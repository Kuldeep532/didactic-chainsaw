export default function Disclaimer() {
  return (
    <div className="container mx-auto px-4 md:px-8 max-w-screen-md py-24">
      <div className="mb-12 border-b border-border pb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Disclaimer</h1>
        <p className="text-muted-foreground font-mono text-sm uppercase tracking-wider">
          Effective Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none text-muted-foreground">
        <p className="text-lg leading-relaxed mb-8 text-foreground">
          The software and information provided by Nexus Wave Technologies are offered on an "as-is" basis, without warranties of any kind.
        </p>

        <h2 className="text-xl font-semibold mt-10 mb-4 text-foreground">1. No Warranty</h2>
        <p>We explicitly disclaim all warranties, whether express or implied, including but not limited to the implied warranties of merchantability, fitness for a particular purpose, and non-infringement.</p>

        <h2 className="text-xl font-semibold mt-10 mb-4 text-foreground">2. Operational Reliability</h2>
        <p>While we engineer our systems for high availability and reliability, we do not guarantee that our software will operate uninterrupted or entirely error-free.</p>

        <h2 className="text-xl font-semibold mt-10 mb-4 text-foreground">3. External Links</h2>
        <p>Our applications or web properties may contain references or links to third-party endpoints. We hold no jurisdiction over, nor assume responsibility for, the content or practices of these external systems.</p>

        <h2 className="text-xl font-semibold mt-10 mb-4 text-foreground">4. Contact</h2>
        <p>For clarification regarding these disclaimers, contact:</p>
        <p className="font-mono text-sm mt-4 p-4 bg-muted border border-border inline-block text-foreground">info@nexusweb.co.in</p>
      </div>
    </div>
  );
}