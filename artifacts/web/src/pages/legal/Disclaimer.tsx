export default function Disclaimer() {
  return (
    <div className="container mx-auto px-4 md:px-8 max-w-screen-md py-20 prose dark:prose-invert">
      <h1>Disclaimer</h1>
      <p className="lead">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      
      <p>The information provided by Nexus Wave Technologies on our website and through our applications (including Nexus Plus and Geeta Nexus) is for general informational purposes only. All information is provided in good faith, however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information.</p>
      
      <h2>1. External Links Disclaimer</h2>
      <p>Our website and applications may contain links to external websites that are not provided or maintained by or in any way affiliated with Nexus Wave Technologies. Please note that Nexus Wave Technologies does not guarantee the accuracy, relevance, timeliness, or completeness of any information on these external websites.</p>

      <h2>2. Professional Disclaimer</h2>
      <p>The tech/engineering information provided on this platform is for informational and educational purposes only and is not a substitute for professional advice. Accordingly, before taking any actions based upon such information, we encourage you to consult with the appropriate professionals. We do not provide any kind of specific architectural or infrastructure advice outside of formal consulting contracts.</p>

      <h2>3. "Geeta Nexus" Specific Disclaimer</h2>
      <p>The spiritual content, translations, and interpretations provided in the Geeta Nexus application are intended for personal study and contemplation. Nexus Wave Technologies acts as a technological conduit for this content and makes no claims regarding theological absolute truth. Users are encouraged to study the texts thoughtfully.</p>

      <h2>4. Platform Availability</h2>
      <p>While our services are engineered for high availability and reliability, Nexus Wave Technologies does not warrant that the website or applications will operate uninterrupted, timely, secure, or error-free. We reserve the right to modify, suspend, or discontinue any aspect of our services at any time.</p>
      
      <h2>5. Contact Us</h2>
      <p>If you require any more information or have any questions about our site's disclaimer, please feel free to contact us by email at <strong>info@nexusweb.co.in</strong>.</p>
    </div>
  );
}
