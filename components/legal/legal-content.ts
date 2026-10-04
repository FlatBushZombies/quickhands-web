// Copy for the /privacy-policy page. The text is the live, reviewed policy from
// app/privacy-policy (effective March 4, 2026), laid out in the Legal design.
// Inline markup:
//   **text**          -> bold
//   [label](url)      -> link

export type LegalBlock = string | { ul: string[] }

export type LegalSection = [heading: string, blocks: LegalBlock[]]

export const PRIVACY_POLICY = {
  t1: "Privacy",
  tEm: "policy",
  t2: ".",
  lead: "Welcome to Quickhands. This Privacy Policy explains how Quickhands (\"we\", \"our\", or \"us\"), operated through our website at [www.quickhandsafrica.com](https://www.quickhandsafrica.com) and our mobile application, collects, uses, and protects your personal information. By using the Quickhands platform, you agree to the collection and use of information in accordance with this policy.",
  effective: "Quickhands Africa — Effective Date: March 4, 2026",
  copyright: "© 2026 Quickhands Africa. All rights reserved.",
  sections: [
    ["Information We Collect", [
      "We collect the following types of information when you use Quickhands:",
      { ul: [
        "**Account information:** name, email address, phone number, and profile photo.",
        "**Service information:** skills, work history, portfolio photos, videos, and pricing (for specialists).",
        "**Location information:** city or region to match you with nearby services.",
        "**Usage data:** how you interact with the app, searches made, and services viewed.",
        "**Communications:** messages sent through the platform or via WhatsApp integration.",
        "**Payment information:** where applicable, transaction details processed through our payment partners.",
      ] },
    ]],
    ["How We Use Your Information", [
      "We use your information to:",
      { ul: [
        "Create and manage your account.",
        "Connect customers with specialists based on location and service needs.",
        "Display your profile, portfolio, and ratings to potential clients.",
        "Send notifications about job requests, bookings, and platform updates.",
        "Improve the Quickhands platform and user experience.",
        "Ensure platform security and prevent fraud.",
        "Comply with applicable laws and regulations.",
      ] },
    ]],
    ["Sharing Your Information", [
      "We do not sell your personal information. We may share your information in the following circumstances:",
      { ul: [
        "**With other users:** your public profile, ratings, and portfolio are visible to customers on the platform.",
        "**With service providers:** third-party partners who help us operate the platform (e.g., hosting, payments, analytics).",
        "**With law enforcement:** if required by law or to protect the rights and safety of our users.",
        "**In a business transfer:** if Quickhands is acquired or merged, your information may be transferred as part of that transaction.",
      ] },
    ]],
    ["WhatsApp Integration", [
      "Quickhands may include links or buttons that connect you directly to specialists or our support team via WhatsApp. When you use WhatsApp, its own privacy policy applies. We do not store the content of your WhatsApp conversations.",
    ]],
    ["Data Storage and Security", [
      "Your data is stored on secure servers. We implement industry-standard security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.",
      "However, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security of your data.",
    ]],
    ["Data Retention", [
      "We retain your personal information for as long as your account is active or as needed to provide you with our services. You may request deletion of your account and associated data at any time by contacting us.",
    ]],
    ["Your Rights", [
      "You have the right to:",
      { ul: [
        "Access the personal information we hold about you.",
        "Request correction of inaccurate or incomplete information.",
        "Request deletion of your personal data.",
        "Withdraw consent for data processing where consent is the legal basis.",
        "Lodge a complaint with a relevant data protection authority.",
      ] },
      "To exercise any of these rights, please contact us at the details below.",
    ]],
    ["Children's Privacy", [
      "Quickhands is not intended for use by individuals under the age of 18. We do not knowingly collect personal information from minors. If we become aware that a minor has provided us with personal data, we will delete it promptly.",
    ]],
    ["Third-Party Links", [
      "Our platform may contain links to third-party websites or services. We are not responsible for the privacy practices of those third parties and encourage you to review their privacy policies.",
    ]],
    ["Changes to This Privacy Policy", [
      "We may update this Privacy Policy from time to time. When we do, we will notify you via the app or our website at [www.quickhandsafrica.com](https://www.quickhandsafrica.com). Your continued use of the platform after changes are posted constitutes your acceptance of the updated policy.",
    ]],
    ["Contact Us", [
      "If you have any questions or concerns about this Privacy Policy, please contact us:",
      "**Company:** Quickhands Africa",
      "**Website:** [www.quickhandsafrica.com](https://www.quickhandsafrica.com)",
      "**Email:** [support@quickhandsafrica.com](mailto:support@quickhandsafrica.com)",
      "**Location:** Harare, Zimbabwe",
    ]],
  ] as LegalSection[],
}
