import { Card } from "@/components/ui/card"
import Image from "next/image"
import { Clipboard, Users, CheckCircle, Star } from "lucide-react"

export function HowItWorks() {
  return (
    <section id="how" className="hiw-section">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

        .hiw-section {
          position: relative;
          overflow: hidden;
          padding: 7rem 0 8rem;
          background: #FDFAF5;
          font-family: 'DM Sans', sans-serif;
        }

        /* Ambient orbs */
        .hiw-orb {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(90px);
          z-index: 0;
        }
        .hiw-orb-1 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(74,144,217,0.09) 0%, transparent 70%);
          top: -160px; left: -100px;
        }
        .hiw-orb-2 {
          width: 420px; height: 420px;
          background: radial-gradient(circle, rgba(245,166,35,0.10) 0%, transparent 70%);
          bottom: -80px; right: -80px;
        }
        .hiw-noise {
          position: absolute;
          inset: 0;
          z-index: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.025'/%3E%3C/svg%3E");
          pointer-events: none;
        }

        .hiw-container {
          position: relative;
          z-index: 1;
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        /* Header */
        .hiw-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 4rem;
          gap: 2rem;
          flex-wrap: wrap;
        }
        .hiw-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: 'Syne', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #22c55e;
          margin-bottom: 1rem;
        }
        .hiw-eyebrow-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #22c55e;
          display: inline-block;
        }
        .hiw-headline {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(2.4rem, 4vw, 3.4rem);
          font-weight: 400;
          line-height: 1.1;
          color: #1A1208;
          max-width: 500px;
          margin: 0;
        }
        .hiw-headline em {
          font-style: italic;
          color: #22c55e;
        }
        .hiw-subtext {
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 300;
          color: #6B5E48;
          line-height: 1.7;
          max-width: 280px;
          margin: 0;
          align-self: flex-end;
        }

        /* Grid layout */
        .hiw-grid {
          display: grid;
          grid-template-columns: 1fr 1.5fr 1fr;
          gap: 1.25rem;
          align-items: end;
        }

        @media (max-width: 1024px) {
          .hiw-grid {
            grid-template-columns: 1fr;
          }
          .hiw-center-card {
            order: -1;
          }
        }

        .hiw-col {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        /* Step cards */
        .hiw-step-card {
          position: relative;
          background: #FFFFFF;
          border-radius: 20px;
          border: 1px solid rgba(26, 18, 8, 0.07);
          padding: 1.5rem;
          overflow: hidden;
          transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
                      box-shadow 0.35s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .hiw-step-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px -12px rgba(26, 18, 8, 0.13);
        }
        .hiw-step-card:hover .hiw-card-glow {
          opacity: 1;
        }
        .hiw-card-glow {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.35s ease;
          z-index: 0;
          background: radial-gradient(ellipse at 50% 0%, rgba(74,144,217,0.10) 0%, transparent 65%);
        }
        .hiw-step-inner {
          position: relative;
          z-index: 1;
        }
        .hiw-step-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 1rem;
        }
        .hiw-step-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px; height: 38px;
          border-radius: 10px;
          background: rgba(74, 144, 217, 0.12);
          transition: transform 0.3s ease;
          flex-shrink: 0;
        }
        .hiw-step-card:hover .hiw-step-icon {
          transform: rotate(-6deg) scale(1.08);
        }
        .hiw-step-number {
          font-family: 'DM Serif Display', serif;
          font-style: italic;
          font-size: 13px;
          color: rgba(26, 18, 8, 0.22);
          letter-spacing: 0.02em;
        }
        .hiw-step-title {
          font-family: 'Syne', sans-serif;
          font-size: 15px;
          font-weight: 700;
          color: #1A1208;
          margin: 0 0 0.5rem;
          letter-spacing: -0.01em;
          line-height: 1.3;
        }
        .hiw-step-divider {
          height: 1px;
          background: rgba(26, 18, 8, 0.07);
          margin-bottom: 0.7rem;
        }
        .hiw-step-desc {
          font-size: 13.5px;
          font-weight: 300;
          color: #7A6B54;
          line-height: 1.7;
          margin: 0;
        }

        /* Trust card */
        .hiw-trust-card {
          position: relative;
          background: #1A1208;
          border-radius: 20px;
          padding: 1.5rem;
          overflow: hidden;
        }
        .hiw-trust-card-pattern {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0);
          background-size: 18px 18px;
          pointer-events: none;
        }
        .hiw-trust-card-glow {
          position: absolute;
          width: 180px; height: 180px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(14, 192, 73, 0.3) 0%, transparent 70%);
          top: -60px; right: -40px;
          pointer-events: none;
          filter: blur(30px);
        }
        .hiw-trust-inner {
          position: relative;
          z-index: 1;
        }
        .hiw-trust-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px; height: 36px;
          border-radius: 10px;
          background: rgba(245, 166, 35, 0.18);
          margin-bottom: 0.9rem;
        }
        .hiw-trust-title {
          font-family: 'Syne', sans-serif;
          font-size: 14px;
          font-weight: 700;
          color: #FDFAF5;
          margin: 0 0 0.5rem;
          letter-spacing: -0.01em;
        }
        .hiw-trust-divider {
          height: 1px;
          background: rgba(255, 255, 255, 0.1);
          margin-bottom: 0.7rem;
        }
        .hiw-trust-desc {
          font-size: 13px;
          font-weight: 300;
          color: rgba(253, 250, 245, 0.55);
          line-height: 1.7;
          margin: 0;
        }

        /* Center featured card */
        .hiw-center-card {
          position: relative;
          border-radius: 24px;
          overflow: hidden;
          border: 1px solid rgba(26, 18, 8, 0.07);
          box-shadow: 0 24px 60px -20px rgba(26, 18, 8, 0.18);
          background: #FFFFFF;
        }
        .hiw-center-image-wrap {
          position: relative;
          height: 360px;
          background: #EDE8DF;
          overflow: hidden;
        }
        .hiw-center-image-pattern {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle at 1px 1px, rgba(26,18,8,0.04) 1px, transparent 0);
          background-size: 20px 20px;
          z-index: 1;
        }
        .hiw-center-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(26,18,8,0.55) 0%, rgba(26,18,8,0.08) 50%, transparent 100%);
          z-index: 2;
        }
        .hiw-center-badge {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 3;
          padding: 1.5rem;
        }
        .hiw-center-badge-inner {
          background: rgba(253, 250, 245, 0.93);
          border-radius: 16px;
          padding: 1.25rem 1.4rem;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(26, 18, 8, 0.07);
        }
        .hiw-badge-step {
          font-family: 'Syne', sans-serif;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #22c55e;
          margin-bottom: 0.35rem;
        }
        .hiw-badge-title {
          font-family: 'Syne', sans-serif;
          font-size: 16px;
          font-weight: 700;
          color: #1A1208;
          margin: 0 0 0.45rem;
          letter-spacing: -0.01em;
          line-height: 1.25;
        }
        .hiw-badge-divider {
          height: 1px;
          background: rgba(26, 18, 8, 0.08);
          margin-bottom: 0.6rem;
        }
        .hiw-badge-desc {
          font-size: 13px;
          font-weight: 300;
          color: #7A6B54;
          line-height: 1.65;
          margin: 0;
        }

        /* Responsive */
        @media (max-width: 640px) {
          .hiw-header {
            flex-direction: column;
            align-items: flex-start;
          }
          .hiw-subtext {
            max-width: 100%;
          }
        }
      `}</style>

      <div className="hiw-noise" />
      <div className="hiw-orb hiw-orb-1" />
      <div className="hiw-orb hiw-orb-2" />

      <div className="hiw-container">
        {/* Header */}
        <div className="hiw-header">
          <div>
            <div className="hiw-eyebrow">
              <span className="hiw-eyebrow-dot" />
              How it works
            </div>
            <h2 className="hiw-headline">
              A frictionless way<br />to get work <em>done</em>
            </h2>
          </div>
          <p className="hiw-subtext">
            Hire vetted specialists for your tasks and get them done without the back-and-forth.
          </p>
        </div>

        {/* Three-column layout */}
        <div className="hiw-grid">

          {/* Left column */}
          <div className="hiw-col">
            <StepCard
              icon={Clipboard}
              title="Tell us what you need"
              description="Share the details of your task through a short questionnaire, and we'll match you with the right experts."
              step="01"
            />
            <StepCard
              icon={Users}
              title="Choose with confidence"
              description="Compare profiles, reviews, and pricing, then select the professional that feels right for you."
              step="03"
            />
          </div>

          {/* Center featured card */}
          <div className="hiw-center-card">
            <div className="hiw-center-image-wrap">
              <div className="hiw-center-image-pattern" />
              <Image
                src="/work.jpg"
                alt="Professionals collaborating"
                fill
                className="object-cover"
                style={{ zIndex: 0 }}
              />
              <div className="hiw-center-overlay" />
              <div className="hiw-center-badge">
                <div className="hiw-center-badge-inner">
                  <div className="hiw-badge-step">Step 02</div>
                  <h3 className="hiw-badge-title">Hear from qualified professionals</h3>
                  <div className="hiw-badge-divider" />
                  <p className="hiw-badge-desc">
                    Skilled specialists review your request and reach out with personalised offers.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="hiw-col">
            <StepCard
              icon={CheckCircle}
              title="Get it done and review"
              description="Approve the completed work, release payment, and leave a review to help others choose confidently."
              step="04"
            />
            {/* Trust card */}
            <div className="hiw-trust-card">
              <div className="hiw-trust-card-pattern" />
              <div className="hiw-trust-card-glow" />
              <div className="hiw-trust-inner">
                <div className="hiw-trust-icon">
                  <Star size={16} color="#22c55e" strokeWidth={2} aria-hidden />
                </div>
                <p className="hiw-trust-title">Trusted by fast-growing teams</p>
                <div className="hiw-trust-divider" />
                <p className="hiw-trust-desc">
                  High completion rates, verified professionals, and transparent pricing.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

/* ─── Step Card ─────────────────────────────────────────────── */

function StepCard({
  icon: Icon,
  title,
  description,
  step,
}: {
  icon: any
  title: string
  description: string
  step: string
}) {
  return (
    <div className="hiw-step-card">
      <div className="hiw-card-glow" />
      <div className="hiw-step-inner">
        <div className="hiw-step-top">
          <div className="hiw-step-icon">
            <Icon size={17} color="#22c55e" strokeWidth={2} aria-hidden />
          </div>
          <span className="hiw-step-number">{step}</span>
        </div>
        <h3 className="hiw-step-title">{title}</h3>
        <div className="hiw-step-divider" />
        <p className="hiw-step-desc">{description}</p>
      </div>
    </div>
  )
}