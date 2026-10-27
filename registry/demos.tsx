"use client";

/**
 * Site only. Maps each registry item to the live demo shown on its page and in the gallery.
 * Items that need a surrounding scene (a scroll area, a fake page) get a small wrapper here;
 * the component files in ./quarry stay clean and portable.
 */
import { useEffect, useRef, useState, type ComponentType } from "react";
import dynamic from "next/dynamic";
import { AuthModal } from "./quarry/auth-modal";
import { FloatingSocials } from "./quarry/floating-socials";
import { GithubHeatmap } from "./quarry/github-heatmap";
import { FlowField } from "./quarry/flow-field";
import { DotRipple } from "./quarry/dot-ripple";
import { AuroraMesh } from "./quarry/aurora-mesh";
import { Constellation } from "./quarry/constellation";
import { WaveLines } from "./quarry/wave-lines";
import { AsciiAquarium } from "./quarry/ascii-aquarium";
import { AsciiLagoon } from "./quarry/ascii-lagoon";
import { CompassField } from "./quarry/compass-field";
import { GlowTrail } from "./quarry/glow-trail";
import { Starfield } from "./quarry/starfield";
import { SquareGrid } from "./quarry/square-grid";
import { TopoLines } from "./quarry/topo-lines";
import { DotGlobe } from "./quarry/dot-globe";
import { ToastStack, useToastStack } from "./quarry/toast-stack";
import { ScrollTextReveal } from "./quarry/scroll-text-reveal";
import { ScrollRevealPill } from "./quarry/scroll-reveal-pill";
import { CommandMenu } from "./quarry/command-menu";
import { CookieBanner } from "./quarry/cookie-banner";
import { MorphingNavbar } from "./quarry/morphing-navbar";
import { RewardsList } from "./quarry/rewards-list";
import { ScrollStatement } from "./quarry/scroll-statement";
import { ServicePath } from "./quarry/service-path";
import { StickyStack } from "./quarry/sticky-stack";
import { ParallaxGallery } from "./quarry/parallax-gallery";
import { CartDrawer } from "./quarry/cart-drawer";
import { PagePreloader } from "./quarry/page-preloader";
import { FloatingChat } from "./quarry/floating-chat";

import { HeroSplit } from "./quarry/hero-split";
import { HeroCentered } from "./quarry/hero-centered";
import { FeatureRows } from "./quarry/feature-rows";
import { CtaBanner } from "./quarry/cta-banner";


function FloatingSocialsDemo() {
  return (
    <div className="relative h-[34rem] w-full">
      <div className="grid h-full place-items-center px-6 text-center text-sm text-muted-foreground">
        The bar stays pinned to the edge of the screen while the page scrolls.
      </div>
      <FloatingSocials position="absolute" />
    </div>
  );
}

function GithubHeatmapDemo() {
  return (
    <div className="w-full px-6">
      <GithubHeatmap className="mx-auto max-w-3xl" username="torvalds" />
    </div>
  );
}

function ScrollRevealPillDemo() {
  const scroller = useRef<HTMLDivElement>(null);
  return (
    <div className="relative h-[34rem] w-full">
      <div ref={scroller} className="h-full overflow-y-auto scrollbar-none">
        <div className="flex h-[64rem] justify-center px-6 pt-24 text-sm text-muted-foreground">
          Scroll down to reveal the pill
        </div>
      </div>
      <ScrollRevealPill scrollContainer={scroller} position="absolute" />
    </div>
  );
}

function AuthModalDemo() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const show = (next: "login" | "signup") => {
    setMode(next);
    setOpen(true);
  };
  return (
    <div className="relative h-[34rem] w-full overflow-hidden">
      <nav className="flex items-center justify-between border-b px-6 py-4">
        <span className="font-semibold tracking-tight text-foreground">Acme</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => show("login")}
            className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Log in
          </button>
          <button
            onClick={() => show("signup")}
            className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Sign up
          </button>
        </div>
      </nav>
      <div className="mx-auto mt-24 max-w-md px-6 text-center">
        <h3 className="text-3xl font-semibold tracking-tight text-foreground">
          Build faster with less friction
        </h3>
        <p className="mt-3 text-muted-foreground">
          Choose Log in or Sign up above to open the dialog.
        </p>
      </div>
      <AuthModal
        open={open}
        onOpenChange={setOpen}
        defaultMode={mode}
        position="absolute"
      />
    </div>
  );
}


/** The heading column is sticky, so give it a scroll area to stick inside. */
function RewardsListDemo(props: { gauge?: "line" | "ruler"; tickCount?: number }) {
  return (
    <div className="h-[34rem] w-full overflow-y-auto scrollbar-none">
      <RewardsList stickyTop={64} {...props} />
    </div>
  );
}

/** Site only: the illustrations are CC0 doodles from Open Doodles, shown through the `illustration` slot. */
const Doodle = ({ name }: { name: string }) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img src={`/doodles/${name}.svg`} alt="" draggable={false} />
);
const HeroSplitDemo = () => <HeroSplit illustration={<Doodle name="float" />} />;
const HeroCenteredDemo = () => <HeroCentered illustration={<Doodle name="dancing" />} />;
const FeatureRowsDemo = () => (
  <FeatureRows
    rows={[
      { eyebrow: "Plan", title: "Everything starts as a plain sentence", text: "Write what you want to happen. The rest of the team can read it, question it and build on it.", points: ["Docs and tasks in one place", "Comments that stay attached", "Nothing lost in chat"], link: "See planning", illustration: <Doodle name="chilling" /> },
      { eyebrow: "Ship", title: "Release without the ceremony", text: "Small changes go out on their own. Bigger ones get a checklist, and the checklist runs itself.", points: ["One click previews", "Safe rollbacks", "Release notes written for you"], link: "See releases", illustration: <Doodle name="unboxing" /> },
      { eyebrow: "Learn", title: "Know what actually worked", text: "Simple numbers after every launch, so the next decision starts from evidence instead of opinion.", points: ["Weekly summary by email", "Compare any two releases", "Share a link, not a deck"], link: "See insights", illustration: <Doodle name="strolling" /> },
    ]}
  />
);
const CtaBannerDemo = () => <CtaBanner illustration={<Doodle name="coffee" />} />;

/** Site only: demos that need a surrounding scene. */
function CartDrawerDemo() {
  const [open, setOpen] = useState(true);
  return (
    <div className="relative h-[34rem] w-full overflow-hidden">
      <div className="grid h-full place-items-center"><button type="button" onClick={() => setOpen(true)} className="rounded-full border bg-card px-5 py-2.5 text-sm font-medium">Open cart</button></div>
      <CartDrawer open={open} onOpenChange={setOpen} contained />
    </div>
  );
}
function PagePreloaderDemo() {
  const [show, setShow] = useState(false);
  return (
    <div className="relative h-[34rem] w-full overflow-hidden">
      <div className="grid h-full place-items-center text-center"><div><p className="text-3xl font-semibold tracking-tight">Welcome back</p><button type="button" onClick={() => setShow(true)} className="mt-5 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground">Play the intro</button></div></div>
      <PagePreloader show={show} onDone={() => setShow(false)} contained />
    </div>
  );
}
function FloatingChatDemo() {
  return (
    <div className="relative h-[34rem] w-full overflow-hidden"><div className="grid h-full place-items-center px-6 text-center text-sm text-muted-foreground">The button stays in the corner of the page.</div><FloatingChat contained /></div>
  );
}
function ParallaxGalleryDemo() {
  const box = useRef<HTMLDivElement>(null);
  return (
    <div ref={box} className="h-[34rem] w-full overflow-y-auto scrollbar-none">
      <div className="grid h-48 place-items-center text-sm text-muted-foreground">Scroll down</div>
      <ParallaxGallery container={box} height="34rem" />
      <div className="h-48" />
    </div>
  );
}
function StickyStackDemo() {
  return <div className="h-[34rem] w-full overflow-y-auto scrollbar-none"><StickyStack /></div>;
}

/** Scroll driven demos need a scroll area of their own, set part way so the still shows the effect. */
function useScrolled(frac: number) {
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const id = setTimeout(() => { el.scrollTop = (el.scrollHeight - el.clientHeight) * frac; }, 250);
    return () => clearTimeout(id);
  }, [frac]);
  return box;
}
function ScrollStatementDemo() {
  const box = useScrolled(0.66);
  return <div ref={box} className="h-[34rem] w-full overflow-y-auto scrollbar-none"><ScrollStatement container={box} stage="34rem" track={3.5} /></div>;
}
function ServicePathDemo() {
  const box = useScrolled(0.4);
  return <div ref={box} className="h-[34rem] w-full overflow-y-auto scrollbar-none"><ServicePath container={box} /></div>;
}

function CommandMenuDemo() {
  const [open, setOpen] = useState(true);
  return (
    <div className="relative grid h-[34rem] w-full place-items-center">
      <button type="button" onClick={() => setOpen(true)} className="inline-flex items-center gap-3 rounded-lg border bg-card px-4 py-2.5 text-sm text-muted-foreground">
        Search or run a command
        <kbd className="rounded border bg-muted px-1.5 py-0.5 text-[10px]">Ctrl K</kbd>
      </button>
      <CommandMenu open={open} onOpenChange={setOpen} position="absolute" />
    </div>
  );
}

function CookieBannerDemo() {
  return (
    <div className="relative h-[34rem] w-full overflow-hidden">
      <div className="space-y-3 p-10">
        <div className="h-5 w-40 rounded bg-muted" />
        <div className="h-3 w-3/4 rounded bg-muted/70" />
        <div className="h-3 w-2/3 rounded bg-muted/70" />
        <div className="h-3 w-1/2 rounded bg-muted/70" />
      </div>
      <CookieBanner storageKey={null} position="absolute" />
    </div>
  );
}

function MorphingNavbarDemo() {
  const scroller = useRef<HTMLDivElement>(null);
  return (
    <div className="relative h-[34rem] w-full">
      <div ref={scroller} className="h-full overflow-y-auto scrollbar-none">
        <div className="h-[60rem] px-8 pt-28 text-center">
          <h3 className="text-4xl font-semibold tracking-tight">Scroll to see it settle</h3>
          <p className="mt-3 text-sm text-muted-foreground">It starts as a floating pill and becomes a full width bar.</p>
        </div>
      </div>
      <MorphingNavbar scrollContainer={scroller} position="absolute" />
    </div>
  );
}

function ToastStackDemo() {
  const { toasts, push, dismiss } = useToastStack();
  const samples = [
    { title: "Deployment finished", description: "quarry-ui.vercel.app is live", tone: "success" as const },
    { title: "New comment on Hero", description: "Priya left a note", tone: "info" as const },
    { title: "Build is slower than usual", description: "2m 14s, usually 40s", tone: "warning" as const },
  ];
  const n = useRef(0);
  return (
    <div className="relative grid h-[34rem] w-full place-items-center">
      <button type="button" onClick={() => push(samples[n.current++ % samples.length])} className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-transform active:scale-[0.97]">
        Show a toast
      </button>
      <ToastStack toasts={toasts} onDismiss={dismiss} position="absolute" />
    </div>
  );
}

function ScrollTextRevealDemo() {
  const scroller = useRef<HTMLDivElement>(null);
  return (
    <div ref={scroller} className="h-[34rem] w-full overflow-y-auto scrollbar-none">
      <div className="grid h-40 place-items-center text-xs uppercase tracking-[0.3em] text-muted-foreground">Scroll</div>
      <div className="py-24"><ScrollTextReveal scrollContainer={scroller} /></div>
      <div className="h-[28rem]" />
    </div>
  );
}

/** Wraps a background so the preview shows a headline over it and passes the live controls through. */
const over = (title: string, hint: string) => (
  <div className="text-center">
    <p className="font-label text-xs uppercase tracking-[0.3em] text-muted-foreground">{hint}</p>
    <h3 className="mt-3 text-balance px-6 text-4xl font-medium tracking-tight sm:text-6xl">{title}</h3>
  </div>
);
const bg = (C: ComponentType<Record<string, unknown>>, title: string, hint: string) =>
  function BackgroundDemo(props: Record<string, unknown>) {
    return <C {...props} className="h-[34rem]">{over(title, hint)}</C>;
  };

export const DEMOS: Record<string, ComponentType> = {
  "feature-bento": dynamic(() => import("./quarry/feature-bento").then((m) => m.FeatureBento)),
  "process-steps": dynamic(() => import("./quarry/process-steps").then((m) => m.ProcessSteps)),
  "scroll-timeline": dynamic(() => import("./quarry/scroll-timeline").then((m) => m.ScrollTimeline)),
  "rewards-list": RewardsListDemo,
  "impact-stats": dynamic(() => import("./quarry/impact-stats").then((m) => m.ImpactStats)),
  "tilted-feature-cards": dynamic(() => import("./quarry/tilted-feature-cards").then((m) => m.TiltedFeatureCards)),
  "workflow-grid": dynamic(() => import("./quarry/workflow-grid").then((m) => m.WorkflowGrid)),
  "horizontal-scroll-cards": dynamic(() => import("./quarry/horizontal-scroll-cards").then((m) => m.HorizontalScrollCards)),
  "testimonial-marquee": dynamic(() => import("./quarry/testimonial-marquee").then((m) => m.TestimonialMarquee)),
  "testimonial-carousel": dynamic(() => import("./quarry/testimonial-carousel").then((m) => m.TestimonialCarousel)),
  "faq-accordion": dynamic(() => import("./quarry/faq-accordion").then((m) => m.FaqAccordion)),
  "integration-snippet": dynamic(() => import("./quarry/integration-snippet").then((m) => m.IntegrationSnippet)),
  "call-to-action": dynamic(() => import("./quarry/call-to-action").then((m) => m.CallToAction)),
  "text-marquee": dynamic(() => import("./quarry/text-marquee").then((m) => m.TextMarquee)),
  "leapfrog-loader": dynamic(() => import("./quarry/leapfrog-loader").then((m) => m.LeapfrogLoader)),
  "momentum-loader": dynamic(() => import("./quarry/momentum-loader").then((m) => m.MomentumLoader)),
  "newtons-cradle": dynamic(() => import("./quarry/newtons-cradle").then((m) => m.NewtonsCradle)),
  "pulse-ring": dynamic(() => import("./quarry/pulse-ring").then((m) => m.PulseRing)),
  "grid-matrix": dynamic(() => import("./quarry/grid-matrix").then((m) => m.GridMatrix)),
  "morphing-shapes": dynamic(() => import("./quarry/morphing-shapes").then((m) => m.MorphingShapes)),
  "shimmer-text": dynamic(() => import("./quarry/shimmer-text").then((m) => m.ShimmerText)),
  "waveform-loader": dynamic(() => import("./quarry/waveform-loader").then((m) => m.WaveformLoader)),
  "cardio-loader": dynamic(() => import("./quarry/cardio-loader").then((m) => m.CardioLoader)),
  "helix-loader": dynamic(() => import("./quarry/helix-loader").then((m) => m.HelixLoader)),
  "metronome-loader": dynamic(() => import("./quarry/metronome-loader").then((m) => m.MetronomeLoader)),
  "typing-indicator": dynamic(() => import("./quarry/typing-indicator").then((m) => m.TypingIndicator)),
  "before-after-slider": dynamic(() => import("./quarry/before-after-slider").then((m) => m.BeforeAfterSlider)),
  "journey-timeline": dynamic(() => import("./quarry/journey-timeline").then((m) => m.JourneyTimeline)),
  "compare-table": dynamic(() => import("./quarry/compare-table").then((m) => m.CompareTable)),
  "command-menu": CommandMenuDemo,
  "cookie-banner": CookieBannerDemo,
  "countdown-timer": dynamic(() => import("./quarry/countdown-timer").then((m) => m.CountdownTimer)),
  "availability-badge": dynamic(() => import("./quarry/availability-badge").then((m) => m.AvailabilityBadge)),
  "drop-zone": dynamic(() => import("./quarry/drop-zone").then((m) => m.DropZone)),
  "morphing-navbar": MorphingNavbarDemo,
  "expand-gallery": dynamic(() => import("./quarry/expand-gallery").then((m) => m.ExpandGallery)),
  "perspective-carousel": dynamic(() => import("./quarry/perspective-carousel").then((m) => m.PerspectiveCarousel)),
  "image-trail": dynamic(() => import("./quarry/image-trail").then((m) => m.ImageTrail)),
  "card-stack": dynamic(() => import("./quarry/card-stack").then((m) => m.CardStack)),
  "dock": dynamic(() => import("./quarry/dock").then((m) => m.Dock)),
  "toast-stack": ToastStackDemo,
  "animated-tabs": dynamic(() => import("./quarry/animated-tabs").then((m) => m.AnimatedTabs)),
  "scroll-text-reveal": ScrollTextRevealDemo,
  "text-scramble": dynamic(() => import("./quarry/text-scramble").then((m) => m.TextScramble)),
  "flow-field": bg(FlowField as ComponentType<Record<string, unknown>>, "Move through the current", "Move your cursor"),
  "dot-ripple": bg(DotRipple as ComponentType<Record<string, unknown>>, "Click anywhere", "Push, pull, ripple"),
  "aurora-mesh": bg(AuroraMesh as ComponentType<Record<string, unknown>>, "A quiet kind of light", "Follow the glow"),
  "constellation": bg(Constellation as ComponentType<Record<string, unknown>>, "Everything is connected", "Reach for a point"),
  "ascii-lagoon": bg(AsciiLagoon as ComponentType<Record<string, unknown>>, "What is on your mind?", "A calm lagoon"),
  "ascii-aquarium": bg(AsciiAquarium as ComponentType<Record<string, unknown>>, "Something is swimming", "Move your cursor"),
  "wave-lines": bg(WaveLines as ComponentType<Record<string, unknown>>, "Pull a ridge through", "Lift the lines"),
  "compass-field": bg(CompassField as ComponentType<Record<string, unknown>>, "Everything points to you", "Move slowly"),
  "topo-lines": bg(TopoLines as ComponentType<Record<string, unknown>>, "Terrain that never settles", "Raise a hill with your cursor"),
  "dot-globe": bg(DotGlobe as ComponentType<Record<string, unknown>>, "Built for everywhere", "Drag the globe"),
  "starfield": bg(Starfield as ComponentType<Record<string, unknown>>, "Look up", "Move to shift the sky"),
  "square-grid": bg(SquareGrid as ComponentType<Record<string, unknown>>, "Built on a grid", "Move across the squares"),
  "glow-trail": bg(GlowTrail as ComponentType<Record<string, unknown>>, "Leave a light behind", "Draw with your cursor"),
  "mega-footer": dynamic(() => import("./quarry/mega-footer").then((m) => m.MegaFooter)),
  "wordmark-footer": dynamic(() => import("./quarry/wordmark-footer").then((m) => m.WordmarkFooter)),
  "mega-menu-navbar": dynamic(() => import("./quarry/mega-menu-navbar").then((m) => m.MegaMenuNavbar)),
  "announcement-bar": dynamic(() => import("./quarry/announcement-bar").then((m) => m.AnnouncementBar)),
  "testimonial-columns": dynamic(() => import("./quarry/testimonial-columns").then((m) => m.TestimonialColumns)),
  "testimonial-spotlight": dynamic(() => import("./quarry/testimonial-spotlight").then((m) => m.TestimonialSpotlight)),
  "faq-search": dynamic(() => import("./quarry/faq-search").then((m) => m.FaqSearch)),
  "spotlight-card": dynamic(() => import("./quarry/spotlight-card").then((m) => m.SpotlightCard)),
  "pricing-cards": dynamic(() => import("./quarry/pricing-cards").then((m) => m.PricingCards)),
  "team-cards": dynamic(() => import("./quarry/team-cards").then((m) => m.TeamCards)),
  "lightbox-gallery": dynamic(() => import("./quarry/lightbox-gallery").then((m) => m.LightboxGallery)),
  "logo-cloud": dynamic(() => import("./quarry/logo-cloud").then((m) => m.LogoCloud)),
  "image-reveal": dynamic(() => import("./quarry/image-reveal").then((m) => m.ImageReveal)),
  "text-rotator": dynamic(() => import("./quarry/text-rotator").then((m) => m.TextRotator)),
  "number-ticker": dynamic(() => import("./quarry/number-ticker").then((m) => m.NumberTicker)),
  "text-highlighter": dynamic(() => import("./quarry/text-highlighter").then((m) => m.TextHighlighter)),
  "video-player": dynamic(() => import("./quarry/video-player").then((m) => m.VideoPlayer)),
  "video-dialog": dynamic(() => import("./quarry/video-dialog").then((m) => m.VideoDialog)),
  "feature-tabs": dynamic(() => import("./quarry/feature-tabs").then((m) => m.FeatureTabs)),
  "theme-toggle": dynamic(() => import("./quarry/theme-toggle").then((m) => m.ThemeToggle)),
  "code-tabs": dynamic(() => import("./quarry/code-tabs").then((m) => m.CodeTabs)),
  "animated-list": dynamic(() => import("./quarry/animated-list").then((m) => m.AnimatedList)),
  "avatar-group": dynamic(() => import("./quarry/avatar-group").then((m) => m.AvatarGroup)),
  "multi-step-form": dynamic(() => import("./quarry/multi-step-form").then((m) => m.MultiStepForm)),
  "dot-ring": dynamic(() => import("./quarry/dot-ring").then((m) => m.DotRing)),
  "tick-ring": dynamic(() => import("./quarry/tick-ring").then((m) => m.TickRing)),
  "square-ring": dynamic(() => import("./quarry/square-ring").then((m) => m.SquareRing)),
  "arc-spinner": dynamic(() => import("./quarry/arc-spinner").then((m) => m.ArcSpinner)),
  "segment-ring": dynamic(() => import("./quarry/segment-ring").then((m) => m.SegmentRing)),
  "fade-squares": dynamic(() => import("./quarry/fade-squares").then((m) => m.FadeSquares)),
  "not-found-doodle": dynamic(() => import("./quarry/not-found-doodle").then((m) => m.NotFoundDoodle)),
  "not-found-poster": dynamic(() => import("./quarry/not-found-poster").then((m) => m.NotFoundPoster)),
  "not-found-dots": dynamic(() => import("./quarry/not-found-dots").then((m) => m.NotFoundDots)),
  "not-found-ascii": dynamic(() => import("./quarry/not-found-ascii").then((m) => m.NotFoundAscii)),
  "not-found-contour": dynamic(() => import("./quarry/not-found-contour").then((m) => m.NotFoundContour)),
  "newsletter-reader": dynamic(() => import("./quarry/newsletter-reader").then((m) => m.NewsletterReader)),
  "sprint-roadmap": dynamic(() => import("./quarry/sprint-roadmap").then((m) => m.SprintRoadmap)),
  "hero-split": HeroSplitDemo,
  "hero-centered": HeroCenteredDemo,
  "feature-rows": FeatureRowsDemo,
  "cta-banner": CtaBannerDemo,
  "hero-sketch": dynamic(() => import("./quarry/hero-sketch").then((m) => m.HeroSketch)),
  "sticky-stack": StickyStackDemo,
  "event-cards": dynamic(() => import("./quarry/event-cards").then((m) => m.EventCards)),
  "parallax-gallery": ParallaxGalleryDemo,
  "product-card": dynamic(() => import("./quarry/product-card").then((m) => m.ProductCard)),
  "contact-form": dynamic(() => import("./quarry/contact-form").then((m) => m.ContactForm)),
  "cart-drawer": CartDrawerDemo,
  "like-button": dynamic(() => import("./quarry/like-button").then((m) => m.LikeButton)),
  "custom-select": dynamic(() => import("./quarry/custom-select").then((m) => m.CustomSelect)),
  "page-preloader": PagePreloaderDemo,
  "floating-chat": FloatingChatDemo,
  "scroll-statement": ScrollStatementDemo,
  "service-path": ServicePathDemo,
  "sticker-marquee": dynamic(() => import("./quarry/sticker-marquee").then((m) => m.StickerMarquee)),
  "cert-stack": dynamic(() => import("./quarry/cert-stack").then((m) => m.CertStack)),
  "floating-socials": FloatingSocialsDemo,
  "scroll-reveal-pill": ScrollRevealPillDemo,
  "auth-modal": AuthModalDemo,
  "github-heatmap": GithubHeatmapDemo,
};
