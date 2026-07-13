export default function RefundPolicy() {
  return (
    <div className="container mx-auto px-4 md:px-8 max-w-screen-md py-20 prose dark:prose-invert">
      <h1>Refund Policy</h1>
      <p className="lead">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      
      <p>Thank you for choosing Nexus Wave Technologies. We stand behind the engineering quality of our products, including Nexus Plus and Geeta Nexus. However, we understand that situations arise where a refund may be requested.</p>
      
      <h2>1. Digital Products and Subscriptions</h2>
      <p>Due to the nature of digital software and cloud-based infrastructure, our standard policy is that all sales are final. However, we review refund requests on a case-by-case basis to ensure customer satisfaction.</p>

      <h2>2. Eligibility for Refund</h2>
      <p>You may be eligible for a refund if:</p>
      <ul>
        <li>You request the refund within 14 days of the initial purchase or subscription renewal.</li>
        <li>The service or application failed to perform as described due to a verified technical fault on our infrastructure.</li>
        <li>You were incorrectly billed due to an administrative or system error.</li>
      </ul>

      <h2>3. App Store Purchases</h2>
      <p>If you purchased Nexus Plus or Geeta Nexus through a third-party marketplace (such as the Apple App Store or Google Play Store), the refund policy of that specific marketplace applies. We cannot directly issue refunds for purchases made through these platforms; you must process the request through their respective support channels.</p>

      <h2>4. Enterprise Contracts</h2>
      <p>For enterprise clients under custom service level agreements (SLAs), refund and credit policies are governed by the specific terms outlined in your contract.</p>

      <h2>5. How to Request a Refund</h2>
      <p>To request a refund for a direct purchase, please contact our support team at <strong>info@nexusweb.co.in</strong> with your order details, account email, and a detailed explanation of your reason for requesting a refund. Our team will review your request and respond within 3-5 business days.</p>
    </div>
  );
}
