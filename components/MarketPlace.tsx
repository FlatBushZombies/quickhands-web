"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import ProfessionalCounter from "./professionals/ProfessionalsCounter"

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  "Tutors & Education":              ["tutor","teacher","education","math","science","english","language","music","computer","lecturer","biology","chemistry","physics","primary","high school","university"],
  "Home & Repair Services":          ["plumber","electrician","painter","tiler","builder","handyman","roofer","appliance","renovation","bricklayer","roofing","repair"],
  "Beauty & Personal Care":          ["makeup","hair","barber","nail","lash","brow","massage","wax","stylist","beauty","braider","grooming"],
  "Freelancers & Digital Services":  ["graphic","web","social media","digital","content","writer","translator","virtual","it support","data entry","developer","designer","freelance","seo","marketing"],
  "Business & Legal Services":       ["accountant","bookkeeper","tax","lawyer","legal","company","business","hr","real estate","consultant","compliance","auditor","finance"],
  "Sports & Wellness":               ["trainer","fitness","yoga","pilates","stretch","dance","sports","coach","wellness","gym","aerobics"],
  "Arts & Entertainment":            ["musician","dj","mc","dancer","photographer","videographer","entertainer","artist","event","band","singer","performer"],
  "Domestic & Household Staff":      ["housekeeper","cleaner","nanny","babysitter","caregiver","gardener","driver","pet sitter","domestic","cook","chef","maid"],
  "Driving & Transport":             ["driving instructor","motorcycle","defensive driving","delivery","courier","transport","logistics","moving","chauffeur","taxi"],
  "Animal & Pet Services":           ["vet","veterinary","pet","grooming","dog trainer","animal","livestock","boarding","kennel"],
  "Other Popular Services":          ["mobile money","phone repair","solar","cctv","security","internet","satellite","tailor","welder","metalwork","installation","technician"],
}

const CATEGORY_ILLUSTRATIONS: Record<string, string> = {
  "Tutors & Education":              "/illustrations/Teacher.svg",
  "Home & Repair Services":          "/illustrations/Electrician.svg",
  "Beauty & Personal Care":          "/illustrations/Beauty.svg",
  "Freelancers & Digital Services":  "/illustrations/Freelancer.svg",
  "Business & Legal Services":       "/illustrations/Lawyer.svg",
  "Sports & Wellness":               "/illustrations/Coach.svg",
  "Arts & Entertainment":            "/illustrations/Videographer.svg",
  "Domestic & Household Staff":      "/illustrations/Gardening.svg",
  "Driving & Transport":             "/illustrations/Driver.svg",
  "Animal & Pet Services":           "/illustrations/Veterinary.svg",
  "Other Popular Services":          "/illustrations/Installation.svg",
}

type ProfessionEntry = { profession: string; count: number }

type Category = {
  title: string
  illustration: string
  totalCount: number
  professions: ProfessionEntry[]
}

function matchCategory(profession: string): string | null {
  const lower = profession.toLowerCase()
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((kw) => lower.includes(kw))) return category
  }
  return "Other Popular Services" // fallback so nothing is lost
}

function AfricaSilhouette({ forBanner = false }) {
  const fill   = forBanner ? "rgba(255,255,255,0.10)" : "rgba(22,163,74,0.055)"
  const stroke = forBanner ? "rgba(255,255,255,0.0)"  : "rgba(22,163,74,0.14)"
  return (
    <svg viewBox="0 0 400 520" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
      style={forBanner ? {
        position:"absolute", right:"-40px", bottom:"-60px",
        width:"400px", height:"auto", pointerEvents:"none", zIndex:0,
      } : {
        position:"absolute", top:"50%", left:"50%",
        transform:"translate(-50%, -46%)",
        width:"min(900px, 95vw)", height:"auto",
        pointerEvents:"none", zIndex:0,
      }}>
      <path d="M195 8 C183 8 167 12 158 21 C146 32 136 36 122 42 C108 48 96 47 86 56 C74 67 69 85 65 100 C61 115 55 127 53 142 C51 157 53 170 51 184 C49 199 40 210 38 225 C36 242 40 258 45 273 C50 288 53 303 60 317 C69 335 81 347 90 362 C99 379 102 396 113 411 C124 427 141 436 157 447 C173 458 186 467 202 474 C218 481 236 483 252 478 C270 472 281 459 292 446 C305 431 314 414 321 397 C330 378 334 358 336 339 C338 319 336 299 338 279 C340 260 347 242 347 223 C347 204 343 186 341 169 C339 152 337 134 330 119 C323 102 310 89 299 76 C288 63 278 49 265 40 C251 30 234 18 216 12 C209 10 201 8 195 8Z" fill={fill} stroke={stroke} strokeWidth="1.5" />
      <path d="M336 200 C342 195 356 192 361 201 C356 216 342 226 335 219 Z" fill={fill} stroke={stroke} strokeWidth="1" />
      <ellipse cx="360" cy="332" rx="13" ry="31" fill={fill} stroke={stroke} strokeWidth="1" transform="rotate(-12,360,332)" />
    </svg>
  )
}

const CSS = `
.mkt { font-family:'Outfit',sans-serif; background:#fff; min-height:100vh; position:relative; overflow-x:hidden; padding:100px 0 120px; }
.mkt::before { content:''; position:absolute; top:-200px; left:50%; transform:translateX(-50%); width:1100px; height:700px; border-radius:50%; background:radial-gradient(ellipse, rgba(22,163,74,0.05) 0%, transparent 68%); pointer-events:none; z-index:0; }

.mkt-inner { position:relative; z-index:1; max-width:1280px; margin:0 auto; padding:0 32px; }

.eyebrow { display:inline-flex; align-items:center; gap:10px; font-size:10.5px; font-weight:700; letter-spacing:0.22em; text-transform:uppercase; color:#16A34A; margin-bottom:18px; }
.eyebrow-dash { display:inline-block; width:24px; height:1.5px; background:#86EFAC; border-radius:2px; }

.mkt-h1 { font-family:'Cormorant Garamond',serif; font-weight:700; font-size:clamp(2.9rem,5.5vw,4.8rem); line-height:1.06; color:#111827; letter-spacing:-0.02em; margin:0 0 20px; }
.mkt-h1 em { font-style:italic; color:#16A34A; }

.mkt-sub { color:#6B7280; font-size:1.05rem; font-weight:400; line-height:1.75; max-width:500px; margin:0 auto; }
.mkt-sub strong { color:#16A34A; font-weight:600; }

.stats-row { display:flex; justify-content:center; align-items:stretch; margin-top:48px; flex-wrap:wrap; }
.stat-cell { display:flex; flex-direction:column; align-items:center; padding:0 36px; border-right:1px solid #E5E7EB; }
.stat-cell:last-child { border-right:none; }
.stat-n { font-family:'Cormorant Garamond',serif; font-size:2.3rem; font-weight:700; color:#111827; line-height:1; }
.stat-l { font-size:10.5px; font-weight:500; color:#9CA3AF; margin-top:6px; letter-spacing:0.08em; text-transform:uppercase; }

.divider { display:flex; align-items:center; gap:16px; margin:64px 0 56px; }
.divider-line { flex:1; height:1px; background:#E5E7EB; }
.divider-node { width:32px; height:32px; border-radius:50%; background:#F0FDF4; border:1px solid rgba(22,163,74,0.18); display:flex; align-items:center; justify-content:center; font-size:15px; flex-shrink:0; }

.cat-grid { display:grid; gap:22px; grid-template-columns:repeat(auto-fill,minmax(340px,1fr)); }

.cat-card { border-radius:20px; border:1px solid #E5E7EB; overflow:hidden; background:#fff; display:flex; flex-direction:column; width:100%; cursor:pointer; transition:border-color 0.28s ease, box-shadow 0.28s ease, transform 0.28s cubic-bezier(0.22,1,0.36,1); }
.cat-card:hover { border-color:rgba(22,163,74,0.25); transform:translateY(-6px); box-shadow:0 20px 48px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04), 0 0 0 1px rgba(22,163,74,0.1); }

.illus-tray { width:100%; height:200px; background:#F0FDF4; position:relative; overflow:hidden; flex-shrink:0; display:flex; align-items:center; justify-content:center; }
.illus-tray::before { content:''; position:absolute; inset:0; background:radial-gradient(ellipse 70% 70% at 50% 60%, rgba(22,163,74,0.09) 0%, transparent 70%); pointer-events:none; }
.illus-tray > span { position:absolute !important; inset:12px 28px 8px !important; display:flex !important; align-items:center !important; justify-content:center !important; }
.illus-tray img { object-fit:contain !important; width:auto !important; height:100% !important; max-height:178px !important; position:relative !important; filter:drop-shadow(0 8px 20px rgba(0,0,0,0.10)); transition:transform 0.4s cubic-bezier(0.22,1,0.36,1), filter 0.4s ease; }
.cat-card:hover .illus-tray img { transform:scale(1.06) translateY(-5px); filter:drop-shadow(0 14px 28px rgba(0,0,0,0.14)); }

.tray-edge { height:3px; background:linear-gradient(90deg, transparent 0%, #86EFAC 30%, #22C55E 50%, #86EFAC 70%, transparent 100%); opacity:0.6; flex-shrink:0; }

.cat-body { padding:22px 24px 24px; display:flex; flex-direction:column; flex:1; }
.cat-title { font-family:'Cormorant Garamond',serif; font-weight:700; font-size:1.25rem; color:#111827; line-height:1.2; margin:0 0 5px; }
.cat-total { font-size:11px; font-weight:700; color:#16A34A; letter-spacing:0.1em; text-transform:uppercase; margin-bottom:14px; }

.prof-list { list-style:none; padding:0; margin:0 0 20px; display:flex; flex-direction:column; gap:6px; }
.prof-row { display:flex; align-items:center; justify-content:space-between; gap:8px; padding-left:15px; position:relative; }
.prof-row::before { content:'›'; position:absolute; left:2px; color:#22C55E; font-size:15px; font-weight:700; line-height:1.38; }
.prof-name { flex:1; font-size:13px; font-weight:400; color:#6B7280; line-height:1.5; }
.prof-badge { flex-shrink:0; display:inline-flex; align-items:center; gap:4px; padding:2px 8px; border-radius:100px; background:#F0FDF4; border:1px solid rgba(22,163,74,0.2); font-size:10px; font-weight:700; color:#16A34A; letter-spacing:0.04em; white-space:nowrap; }

.empty-state { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:8px; padding:28px 0 20px; color:#9CA3AF; font-size:13px; text-align:center; }
.empty-icon { font-size:28px; opacity:0.5; }

.cat-cta { margin-top:auto; padding-top:16px; border-top:1px solid #E5E7EB; font-size:13px; font-weight:600; color:#16A34A; display:flex; align-items:center; justify-content:space-between; letter-spacing:0.01em; }
.cta-pill { display:inline-flex; align-items:center; justify-content:center; width:30px; height:30px; border-radius:50%; background:#F0FDF4; border:1px solid rgba(22,163,74,0.2); font-size:14px; color:#16A34A; transition:background 0.2s, color 0.2s, transform 0.2s; }
.cat-card:hover .cta-pill { background:#16A34A; color:#fff; transform:translateX(3px); }

.skeleton { background:linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%); background-size:200% 100%; animation:shimmer 1.4s infinite; border-radius:6px; height:14px; margin-bottom:8px; }
@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

.app-banner { margin-top:100px; border-radius:28px; background:#16A34A; position:relative; overflow:hidden; }
.app-banner::before { content:''; position:absolute; top:-140px; left:-100px; width:600px; height:600px; border-radius:50%; background:radial-gradient(circle, rgba(255,255,255,0.14) 0%, transparent 65%); pointer-events:none; }
.app-banner::after { content:''; position:absolute; bottom:-160px; right:-100px; width:560px; height:560px; border-radius:50%; background:radial-gradient(circle, rgba(0,0,0,0.12) 0%, transparent 65%); pointer-events:none; }

.banner-inner { position:relative; z-index:1; display:grid; grid-template-columns:1fr auto; gap:48px; padding:clamp(44px,5vw,80px); align-items:center; }
@media (max-width:680px) { .banner-inner { grid-template-columns:1fr; } .banner-phone { display:none; } }

.live-badge { display:inline-flex; align-items:center; gap:8px; padding:5px 14px 5px 10px; border-radius:100px; background:rgba(255,255,255,0.18); border:1px solid rgba(255,255,255,0.3); color:#fff; font-size:10.5px; font-weight:700; letter-spacing:0.15em; text-transform:uppercase; margin-bottom:22px; }
.live-dot { width:6px; height:6px; border-radius:50%; background:#fff; animation:ldot 2s ease infinite; }
@keyframes ldot { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.35; transform:scale(0.6); } }

.banner-h { font-family:'Cormorant Garamond',serif; font-weight:700; font-size:clamp(2.6rem,4.5vw,4.2rem); line-height:1.04; color:#fff; margin:0 0 18px; }
.banner-h em { font-style:italic; color:rgba(255,255,255,0.8); }
.banner-p { color:rgba(255,255,255,0.78); font-size:1rem; font-weight:400; line-height:1.75; max-width:420px; margin-bottom:36px; }

.store-row { display:flex; gap:12px; flex-wrap:wrap; }
.store-btn { display:inline-flex; align-items:center; gap:10px; padding:13px 24px; border-radius:100px; background:#fff; border:none; color:#16A34A; font-size:13.5px; font-weight:700; font-family:'Outfit',sans-serif; transition:transform 0.2s, box-shadow 0.2s, background 0.2s; cursor:pointer; box-shadow:0 4px 20px rgba(0,0,0,0.12); }
.store-btn:hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(0,0,0,0.18); background:#f0fdf4; }

.phone-shell { background:rgba(0,0,0,0.15); border-radius:30px; padding:11px; border:1px solid rgba(255,255,255,0.22); box-shadow:0 40px 80px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.15); }
`

export default function Marketplace() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/onboarding?type=professions")
        if (!res.ok) return

        const { professions } = await res.json() as {
          professions: { profession: string; count: string }[]
        }

        // Group all DB professions into their matching category
        const map: Record<string, ProfessionEntry[]> = {}
        for (const { profession, count } of professions) {
          const cat = matchCategory(profession)
          if (!cat) continue
          if (!map[cat]) map[cat] = []
          map[cat].push({ profession, count: parseInt(count) })
        }

        // Only render categories that actually have data
        const built: Category[] = Object.entries(map)
          .map(([title, entries]) => ({
            title,
            illustration: CATEGORY_ILLUSTRATIONS[title] ?? "/illustrations/Installation.svg",
            totalCount: entries.reduce((s, e) => s + e.count, 0),
            professions: entries.sort((a, b) => b.count - a.count), // most popular first
          }))
          .sort((a, b) => b.totalCount - a.totalCount) // busiest category first

        setCategories(built)
      } catch {
        // fail silently — grid stays empty
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <>
      <style>{CSS}</style>
      <section className="mkt">
        <AfricaSilhouette />

        <div className="mkt-inner">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{ textAlign: "center", maxWidth: "640px", margin: "0 auto" }}
          >
            <div className="eyebrow">
              <span className="eyebrow-dash" />
              🌍 Across Africa &amp; Beyond
              <span className="eyebrow-dash" />
            </div>

            <h2 className="mkt-h1">
              Trusted specialists<br />
              <em>near you</em>
            </h2>

            <p className="mkt-sub">
              Choose from <strong><ProfessionalCounter /> local specialists</strong> or{" "}
              <strong>remote professionals</strong>, all ready to help when you need them.
            </p>

            <div className="stats-row">
              {[
                { n: "", l: "" },
                { n: "", l: "" },
                { n: "", l: "" },
                { n: "", l: "" },
              ].map((s, i) => (
                <div className="stat-cell" key={i}>
                  <span className="stat-n">{s.n}</span>
                  <span className="stat-l">{s.l}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Divider */}
          <div className="divider">
            <div className="divider-line" />
            <div className="divider-node">🌿</div>
            <div className="divider-line" />
          </div>

          {/* Grid */}
          {loading ? (
            // Skeleton shimmer while fetching
            <div className="cat-grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="cat-card" style={{ minHeight: 320 }}>
                  <div className="illus-tray" />
                  <div className="tray-edge" />
                  <div className="cat-body">
                    <div className="skeleton" style={{ width: "60%", marginBottom: 10 }} />
                    <div className="skeleton" style={{ width: "35%", height: 10, marginBottom: 18 }} />
                    {Array.from({ length: 4 }).map((_, j) => (
                      <div key={j} className="skeleton" style={{ width: `${75 - j * 8}%` }} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div style={{ textAlign: "center", color: "#9CA3AF", padding: "60px 0", fontSize: "15px" }}>
              No specialists registered yet — be the first! 🌱
            </div>
          ) : (
            <div className="cat-grid">
              {categories.map((cat, i) => (
                <motion.div
                  key={cat.title}
                  initial={{ opacity: 0, y: 36 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                  viewport={{ once: true }}
                  style={{ display: "flex" }}
                >
                  <div className="cat-card">
                    <div className="illus-tray">
                      <span>
                        <Image
                          src={cat.illustration}
                          alt={`${cat.title} illustration`}
                          fill
                          sizes="320px"
                          priority={i < 6}
                        />
                      </span>
                    </div>
                    <div className="tray-edge" />

                    <div className="cat-body">
                      <h3 className="cat-title">{cat.title}</h3>
                      <p className="cat-total">
                        {cat.totalCount.toLocaleString()} specialist{cat.totalCount === 1 ? "" : "s"} registered
                      </p>

                      <ul className="prof-list">
                        {cat.professions.map((p) => (
                          <li key={p.profession} className="prof-row">
                            <span className="prof-name">{p.profession}</span>
                            <span className="prof-badge">
                              👤 {p.count.toLocaleString()}
                            </span>
                          </li>
                        ))}
                      </ul>

                      <div className="cat-cta">
                        <span>View all specialists</span>
                        <span className="cta-pill">→</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* App Banner */}
          <div className="app-banner">
            <AfricaSilhouette forBanner={true} />
            <div className="banner-inner">
              <div>
                <div className="live-badge">
                  <span className="live-dot" />
                  Launching Soon
                </div>
                <h3 className="banner-h">
                  Try the<br />
                  <em>Quickhands</em><br />
                  app.
                </h3>
                <p className="banner-p">
                  <strong style={{ color: "#fff", fontWeight: 600 }}>Quickhands</strong> is almost
                  here — built to connect you with trusted specialists, faster.
                  Be the first in when we go live.
                </p>
                <div className="store-row">
                  <button className="store-btn">
                    <Image src="/icons/app-store.svg" alt="App Store" width={18} height={18} />
                    App Store
                  </button>
                  <button className="store-btn">
                    <Image src="/icons/google-play.svg" alt="Google Play" width={18} height={18} />
                    Google Play
                  </button>
                </div>
              </div>
              <div className="banner-phone">
                <div className="phone-shell">
                  <Image
                    src="/demo.png"
                    alt="Quickhands app demo"
                    width={258}
                    height={516}
                    style={{ borderRadius: "20px", display: "block" }}
                    priority
                  />
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  )
}