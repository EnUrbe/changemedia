import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy | CHANGE Media",
  description: "Privacy Policy and data handling practices for CHANGE Media.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] atmosphere relative overflow-hidden">
      <Nav />
      {/* Glow Background */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vh] bg-[var(--accent)]/10 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-0 w-[50vw] h-[50vh] bg-[var(--accent)]/10 blur-[150px] pointer-events-none rounded-full" />

      <main className="container-narrow py-32 relative z-10">
        <h1 className="font-serif text-5xl md:text-6xl text-white mb-6">
          Privacy Policy
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mb-12 uppercase tracking-widest">
          Last Updated: April 6, 2026
        </p>

        <div className="prose prose-invert prose-lg max-w-none text-[var(--text-secondary)]">
          <h2 className="text-2xl font-serif text-white mt-12 mb-4">1. Introduction</h2>
          <p>
            At CHANGE Media, we respect your privacy and are committed to protecting it through our compliance with this policy. This policy describes the types of information we may collect from you or that you may provide when you visit our website, book our services, or use our digital photo delivery systems.
          </p>

          <h2 className="text-2xl font-serif text-white mt-12 mb-4">2. Information We Collect</h2>
          <p>We may collect several types of information from and about users of our website, including:</p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li><strong>Personal Information:</strong> Such as name, postal address, e-mail address, and telephone number when you submit an inquiry, book a session, or create a client account.</li>
            <li><strong>Media Data:</strong> Photographs, videos, and project files captured during your booked sessions.</li>
            <li><strong>Usage Data:</strong> Information about your internet connection, the equipment you use to access our website, and usage details through cookies or tracking technologies to improve our services.</li>
          </ul>

          <h2 className="text-2xl font-serif text-white mt-12 mb-4">3. How We Use Your Information</h2>
          <p>We use information that we collect about you or that you provide to us:</p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>To present our website, portfolios, and client galleries to you.</li>
            <li>To provide you with information, pricing, products, or services that you request from us.</li>
            <li>To fulfill our obligations and enforce our rights arising from any contracts entered into between you and us, including billing, gallery delivery, and print fulfillment.</li>
            <li>To notify you about changes to our website or any products or services we offer.</li>
          </ul>

          <h2 className="text-2xl font-serif text-white mt-12 mb-4">4. Sharing of Information</h2>
          <p>
            We do not sell, trade, or rent your Personal Identification Information to others. We may share generic aggregated demographic information not linked to any personal identification information regarding visitors and users with our business partners, trusted affiliates, and advertisers. We may use third-party service providers to help us operate our business and the Site or administer activities on our behalf (such as sending out newsletters, processing payments, or hosting image galleries).
          </p>
          <p>
            Any photographs or media captured during a session may be used for our portfolio, marketing, and promotional materials in accordance with the specific terms outlined in your signed photography contract/release. We respect your right to privacy and will accommodate specific privacy requests negotiated in the contract.
          </p>

          <h2 className="text-2xl font-serif text-white mt-12 mb-4">5. Data Security</h2>
          <p>
            We have implemented appropriate data collection, storage, and processing practices and security measures to protect against unauthorized access, alteration, disclosure, or destruction of your personal information, transaction information, and data stored on our Site. However, the transmission of information via the internet is not completely secure, and we cannot guarantee the security of your personal information transmitted to our website.
          </p>

          <h2 className="text-2xl font-serif text-white mt-12 mb-4">6. Your Rights</h2>
          <p>
            Depending on your location, you may have rights regarding your personal information, including the right to access, update, or delete the personal information we have on you. If you wish to exercise any of these rights, please contact us.
          </p>

          <h2 className="text-2xl font-serif text-white mt-12 mb-4">7. Contact Information</h2>
          <p>
            To ask questions or comment about this privacy policy and our privacy practices, contact us at:
            <br />
            <strong>hello@changemedia.com</strong>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
