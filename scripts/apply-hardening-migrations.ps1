#Requires -Version 5.1
<#
.SYNOPSIS
  Terapkan migration hardening BuzzHub (20261116000000 - 20261116000005).

.DESCRIPTION
  Script ini hanya menerapkan enam migration hardening, berurutan, dan berhenti
  pada error pertama. Migration lama tidak disentuh.

  Dua jalur koneksi yang didukung:
    1. psql  -> butuh DATABASE_URL / SUPABASE_DB_URL, atau SUPABASE_DB_PASSWORD.
    2. Supabase Management API -> butuh SUPABASE_ACCESS_TOKEN (sbp_...).

  Tidak ada password/token yang dicetak ke layar.

.PARAMETER DatabaseUrl
  Connection string Postgres. Jika kosong, script membaca DATABASE_URL,
  SUPABASE_DB_URL, atau menyusunnya dari SUPABASE_DB_PASSWORD.

.PARAMETER DryRun
  Tampilkan rencana tanpa menyentuh database.

.PARAMETER UseManagementApi
  Paksa jalur Management API (butuh SUPABASE_ACCESS_TOKEN).

.EXAMPLE
  npm run db:plan
  npm run db:apply

.EXAMPLE
  powershell -ExecutionPolicy Bypass -File scripts/apply-hardening-migrations.ps1 `
    -DatabaseUrl "postgresql://postgres:<password>@db.<ref>.supabase.co:5432/postgres?sslmode=require"
#>
[CmdletBinding()]
param(
  [string]$DatabaseUrl,
  [switch]$DryRun,
  [switch]$UseManagementApi
)

$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $repoRoot

$migrations = @(
  '20261116000000_harden_rls_phase1.sql',
  '20261116000001_phase1_bridge_rpcs.sql',
  '20261116000002_harden_rls_phase2_accounts.sql',
  '20261116000003_harden_rls_phase2b.sql',
  '20261116000004_harden_storage_writes.sql',
  '20261116000005_audit_logs.sql'
)

# ---------------------------------------------------------------------------
# .env loader (tanpa dependency)
# ---------------------------------------------------------------------------
$script:DotEnv = @{}

function Import-DotEnv {
  $envPath = Join-Path $repoRoot '.env'
  if (-not (Test-Path -LiteralPath $envPath)) { return }

  foreach ($line in Get-Content -LiteralPath $envPath) {
    $trimmed = $line.Trim()
    if (-not $trimmed -or $trimmed.StartsWith('#')) { continue }
    $eq = $trimmed.IndexOf('=')
    if ($eq -le 0) { continue }

    $key = $trimmed.Substring(0, $eq).Trim()
    $value = $trimmed.Substring($eq + 1).Trim()
    if ($value.Length -ge 2) {
      $first = $value.Substring(0, 1)
      $last = $value.Substring($value.Length - 1, 1)
      if (($first -eq '"' -and $last -eq '"') -or ($first -eq "'" -and $last -eq "'")) {
        $value = $value.Substring(1, $value.Length - 2)
      }
    }
    $script:DotEnv[$key] = $value
  }
}

function Get-EnvValue {
  param([string[]]$Names)

  foreach ($name in $Names) {
    $processValue = [Environment]::GetEnvironmentVariable($name)
    if ($processValue -and $processValue.Trim()) { return $processValue.Trim() }
  }
  foreach ($name in $Names) {
    if ($script:DotEnv.ContainsKey($name)) {
      $fileValue = [string]$script:DotEnv[$name]
      if ($fileValue -and $fileValue.Trim()) { return $fileValue.Trim() }
    }
  }
  return $null
}

function Get-ProjectRef {
  $ref = Get-EnvValue @('SUPABASE_PROJECT_ID', 'VITE_SUPABASE_PROJECT_ID')
  if ($ref) { return $ref }

  $linked = Join-Path $repoRoot 'supabase\.temp\linked-project.json'
  if (Test-Path -LiteralPath $linked) {
    try {
      $json = Get-Content -LiteralPath $linked -Raw | ConvertFrom-Json
      if ($json.ref) { return [string]$json.ref }
    } catch {
      # abaikan; nanti pesan error menjelaskan apa yang kurang
    }
  }
  return $null
}

function Get-PoolerUrlWithoutPassword {
  $path = Join-Path $repoRoot 'supabase\.temp\pooler-url'
  if (-not (Test-Path -LiteralPath $path)) { return $null }

  $raw = (Get-Content -LiteralPath $path -Raw).Trim()
  if (-not $raw) { return $null }

  try {
    $uri = [Uri]$raw
    if (-not $uri.Host -or -not $uri.UserInfo) { return $null }
    if ($uri.UserInfo.Contains(':')) { return $null } # sudah ada password
    return $raw
  } catch {
    return $null
  }
}

function New-DatabaseUrlFromPassword {
  $password = Get-EnvValue @('SUPABASE_DB_PASSWORD', 'PGPASSWORD')
  if (-not $password) { return $null }

  $encoded = [Uri]::EscapeDataString($password)
  $pooler = Get-PoolerUrlWithoutPassword

  if ($pooler) {
    $uri = [Uri]$pooler
    $port = $uri.Port
    if (-not $port -or $port -lt 1) { $port = 5432 }
    $database = $uri.AbsolutePath.TrimStart('/')
    if (-not $database) { $database = 'postgres' }
    return "$($uri.Scheme)://$($uri.UserInfo):$encoded@$($uri.Host):$port/$database?sslmode=require"
  }

  $ref = Get-ProjectRef
  if (-not $ref) { return $null }

  return "postgresql://postgres:$encoded@db.$ref.supabase.co:5432/postgres?sslmode=require"
}

function Write-Plan {
  param([string]$Mode)

  Write-Host ''
  Write-Host 'BuzzHub - hardening migrations' -ForegroundColor Cyan
  Write-Host "Mode: $Mode"
  Write-Host "Repo: $repoRoot"
  Write-Host ''
  Write-Host 'Rencana penerapan (berurutan):'
  $index = 1
  foreach ($file in $migrations) {
    $path = Join-Path $repoRoot "supabase\migrations\$file"
    $status = 'OK'
    if (-not (Test-Path -LiteralPath $path)) { $status = 'HILANG' }
    Write-Host ("  {0}. {1} [{2}]" -f $index, $file, $status)
    $index++
  }
  Write-Host ''
}

function Invoke-Psql {
  param(
    [string]$ConnectionString,
    [string]$MigrationPath,
    [string]$MigrationName
  )

  $uri = [Uri]$ConnectionString
  $userInfo = $uri.UserInfo
  if (-not $userInfo) {
    throw "DATABASE_URL tidak memuat user. Contoh: postgresql://postgres:<password>@db.<ref>.supabase.co:5432/postgres"
  }

  $user = $userInfo.Split(':')[0]
  $password = $null
  if ($userInfo.Contains(':')) {
    $password = [Uri]::UnescapeDataString($userInfo.Substring($userInfo.IndexOf(':') + 1))
  }

  $database = $uri.AbsolutePath.TrimStart('/')
  if (-not $database) { $database = 'postgres' }

  $isLocal = $uri.Host -eq 'localhost' -or $uri.Host -eq '127.0.0.1'

  if ($password) { $env:PGPASSWORD = $password }
  if (-not $isLocal) { $env:PGSSLMODE = 'require' }

  $psqlArgs = @(
    '-h', $uri.Host,
    '-p', [string]$uri.Port,
    '-U', $user,
    '-d', $database,
    '-v', 'ON_ERROR_STOP=1',
    '-X',
    '-f', $MigrationPath
  )

  Write-Host "  -> psql $MigrationName" -ForegroundColor DarkGray
  & $script:PsqlPath @psqlArgs
  if ($LASTEXITCODE -ne 0) {
    throw "psql gagal menerapkan $MigrationName (exit $LASTEXITCODE)."
  }
}

function Invoke-ManagementApi {
  param(
    [string]$AccessToken,
    [string]$ProjectRef,
    [string]$MigrationPath,
    [string]$MigrationName
  )

  $sql = Get-Content -LiteralPath $MigrationPath -Raw
  $body = @{ query = $sql } | ConvertTo-Json -Depth 5 -Compress
  $headers = @{
    Authorization = "Bearer $AccessToken"
    'Content-Type' = 'application/json'
  }

  Write-Host "  -> Management API $MigrationName" -ForegroundColor DarkGray
  $uri = "https://api.supabase.com/v1/projects/$ProjectRef/database/query"

  try {
    Invoke-RestMethod -Uri $uri -Method Post -Headers $headers -Body $body -TimeoutSec 120 | Out-Null
  } catch {
    $detail = $_.Exception.Message
    $response = $_.Exception.Response
    if ($response) {
      try {
        $reader = New-Object System.IO.StreamReader($response.GetResponseStream())
        $payload = $reader.ReadToEnd()
        if ($payload) { $detail = $payload }
      } catch {
        # pakai pesan awal
      }
    }
    throw "Management API gagal menerapkan $MigrationName. $detail"
  }
}

function Resolve-PsqlPath {
  $command = Get-Command psql -ErrorAction SilentlyContinue
  if ($command) { return $command.Source }

  $candidates = @()
  if ($env:ProgramFiles) {
    $candidates += Get-ChildItem -Path (Join-Path $env:ProgramFiles 'PostgreSQL') -Directory -ErrorAction SilentlyContinue |
      Sort-Object Name -Descending |
      ForEach-Object { Join-Path $_.FullName 'bin\psql.exe' }
  }
  $candidates += 'C:\laragon\bin\postgresql\bin\psql.exe'

  foreach ($candidate in $candidates) {
    if ($candidate -and (Test-Path -LiteralPath $candidate)) { return $candidate }
  }
  return $null
}

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
Import-DotEnv

$accessToken = Get-EnvValue @('SUPABASE_ACCESS_TOKEN')
$projectRef = Get-ProjectRef

if (-not $UseManagementApi -and -not $DatabaseUrl) {
  $DatabaseUrl = Get-EnvValue @('DATABASE_URL', 'SUPABASE_DB_URL')
}
if (-not $UseManagementApi -and -not $DatabaseUrl) {
  $DatabaseUrl = New-DatabaseUrlFromPassword
}

$mode = 'psql'
$psqlPath = Resolve-PsqlPath

if ($UseManagementApi) {
  $mode = 'management-api'
} elseif (-not $psqlPath -and $accessToken -and $projectRef) {
  $mode = 'management-api'
} elseif (-not $psqlPath -and -not $DatabaseUrl) {
  $mode = 'tidak-tersedia'
}

Write-Plan -Mode $mode

if ($DryRun) {
  Write-Host 'Dry run: tidak ada perubahan pada database.' -ForegroundColor Yellow
  Write-Host ''
  Write-Host 'Cara mengaktifkan penerapan:'
  Write-Host '  - Jalur psql: isi DATABASE_URL / SUPABASE_DB_PASSWORD di .env, atau'
  Write-Host '  - Jalur API : isi SUPABASE_ACCESS_TOKEN (sbp_...) di .env.'
  exit 0
}

if ($mode -eq 'tidak-tersedia') {
  Write-Host 'Tidak bisa menerapkan migration: kredensial database belum tersedia.' -ForegroundColor Red
  Write-Host ''
  Write-Host 'Pilih salah satu:'
  Write-Host '  1. Install PostgreSQL client (psql) lalu isi salah satu dari:'
  Write-Host '       DATABASE_URL="postgresql://postgres:<password>@db.<ref>.supabase.co:5432/postgres?sslmode=require"'
  Write-Host '       SUPABASE_DB_PASSWORD="<database password>"'
  Write-Host '     Password ada di Supabase Dashboard -> Project Settings -> Database.'
  Write-Host '  2. Buat Personal Access Token di https://supabase.com/dashboard/account/tokens'
  Write-Host '     lalu isi SUPABASE_ACCESS_TOKEN="sbp_..." di .env.'
  Write-Host '  3. Tanpa kredensial: tempel isi keenam file SQL ke Supabase SQL Editor,'
  Write-Host '     berurutan sesuai daftar di atas.'
  exit 1
}

if ($mode -eq 'management-api') {
  if (-not $accessToken) {
    Write-Host 'SUPABASE_ACCESS_TOKEN belum diisi.' -ForegroundColor Red
    Write-Host 'Buat token di https://supabase.com/dashboard/account/tokens lalu isi di .env.'
    exit 1
  }
  if (-not $projectRef) {
    Write-Host 'SUPABASE_PROJECT_ID / project ref belum tersedia.' -ForegroundColor Red
    exit 1
  }

  Write-Host "Menerapkan lewat Management API untuk project $projectRef ..." -ForegroundColor Cyan
  foreach ($file in $migrations) {
    $path = Join-Path $repoRoot "supabase\migrations\$file"
    if (-not (Test-Path -LiteralPath $path)) { throw "Migration tidak ditemukan: $file" }
    Invoke-ManagementApi -AccessToken $accessToken -ProjectRef $projectRef -MigrationPath $path -MigrationName $file
    Write-Host "     ok: $file" -ForegroundColor Green
  }
} else {
  if (-not $DatabaseUrl) {
    Write-Host 'DATABASE_URL belum tersedia dan password database tidak ditemukan.' -ForegroundColor Red
    Write-Host 'Isi DATABASE_URL atau SUPABASE_DB_PASSWORD di .env, lalu jalankan ulang.'
    exit 1
  }
  if (-not $psqlPath) {
    Write-Host 'psql tidak ditemukan.' -ForegroundColor Red
    Write-Host 'Install PostgreSQL client, atau isi SUPABASE_ACCESS_TOKEN untuk memakai Management API.'
    exit 1
  }

  $script:PsqlPath = $psqlPath
  Write-Host "Menerapkan lewat psql ($psqlPath) ..." -ForegroundColor Cyan
  foreach ($file in $migrations) {
    $path = Join-Path $repoRoot "supabase\migrations\$file"
    if (-not (Test-Path -LiteralPath $path)) { throw "Migration tidak ditemukan: $file" }
    Invoke-Psql -ConnectionString $DatabaseUrl -MigrationPath $path -MigrationName $file
    Write-Host "     ok: $file" -ForegroundColor Green
  }
}

Write-Host ''
Write-Host 'Selesai. Enam migration hardening sudah diterapkan.' -ForegroundColor Green
Write-Host ''
Write-Host 'Langkah berikutnya:'
Write-Host '  1. Pastikan SUPABASE_SERVICE_ROLE_KEY berisi secret key (bukan publishable).'
Write-Host '  2. Jalankan: npm run check:env'
Write-Host '  3. Uji login admin, pencairan, upload bukti, dan pendaftaran buzzer.'
Write-Host ''
Write-Host 'Catatan: `supabase db push` belum dipakai karena riwayat migration project'
Write-Host 'belum memiliki tabel supabase_migrations.schema_migrations.'
