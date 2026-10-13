# Security Policy

Quarry UI is copied into other people's projects, so a problem here can travel. We take reports seriously and want to fix real issues quickly.

## Supported versions

Quarry UI is a registry, not a versioned package. The `main` branch and the live site at [quarry-ui.com](https://quarry-ui.com) are the only supported versions. Fixes are published there, and you get them by running the install command again for the affected component.

## Reporting a vulnerability

Please do **not** open a public issue for a security problem.

Report it privately in one of these ways:

1. Use GitHub's private reporting: go to the [Security tab](https://github.com/PRODHOSH/quarry-ui/security/advisories/new) and choose **Report a vulnerability**.
2. Or email **hello@quarry-ui.com** with the subject line `Security: Quarry UI`.

Please include:

- What the problem is and which component, file or page it affects
- Steps to reproduce it, or a small proof of concept
- The impact as you understand it
- Your name or handle if you would like credit

## What to expect

- We will acknowledge your report within **3 working days**.
- We will keep you updated while we investigate and tell you whether we can reproduce it.
- We aim to ship a fix for confirmed issues within **30 days**, sooner for serious ones.
- With your permission we will credit you in the release notes or advisory. If you would rather stay anonymous, just say so.

Please give us reasonable time to fix the issue before sharing details publicly.

## What counts

Examples of things we want to hear about:

- A component that can be made to run attacker controlled script (for example through an unsafe `dangerouslySetInnerHTML`, an unvalidated URL, or an unsanitised prop)
- A registry file that installs something it should not, such as an unexpected dependency or a file outside the intended paths
- A problem in the documentation site, such as an open redirect or an injectable endpoint like the waitlist form
- A leaked secret or token in the repository history

## What does not count

- Missing security headers on a static demo with no sensitive data
- Reports from automated scanners with no real impact shown
- Issues in third party packages we depend on. Please report those upstream, and tell us if we should bump a version.
- Social engineering or physical attacks

## A note for people using Quarry UI

Components here are demos of how things look and move. They do not include real authentication, validation or data storage. The templates keep state in memory so they work out of the box. Before shipping one, replace the demo state with your own backend and add the checks your app needs.

Thank you for helping keep the project and the people who use it safe.
