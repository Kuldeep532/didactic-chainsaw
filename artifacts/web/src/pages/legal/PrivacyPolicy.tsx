export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto max-w-screen-md px-4 py-20 md:px-8">
      <div className="mb-12 border-b border-border pb-8">
        <p className="mb-3 text-sm font-medium text-muted-foreground">Nexus Web Technology</p>
        <h1 className="mb-4 text-4xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground">Last updated: September 27, 2026</p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none text-muted-foreground">
        <p className="text-lg leading-relaxed text-foreground">
          This Privacy Policy explains how Nexus Wave uses information when you visit this website, create a Nexus account, contact us, or use connected products such as Nexus Plus and Geeta Nexus.
        </p>
        <p>
          “Nexus Web Technology” and “Nexus Wave” are names used for software products and online services developed by Kuldeep. They are used as a developer identity and product name.
        </p>

        <h2 className="mt-10 text-xl font-semibold text-foreground">1. Information we may collect</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li><strong>Account information:</strong> email address and, where provided, profile details such as a display name or avatar.</li>
          <li><strong>Service information:</strong> subscription status, product access, credits, transaction references and support details needed to provide paid services.</li>
          <li><strong>Messages:</strong> information you send through contact or support forms so we can respond to you.</li>
          <li><strong>Technical information:</strong> limited information needed for security, reliability and troubleshooting, such as device or browser information and network data.</li>
        </ul>

        <h2 className="mt-10 text-xl font-semibold text-foreground">2. Authentication</h2>
        <p>
          Website account registration and sign-in are handled through Supabase Auth. Your password is processed by the authentication service and is not stored in this website's application code. Supabase Auth uses sessions and access tokens to keep you signed in.
        </p>

        <h2 className="mt-10 text-xl font-semibold text-foreground">3. How we use information</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>Create and maintain your account.</li>
          <li>Provide Nexus Plus, Geeta Nexus and website features.</li>
          <li>Deliver paid memberships or credits and verify related transactions.</li>
          <li>Respond to questions, support requests and refund requests.</li>
          <li>Protect accounts, prevent fraud or misuse, and maintain service security.</li>
          <li>Meet legal or regulatory requirements when applicable.</li>
        </ul>

        <h2 className="mt-10 text-xl font-semibold text-foreground">4. Payments</h2>
        <p>
          When a payment provider is used, payment credentials such as card or bank details are handled by that provider under its own privacy and security controls. We may receive transaction information such as order IDs, payment references, status and amount so that we can verify a purchase, provide the service and handle support or refunds.
        </p>

        <h2 className="mt-10 text-xl font-semibold text-foreground">5. Cookies and local storage</h2>
        <p>
          The website may use browser storage to keep an authentication session and remember necessary preferences. These storage mechanisms are used to provide the requested service rather than to build an advertising profile.
        </p>

        <h2 className="mt-10 text-xl font-semibold text-foreground">6. Sharing and service providers</h2>
        <p>
          We may use service providers such as Supabase and payment processors to operate authentication, databases, hosting and payments. Information is shared only to the extent needed to provide the requested service, protect the platform, or comply with law.
        </p>

        <h2 className="mt-10 text-xl font-semibold text-foreground">7. Data security</h2>
        <p>
          We use access controls, authenticated requests, encrypted connections and other reasonable safeguards designed to protect information. No internet service can guarantee absolute security, so please use a strong, unique password for your account.
        </p>

        <h2 className="mt-10 text-xl font-semibold text-foreground">8. Data retention and deletion</h2>
        <p>
          Information is retained for as long as reasonably necessary to provide the service, maintain transaction records, resolve disputes, prevent abuse, or meet legal obligations. You may contact us to ask about account deletion or the information associated with your account.
        </p>

        <h2 className="mt-10 text-xl font-semibold text-foreground">9. Children's privacy</h2>
        <p>
          Our services are not intentionally designed to collect personal information from children without appropriate consent. Please contact us if you believe a child has provided personal information that should be removed.
        </p>

        <h2 className="mt-10 text-xl font-semibold text-foreground">10. Updates to this policy</h2>
        <p>
          We may update this policy when our services, payment methods or legal requirements change. The latest version will always be published on this page.
        </p>

        <h2 className="mt-10 text-xl font-semibold text-foreground">11. Contact</h2>
        <p>
          For privacy questions, account deletion requests or data concerns, email:
        </p>
        <p className="mt-4 inline-block rounded-lg border border-border bg-muted p-4 font-medium text-foreground">info@nexusweb.co.in</p>
      </div>
    </div>
  );
}
