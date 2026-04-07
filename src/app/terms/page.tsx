import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms of Service | CHANGE Media",
  description: "Terms of Service for using CHANGE Media Website and Services.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] atmosphere relative overflow-hidden">
      <Nav />
      {/* Glow Background */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vh] bg-[var(--accent)]/10 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-0 w-[50vw] h-[50vh] bg-[var(--accent)]/10 blur-[150px] pointer-events-none rounded-full" />

      <main className="container-narrow py-32 relative z-10">
        <h1 className="font-serif text-5xl md:text-6xl text-white mb-6">
          Terms of Service
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mb-12 uppercase tracking-widest">
          Last Updated: April 6, 2026
        </p>

        <div className="prose prose-invert prose-lg max-w-none text-[var(--text-secondary)]">
          <h2 className="text-2xl font-serif text-white mt-12 mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing and using this website, you accept and agree to be bound by the terms and provisions of this agreement. In addition, when using this website&apos;s particular services, you shall be subject to any posted guidelines or rules applicable to such services. Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users, and others who access or use the Service.
          </p>

          <h2 className="text-2xl font-serif text-white mt-12 mb-4">2. Intellectual Property</h2>
          <p>
            The Site and its original content, features, and functionality are owned by CHANGE Media and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws. All photographs, videos, design elements, text, and graphics shown on this website remain the sole property of CHANGE Media, unless otherwise stated.
          </p>
          <p>
            Unauthorized reproduction, republication, distribution, or use of our creative assets across any medium, personal or commercial, without obtaining explicitly written legal consent or a purchased licensing agreement is strictly prohibited.
          </p>

          <h2 className="text-2xl font-serif text-white mt-12 mb-4">3. Bookings and Contracts</h2>
          <p>
            Inquiries and online reservations made through this website are requests for service. A booking is not considered fully secured or confirmed until:
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>A customized proposal or legal Service Agreement / Contract has been signed.</li>
            <li>A non-refundable retainer fee has been paid in full.</li>
          </ul>
          <p>
            Final deliverables, editing timelines, and specific usage rights are governed by the individual Service Agreement signed between the client and CHANGE Media. In the event of a discrepancy between these generalized Terms and your specific contract, your specific contract shall prevail.
          </p>

          <h2 className="text-2xl font-serif text-white mt-12 mb-4">4. Payment and Fees</h2>
          <p>
            All fees, pricing packages, and print add-ons conveyed on this website are estimates and subject to change without notice. We reserve the right to refuse service, cancel orders, or alter pricing for any product or session. Any payments processed digitally through our portal or third-party invoicing must be completed prior to the release of high-resolution digital galleries or print products.
          </p>

          <h2 className="text-2xl font-serif text-white mt-12 mb-4">5. Disclaimer of Warranties</h2>
          <p>
            Your use of the website and services is at your sole risk. The service is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis. The service is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement, or course of performance.
          </p>
          
          <h2 className="text-2xl font-serif text-white mt-12 mb-4">6. Limitation of Liability</h2>
          <p>
            In no event shall CHANGE Media, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
          </p>

          <h2 className="text-2xl font-serif text-white mt-12 mb-4">7. Termination</h2>
          <p>
            We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
          </p>

          <h2 className="text-2xl font-serif text-white mt-12 mb-4">8. Governing Law</h2>
          <p>
            These Terms shall be governed and construed in accordance with the laws of the State of Colorado, United States, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
          </p>

          <h2 className="text-2xl font-serif text-white mt-12 mb-4">9. Changes</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, please stop using the Service.
          </p>

          <h2 className="text-2xl font-serif text-white mt-12 mb-4">10. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at:
            <br />
            <strong>hello@changemedia.com</strong>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
