"use client";

import type { ComponentType, SVGProps } from "react";
import { cn } from "@/lib/utils";
import Lclaude from "@thesvg/react/claude";
import Lcohere from "@thesvg/react/cohere";
import Lelevenlabs from "@thesvg/react/elevenlabs";
import Lminimax from "@thesvg/react/minimax";
import Lmistral from "@thesvg/react/mistral";
import Lollama from "@thesvg/react/ollama";
import Lopencode from "@thesvg/react/opencode";
import Lreplicate from "@thesvg/react/replicate";
import Lrunwayml from "@thesvg/react/runway";
import Ltogether from "@thesvg/react/together-ai";
import Lx from "@thesvg/react/x";
import Lcursor from "@thesvg/react/cursor";
import Lexpo from "@thesvg/react/expo";
import Llovable from "@thesvg/react/lovable";
import Lraycast from "@thesvg/react/raycast";
import Lvercel from "@thesvg/react/vercel";
import Lwarp from "@thesvg/react/warp";
import Lclickhouse from "@thesvg/react/clickhouse";
import Lcomposio from "@thesvg/react/composio";
import Lhashicorp from "@thesvg/react/hashicorp";
import Lmongodb from "@thesvg/react/mongodb";
import Loracle from "@thesvg/react/oracle";
import Lposthog from "@thesvg/react/posthog";
import Lsanity from "@thesvg/react/sanity";
import Lsentry from "@thesvg/react/sentry";
import Lsupabase from "@thesvg/react/supabase";
import Lcal from "@thesvg/react/cal-com";
import Lintercom from "@thesvg/react/intercom";
import Llinear from "@thesvg/react/linear";
import Lmintlify from "@thesvg/react/mintlify";
import Lnotion from "@thesvg/react/notion";
import Lresend from "@thesvg/react/resend";
import Lsap from "@thesvg/react/sap";
import Lzapier from "@thesvg/react/zapier";
import Lairtable from "@thesvg/react/airtable";
import Lfigma from "@thesvg/react/figma";
import Lframer from "@thesvg/react/framer";
import Lmiro from "@thesvg/react/miro";
import Lwebflow from "@thesvg/react/webflow";
import Lbinance from "@thesvg/react/binance";
import Lcoinbase from "@thesvg/react/coinbase";
import Lkraken from "@thesvg/react/kraken";
import Lmastercard from "@thesvg/react/mastercard";
import Lrevolut from "@thesvg/react/revolut";
import Lstripe from "@thesvg/react/stripe";
import Lwise from "@thesvg/react/wise";
import Lairbnb from "@thesvg/react/airbnb";
import Lmeta from "@thesvg/react/meta";
import Lnike from "@thesvg/react/nike";
import Lshopify from "@thesvg/react/shopify";
import Lstarbucks from "@thesvg/react/starbucks";
import Laljazeera from "@thesvg/react/al-jazeera";
import Lapple from "@thesvg/react/apple";
import Ldji from "@thesvg/react/dji";
import Lhp from "@thesvg/react/hp";
import Libm from "@thesvg/react/ibm";
import Lnvidia from "@thesvg/react/nvidia";
import Lpinterest from "@thesvg/react/pinterest";
import Lplaystation from "@thesvg/react/playstation";
import Lspacex from "@thesvg/react/spacex";
import Lspotify from "@thesvg/react/spotify";
import Luber from "@thesvg/react/uber";
import Lvodafone from "@thesvg/react/vodafone";
import Lbmw from "@thesvg/react/bmw";
import Lbugatti from "@thesvg/react/bugatti";
import Lferrari from "@thesvg/react/ferrari";
import Llamborghini from "@thesvg/react/lamborghini";
import Lrenault from "@thesvg/react/renault";
import Ltesla from "@thesvg/react/tesla";

type Logo = ComponentType<SVGProps<SVGSVGElement> & { variant?: "default" | "mono" }>;

const LOGOS: Record<string, Logo> = {
  "claude": Lclaude as Logo,
  "cohere": Lcohere as Logo,
  "elevenlabs": Lelevenlabs as Logo,
  "minimax": Lminimax as Logo,
  "mistral": Lmistral as Logo,
  "ollama": Lollama as Logo,
  "opencode": Lopencode as Logo,
  "replicate": Lreplicate as Logo,
  "runwayml": Lrunwayml as Logo,
  "together": Ltogether as Logo,
  "x": Lx as Logo,
  "cursor": Lcursor as Logo,
  "expo": Lexpo as Logo,
  "lovable": Llovable as Logo,
  "raycast": Lraycast as Logo,
  "vercel": Lvercel as Logo,
  "warp": Lwarp as Logo,
  "clickhouse": Lclickhouse as Logo,
  "composio": Lcomposio as Logo,
  "hashicorp": Lhashicorp as Logo,
  "mongodb": Lmongodb as Logo,
  "oracle": Loracle as Logo,
  "posthog": Lposthog as Logo,
  "sanity": Lsanity as Logo,
  "sentry": Lsentry as Logo,
  "supabase": Lsupabase as Logo,
  "cal": Lcal as Logo,
  "intercom": Lintercom as Logo,
  "linear": Llinear as Logo,
  "mintlify": Lmintlify as Logo,
  "notion": Lnotion as Logo,
  "resend": Lresend as Logo,
  "sap": Lsap as Logo,
  "zapier": Lzapier as Logo,
  "airtable": Lairtable as Logo,
  "figma": Lfigma as Logo,
  "framer": Lframer as Logo,
  "miro": Lmiro as Logo,
  "webflow": Lwebflow as Logo,
  "binance": Lbinance as Logo,
  "coinbase": Lcoinbase as Logo,
  "kraken": Lkraken as Logo,
  "mastercard": Lmastercard as Logo,
  "revolut": Lrevolut as Logo,
  "stripe": Lstripe as Logo,
  "wise": Lwise as Logo,
  "airbnb": Lairbnb as Logo,
  "meta": Lmeta as Logo,
  "nike": Lnike as Logo,
  "shopify": Lshopify as Logo,
  "starbucks": Lstarbucks as Logo,
  "aljazeera": Laljazeera as Logo,
  "apple": Lapple as Logo,
  "dji": Ldji as Logo,
  "hp": Lhp as Logo,
  "ibm": Libm as Logo,
  "nvidia": Lnvidia as Logo,
  "pinterest": Lpinterest as Logo,
  "playstation": Lplaystation as Logo,
  "spacex": Lspacex as Logo,
  "spotify": Lspotify as Logo,
  "uber": Luber as Logo,
  "vodafone": Lvodafone as Logo,
  "bmw": Lbmw as Logo,
  "bugatti": Lbugatti as Logo,
  "ferrari": Lferrari as Logo,
  "lamborghini": Llamborghini as Logo,
  "renault": Lrenault as Logo,
  "tesla": Ltesla as Logo,
};

/**
 * A small monochrome brand mark for a design system. Brands without a mark in the icon set get a
 * neutral letter tile, so every row in the sidebar lines up.
 */
export function BrandLogo({ slug, name, className }: { slug: string; name: string; className?: string }) {
  const Icon = LOGOS[slug];
  if (Icon) return <Icon variant="mono" aria-hidden className={cn("size-4 shrink-0", className)} />;
  return (
    <span aria-hidden className={cn("grid size-4 shrink-0 place-items-center rounded-[4px] border text-[9px] font-semibold leading-none", className)}>
      {name[0]?.toUpperCase()}
    </span>
  );
}
