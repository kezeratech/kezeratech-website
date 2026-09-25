import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { PageHero } from '@/components/page-hero';

export default function TermsPage() {
  return (
    <main>
      <Navbar />
      <PageHero
        eyebrow="Legal"
        title="Terms & Conditions"
        description="The terms that govern your use of the Kezera Tech website and services."
      />
      <section className="section-padding">
        <div className="container-kezera max-w-3xl space-y-10 text-sm leading-7 text-muted-foreground">

          <div className="space-y-2">
            <p className="text-xs uppercase tracking-widest text-accent font-semibold">Last updated: 2026</p>
            <p>
              By accessing or using the Kezera Tech website at kezeratech.com, you agree
              to be bound by these Terms and Conditions. If you do not agree, please do
              not use the website.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">1. Use of the Website</h2>
            <p>You agree to use this website only for lawful purposes and in a manner that does not infringe the rights of others. You must not:</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>Use the website in any way that violates applicable local, national, or international laws</li>
              <li>Transmit unsolicited or unauthorized advertising material</li>
              <li>Attempt to gain unauthorized access to any part of the website or its related systems</li>
              <li>Use the website to harm, harass, or deceive any person</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">2. Intellectual Property</h2>
            <p>
              All content on this website — including text, graphics, logos, icons, images,
              and software — is the property of Kezera Tech and is protected by applicable
              intellectual property laws.
            </p>
            <p>
              You may not reproduce, distribute, or create derivative works from any content
              on this website without prior written permission from Kezera Tech.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">3. Services and Enquiries</h2>
            <p>
              Information submitted through our contact forms, quote request forms, or any
              other communication channel is subject to our{' '}
              <a href="/privacy" className="text-accent hover:underline">Privacy Policy</a>.
              Submitting an enquiry does not constitute a binding contract or guarantee of service.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">4. Disclaimer of Warranties</h2>
            <p>
              This website is provided on an "as is" basis without warranties of any kind,
              either express or implied. Kezera Tech does not warrant that the website will
              be uninterrupted, error-free, or free of viruses or other harmful components.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">5. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, Kezera Tech shall not be liable for
              any indirect, incidental, special, or consequential damages arising from your
              use of or inability to use this website.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">6. Third-Party Links</h2>
            <p>
              This website may contain links to third-party websites. These links are provided
              for convenience only. Kezera Tech has no control over the content of those
              websites and accepts no responsibility for them.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">7. Changes to These Terms</h2>
            <p>
              Kezera Tech reserves the right to modify these Terms and Conditions at any time.
              Changes will be effective immediately upon posting to the website. Continued use
              of the website after changes are posted constitutes your acceptance of the
              revised terms.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">8. Governing Law</h2>
            <p>
              These Terms and Conditions are governed by the laws of Ethiopia. Any disputes
              arising from these terms shall be subject to the exclusive jurisdiction of
              the courts of Addis Ababa, Ethiopia.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">9. Contact</h2>
            <p>
              If you have questions about these Terms and Conditions, please contact us at{' '}
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
