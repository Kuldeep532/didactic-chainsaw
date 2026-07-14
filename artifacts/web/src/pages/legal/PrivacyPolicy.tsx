export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 md:px-8 max-w-screen-md py-24">
      <div className="mb-12 border-b border-border pb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Privacy Policy</h1>
        <p className="text-muted-foreground font-mono text-sm uppercase tracking-wider">
          Effective Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-lg leading-relaxed text-muted-foreground mb-8">
          Nexus Wave Technologies ("we," "our," or "us") respects your privacy and is committed to protecting your personal data. This policy details our processing mechanisms when you interact with our software and infrastructure.
        </p>

        <h2 className="text-xl font-semibold mt-10 mb-4 text-foreground">1. Data Collection</h2>
        <p className="text-muted-foreground">We restrict data collection to the absolute minimum required for operational functionality:</p>
        <ul className="list-disc pl-6 space-y-2 mt-4 text-muted-foreground">
          <li><strong>Identity Data:</strong> Basic identifiers such as name and username.</li>
          <li><strong>Contact Data:</strong> Communication vectors like email addresses.</li>
          <li><strong>Technical Data:</strong> Anonymized metrics including IP addresses, browser specifications, and platform details.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-10 mb-4 text-foreground">2. Processing Rationale</h2>
        <p className="text-muted-foreground">Processing occurs exclusively under the following jurisdictions:</p>
        <ul className="list-disc pl-6 space-y-2 mt-4 text-muted-foreground">
          <li>Contractual necessity for service delivery.</li>
          <li>Legitimate operational interests that do not infringe upon fundamental rights.</li>
          <li>Compliance with statutory legal obligations.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-10 mb-4 text-foreground">3. System Permissions</h2>
        <p className="text-muted-foreground">Our client applications request hardware access strictly for local operations. We do not exfiltrate this data:</p>
        <ul className="list-disc pl-6 space-y-2 mt-4 text-muted-foreground">
          <li><strong>Location Access:</strong> Exclusively for the Emergency Guardian feature to dispatch local safety alerts. Processed on-device.</li>
          <li><strong>Storage Access:</strong> Required to serialize offline data, downloaded materials, and user-generated configurations.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-10 mb-4 text-foreground">4. Security Infrastructure</h2>
        <p className="text-muted-foreground">We deploy industry-standard cryptographic and structural measures to prevent unauthorized data ingress, alteration, or exposure.</p>

        <h2 className="text-xl font-semibold mt-10 mb-4 text-foreground">5. Inquiries</h2>
        <p className="text-muted-foreground">Direct all privacy-related correspondence to our compliance channel:</p>
        <p className="font-mono text-sm mt-4 p-4 bg-muted border border-border inline-block text-foreground">info@nexusweb.co.in</p>
      </div>
    </div>
  );
}