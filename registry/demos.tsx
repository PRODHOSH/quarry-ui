"use client";

/**
 * Site only. Maps each registry item to the live demo shown on its page and in the gallery.
 * Items that need a surrounding scene (a scroll area, a fake page) get a small wrapper here;
 * the component files in ./quarry stay clean and portable.
 */
import { useRef, useState, type ComponentType } from "react";
import dynamic from "next/dynamic";
import { AuthModal } from "./quarry/auth-modal";
import { FloatingSocials } from "./quarry/floating-socials";
import { GithubHeatmap } from "./quarry/github-heatmap";
import { ScrollRevealPill } from "./quarry/scroll-reveal-pill";

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

export const DEMOS: Record<string, ComponentType> = {
  "feature-bento": dynamic(() => import("./quarry/feature-bento").then((m) => m.FeatureBento)),
  "process-steps": dynamic(() => import("./quarry/process-steps").then((m) => m.ProcessSteps)),
  "scroll-timeline": dynamic(() => import("./quarry/scroll-timeline").then((m) => m.ScrollTimeline)),
  "rewards-list": dynamic(() => import("./quarry/rewards-list").then((m) => m.RewardsList)),
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
  "infinity-spinner": dynamic(() => import("./quarry/infinity-spinner").then((m) => m.InfinitySpinner)),
  "tailspin-loader": dynamic(() => import("./quarry/tailspin-loader").then((m) => m.TailspinLoader)),
  "line-spinner": dynamic(() => import("./quarry/line-spinner").then((m) => m.LineSpinner)),
  "squircle-loader": dynamic(() => import("./quarry/squircle-loader").then((m) => m.SquircleLoader)),
  "tail-chase": dynamic(() => import("./quarry/tail-chase").then((m) => m.TailChase)),
  "morphing-shapes": dynamic(() => import("./quarry/morphing-shapes").then((m) => m.MorphingShapes)),
  "shimmer-text": dynamic(() => import("./quarry/shimmer-text").then((m) => m.ShimmerText)),
  "orbit-loader": dynamic(() => import("./quarry/orbit-loader").then((m) => m.OrbitLoader)),
  "radar-ping": dynamic(() => import("./quarry/radar-ping").then((m) => m.RadarPing)),
  "dot-spinner": dynamic(() => import("./quarry/dot-spinner").then((m) => m.DotSpinner)),
  "waveform-loader": dynamic(() => import("./quarry/waveform-loader").then((m) => m.WaveformLoader)),
  "hourglass-loader": dynamic(() => import("./quarry/hourglass-loader").then((m) => m.HourglassLoader)),
  "cardio-loader": dynamic(() => import("./quarry/cardio-loader").then((m) => m.CardioLoader)),
  "helix-loader": dynamic(() => import("./quarry/helix-loader").then((m) => m.HelixLoader)),
  "trio-loader": dynamic(() => import("./quarry/trio-loader").then((m) => m.TrioLoader)),
  "dot-wave": dynamic(() => import("./quarry/dot-wave").then((m) => m.DotWave)),
  "metronome-loader": dynamic(() => import("./quarry/metronome-loader").then((m) => m.MetronomeLoader)),
  "typing-indicator": dynamic(() => import("./quarry/typing-indicator").then((m) => m.TypingIndicator)),
  "superballs-loader": dynamic(() => import("./quarry/superballs-loader").then((m) => m.SuperballsLoader)),
  "pinwheel-loader": dynamic(() => import("./quarry/pinwheel-loader").then((m) => m.PinwheelLoader)),
  "zoomies-loader": dynamic(() => import("./quarry/zoomies-loader").then((m) => m.ZoomiesLoader)),
  "floating-socials": FloatingSocialsDemo,
  "scroll-reveal-pill": ScrollRevealPillDemo,
  "auth-modal": AuthModalDemo,
  "github-heatmap": GithubHeatmapDemo,
};
