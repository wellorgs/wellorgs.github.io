import { useEffect, useState } from "react";
import { Check, Globe, Plane, Sparkles } from "lucide-react";

import { WaitlistForm } from "@/components/site/WaitlistForm";
import { setPlanIntent } from "@/lib/plan-intent";
import { getVisitorCountry } from "@/lib/geo.functions";
import {
  type BillingCycle,
  type PlanKey,
  type Region,
  cycleAmount,
  cycleSuffix,
  defaultRegion,
  detectRegion,
  formatPrice,
  loadStoredRegion,
  regionForCountry,
  perMonthAmount,
  regions,
  storeRegion,
  yearlySavingsPercent,
} from "@/lib/pricing";

type Plan = {
  key: Exclude<PlanKey, "nri">;
  name: string;
  tagline: string;
  period: string;
  features: string[];
  featured?: boolean;
  tint: string;
};

const plans: Plan[] = [
  {
    key: "free",
    name: "Trial",
    tagline: "Start here",
    period: "for 7 days",
    tint: "bg-card",
    features: [
      "1 phone number, full features",
      "Call screening and in-app summaries",
      "1 priority contact",
      "7 days of call history",
    ],
  },
  {
    key: "premium",
    name: "Essential",
    tagline: "Most people start here",
    period: "/month",
    tint: "bg-card",
    featured: true,
    features: [
      "1 phone number, unlimited answered calls",
      "In-app summary with recording, after every call",
      "Multi-language call screening",
      "Emergency escalation, calls you directly",
      "1 priority contact with automatic retry",
      "90 days of call history",
    ],
  },
  {
    key: "familyPlus",
    name: "Business",
    tagline: "For more than one number",
    period: "/month",
    tint: "bg-card",
    features: [
      "Everything in Essential",
      "Up to 3 phone numbers or personas",
      "Unlimited priority contacts",
      "Shared summaries across your team",
      "Exportable monthly call history",
    ],
  },
];

const comparisonRows = [
  {
    label: "Phone numbers",
    free: "1",
    premium: "1",
    familyPlus: "Up to 3",
    nri: "Up to 5",
  },
  {
    label: "Emergency escalation",
    free: "Included",
    premium: "Calls you directly",
    familyPlus: "Calls you directly",
    nri: "Time zone aware",
  },
  {
    label: "Priority contacts",
    free: "1",
    premium: "1, automatic retry",
    familyPlus: "Unlimited",
    nri: "Unlimited",
  },
  {
    label: "In-app call summaries",
    free: "Included",
    premium: "With recording",
    familyPlus: "With recording",
    nri: "With recording",
  },
  {
    label: "Call history",
    free: "7 days",
    premium: "90 days",
    familyPlus: "Full history",
    nri: "Full history",
  },
  {
    label: "Languages",
    free: "Hindi, English",
    premium: "10+ Indian languages",
    familyPlus: "10+ Indian languages",
    nri: "10+ Indian languages",
  },
  {
    label: "Support",
    free: "Community",
    premium: "Email",
    familyPlus: "Priority email",
    nri: "Priority email",
  },
];

function planNote(plan: Plan, region: Region, cycle: BillingCycle) {
  if (plan.key === "free") return "No card required, cancel anytime.";
  if (plan.key === "premium")
    return `Founding members pay ${formatPrice(
      region,
      cycleAmount(region.prices.foundingPremium, cycle),
    )}${cycleSuffix(cycle)} for life.`;
  return "Every number and priority contact in one place.";
}

const CYCLE_KEY = "myassistant.billing-cycle";

const scenarios = [
  {
    flag: "🇺🇸",
    where: "New York to Delhi",
    line: "A shop owner manages her family business from New York while MyAssistant answers supplier calls on Delhi hours. The summary is waiting in the app with her morning coffee.",
  },
  {
    flag: "🇬🇧",
    where: "London to Mumbai",
    line: "A family keeps one shared number active for their Mumbai business. Every call is summarized in London time, so nothing waits until someone is back online.",
  },
  {
    flag: "🇦🇪",
    where: "Dubai to Jaipur",
    line: "A consultant's old Jaipur number still gets client calls out of habit. MyAssistant handles them, and one tidy summary lands in the app each day.",
  },
  {
    flag: "🇨🇦",
    where: "Toronto to Lucknow",
    line: "A family's old Lucknow number still gets passed around to relatives. MyAssistant now answers those calls, so no one is woken at 3am for something that can wait.",
  },
];

function ScenarioCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % scenarios.length);
    }, 5000);
    return () => window.clearInterval(id);
  }, [paused]);

  const active = scenarios[index] ?? scenarios[0]!;

  return (
    <div
      className="mt-6 max-w-lg"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="rounded-2xl bg-background/10 p-5"
        aria-live="polite"
        aria-atomic="true"
      >
        <p className="flex items-center gap-2 text-sm font-semibold text-background">
          <span aria-hidden="true">{active.flag}</span>
          {active.where}
        </p>
        <p key={active.where} className="mt-2 min-h-[66px] animate-fade-in text-sm leading-relaxed text-background/70 sm:min-h-[48px]">
          {active.line}
        </p>
      </div>
      <div className="mt-3 flex items-center gap-2">
        {scenarios.map((s, i) => (
          <button
            key={s.where}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Show example: ${s.where}`}
            aria-current={i === index}
            className={`h-2 rounded-full transition-all ${
              i === index ? "w-6 bg-background" : "w-2 bg-background/30 hover:bg-background/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export function Pricing() {
  const [region, setRegion] = useState<Region>(defaultRegion);
  const [cycle, setCycle] = useState<BillingCycle>("monthly");
  const yearly = cycle === "yearly";

  useEffect(() => {
    const stored = loadStoredRegion();
    if (stored) {
      setRegion(stored);
    } else {
      // Browser hints first so prices are right immediately, then confirm with
      // the country the request actually came from.
      setRegion(detectRegion());
      getVisitorCountry()
        .then((res) => {
          const fromIp = regionForCountry(res?.country);
          if (fromIp) setRegion(fromIp);
        })
        .catch(() => {
          /* keep the browser-detected region */
        });
    }
    try {
      const storedCycle = window.localStorage.getItem(CYCLE_KEY);
      if (storedCycle === "monthly" || storedCycle === "yearly") setCycle(storedCycle);
    } catch {
      /* ignore */
    }
  }, []);

  const chooseCycle = (next: BillingCycle) => {
    setCycle(next);
    try {
      window.localStorage.setItem(CYCLE_KEY, next);
    } catch {
      /* ignore */
    }
  };

  const savings = yearlySavingsPercent(region.prices.premium);
  const india = regions.find((r) => r.code === "IN")!;

  return (
    <section id="pricing" className="cv-auto scroll-mt-24 mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-5 md:pb-20">
      <div className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-card px-4 py-2 text-sm font-medium shadow-soft">
          <Sparkles className="size-4 shrink-0 text-primary" strokeWidth={2} />
          Founding member pricing
        </span>
        <h2 className="mt-5 text-[28px] font-bold leading-tight sm:text-[40px]">
          Try it free. Keep it if it helps.
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
          Start with a 7 day trial, no card required. Join the waitlist now and keep
          founding pricing for as long as you stay.
        </p>

        <div className="mt-6 inline-flex max-w-full flex-wrap items-center justify-center gap-2 rounded-3xl bg-card px-3 py-2 shadow-soft sm:rounded-full sm:pl-4">
          <Globe className="size-4 shrink-0 text-muted-foreground" strokeWidth={2} />
          <span className="text-sm text-muted-foreground">Prices for</span>
          <label htmlFor="region" className="sr-only">
            Choose your country
          </label>
          <select
            id="region"
            value={region.code}
            onChange={(e) => {
              const next = regions.find((r) => r.code === e.target.value);
              if (!next) return;
              setRegion(next);
              storeRegion(next);
            }}
            className="max-w-full rounded-full bg-muted px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {regions.map((r) => (
              <option key={r.code} value={r.code}>
                {r.flag} {r.country} · {r.currency}
              </option>
            ))}
          </select>
        </div>

        <p className="mt-2 text-xs text-muted-foreground">
          Auto-detected from your location. Billed in {region.currency}, taxes included.
        </p>

        <div className="mt-5 flex flex-col items-center gap-2">
          <div
            role="group"
            aria-label="Billing period"
            className="inline-flex items-center rounded-full bg-muted p-1 shadow-soft"
          >
            {(["monthly", "yearly"] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => chooseCycle(option)}
                aria-pressed={cycle === option}
                className={`rounded-full px-5 py-2 text-sm font-semibold capitalize transition-colors ${
                  cycle === option
                    ? "bg-card text-foreground shadow-soft"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
          <span className="text-xs font-medium text-primary">
            Yearly saves {savings}%. Pay once, forget about it
          </span>
        </div>
      </div>

      <div className="mt-10 grid items-stretch gap-4 md:grid-cols-3 md:gap-3 lg:gap-5">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative flex min-w-0 flex-col rounded-3xl border p-6 transition-transform duration-300 hover:-translate-y-1 md:p-5 lg:p-8 ${plan.tint} ${
              plan.featured
                ? "border-primary shadow-lift md:-translate-y-2"
                : "border-border shadow-soft"
            }`}
          >
            {plan.featured && (
              <span className="absolute right-4 top-4 rounded-full bg-primary px-2.5 py-1 text-[11px] font-semibold text-primary-foreground lg:right-6 lg:top-6">
                Most popular
              </span>
            )}
            <p
              className={`max-w-[60%] text-sm font-semibold uppercase tracking-wide ${
                "text-muted-foreground"
              }`}
            >
              {plan.tagline}
            </p>
            <h3
              className={`mt-2 text-2xl font-bold ${
                "text-foreground"
              }`}
            >
              {plan.name}
            </h3>
            <div className="mt-6 flex flex-wrap items-end gap-1">
              <span
                className={`text-[38px] font-bold leading-none tracking-tight sm:text-[44px] ${
                  "text-foreground"
                }`}
              >
                {formatPrice(region, cycleAmount(region.prices[plan.key], cycle))}
              </span>
              <span
                className={`pb-1 text-sm ${
                  "text-muted-foreground"
                }`}
              >
                {plan.key === "free" ? plan.period : cycleSuffix(cycle)}
              </span>
            </div>
            {yearly && plan.key !== "free" && (
              <p
                className={`mt-1 text-xs ${
                  "text-muted-foreground"
                }`}
              >
                ≈ {formatPrice(region, perMonthAmount(region.prices[plan.key], cycle))}/month,
                billed yearly
              </p>
            )}
            <p
              className={`mt-2 text-sm ${
                "text-muted-foreground"
              }`}
            >
              {planNote(plan, region, cycle)}
            </p>

            <ul className="mt-6 mb-7 flex-1 space-y-3 md:space-y-2.5 lg:space-y-3">
              {plan.features.map((f) => (
                <li key={f} className="flex gap-3 text-[15px]">
                  <Check
                    className="mt-0.5 size-4 shrink-0 text-primary"
                    strokeWidth={2.6}
                  />
                  <span
                    className="text-foreground/80"
                  >
                    {f}
                  </span>
                </li>
              ))}
            </ul>

            <a
              href="#waitlist"
              onClick={() => setPlanIntent(plan.name)}
              className={`btn-sheen inline-flex items-center justify-center self-stretch rounded-2xl px-6 text-base font-semibold ${
                plan.featured
                  ? "btn-glow bg-primary text-primary-foreground"
                  : "border border-border bg-background text-foreground hover:bg-muted"
              } h-14`}
            >
              Join the waitlist
            </a>
          </div>
        ))}
      </div>

      {/* NRI / out-of-country plan */}
      <div
        id="nri"
        className="mt-6 scroll-mt-24 overflow-hidden rounded-4xl bg-foreground p-6 text-background shadow-lift sm:p-10"
      >
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-background/10 px-3 py-1.5 text-sm font-medium">
              <Plane className="size-4" strokeWidth={2} />
              For teams and people abroad
            </span>
            <h3 className="mt-5 text-[26px] font-bold leading-tight sm:text-[34px]">
              You're awake in a different time zone.
              <br />
              <span className="text-background/70">Your calls don't stop.</span>
            </h3>
            <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-background/70">
              Running a business or keeping in touch with home while you live abroad means
              missed calls land at the worst hours. MyAssistant answers on Indian time while
              you sleep, and the summary is waiting when you wake up.
            </p>

            <ScenarioCarousel />

            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                "Calls answered on Indian business hours, no matter where you are",
                "Summaries delivered in your own time zone, ready when you wake",
                "Billed in your local currency, no conversion surprises",
                "One shared priority list across the whole team",
                "Pay in your currency: USD, AED, GBP, EUR, SGD, AUD or CAD",
              ].map((f) => (
                <li key={f} className="flex gap-3 text-[15px] text-background/80">
                  <Check className="mt-0.5 size-4 shrink-0 text-background" strokeWidth={2.6} />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl bg-background p-6 text-foreground shadow-soft sm:p-8 lg:sticky lg:top-24">
            <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              MyAssistant Global
            </p>
            <div className="mt-4 flex flex-wrap items-end gap-1">
              <span className="text-[40px] font-bold leading-none tracking-tight sm:text-[46px]">
                {formatPrice(region, cycleAmount(region.prices.nri, cycle))}
              </span>
              <span className="pb-1 text-sm text-muted-foreground">{cycleSuffix(cycle)}</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {yearly
                ? `≈ ${formatPrice(region, perMonthAmount(region.prices.nri, cycle))}/month, billed yearly. `
                : ""}
              Equivalent to {formatPrice(india, india.prices.nri.monthly)}/month locally.
            </p>

            <ul className="mt-6 space-y-3 border-t border-border pt-6">
              {[
                "Everything in Business",
                "Alerts timed to the country you live in",
                "Priority email support",
                "Billing in your own currency",
              ].map((f) => (
                <li key={f} className="flex gap-3 text-[15px] text-foreground/80">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" strokeWidth={2.6} />
                  {f}
                </li>
              ))}
            </ul>

            <div className="mt-6 space-y-2 rounded-2xl bg-muted p-4 text-sm">
              <p className="font-semibold">Need something custom?</p>
              <p className="text-muted-foreground">
                Multiple numbers, or a team spread across countries? Tell us on the
                waitlist form and we will price it for you.
              </p>
            </div>
            <a
              href="#waitlist"
              onClick={() => setPlanIntent("MyAssistant Global")}
              className="btn-glow btn-sheen mt-6 inline-flex h-14 w-full items-center justify-center rounded-2xl bg-foreground px-6 text-base font-semibold text-background"
            >
              Request the Global plan
            </a>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Founding members keep this rate for life.
            </p>
          </div>
        </div>
      </div>


      {/* Comparison table */}
      <div className="mt-12 overflow-hidden rounded-4xl bg-card shadow-soft sm:mt-14">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-muted/40 px-5 py-4 sm:px-8">
          <h3 className="text-lg font-semibold">Compare plans</h3>
          <span className="text-sm text-muted-foreground">
            {region.flag} {region.country} · {region.currency} · {yearly ? "Yearly" : "Monthly"}
          </span>
        </div>
        <p className="px-5 pt-3 text-xs text-muted-foreground lg:hidden">Swipe to compare →</p>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-[15px]">
            <thead>
              <tr className="border-b border-border">
                <th className="px-6 py-4 font-medium text-muted-foreground sm:px-8">Feature</th>
                <th className="px-6 py-4 text-center font-semibold sm:px-8">Trial</th>
                <th className="bg-primary/5 px-6 py-4 text-center font-semibold text-primary sm:px-8">
                  Essential
                </th>
                <th className="px-6 py-4 text-center font-semibold sm:px-8">Business</th>
                <th className="px-6 py-4 text-center font-semibold sm:px-8">Global</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border">
                <td className="px-6 py-4 font-medium text-foreground sm:px-8">
                  {yearly ? "Yearly price" : "Monthly price"}
                </td>
                <td className="px-6 py-4 text-center font-semibold sm:px-8">
                  {formatPrice(region, cycleAmount(region.prices.free, cycle))}
                </td>
                <td className="bg-primary/[0.03] px-6 py-4 text-center font-semibold text-primary sm:px-8">
                  {formatPrice(region, cycleAmount(region.prices.premium, cycle))}
                </td>
                <td className="px-6 py-4 text-center font-semibold sm:px-8">
                  {formatPrice(region, cycleAmount(region.prices.familyPlus, cycle))}
                </td>
                <td className="px-6 py-4 text-center font-semibold sm:px-8">
                  {formatPrice(region, cycleAmount(region.prices.nri, cycle))}
                </td>
              </tr>

              {comparisonRows.map((row, i) => (
                <tr
                  key={row.label}
                  className={`border-b border-border last:border-0 ${
                    i % 2 === 1 ? "bg-muted/20" : ""
                  }`}
                >
                  <td className="px-6 py-4 font-medium text-foreground sm:px-8">{row.label}</td>
                  <td className="px-6 py-4 text-center text-muted-foreground sm:px-8">
                    {row.free}
                  </td>
                  <td className="bg-primary/[0.03] px-6 py-4 text-center font-medium text-foreground sm:px-8">
                    {row.premium}
                  </td>
                  <td className="px-6 py-4 text-center text-muted-foreground sm:px-8">
                    {row.familyPlus}
                  </td>
                  <td className="px-6 py-4 text-center text-muted-foreground sm:px-8">
                    {row.nri}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div
        id="waitlist"
        className="mt-6 scroll-mt-24 rounded-4xl bg-card p-6 text-center shadow-soft sm:p-9"
      >
        <h3 className="text-xl font-bold sm:text-2xl">Claim your founding price</h3>

        <p className="mx-auto mt-2 max-w-md text-[15px] text-muted-foreground">
          Free to join. We will email you when your spot opens, and your rate stays
          locked from day one.
        </p>
        <div className="mx-auto mt-6 max-w-lg">
          <WaitlistForm />
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          No card required · Cancel anytime · 1,400+ people ahead of you
        </p>
      </div>
    </section>
  );
}
