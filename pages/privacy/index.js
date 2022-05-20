import styles from "./index.module.css";
import HeaderAndFooter from "../../components/HeaderAndFooter";
import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <HeaderAndFooter>
      <div className={styles.body}>
        <h1 className="pageHeader">Privacy Policy</h1>
        <h3>Effective Date: May 19, 2022</h3>
        <div className={styles.box}>
          <h2>1. Terms list</h2>
          <ol>
            <li>
              <Link href="/">Investivision</Link> - "us", "we", "our" | "the
              Website", "the App", "the Platform", or collectively, "the
              Services".
            </li>
            <li>
              Third-party authenticator - an external website's authentication
              service, such as Google, initiated with the "Continue with Google"
              button.
            </li>
            <li>
              <Link href="https://stripe.com/">Stripe</Link> - our external
              payment processor and subscription engine service.
            </li>
            <li>
              <Link href="https://firebase.com/">Firebase</Link> - online
              platform-as-a-service with integrated web services such as
              authentication, databases, and serverless HTTPS endpoints.
            </li>
            <li>
              <Link href="https://firebase.com/">Firebase Security Rules</Link>{" "}
              - Firebase's secure database user privilege management system
              designed to restrict user reads/writes to strictly authorized
              locations.
            </li>
            <li>
              <Link href="https://analytics.google.com/analytics/web/">
                Google Analytics
              </Link>{" "}
              - a web-based site analytics platform and service.
            </li>
            <li>
              <Link href="https://analytics.google.com/analytics/web/">
                The Screener (/screener)
              </Link>{" "}
              - webpage for Investivision's stock discovery workbench.
            </li>
            <li>
              <Link href="/account">The Account Page (/account)</Link> - webpage
              for user account and profile management. Must be authenticated.
            </li>
            <li>
              The Browser Extension - downloadable Investivision package found
              on the Google Chrome Store.
            </li>
          </ol>
          <h2>2. What we collect, how we collect it, and how to opt-out</h2>
          <ol>
            <li>
              Cookies encoding anonymous page interactions and environment
              specifications via Google Analytics. This is an all-or-nothing
              process that cannot be avoided by request. If you prefer, you can
              configure your browser to block such cookies.
            </li>
            <li>
              Screener configuration presets are stored in the cloud via manual
              submission by the user on the Screener. Users can only access
              their own presets by Firebase Security Rules. To fully delete all
              records of a preset, a user may manually submit its deletion from
              the Screener.
            </li>
            <li>
              Account Profile information, including:
              <ol>
                <li>
                  Email, either entered manually by the user during registration
                  or on the Account Page, or populated by a user-selected
                  third-party authenticator.
                </li>
                <li>
                  Email verification status, modified when a user successfully
                  clicks the link in a previously sent verification email, or
                  populated by a user-selected third-party authenticator.
                </li>
                <li>
                  Name, either entered manually by the user on the Account Page
                  or populated by a user-selected third-party authenticator.
                </li>
                <li>
                  Subscription tier, modified when notified by Stripe of a
                  change in subscription status, such as enrollment, plan
                  change, or cancellation.
                </li>
              </ol>
              All the above fields are expunged when a user deletes their
              account on the Account Page.
            </li>
            <li>
              Text-based user notes manually composed inside the Screener or
              Browser Extension on-page interface. Values are saved
              automatically as the user is typing. Users can only access their
              own notes by Firebase Security Rules. These entries can be cleared
              by deleting all text inside the composition text box, and waiting
              for the change to save.
            </li>
          </ol>
          <h2>3. Users</h2>
          <ol>
            <li>
              We do not knowingly collect or solicit any information from anyone
              under the age of 13 on these Services. In the event we learn that
              we have inadvertently collected personal information from a child
              under age 13, we will take reasonable steps to delete that
              information. If you believe that we might have any information
              from a child under 13, please contact us at{" "}
              <a href="mailto:investivision.contact@gmail.com">
                investivision.contact@gmail.com
              </a>
              .
            </li>
          </ol>
          <h2>4. Jurisdiction</h2>
          <ol>
            <li>
              Our Services are currently designed for use only in the United
              States. If you are using our Services from another jurisdiction,
              your information may be processed in the United States or other
              countries that may not provide levels of data protection that are
              equivalent to those of your home jurisdiction.
            </li>
          </ol>
          <h2>5. Changes to this policy</h2>
          <ol>
            <li>
              This Privacy Policy will evolve with time, and when we update it,
              we will revise the "Effective Date" above and post the new Policy
              and, in some cases, we provide additional notice (such as adding a
              statement to our Website or sending you a notification). To stay
              informed of our privacy practices, we recommend you review the
              Policy on a regular basis as you continue to use our Services.
            </li>
          </ol>
          <h2>6. Contact</h2>
          <ol>
            <li>
              If you have any questions about this Privacy Policy, please
              contact us at{" "}
              <a href="mailto:investivisioncontact@gmail.com">
                investivision.contact@gmail.com
              </a>
              .
            </li>
          </ol>
        </div>
      </div>
    </HeaderAndFooter>
  );
}
