export default function Terms() {
  return (
    <div className="container mx-auto px-4 md:px-8 max-w-screen-md py-20 prose dark:prose-invert">
      <h1>Terms and Conditions</h1>
      <p className="lead">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

      <p>These terms and conditions outline the rules and regulations for the use of Nexus Wave Technologies's Website and Applications (including Nexus Plus and Geeta Nexus).</p>

      <h2>1. Acceptance of Terms</h2>
      <p>By accessing this website and using our applications, we assume you accept these terms and conditions. Do not continue to use Nexus Wave Technologies's software or website if you do not agree to take all of the terms and conditions stated on this page.</p>

      <h2>2. License</h2>
      <p>Unless otherwise stated, Nexus Wave Technologies and/or its licensors own the intellectual property rights for all material on our platforms. All intellectual property rights are reserved. You may access this for your own personal use subjected to restrictions set in these terms and conditions.</p>
      <p>You must not:</p>
      <ul>
        <li>Republish material from Nexus Wave Technologies</li>
        <li>Sell, rent, or sub-license material from Nexus Wave Technologies</li>
        <li>Reproduce, duplicate or copy material from Nexus Wave Technologies</li>
        <li>Redistribute content from Nexus Wave Technologies without explicit permission</li>
      </ul>

      <h2>3. App Permissions and Usage</h2>
      <p>Our applications may request the following permissions from your device. By installing and using our apps, you consent to the use of these permissions as described below:</p>
      <ul>
        <li><strong>Location Permission:</strong> The Emergency Guardian feature in our apps requires location access to send safety alerts to your designated emergency contacts. Location data is processed locally and is not stored on our servers.</li>
        <li><strong>Media / File Manager Permission:</strong> Our apps need access to your device's storage to save downloaded content (e.g., scriptures, notes, documents) and to allow you to import your own files for use within the app.</li>
      </ul>

      <h2>4. Acceptable Use</h2>
      <p>If you are using our applications or services, you agree to adhere to reasonable usage policies and security guidelines. Any attempt to abuse, overload, or compromise the integrity of our services will result in immediate termination of access.</p>

      <h2>5. Limitation of Liability</h2>
      <p>In no event shall Nexus Wave Technologies, nor any of its officers, directors, and employees, be held liable for anything arising out of or in any way connected with your use of this Website or our applications whether such liability is under contract.</p>

      <h2>6. Contact</h2>
      <p>For any questions regarding these Terms, please contact us at <strong>info@nexusweb.co.in</strong>.</p>
    </div>
  );
}
