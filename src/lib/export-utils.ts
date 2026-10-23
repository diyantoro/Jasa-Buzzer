import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export type ExportColumn<T> = {
  header: string;
  accessor: (row: T) => string | number;
};

function stamp() {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}`;
}

export function exportToExcel<T>(
  filename: string,
  sheetName: string,
  rows: T[],
  columns: ExportColumn<T>[],
) {
  const data = rows.map((r) => {
    const o: Record<string, string | number> = {};
    columns.forEach((c) => (o[c.header] = c.accessor(r)));
    return o;
  });
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName.slice(0, 31));
  XLSX.writeFile(wb, `${filename}-${stamp()}.xlsx`);
}

export function exportToPDF<T>(
  filename: string,
  title: string,
  rows: T[],
  columns: ExportColumn<T>[],
  summary?: { label: string; value: string }[],
) {
  const doc = new jsPDF({ orientation: "landscape" });
  doc.setFontSize(14);
  doc.text(title, 14, 15);
  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text(`Dicetak: ${new Date().toLocaleString("id-ID")}`, 14, 21);
  doc.setTextColor(0);

  let startY = 26;
  if (summary && summary.length) {
    doc.setFontSize(10);
    summary.forEach((s, i) => {
      doc.text(`${s.label}: ${s.value}`, 14 + i * 80, startY);
    });
    startY += 6;
  }

  autoTable(doc, {
    head: [columns.map((c) => c.header)],
    body: rows.map((r) => columns.map((c) => String(c.accessor(r)))),
    startY,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [124, 58, 237] },
  });
  doc.save(`${filename}-${stamp()}.pdf`);
}