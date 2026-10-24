import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { L as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-BkEeRci-.mjs";
import { D as Rocket, Dt as CircleCheck, Ft as ChartColumn, G as Megaphone, J as LogOut, Wt as ArrowRight, b as ShieldCheck, g as Sparkles, h as Star, i as Users, u as TrendingUp } from "../_libs/lucide-react.mjs";
import { a as services, i as formatIDR, o as stats, s as testimonials } from "./router-BuTnQWI2.mjs";
import { c as useSession, t as clearSession } from "./auth-CNL2N2Mo.mjs";
import { t as ThemeToggle } from "./theme-toggle-B6xwIFaA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-dHgfXGkc.js
var import_jsx_runtime = require_jsx_runtime();
function SiteHeader() {
	const session = useSession();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
		className: "sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-3 sm:gap-4 sm:px-6 sm:py-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "flex min-w-0 items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid h-9 w-9 shrink-0 place-items-center rounded-xl gradient-brand text-brand-foreground shadow-glow",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Megaphone, { className: "h-5 w-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "truncate font-display text-lg font-bold tracking-tight sm:text-xl",
						children: ["Buzz", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-gradient-brand",
							children: "Hub"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					className: "hidden items-center gap-8 md:flex",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "/#layanan",
							className: "text-sm font-medium text-muted-foreground hover:text-foreground",
							children: "Layanan"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "/#proses",
							className: "text-sm font-medium text-muted-foreground hover:text-foreground",
							children: "Proses"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "/#testimoni",
							className: "text-sm font-medium text-muted-foreground hover:text-foreground",
							children: "Testimoni"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hidden items-center gap-2 sm:flex",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeToggle, {}), session ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "ghost",
						size: "sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: `/${session.role}`,
							children: "Dashboard"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: clearSession,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "mr-1 h-4 w-4" }), " Keluar"]
					})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "ghost",
						size: "sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/login",
							children: "Masuk"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						size: "sm",
						className: "gradient-brand text-brand-foreground hover:opacity-90",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/register",
							children: "Daftar"
						})
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1 sm:hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeToggle, {}), session ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						size: "sm",
						className: "gradient-brand text-brand-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: `/${session.role}`,
							children: "Dashboard"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						size: "icon",
						className: "h-9 w-9",
						"aria-label": "Keluar",
						onClick: clearSession,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4" })
					})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						size: "sm",
						className: "gradient-brand text-brand-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/login",
							children: "Masuk"
						})
					})]
				})
			]
		})
	});
}
var hero_illustration_default = "/assets/hero-illustration-BvkNTcNE.png";
var hero_bg_texture_default = "/assets/hero-bg-texture-A6yyNez4.png";
function Landing() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "relative overflow-hidden",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 -z-10 bg-gradient-to-br from-accent/50 via-background to-background" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-40 right-0 -z-10 h-[500px] w-[500px] rounded-full bg-brand/20 blur-3xl" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -bottom-40 -left-20 -z-10 h-[400px] w-[400px] rounded-full bg-brand-glow/20 blur-3xl" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto flex min-h-[calc(100svh-var(--navbar-height)-4rem)] max-w-7xl items-center px-4 py-8 sm:px-6 sm:py-10 lg:py-12",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid w-full items-center gap-8 sm:gap-10 lg:grid-cols-2 lg:gap-[clamp(2rem,4vw,4rem)]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 max-w-[680px]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-[11px] font-semibold text-foreground shadow-xs sm:px-3.5 sm:text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5 text-brand" }), "8.420 Buzzer aktif tersebar di Indonesia"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
										className: "mt-4 font-serif text-[clamp(2.35rem,4.2vw,4rem)] leading-[1.03] font-normal tracking-[-0.02em] text-balance",
										children: [
											"Jadikan brand Anda",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", { className: "hidden lg:block" }),
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-gradient-brand italic whitespace-nowrap",
												children: "trending topic"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", { className: "hidden lg:block" }),
											" hari ini juga."
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-4 max-w-[54ch] text-[1.05rem] leading-[1.65] text-muted-foreground sm:text-[1.15rem]",
										children: "BuzzHub menghubungkan brand, partai, dan UMKM dengan ribuan buzzer terverifikasi untuk kampanye viral di Instagram, TikTok, X, YouTube, dan Facebook."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-6 flex flex-wrap gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											asChild: true,
											size: "lg",
											className: "gradient-brand h-11 w-full text-brand-foreground shadow-glow hover:opacity-90 sm:w-auto",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
												to: "/register",
												children: ["Mulai Kampanye ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-1 h-4 w-4" })]
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											asChild: true,
											size: "lg",
											variant: "outline",
											className: "h-11 w-full sm:w-auto",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
												to: "/register/buzzer",
												children: "Daftar jadi Buzzer"
											})
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-7 grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3",
										children: [
											{
												l: "Kampanye",
												v: stats.totalCampaigns.toLocaleString("id-ID"),
												i: Megaphone
											},
											{
												l: "Buzzer Aktif",
												v: stats.activeBuzzers.toLocaleString("id-ID"),
												i: Users
											},
											{
												l: "Klien Puas",
												v: stats.satisfiedClients.toLocaleString("id-ID"),
												i: Star
											},
											{
												l: "Trending #1",
												v: stats.trendingHits.toLocaleString("id-ID"),
												i: TrendingUp
											}
										].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex h-full flex-col gap-2 rounded-xl border border-border bg-muted p-3.5 shadow-md transition-colors hover:border-brand/40",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand/15 text-brand",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(s.i, {
														className: "h-4 w-4",
														"aria-hidden": "true"
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
													className: "text-xs font-semibold leading-snug text-muted-foreground",
													children: s.l
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
													className: "mt-auto font-display text-2xl leading-none font-bold tracking-tight text-foreground tabular-nums",
													children: s.v
												})
											]
										}, s.l))
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "relative min-w-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mx-auto max-w-[560px] overflow-hidden rounded-2xl border border-border bg-card p-2 shadow-md sm:p-2.5 lg:max-w-none",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: hero_illustration_default,
										alt: "Ilustrasi kampanye viral di Instagram, TikTok, X, YouTube, dan Facebook dengan ribuan buzzer terverifikasi",
										width: 1024,
										height: 1024,
										className: "mx-auto block h-auto max-h-[min(72vh,680px)] w-auto max-w-full rounded-xl",
										loading: "eager"
									})
								})
							})]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				id: "layanan",
				className: "mx-auto max-w-7xl px-4 py-20 sm:px-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-2xl text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-serif text-3xl font-medium tracking-[-0.01em] sm:text-4xl",
						children: "Pilih paket sesuai tujuan"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-muted-foreground",
						children: "Harga transparan, hasil terukur, buzzer real people."
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3",
					children: services.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:border-brand/40 hover:shadow-md",
						children: [
							i === 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "absolute right-4 top-4 rounded-full gradient-brand px-2.5 py-0.5 text-xs font-bold text-brand-foreground",
								children: "Popular"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "inline-flex rounded-lg bg-accent px-2.5 py-1 text-xs font-semibold text-accent-foreground",
								children: s.platform
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mt-4 font-display text-xl font-bold",
								children: s.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-muted-foreground",
								children: s.desc
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-5 flex items-end justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-display text-2xl font-bold text-gradient-brand",
									children: formatIDR(s.price)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground",
									children: [s.buzzers, " buzzer terlibat"]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									size: "sm",
									variant: "outline",
									className: "group-hover:gradient-brand group-hover:border-transparent group-hover:text-brand-foreground",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/login",
										children: "Pesan"
									})
								})]
							})
						]
					}, s.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				id: "proses",
				className: "bg-muted/40 py-20",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-7xl px-4 sm:px-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto max-w-2xl text-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-serif text-3xl font-medium tracking-[-0.01em] sm:text-4xl",
							children: "Proses simpel, hasil maksimal"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-12 grid gap-6 md:grid-cols-4",
						children: [
							{
								i: Rocket,
								t: "Pilih Paket",
								d: "Tentukan platform & target campaign Anda."
							},
							{
								i: Users,
								t: "Buzzer Matching",
								d: "Sistem alokasi buzzer sesuai niche & audiens."
							},
							{
								i: Megaphone,
								t: "Eksekusi Serentak",
								d: "Kampanye live dengan jadwal terkurasi."
							},
							{
								i: ChartColumn,
								t: "Laporan Real-time",
								d: "Pantau reach, engagement, & sentiment."
							}
						].map((p, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "absolute -top-3 left-6 grid h-7 w-7 place-items-center rounded-full gradient-brand text-sm font-bold text-brand-foreground",
									children: idx + 1
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(p.i, { className: "mb-3 h-6 w-6 text-brand" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-display text-lg font-bold",
									children: p.t
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-muted-foreground",
									children: p.d
								})
							]
						}, p.t))
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				id: "testimoni",
				className: "mx-auto max-w-7xl px-4 py-20 sm:px-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto max-w-2xl text-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-serif text-3xl font-medium tracking-[-0.01em] sm:text-4xl",
						children: "Dipercaya brand & figur publik"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-12 grid gap-5 md:grid-cols-3",
					children: testimonials.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
						className: "rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex gap-0.5 text-amber-500",
								children: Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-4 w-4 fill-current" }, i))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("blockquote", {
								className: "mt-4 text-base",
								children: [
									"\"",
									t.quote,
									"\""
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figcaption", {
								className: "mt-4 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-semibold",
									children: t.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-muted-foreground",
									children: t.company
								})]
							})
						]
					}, t.name))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "mx-auto max-w-7xl px-4 pb-20 sm:px-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative overflow-hidden rounded-3xl gradient-brand p-10 text-center text-brand-foreground shadow-glow sm:p-16",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: hero_bg_texture_default,
							alt: "",
							width: 1920,
							height: 1080,
							className: "absolute inset-0 h-full w-full object-cover opacity-40",
							loading: "lazy"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.25),transparent)]" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-serif text-3xl font-medium tracking-[-0.01em] sm:text-4xl",
									children: "Siap viral minggu ini?"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mx-auto mt-3 max-w-xl opacity-90",
									children: "Konsultasi gratis dengan campaign manager kami. Tanpa kontrak panjang."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-8 flex flex-wrap justify-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										asChild: true,
										size: "lg",
										variant: "secondary",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/register",
											children: "Daftar sebagai Customer"
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										asChild: true,
										size: "lg",
										variant: "outline",
										className: "border-white/40 bg-transparent text-brand-foreground hover:bg-white/10",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/login",
											children: "Sudah punya akun? Masuk"
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-8 flex flex-wrap items-center justify-center gap-6 text-sm",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "inline-flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4" }), " Buzzer terverifikasi KYC"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "inline-flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4" }), " Garansi 100% refund"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "inline-flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-4 w-4" }), " Laporan real-time"]
										})
									]
								})
							]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "border-t border-border py-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto max-w-7xl px-4 text-center text-sm text-muted-foreground sm:px-6",
					children: "© 2026 BuzzHub Indonesia. Semua hak dilindungi."
				})
			})
		]
	});
}
//#endregion
export { Landing as component };
