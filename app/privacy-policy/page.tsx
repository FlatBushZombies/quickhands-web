import Link from "next/link"

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-6 py-16">

        {/* Back navigation */}
        <div className="mb-8">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
          >
            &larr; Back to home
          </Link>
        </div>

        <div className="bg-card border border-border rounded-3xl shadow-sm p-8 sm:p-12">
          {/* Header */}
          <div className="mb-10 pb-6 border-b border-border">
            <h1 className="text-4xl font-bold text-foreground tracking-tight mb-2">Privacy Policy</h1>
            <p className="text-sm text-muted-foreground">Quickhands Africa &mdash; Effective Date: March 4, 2026</p>
          </div>

          {/* Intro */}
          <p className="text-muted-foreground leading-relaxed mb-10 text-[15.5px]">
            Welcome to Quickhands. This Privacy Policy explains how Quickhands ("we", "our", or "us"),
            operated through our website at{" "}
            <a href="https://www.quickhandsafrica.com" className="text-primary hover:text-primary-hover hover:underline font-medium">
              www.quickhandsafrica.com
            </a>{" "}
            and our mobile application, collects, uses, and protects your personal information.
            By using the Quickhands platform, you agree to the collection and use of information
            in accordance with this policy.
          </p>

          <div className="space-y-10 text-[15px]">

            {/* Section 1 */}
            <section>
              <h2 className="text-xl font-bold text-foreground mb-4">1. Information We Collect</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We collect the following types of information when you use Quickhands:
              </p>
              <ul className="list-disc list-inside space-y-3 text-muted-foreground leading-relaxed pl-2">
                <li><span className="font-semibold text-foreground">Account information:</span> name, email address, phone number, and profile photo.</li>
                <li><span className="font-semibold text-foreground">Service information:</span> skills, work history, portfolio photos, videos, and pricing (for specialists).</li>
                <li><span className="font-semibold text-foreground">Location information:</span> city or region to match you with nearby services.</li>
                <li><span className="font-semibold text-foreground">Usage data:</span> how you interact with the app, searches made, and services viewed.</li>
                <li><span className="font-semibold text-foreground">Communications:</span> messages sent through the platform or via WhatsApp integration.</li>
                <li><span className="font-semibold text-foreground">Payment information:</span> where applicable, transaction details processed through our payment partners.</li>
              </ul>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-xl font-bold text-foreground mb-4">2. How We Use Your Information</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">We use your information to:</p>
              <ul className="list-disc list-inside space-y-3 text-muted-foreground leading-relaxed pl-2">
                <li>Create and manage your account.</li>
                <li>Connect customers with specialists based on location and service needs.</li>
                <li>Display your profile, portfolio, and ratings to potential clients.</li>
                <li>Send notifications about job requests, bookings, and platform updates.</li>
                <li>Improve the Quickhands platform and user experience.</li>
                <li>Ensure platform security and prevent fraud.</li>
                <li>Comply with applicable laws and regulations.</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-xl font-bold text-foreground mb-4">3. Sharing Your Information</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We do not sell your personal information. We may share your information in the following circumstances:
              </p>
              <ul className="list-disc list-inside space-y-3 text-muted-foreground leading-relaxed pl-2">
                <li><span className="font-semibold text-foreground">With other users:</span> your public profile, ratings, and portfolio are visible to customers on the platform.</li>
                <li><span className="font-semibold text-foreground">With service providers:</span> third-party partners who help us operate the platform (e.g., hosting, payments, analytics).</li>
                <li><span className="font-semibold text-foreground">With law enforcement:</span> if required by law or to protect the rights and safety of our users.</li>
                <li><span className="font-semibold text-foreground">In a business transfer:</span> if Quickhands is acquired or merged, your information may be transferred as part of that transaction.</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-xl font-bold text-foreground mb-4">4. WhatsApp Integration</h2>
              <p className="text-muted-foreground leading-relaxed">
                Quickhands may include links or buttons that connect you directly to specialists or our support
                team via WhatsApp. When you use WhatsApp, its own privacy policy applies. We do not store
                the content of your WhatsApp conversations.
              </p>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-xl font-bold text-foreground mb-4">5. Data Storage and Security</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Your data is stored on secure servers. We implement industry-standard security measures to
                protect your personal information from unauthorized access, alteration, disclosure, or destruction.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                However, no method of transmission over the internet is 100% secure. We cannot guarantee
                absolute security of your data.
              </p>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-xl font-bold text-foreground mb-4">6. Data Retention</h2>
              <p className="text-muted-foreground leading-relaxed">
                We retain your personal information for as long as your account is active or as needed to
                provide you with our services. You may request deletion of your account and associated data
                at any time by contacting us.
              </p>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-xl font-bold text-foreground mb-4">7. Your Rights</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">You have the right to:</p>
              <ul className="list-disc list-inside space-y-3 text-muted-foreground leading-relaxed pl-2">
                <li>Access the personal information we hold about you.</li>
                <li>Request correction of inaccurate or incomplete information.</li>
                <li>Request deletion of your personal data.</li>
                <li>Withdraw consent for data processing where consent is the legal basis.</li>
                <li>Lodge a complaint with a relevant data protection authority.</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                To exercise any of these rights, please contact us at the details below.
              </p>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="text-xl font-bold text-foreground mb-4">8. Children's Privacy</h2>
              <p className="text-muted-foreground leading-relaxed">
                Quickhands is not intended for use by individuals under the age of 18. We do not knowingly
                collect personal information from minors. If we become aware that a minor has provided us
                with personal data, we will delete it promptly.
              </p>
            </section>

            {/* Section 9 */}
            <section>
              <h2 className="text-xl font-bold text-foreground mb-4">9. Third-Party Links</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our platform may contain links to third-party websites or services. We are not responsible
                for the privacy practices of those third parties and encourage you to review their privacy policies.
              </p>
            </section>

            {/* Section 10 */}
            <section>
              <h2 className="text-xl font-bold text-foreground mb-4">10. Changes to This Privacy Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Privacy Policy from time to time. When we do, we will notify you via the
                app or our website at{" "}
                <a href="https://www.quickhandsafrica.com" className="text-primary hover:text-primary-hover hover:underline font-medium">
                  www.quickhandsafrica.com
                </a>. Your continued use of the platform after changes are posted constitutes your
                acceptance of the updated policy.
              </p>
            </section>

            {/* Section 11 */}
            <section>
              <h2 className="text-xl font-bold text-foreground mb-4">11. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                If you have any questions or concerns about this Privacy Policy, please contact us:
              </p>
              <div className="text-muted-foreground leading-relaxed space-y-2 pl-2 border-l-2 border-primary/20">
                <p><span className="font-semibold text-foreground">Company:</span> Quickhands Africa</p>
                <p>
                  <span className="font-semibold text-foreground">Website:</span>{" "}
                  <a href="https://www.quickhandsafrica.com" className="text-primary hover:text-primary-hover hover:underline font-medium">
                    www.quickhandsafrica.com
                  </a>
                </p>
                <p>
                  <span className="font-semibold text-foreground">Email:</span>{" "}
                  <a href="mailto:support@quickhandsafrica.com" className="text-primary hover:text-primary-hover hover:underline font-medium">
                    support@quickhandsafrica.com
                  </a>
                </p>
                <p><span className="font-semibold text-foreground">Location:</span> Harare, Zimbabwe</p>
              </div>
            </section>

          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-border/60 text-center">
          <p className="text-sm text-muted-foreground">&copy; 2026 Quickhands Africa. All rights reserved.</p>
        </div>

      </div>
    </div>
  );
}