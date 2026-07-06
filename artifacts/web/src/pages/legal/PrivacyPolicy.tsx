export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 md:px-8 max-w-screen-md py-20 prose dark:prose-invert">
      <h1>Privacy Policy</h1>
      <p className="lead">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      
      <p>Nexus Wave Technologies ("we," "our," or "us") respects your privacy and is committed to protecting your personal data. This Privacy Policy informs you about how we look after your personal data when you visit our website or use our applications (including Nexus Plus and Geeta Nexus) and tells you about your privacy rights.</p>
      
      <h2>1. Important Information and Who We Are</h2>
      <p>This privacy policy aims to give you information on how Nexus Wave Technologies collects and processes your personal data through your use of our platforms, including any data you may provide through our apps or website.</p>
      <p><strong>Contact Details:</strong><br/>
      Email address: info@nexusweb.co.in</p>

      <h2>2. The Data We Collect About You</h2>
      <p>We may collect, use, store, and transfer different kinds of personal data about you which we have grouped together as follows:</p>
      <ul>
        <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
        <li><strong>Contact Data</strong> includes email address and telephone numbers.</li>
        <li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, operating system and platform, and other technology on the devices you use to access our systems.</li>
        <li><strong>Usage Data</strong> includes information about how you use our website, products, and services.</li>
      </ul>

      <h2>3. How We Use Your Personal Data</h2>
      <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
      <ul>
        <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
        <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
        <li>Where we need to comply with a legal obligation.</li>
      </ul>

      <h2>4. Data Security</h2>
      <p>We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed. As an engineering-grade infrastructure company, zero-trust security architecture forms the basis of our data protection strategy.</p>

      <h2>5. Your Legal Rights</h2>
      <p>Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to request access, correction, erasure, restriction, transfer, to object to processing, to portability of data, and (where the lawful ground of processing is consent) to withdraw consent.</p>
    </div>
  );
}
