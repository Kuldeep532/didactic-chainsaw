export default function Terms() {
  return (
    <div className="container mx-auto px-4 md:px-8 max-w-screen-md py-24">
      <div className="mb-12 border-b border-border pb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Terms and Conditions</h1>
        <p className="text-muted-foreground font-mono text-sm uppercase tracking-wider">
          Effective Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none text-muted-foreground">
        <p className="text-lg leading-relaxed mb-8 text-foreground">
          These terms dictate the parameters for utilizing software and infrastructure provided by Nexus Wave Technologies.
        </p>

        <h2 className="text-xl font-semibold mt-10 mb-4 text-foreground">1. Agreement to Terms</h2>
        <p>By accessing our network or installing our applications, you enter into a binding agreement with these terms. Discontinue use immediately if you reject any stipulation herein.</p>

        <h2 className="text-xl font-semibold mt-10 mb-4 text-foreground">2. Intellectual Property</h2>
        <p>All source code, design language, and documentation are the exclusive property of Nexus Wave Technologies unless explicitly open-sourced. You are prohibited from:</p>
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li>Republishing our material without authorization.</li>
          <li>Sub-licensing, selling, or renting our software.</li>
          <li>Reverse-engineering proprietary binaries.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-10 mb-4 text-foreground">3. Hardware Permissions</h2>
        <p>Installation of our applications implies consent for specific, localized hardware access:</p>
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li><strong>Location Access:</strong> Strictly for peer-to-peer safety alerts via the Emergency Guardian sub-system. Data remains on-device.</li>
          <li><strong>Storage Access:</strong> Required for caching, offline capability, and state persistence.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-10 mb-4 text-foreground">4. Liability Constraints</h2>
        <p>Nexus Wave Technologies, including its engineers and operators, holds no liability for damages—direct or indirect—resulting from the use or inability to use our software.</p>

        <h2 className="text-xl font-semibold mt-10 mb-4 text-foreground">5. Contact</h2>
        <p>For legal inquiries, dispatch communications to:</p>
        <p className="font-mono text-sm mt-4 p-4 bg-muted border border-border inline-block text-foreground">info@nexusweb.co.in</p>
      </div>
    </div>
  );
}