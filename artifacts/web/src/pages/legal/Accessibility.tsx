export default function Accessibility() {
  return (
    <div className="container mx-auto px-4 md:px-8 max-w-screen-md py-24">
      <div className="mb-12 border-b border-border pb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Accessibility Statement</h1>
        <p className="text-muted-foreground font-mono text-sm uppercase tracking-wider">
          Effective Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none text-muted-foreground">
        <p className="text-lg leading-relaxed mb-8 text-foreground">
          At Nexus Wave Technologies, accessibility is not a compliance checklist; it is an engineering baseline. We are committed to ensuring our digital utilities are usable by everyone, regardless of physical or cognitive ability.
        </p>

        <h2 className="text-xl font-semibold mt-10 mb-4 text-foreground">1. Technical Standards</h2>
        <p>We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA for our web infrastructure, and equivalent material standards for our Android binaries.</p>

        <h2 className="text-xl font-semibold mt-10 mb-4 text-foreground">2. Core Features</h2>
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li><strong>Screen Reader Optimization:</strong> Comprehensive labeling and ARIA utilization across all interfaces.</li>
          <li><strong>Keyboard Navigation:</strong> Complete system traversability without reliance on pointing devices.</li>
          <li><strong>Contrast & Legibility:</strong> Strict adherence to contrast ratios and scalable typography.</li>
          <li><strong>Motion Control:</strong> Respect for `prefers-reduced-motion` system directives.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-10 mb-4 text-foreground">3. Continuous Iteration</h2>
        <p>Accessibility is a moving target. We actively audit our codebase and integrate user feedback to refine our implementations.</p>

        <h2 className="text-xl font-semibold mt-10 mb-4 text-foreground">4. Feedback Channel</h2>
        <p>If you encounter a barrier while using our software, please file a report so we can engineer a solution:</p>
        <p className="font-mono text-sm mt-4 p-4 bg-muted border border-border inline-block text-foreground">info@nexusweb.co.in</p>
      </div>
    </div>
  );
}