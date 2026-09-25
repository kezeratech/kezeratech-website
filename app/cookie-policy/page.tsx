import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { PageHero } from '@/components/page-hero';

export default function CookiePage() {
  return (
    <main>
      <Navbar />
      <PageHero
        eyebrow="Legal"
        title="Cookie Policy"
        description="How Kezera Tech uses cookies and similar technologies on this website."
      />
      <section className="section-padding">
        <div className="container-kezera max-w-3xl space-y-10 text-sm leading-7 text-muted-foreground">

          <div className="space-y-2">
            <p className="text-xs uppercase tracking-widest text-accent font-semibold">Last updated: 2026</p>
            <p>
              This Cookie Policy explains what cookies are, how Kezera Tech uses them on
              this website, and the choices you have regarding their use.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">1. What Are Cookies?</h2>
            <p>
              Cookies are small text files stored on your device when you visit a website.
              They help the website remember information about your visit, making it faster
              and more useful on your next visit. Cookies cannot run programs or deliver
              viruses to your device.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">2. How We Use Cookies</h2>
            <p>We use cookies for the following purposes:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong className="text-foreground">Essential cookies</strong> — required for the
                website to function correctly, such as maintaining your session when logged into
                the admin panel.
              </li>
              <li>
                <strong className="text-foreground">Preference cookies</strong> — remember your
                settings such as dark or light mode so you do not have to set them again on
                each visit.
              </li>
              <li>
                <strong className="text-foreground">Analytics cookies</strong> — help us understand
                how visitors use the website so we can improve it. These may be added in the
                future using a service such as Google Analytics.
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">3. Types of Cookies We Use</h2>
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Cookie</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Purpose</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/50">
                    <td className="px-4 py-3">theme</td>
                    <td className="px-4 py-3">Stores your dark/light mode preference</td>
                    <td className="px-4 py-3">1 year</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="px-4 py-3">sb-auth-token</td>
                    <td className="px-4 py-3">Keeps admin users authenticated</td>
                    <td className="px-4 py-3">Session</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">4. Managing Cookies</h2>
            <p>
              You can control and manage cookies through your browser settings. Most browsers
              allow you to refuse cookies, delete existing cookies, or be notified when cookies
              are set.
            </p>
            <p>
              Please note that disabling certain cookies may affect the functionality of this
              website, particularly the admin panel.
            </p>
            <p>Instructions for popular browsers:</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noreferrer" className="text-accent hover:underline">
                  Google Chrome
                </a>
              </li>
              <li>
                <a href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences" target="_blank" rel="noreferrer" className="text-accent hover:underline">
                  Mozilla Firefox
                </a>
              </li>
              <li>
                <a href="https://support.microsoft.com/en-us/topic/delete-and-manage-cookies-168dab11-0753-043d-7c16-ede5947fc64d" target="_blank" rel="noreferrer" className="text-accent hover:underline">
                  Microsoft Edge
                </a>
              </li>
              <li>
                <a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noreferrer" className="text-accent hover:underline">
                  Safari
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">5. Changes to This Policy</h2>
            <p>
              We may update this Cookie Policy as our use of cookies changes. Any updates
              will be reflected by the date at the top of this page.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">6. Contact</h2>
            <p>
              If you have questions about how we use cookies, please contact us at{' '}
              <a href="mailto:kezeratech@gmail.com" className="text-accent hover:underline">
                kezeratech@gmail.com
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
