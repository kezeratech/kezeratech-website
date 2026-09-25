import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { PageHero } from '@/components/page-hero';

export default function PrivacyPage() {
  return (
    <main>
      <Navbar />
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        description="How Kezera Tech collects, uses, and protects your information."
      />
      <section className="section-padding">
        <div className="container-kezera max-w-3xl space-y-10 text-sm leading-7 text-muted-foreground">

          <div className="space-y-2">
            <p className="text-xs uppercase tracking-widest text-accent font-semibold">Last updated: 2026</p>
            <p>
              Kezera Tech ("we", "our", or "us") is committed to protecting your privacy.
              This Privacy Policy explains what information we collect, how we use it, and
              what choices you have.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">1. Information We Collect</h2>
            <p>We collect information you provide directly to us, including:</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>Name and email address when you contact us or request a quote</li>
              <li>Phone number and company name when provided voluntarily</li>
              <li>Project details, goals, and any other information you share in forms</li>
              <li>Email address when you subscribe to our newsletter</li>
              <li>CV, portfolio links, and cover letter when you apply for a job</li>
            </ul>
            <p>
              We may also collect limited technical data such as browser type and pages visited
              through standard web analytics tools.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>Respond to your enquiries and project requests</li>
              <li>Send newsletters you have subscribed to</li>
              <li>Review job applications and contact candidates</li>
              <li>Improve our website and services</li>
              <li>Comply with legal obligations</li>
            </ul>
            <p>We do not sell your personal information to third parties.</p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">3. Data Storage</h2>
            <p>
              Your information is stored securely using Supabase, which provides encrypted
              storage and access controls. Data is retained only as long as necessary for
              the purposes stated in this policy.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">4. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>Request access to the personal data we hold about you</li>
              <li>Request correction or deletion of your data</li>
              <li>Unsubscribe from our newsletter at any time</li>
              <li>Withdraw consent where processing is based on consent</li>
            </ul>
            <p>
              To exercise any of these rights, please contact us at{' '}
              <a href="mailto:kezeratech@gmail.com" className="text-accent hover:underline">
                kezeratech@gmail.com
              </a>
              .
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">5. Cookies</h2>
            <p>
              Our website uses cookies to improve your experience. Please see our{' '}
              <a href="/cookie-policy" className="text-accent hover:underline">
                Cookie Policy
              </a>{' '}
              for details.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">6. Third-Party Services</h2>
            <p>
              We use trusted third-party services including Supabase for data storage.
              These services have their own privacy policies and security practices.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">7. Changes to This Policy</h2>
            <p>
              We may update this policy from time to time. Any significant changes will be
              reflected by an updated date at the top of this page. Continued use of the
              website after changes means you accept the updated policy.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">8. Contact</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at{' '}
              <a href="mailto:kezeratech@gmail.com" className="text-accent hover:underline">
                kezeratech@gmail.com
              </a>{' '}
              or call us at{' '}
              <a href="tel:+251974585446" className="text-accent hover:underline">
                +251 974 585 446
              </a>
              .
            </p>
          </div>

        </div>
      </section>
      <Footer />
    </main>
  );
}
