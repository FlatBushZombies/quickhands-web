"use client"

import { motion } from "framer-motion"
import Image from "next/image"

const categories = [
  { title: "Tutors & Education", illustration: "/illustrations/Teacher.svg", count: 0, items: ["English tutoring","Mathematics","Science (Physics, Chemistry, Biology)","Primary school tutoring","High school exam preparation","University tutoring","Computer literacy","Music lessons","Language tutoring (local & international)"], services: 2146 },
  { title: "Home & Repair Services", illustration: "/illustrations/Electrician.svg", count: 0, items: ["Plumbers","Electricians","Painters","Tilers","Builders / Bricklayers","Handymen","Roofing specialists","Appliance repair","Renovations (turnkey)"], services: 2312 },
  { title: "Beauty & Personal Care", illustration: "/illustrations/Beauty.svg", count: 0, items: ["Makeup artists","Hair stylists / Braiders","Barbers","Nail technicians","Lash & brow technicians","Massage therapists","Waxing & hair removal","Personal stylists"], services: 1874 },
  { title: "Freelancers & Digital Services", illustration: "/illustrations/Freelancer.svg", count: 0, items: ["Graphic designers","Web designers & developers","Social media managers","Digital marketers","Content writers","Translators","Virtual assistants","IT support & outsourcing","Data entry specialists"], services: 1439 },
  { title: "Business & Legal Services", illustration: "/illustrations/Lawyer.svg", count: 0, items: ["Accountants","Bookkeepers","Tax consultants","Lawyers","Company registration services","Business consultants","HR consultants","Real estate agents"], services: 986 },
  { title: "Sports & Wellness", illustration: "/illustrations/Coach.svg", count: 0, items: ["Personal trainers","Fitness instructors","Yoga instructors","Pilates instructors","Stretching & mobility coaches","Dance instructors","Sports coaches"], services: 742 },
  { title: "Arts & Entertainment", illustration: "/illustrations/Videographer.svg", count: 0, items: ["Musicians","DJs","MCs / Event hosts","Dancers","Photographers","Videographers","Makeup artists for events","Event entertainers"], services: 1183 },
  { title: "Domestic & Household Staff", illustration: "/illustrations/Gardening.svg", count: 0, items: ["Housekeepers","Cleaners","Nannies","Babysitters","Caregivers","Gardeners","Drivers","Pet sitters"], services: 624 },
  { title: "Driving & Transport", illustration: "/illustrations/Driver.svg", count: 0, items: ["Driving instructors","Motorcycle instructors","Defensive driving","Delivery drivers","Couriers","Passenger transport","Moving & logistics"], services: 512 },
  { title: "Animal & Pet Services", illustration: "/illustrations/Veterinary.svg", count: 0, items: ["Veterinarians","Veterinary assistants","Pet grooming","Dog trainers","Animal boarding","Livestock care"], services: 341 },
  { title: "Other Popular Services", illustration: "/illustrations/Installation.svg", count: 0, items: ["Mobile money agents","Phone repair technicians","Solar panel installers","CCTV & security installers","Internet & satellite installers","Tailors & designers","Welding & metalwork"], services: 1107 },
]

function AfricaSilhouette({ forBanner = false }) {
  const fill = forBanner ? "rgba(255,255,255,0.10)" : "rgba(22,163,74,0.055)"
  const stroke = forBanner ? "rgba(255,255,255,0.0)" : "rgba(22,163,74,0.14)"
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
.cat-count { font-size:11px; font-weight:700; color:#16A34A; letter-spacing:0.1em; text-transform:uppercase; margin-bottom:16px; }
.cat-list { list-style:none; padding:0; margin:0 0 20px; display:flex; flex-direction:column; gap:5px; }
.cat-list li { font-size:13px; color:#6B7280; padding-left:15px; position:relative; line-height:1.55; font-weight:400; }
.cat-list li::before { content:'›'; position:absolute; left:2px; color:#22C55E; font-size:15px; font-weight:700; line-height:1.38; }
.cat-cta { margin-top:auto; padding-top:16px; border-top:1px solid #E5E7EB; font-size:13px; font-weight:600; color:#16A34A; display:flex; align-items:center; justify-content:space-between; letter-spacing:0.01em; }
.cta-pill { display:inline-flex; align-items:center; justify-content:center; width:30px; height:30px; border-radius:50%; background:#F0FDF4; border:1px solid rgba(22,163,74,0.2); font-size:14px; color:#16A34A; transition:background 0.2s, color 0.2s, transform 0.2s; }
.cat-card:hover .cta-pill { background:#16A34A; color:#fff; transform:translateX(3px); }

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
              Choose from <strong>0 local specialists</strong> or{" "}
              <strong>0 remote professionals</strong>, all ready to help when you need them.
            </p>

            <div className="stats-row">
              {[
                { n: "11K+", l: "Specialists" },
                { n: "11",   l: "Categories" },
                { n: "4.9★", l: "Avg Rating" },
                { n: "50+",  l: "Cities" },
              ].map((s) => (
                <div className="stat-cell" key={s.l}>
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
                    <p className="cat-count">{cat.count.toLocaleString()} specialists</p>
                    <ul className="cat-list">
                      {cat.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                    <div className="cat-cta">
                      <span>All {cat.services.toLocaleString()} services</span>
                      <span className="cta-pill">→</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

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