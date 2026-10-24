import type { Metadata } from "next";
import Link from "next/link";
import { LegalDoc } from "@/components/site/legal-doc";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = { title: "Terms of Service", description: `The rules for using ${SITE_NAME}.` };

export default function TermsPage() {
  return (
    <LegalDoc
      title="Terms of Service"
      updated="24 October 2026"
      intro={
        <>
          <p>These terms cover your use of the {SITE_NAME} website and the components, templates and files we publish. By using the site you agree to them.</p>
          <p>The short version: the code is free to use, the site is provided as it is, and please be decent about it.</p>
        </>
      }
      sections={[
        {
          title: "Using the site",
          body: <p>You may browse the site, copy components and install them into your own projects, for personal or commercial work. You agree not to misuse the site, which includes trying to break it, overload it, scrape it in a way that harms it, or get around the limits we set, such as the free prompt copy limit.</p>,
        },
        {
          title: "The code and its license",
          body: (
            <>
              <p>The source code of {SITE_NAME} is released under the MIT License. You can use, change and distribute it, in private and commercial projects, without asking. The license text is in the project repository and comes with no warranty of any kind.</p>
              <p>Some files come from other people and keep their own terms, including design briefs and illustrations. These are credited in the repository&rsquo;s third party notices.</p>
            </>
          ),
        },
        {
          title: "Brand names in design briefs",
          body: <p>The design briefs describe the public look of well known brands for reference and learning. Those names, logos and designs belong to their owners. They are not affiliated with or endorsed by {SITE_NAME}, and a brief gives you no right to use a brand&rsquo;s trademarks. Build your own product in your own name.</p>,
        },
        {
          title: "Accounts",
          body: <p>You can sign in with Google or GitHub to save bookmarks and copy unlimited prompts. You are responsible for activity on your account. Tell us if you think it has been used without your permission, and we may suspend accounts that abuse the site.</p>,
        },
        {
          title: "Your content",
          body: <p>If you send us something, such as a message, a bug report or a pull request, you keep ownership. You give us permission to use it to run and improve the project. Contributions to the repository are licensed under the MIT License.</p>,
        },
        {
          title: "No warranty",
          body: <p>The site and everything on it is provided &ldquo;as is&rdquo;, without promises of any kind. We try to make components accessible, secure and reliable, but we cannot guarantee they will fit your project or be free of mistakes. Check anything important before you ship it.</p>,
        },
        {
          title: "Limit of liability",
          body: <p>To the fullest extent the law allows, we are not responsible for any loss or damage that comes from using the site or the code, including lost data, lost profit or problems in your own product. Because the service is free, our total liability is limited to the amount you paid us, which is zero.</p>,
        },
        {
          title: "Links and third parties",
          body: <p>The site links to and relies on other services. We do not control them and are not responsible for their content or practices. See our <Link href="/privacy">Privacy Policy</Link> for the services we use.</p>,
        },
        {
          title: "Changes and availability",
          body: <p>We may change, pause or remove parts of the site, and we may update these terms. When we do, we will change the date above. If you keep using the site afterwards, that means you accept the new terms.</p>,
        },
        {
          title: "Governing law",
          body: <p>These terms are governed by the laws of India, and any dispute will be handled by the courts there, unless your local consumer law says otherwise.</p>,
        },
        {
          title: "Contact",
          body: <p>Questions about these terms? Write to <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</p>,
        },
      ]}
    />
  );
}
