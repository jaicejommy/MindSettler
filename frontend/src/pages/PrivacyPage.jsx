export default function PrivacyPage() {
  return (
    <main>
      <section className="section" style={{ paddingTop: '6rem' }}>
        <div className="section-header" style={{ display: 'flex', justifyContent: 'center' }}>
          <h2 style={{ textAlign: 'center' }}>Privacy Policy</h2>
        </div>
        <div style={{ padding: '2rem', backgroundColor: 'var(--card)', borderRadius: 'var(--radius-lg)' }}>
          <p>
            At MindSettler, we are committed to protecting your privacy and ensuring you have a positive experience
            on our website and when using our services. This Privacy Policy explains how we collect, use, disclose,
            and safeguard your information.
          </p>

          <h3>1. Information We Collect</h3>
          <p>
            We may collect information about you in a variety of ways. The information we may collect on the Site
            includes:
          </p>
          <ul className="bullet-list">
            <li>
              <strong>Personal Data:</strong> Name, email address, phone number, location, and any other information
              you choose to provide during booking or contact.
            </li>
            <li>
              <strong>Session Information:</strong> Notes and details shared during your sessions, which are kept
              confidential and secure.
            </li>
            <li>
              <strong>Usage Data:</strong> Information about how you interact with our website, including pages
              visited, time spent, and device information.
            </li>
            <li>
              <strong>Cookies:</strong> We use cookies to enhance your experience on our website.
            </li>
          </ul>

          <h3>2. How We Use Your Information</h3>
          <p>We use the information we collect for various purposes:</p>
          <ul className="bullet-list">
            <li>To provide and maintain our services</li>
            <li>To process bookings and payments</li>
            <li>To communicate with you about your sessions and appointments</li>
            <li>To improve our website and services</li>
            <li>To send promotional updates (only if you opt in)</li>
            <li>To comply with legal obligations</li>
          </ul>

          <h3>3. Confidentiality in Sessions</h3>
          <p>
            All information shared during your sessions is treated with the highest level of confidentiality. We
            maintain strict protocols to protect your personal and session-related information from unauthorized access
            or disclosure.
          </p>
          <p>
            Please note that there are limited circumstances where we may be required to disclose information, such as
            if there is a serious threat to your safety or the safety of others, or as required by law.
          </p>

          <h3>4. Data Security</h3>
          <p>
            We implement appropriate security measures to protect your personal information from unauthorized access,
            alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100%
            secure.
          </p>

          <h3>5. Third-Party Sharing</h3>
          <p>
            We do not sell, trade, or rent your personal information to third parties. We may share information with
            service providers who assist us in operating our website and conducting our business, subject to
            confidentiality agreements.
          </p>
          <p>
            We may use trusted third-party tools such as scheduling services or analytics platforms (e.g., calendar
            integrations) solely to improve service delivery. These providers are bound by confidentiality and data
            protection obligations.
          </p>

          <h3>6. Your Rights</h3>
          <p>You have the right to:</p>
          <ul className="bullet-list">
            <li>Access your personal information</li>
            <li>Request corrections to inaccurate information</li>
            <li>Request deletion of your information (subject to legal obligations)</li>
            <li>Opt out of communications</li>
          </ul>

          <h3>7. Cookies</h3>
          <p>
            Our website may use cookies to enhance your browsing experience. You can control cookie settings through
            your browser preferences. Disabling cookies may affect some functionalities of our website.
          </p>

          <h3>8. Changes to This Privacy Policy</h3>
          <p>
            We may update this Privacy Policy from time to time. Any changes will be posted on this page with an
            updated effective date. Continued use of our services constitutes your acceptance of the updated policy.
          </p>

          <h3>10. Your Consent</h3>
          <p>
            By using our website or booking a session, you consent to the collection and use of information as
            outlined in this Privacy Policy.
          </p>

          <h3>9. Contact Us</h3>
          <p>
            If you have questions about this Privacy Policy or our privacy practices, please contact us at:
          </p>
          <ul className="bullet-list">
            <li>Email: support@mindsettler.in</li>
            <li>
              Instagram:{' '}
              <a href="https://www.instagram.com/mindsettlerbypb/" target="_blank" rel="noreferrer">
                @mindsettlerbypb
              </a>
            </li>
          </ul>

          <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: 'var(--text-soft)' }}>
            <em>Last updated: January 2026</em>
          </p>
        </div>
      </section>
    </main>
  )
}
