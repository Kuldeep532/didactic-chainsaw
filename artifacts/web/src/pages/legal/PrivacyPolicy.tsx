export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 md:px-8 max-w-screen-md py-20 prose dark:prose-invert">
      <h1>Privacy Policy</h1>
      <p className="lead">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

      <p>Nexus Wave Technologies ("we," "our," or "us") respects your privacy and is committed to protecting your personal data. This Privacy Policy informs you about how we look after your personal data when you visit our website or use our applications (including Nexus Plus and Geeta Nexus).</p>

      <h2>1. Information We Collect</h2>
      <p>We may collect, use, store, and transfer different kinds of personal data about you:</p>
      <ul>
        <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
        <li><strong>Contact Data</strong> includes email address and telephone numbers.</li>
        <li><strong>Technical Data</strong> includes internet protocol (IP) address, browser type and version, time zone setting and location, operating system and platform, and other technology on the devices you use to access our systems.</li>
        <li><strong>Usage Data</strong> includes information about how you use our website, products, and services.</li>
      </ul>

      <h2>2. How We Use Your Personal Data</h2>
      <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
      <ul>
        <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
        <li>Where it is necessary for our legitimate interests and your interests and fundamental rights do not override those interests.</li>
        <li>Where we need to comply with a legal obligation.</li>
      </ul>

      <h2>3. App Permissions</h2>
      <p>Our mobile applications may request certain device permissions. Below we explain why each permission is needed:</p>
      <ul>
        <li><strong>Location Permission:</strong> Used by the Emergency Guardian feature to enable location-based safety alerts and notify trusted contacts in case of an emergency. Location data is processed locally on your device and shared only with contacts you explicitly designate.</li>
        <li><strong>Media / File Manager Permission:</strong> Used to allow the app to save files, documents, and media content (such as downloaded scriptures or saved notes) to your device's storage. This permission is essential for offline functionality.</li>
      </ul>

      <h2>4. Data Security</h2>
      <p>We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed.</p>

      <h2>5. Your Legal Rights</h2>
      <p>Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to request access, correction, erasure, restriction, transfer, to object to processing, to portability of data, and (where the lawful ground of processing is consent) to withdraw consent.</p>

      <h2>6. Contact Us</h2>
      <p>If you have any questions about this Privacy Policy, please contact us at <strong>info@nexusweb.co.in</strong>.</p>
    </div>
  );
}
