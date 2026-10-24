import type { Metadata } from "next";
import Link from "next/link";
import { LegalDoc } from "@/components/site/legal-doc";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = { title: "Privacy Policy", description: `How ${SITE_NAME} handles your information.` };

export default function PrivacyPage() {
  return (
    <LegalDoc
      title="Privacy Policy"
      updated="24 October 2026"
      intro={
        <>
          <p>{SITE_NAME} is a free, open source library of components and templates. We collect as little as we can, and this page explains exactly what that is and why.</p>
          <p>You can browse and copy components without an account. Signing in is optional and only needed for bookmarks and unlimited prompt copies.</p>
        </>
      }
      sections={[
        {
          title: "What we collect",
          body: (
            <>
              <p>It depends on what you do on the site.</p>
              <ul>
                <li><strong>If you join the waiting list:</strong> your email address.</li>
                <li><strong>If you sign in with Google or GitHub:</strong> your name, email address and profile picture, as provided by that service. We never see your password.</li>
                <li><strong>If you bookmark something:</strong> which item you saved, linked to your account.</li>
                <li><strong>If you copy a prompt without signing in:</strong> a small counter stored in a cookie, plus a one way scrambled version of your network address so the free limit can be enforced. We cannot turn the scrambled value back into your address.</li>
                <li><strong>If you visit any page:</strong> basic usage data through Google Analytics, such as the pages you view, your approximate location, your browser and device type.</li>
              </ul>
            </>
          ),
        },
        {
          title: "How we use it",
          body: (
            <ul>
              <li>To run the site, keep you signed in and remember your bookmarks.</li>
              <li>To email you once when we open, if you joined the waiting list.</li>
              <li>To limit free prompt copies and prevent abuse.</li>
              <li>To understand which parts of the site people use, so we can improve it.</li>
            </ul>
          ),
        },
        {
          title: "Who handles your data",
          body: (
            <>
              <p>We use a few services to run the site. Each one processes data only to provide its service.</p>
              <ul>
                <li><strong>Supabase</strong> stores accounts, bookmarks and the waiting list.</li>
                <li><strong>Google and GitHub</strong> handle sign in when you choose them.</li>
                <li><strong>Vercel</strong> hosts the site and sees standard request data such as your IP address.</li>
                <li><strong>Google Analytics</strong> measures usage.</li>
              </ul>
              <p>Some demo images load from third party image services such as picsum.photos and randomuser.me, which means your browser contacts them when those images appear.</p>
              <p>We do not sell your information and we do not use it for advertising.</p>
            </>
          ),
        },
        {
          title: "Cookies and local storage",
          body: (
            <>
              <p>We use a small cookie to count free prompt copies, and your browser keeps a sign in session if you log in. Google Analytics sets its own cookies to tell visits apart.</p>
              <p>You can block or delete cookies in your browser settings. The site still works, though your free copy count and sign in may reset. You can also opt out of Google Analytics with <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noreferrer">Google&rsquo;s browser add on</a>.</p>
            </>
          ),
        },
        {
          title: "How long we keep it",
          body: <p>Account and bookmark data is kept until you ask us to delete it. Waiting list emails are kept until we have contacted you or you ask us to remove yours. Analytics data follows Google&rsquo;s retention settings, which we keep short. The prompt counter expires after a year.</p>,
        },
        {
          title: "Your choices",
          body: (
            <>
              <p>You can ask to see, correct or delete the information we hold about you, or to be removed from the waiting list, at any time. Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> from the address on your account and we will take care of it.</p>
              <p>Depending on where you live, you may have extra rights under laws such as the GDPR. We will honour them.</p>
            </>
          ),
        },
        {
          title: "Security",
          body: <p>Data is stored with reputable providers and protected with access rules, so people can only read their own bookmarks. No system is perfectly secure, but we take care to keep your information safe.</p>,
        },
        {
          title: "Children",
          body: <p>{SITE_NAME} is built for developers and designers and is not meant for children under 13. We do not knowingly collect their information.</p>,
        },
        {
          title: "Changes to this policy",
          body: <p>If we change how we handle data, we will update this page and the date at the top. Using the site after a change means you accept it.</p>,
        },
        {
          title: "Contact",
          body: <p>Questions about privacy? Write to <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. You can also read our <Link href="/terms">Terms of Service</Link>.</p>,
        },
      ]}
    />
  );
}
