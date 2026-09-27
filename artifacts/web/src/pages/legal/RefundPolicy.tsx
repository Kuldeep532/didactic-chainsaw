export default function RefundPolicy() {
  return (
    <div className="container mx-auto max-w-screen-md px-4 py-20 md:px-8">
      <div className="mb-12 border-b border-border pb-8">
        <p className="mb-3 text-sm font-medium text-muted-foreground">Nexus Web Technology</p>
        <h1 className="mb-4 text-4xl font-bold tracking-tight">Refund Policy</h1>
        <p className="text-sm text-muted-foreground">Last updated: September 27, 2026</p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none text-muted-foreground">
        <p className="text-lg leading-relaxed text-foreground">
          This Refund Policy explains how refunds, failed payments and cancellations are handled for paid Nexus Web Technology services, including Nexus Plus memberships and AI credit top-ups where offered.
        </p>

        <h2 className="mt-10 text-xl font-semibold text-foreground">1. When a refund may be available</h2>
        <p>Refunds may be considered for:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>A duplicate payment for the same order.</li>
          <li>A payment that was debited but the order could not be fulfilled after verification.</li>
          <li>An incorrect charge or payment-processing error confirmed by our records.</li>
          <li>An eligible cancellation or refund request where the purchased service has not been materially used.</li>
          <li>An unauthorized transaction that is reported promptly and can be verified.</li>
        </ul>

        <h2 className="mt-10 text-xl font-semibold text-foreground">2. Digital credits and feature usage</h2>
        <p>
          Because AI and other digital features can be consumed immediately, credits or paid features that have already been materially used may not be refundable except where the issue was caused by a billing or service error. Unused credits may be reviewed on a case-by-case basis.
        </p>

        <h2 className="mt-10 text-xl font-semibold text-foreground">3. Failed or debited transactions</h2>
        <p>
          If your bank shows a debit but the Nexus order is not successfully completed, contact us with the order or payment reference. We will reconcile the transaction before confirming the outcome. Where a refund is due, we will initiate it after verification and approval.
        </p>

        <h2 className="mt-10 text-xl font-semibold text-foreground">4. How to request a refund</h2>
        <p>Send an email to <strong>info@nexusweb.co.in</strong> with:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Your account email address.</li>
          <li>Order ID or payment reference, if available.</li>
          <li>Amount and approximate payment date.</li>
          <li>A short description of the issue.</li>
        </ul>

        <h2 className="mt-10 text-xl font-semibold text-foreground">5. Review and processing time</h2>
        <p>
          We aim to review refund requests within 5 business days after receiving the information needed to verify the transaction. Once approved, the refund is initiated through the applicable payment channel. The final time for the amount to appear in your bank or payment account depends on the payment provider and your bank.
        </p>

        <h2 className="mt-10 text-xl font-semibold text-foreground">6. Subscription cancellation</h2>
        <p>
          Where recurring renewal is enabled, you can request cancellation before the next renewal. Cancellation normally stops future renewal while the already-paid period remains available until its stated end date, unless a different remedy is approved under this policy.
        </p>

        <h2 className="mt-10 text-xl font-semibold text-foreground">7. Non-refundable situations</h2>
        <p>
          Refunds are generally not available for deliberate misuse, purchases made after material consumption of digital credits, or requests that do not contain enough information to verify the transaction. This does not limit any rights you may have under applicable consumer law.
        </p>

        <h2 className="mt-10 text-xl font-semibold text-foreground">8. Payment provider terms</h2>
        <p>
          A payment provider may apply its own transaction, chargeback and settlement rules. Where a provider is involved, we follow the provider's applicable process for initiating or tracking a refund.
        </p>

        <h2 className="mt-10 text-xl font-semibold text-foreground">9. Contact</h2>
        <p>For refund or payment support:</p>
        <p className="mt-4 inline-block rounded-lg border border-border bg-muted p-4 font-medium text-foreground">info@nexusweb.co.in</p>
      </div>
    </div>
  );
}
