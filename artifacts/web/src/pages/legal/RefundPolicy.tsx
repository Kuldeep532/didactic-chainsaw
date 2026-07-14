export default function RefundPolicy() {
  return (
    <div className="container mx-auto px-4 md:px-8 max-w-screen-md py-24">
      <div className="mb-12 border-b border-border pb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Refund Policy</h1>
        <p className="text-muted-foreground font-mono text-sm uppercase tracking-wider">
          Effective Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none text-muted-foreground">
        <p className="text-lg leading-relaxed mb-8 text-foreground">
          Our current suite of applications—including Nexus Plus and Geeta Nexus—is distributed free of charge. Therefore, standard refund protocols are presently inapplicable.
        </p>

        <h2 className="text-xl font-semibold mt-10 mb-4 text-foreground">1. Free Distribution</h2>
        <p>We do not collect payment information, process transactions, or charge subscription fees for our core utilities at this time.</p>

        <h2 className="text-xl font-semibold mt-10 mb-4 text-foreground">2. Future Commercial Software</h2>
        <p>Should Nexus Wave Technologies release commercial binaries or premium tiers in the future, a comprehensive refund matrix will be implemented and detailed within this document prior to any transaction.</p>

        <h2 className="text-xl font-semibold mt-10 mb-4 text-foreground">3. Inquiries</h2>
        <p>For financial or distribution questions, contact:</p>
        <p className="font-mono text-sm mt-4 p-4 bg-muted border border-border inline-block text-foreground">info@nexusweb.co.in</p>
      </div>
    </div>
  );
}