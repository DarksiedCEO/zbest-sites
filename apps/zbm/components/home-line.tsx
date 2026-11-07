"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { useMotionAllowed } from "@zbest/ui";
import type { BizId } from "@/content/home-line";

/**
 * The homepage showpiece (founder direction 2026-11-07): one amber line is one
 * customer. It is drawn down the page by a CSS scroll-driven animation (no
 * scroll listeners), breaks at the leak stop, falls away, and is stitched back
 * at Revenue Recovery before running into the closing "Start a Project".
 *
 * Static state (server HTML, no JS, reduced motion): the whole line is drawn
 * and still, and the customer dots are hidden. Nothing starts invisible.
 *
 * Browsers without scroll-driven animations step the line stop by stop with an
 * IntersectionObserver instead.
 */

const BizContext = createContext<{ biz: BizId; setBiz: (b: BizId) => void }>({ biz: "auto", setBiz: () => {} });
export const useBiz = () => useContext(BizContext);

export function HomeLine({ children }: { children: ReactNode }) {
  const [biz, setBizState] = useState<BizId>("auto");
  const live = useMotionAllowed();
  const root = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const kf = useRef<HTMLStyleElement>(null);
  const redraw = useRef<() => void>(() => {});

  const setBiz = useCallback((b: BizId) => {
    setBizState(b);
    const s = svg.current;
    if (s) {
      s.classList.add("is-redraw");
      requestAnimationFrame(() => requestAnimationFrame(() => s.classList.remove("is-redraw")));
    }
  }, []);

  useEffect(() => {
    const journey = root.current, s = svg.current, kfStyle = kf.current;
    if (!journey || !s || !kfStyle) return;
    const $ = <T extends Element>(sel: string, r: ParentNode = journey) => r.querySelector<T>(sel);
    const $$ = <T extends Element>(sel: string, r: ParentNode = journey) => [...r.querySelectorAll<T>(sel)];
    const pA = $<SVGPathElement>("#hl-a")!, pLost = $<SVGPathElement>("#hl-lost")!, pStitch = $<SVGPathElement>("#hl-stitch")!;
    const pB = $<SVGPathElement>("#hl-b")!, pGhost = $<SVGPathElement>("#hl-ghost")!;
    const dotA = $<HTMLElement>("#hl-dot-a")!, dotB = $<HTMLElement>("#hl-dot-b")!;
    const timeline = live && CSS.supports("animation-timeline: view()");
    journey.classList.toggle("is-fallback", live && !timeline);

    const NS = "http://www.w3.org/2000/svg";
    const f = (n: number) => Math.round(n * 10) / 10;
    const rel = (el: Element) => {
      const r = el.getBoundingClientRect(), j = journey.getBoundingClientRect();
      return { x: r.left - j.left, y: r.top - j.top, w: r.width, h: r.height };
    };
    const seg = (x1: number, y1: number, x2: number, y2: number) => {
      const m = (y1 + y2) / 2;
      return ` C ${x1} ${m}, ${x2} ${m}, ${x2} ${y2}`;
    };
    type Measure = { L: number; at: (y: number) => number };
    const measure = (d: string): Measure => {
      const p = document.createElementNS(NS, "path");
      p.setAttribute("d", d);
      s.appendChild(p);
      const L = p.getTotalLength(), N = Math.max(80, Math.min(900, Math.round(L / 12)));
      const ys: number[] = [], ls: number[] = [];
      for (let i = 0; i <= N; i++) { const l = (L * i) / N; ls.push(l); ys.push(p.getPointAtLength(l).y); }
      p.remove();
      for (let i = 1; i < ys.length; i++) ys[i] = Math.max(ys[i]!, ys[i - 1]!);
      return {
        L,
        at(y) {
          if (y <= ys[0]!) return 0;
          if (y >= ys[ys.length - 1]!) return L;
          let lo = 0, hi = ys.length - 1;
          while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (ys[mid]! < y) lo = mid; else hi = mid; }
          const t = (y - ys[lo]!) / (ys[hi]! - ys[lo]! || 1);
          return ls[lo]! + t * (ls[hi]! - ls[lo]!);
        },
      };
    };

    type Geo = { H: number; breakY: number; lostY: number; stitchY: number; mA: Measure; mSt: Measure; mB: Measure; mDotA: Measure; mDotB: Measure };
    let geo: Geo | null = null;
    let lastTip = 0;

    const fallbackUpdate = (tip: number) => {
      if (!geo) return;
      lastTip = tip;
      const g = geo;
      pA.style.strokeDashoffset = `${g.mA.L - g.mA.at(tip)}`;
      pB.style.strokeDashoffset = `${g.mB.L - g.mB.at(tip)}`;
      pLost.style.opacity = tip > g.breakY + 20 ? ".75" : "0";
      const st = tip > g.stitchY - innerHeight * 0.3;
      pStitch.style.strokeDashoffset = st ? "0" : `${g.mSt.L}`;
      dotA.style.offsetDistance = `${tip <= g.breakY ? g.mA.at(tip) : g.mDotA.L}px`;
      dotA.style.opacity = tip <= g.breakY ? "1" : "0";
      dotB.style.opacity = st ? "1" : "0";
      dotB.style.offsetDistance = `${st ? g.mSt.L + g.mB.at(tip) : 0}px`;
    };

    const writeKeyframes = () => {
      const g = geo!, N = 160, vh = innerHeight, lead = vh * 0.48;
      const fr = { a: [] as string[], lost: [] as string[], st: [] as string[], b: [] as string[], da: [] as string[], db: [] as string[] };
      const stStart = g.stitchY - vh * 0.42, stEnd = g.stitchY - vh * 0.1;
      for (let i = 0; i <= N; i++) {
        const t = i / N, tip = t * g.H + lead, pct = `${(t * 100).toFixed(2)}%`;
        fr.a.push(`${pct}{stroke-dashoffset:${f(g.mA.L - g.mA.at(tip))}}`);
        fr.lost.push(`${pct}{opacity:${tip > g.breakY + 20 ? 0.75 : 0}}`);
        const sp = tip < stStart ? 0 : tip > stEnd ? 1 : (tip - stStart) / (stEnd - stStart);
        fr.st.push(`${pct}{stroke-dashoffset:${f(g.mSt.L * (1 - sp))}}`);
        fr.b.push(`${pct}{stroke-dashoffset:${f(g.mB.L - g.mB.at(tip))}}`);
        let dA: number;
        if (tip <= g.breakY) dA = g.mA.at(tip);
        else { const k = Math.min(1, (tip - g.breakY) / Math.max(1, g.lostY - g.breakY)); dA = g.mA.L + k * (g.mDotA.L - g.mA.L); }
        const opA = tip < g.breakY + 20 ? 1 : tip > g.lostY ? 0 : 0.9;
        const hollow = tip > g.breakY + 20;
        fr.da.push(`${pct}{offset-distance:${f(Math.min(dA, g.mDotA.L))}px;opacity:${opA};background:${hollow ? "var(--hl-night)" : "var(--hl-amber)"}}`);
        let dB = sp * g.mSt.L;
        if (tip > stEnd) dB = g.mSt.L + g.mB.at(tip);
        fr.db.push(`${pct}{offset-distance:${f(Math.min(dB, g.mDotB.L))}px;opacity:${tip < stStart ? 0 : 1}}`);
      }
      const range = "animation-range:cover 50vh cover calc(100% - 50vh);";
      const anim = (id: string, k: string) => `#${id}{animation:${k} linear both;animation-timeline:--hl;${range}}`;
      kfStyle.textContent =
        `@keyframes hlA{${fr.a.join("")}}@keyframes hlL{${fr.lost.join("")}}@keyframes hlS{${fr.st.join("")}}` +
        `@keyframes hlB{${fr.b.join("")}}@keyframes hlDA{${fr.da.join("")}}@keyframes hlDB{${fr.db.join("")}}` +
        anim("hl-a", "hlA") + anim("hl-lost", "hlL") + anim("hl-stitch", "hlS") + anim("hl-b", "hlB") +
        anim("hl-dot-a", "hlDA") + anim("hl-dot-b", "hlDB");
    };

    const build = () => {
      const W = journey.clientWidth, H = journey.scrollHeight;
      s.setAttribute("width", `${W}`);
      s.setAttribute("height", `${H}`);
      s.setAttribute("viewBox", `0 0 ${W} ${H}`);
      const stops = $$<HTMLElement>("[data-stop]");
      if (stops.length < 3) return;
      const pts = stops.map((st) => {
        const n = $("[data-node]", st)!, r = rel(n), sr = rel(st);
        return { x: r.x + r.w / 2, y: r.y + r.h / 2, bot: sr.y + sr.h };
      });
      const leakI = stops.findIndex((st) => st.hasAttribute("data-leak"));
      const rrI = stops.findIndex((st) => st.hasAttribute("data-stitch"));
      const endI = stops.length - 1;

      let a = `M ${f(pts[0]!.x)} ${f(pts[0]!.y)}`;
      for (let i = 0; i < leakI; i++) {
        const p = pts[i]!, q = pts[i + 1]!, bottom = Math.max(p.y + 1, p.bot);
        a += ` L ${f(p.x)} ${f(bottom)}` + seg(f(p.x), f(bottom), f(q.x), f(q.y));
      }
      const lk = pts[leakI]!;
      const fig = $("[data-leak-figure]");
      const leakFig = fig ? rel(fig) : { y: lk.y + 200, h: 200 };
      const breakY = Math.min(lk.bot - 60, Math.max(lk.y + 160, leakFig.y + leakFig.h * 0.45));
      a += ` L ${f(lk.x)} ${f(breakY)}`;
      const lostY = breakY + 300;
      const lost = `M ${f(lk.x)} ${f(breakY)} C ${f(lk.x)} ${f(breakY + 110)}, ${f(lk.x - 10)} ${f(breakY + 170)}, ${f(lk.x * 0.45)} ${f(breakY + 220)} S ${f(-30)} ${f(lostY - 30)}, ${f(-40)} ${f(lostY)}`;
      const rr = pts[rrI]!;
      const stitch = `M ${f(lk.x)} ${f(breakY)} L ${f(lk.x)} ${f(lk.bot)}` + seg(f(lk.x), f(lk.bot), f(rr.x), f(rr.y));
      let b = `M ${f(rr.x)} ${f(rr.y)}`;
      for (let i = rrI; i < endI; i++) {
        const p = pts[i]!, q = pts[i + 1]!;
        b += ` L ${f(p.x)} ${f(p.bot)}` + seg(f(p.x), f(p.bot), f(q.x), f(q.y));
      }
      const endBtn = $("[data-line-end]");
      const e = pts[endI]!;
      if (endBtn) {
        const btn = rel(endBtn), by = btn.y + btn.h / 2, bx = btn.x - 2;
        b += ` L ${f(e.x)} ${f(by - 36)} Q ${f(e.x)} ${f(by)}, ${f(e.x + 36)} ${f(by)} L ${f(bx)} ${f(by)}`;
      }

      pA.setAttribute("d", a);
      pLost.setAttribute("d", lost);
      pStitch.setAttribute("d", stitch);
      pB.setAttribute("d", b);
      pGhost.setAttribute("d", `${a} ${b}`);

      const mA = measure(a), mSt = measure(stitch), mB = measure(b);
      const lostTail = lost.replace(/^M [^C]+/, "");
      const bTail = b.replace(/^M [^ ]+ [^ ]+/, "");
      const mDotA = measure(`${a} ${lostTail}`), mDotB = measure(`${stitch} ${bTail}`);
      geo = { H, breakY, lostY, stitchY: rr.y, mA, mSt, mB, mDotA, mDotB };

      for (const [p, m] of [[pA, mA], [pStitch, mSt], [pB, mB]] as const) p.style.strokeDasharray = `${m.L} ${m.L + 10}`;
      dotA.style.offsetPath = `path("${a} ${lostTail}")`;
      dotB.style.offsetPath = `path("${stitch} ${bTail}")`;

      if (!live) {
        kfStyle.textContent = "";
        for (const p of [pA, pStitch, pB]) p.style.strokeDashoffset = "0";
        return;
      }
      if (timeline) writeKeyframes();
      else fallbackUpdate(lastTip || innerHeight * 0.6);
    };

    let raf = 0;
    const schedule = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(build); };
    redraw.current = schedule;
    const ro = new ResizeObserver(schedule);
    ro.observe(journey);
    addEventListener("resize", schedule);
    document.fonts?.ready.then(schedule);
    const onLoad = (ev: Event) => { if ((ev.target as Element)?.tagName === "IMG") schedule(); };
    journey.addEventListener("load", onLoad, true);

    let fio: IntersectionObserver | null = null;
    if (live && !timeline) {
      fio = new IntersectionObserver(
        (es) => es.forEach((en) => { if (en.isIntersecting) { const r = rel(en.target); fallbackUpdate(r.y + r.h + innerHeight * 0.1); } }),
        { rootMargin: "-50% 0px -50% 0px" },
      );
      $$("[data-stop]").forEach((st) => { $$("[data-node], h2, figure, [data-line-end]", st).forEach((el) => fio!.observe(el)); });
    }
    schedule();
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      fio?.disconnect();
      removeEventListener("resize", schedule);
      journey.removeEventListener("load", onLoad, true);
      kfStyle.textContent = "";
    };
  }, [live]);

  // The chosen business changes text heights, so the line is re-measured.
  useEffect(() => { redraw.current(); }, [biz]);

  return (
    <BizContext.Provider value={{ biz, setBiz }}>
      <div ref={root} className="hl-journey" data-biz={biz} data-line-state={live ? "live" : "static"}>
        <style ref={kf} />
        <svg ref={svg} className="hl-svg" aria-hidden="true" focusable="false">
          <path className="hl-ghost" id="hl-ghost" />
          <path className="hl-main" id="hl-a" />
          <path className="hl-lost" id="hl-lost" strokeDasharray="2 9" />
          <path className="hl-main" id="hl-stitch" />
          <path className="hl-main" id="hl-b" />
        </svg>
        <div className="hl-dot" id="hl-dot-a" aria-hidden="true" />
        <div className="hl-dot hl-dot-next" id="hl-dot-b" aria-hidden="true" />
        {children}
      </div>
    </BizContext.Provider>
  );
}

/** The business picker. Real radio buttons, so it works by keyboard and screen reader. */
export function BizPicker({ options }: { options: readonly { id: BizId; label: string }[] }) {
  const { biz, setBiz } = useBiz();
  return (
    <fieldset className="hl-picker">
      <legend>Your business</legend>
      <div className="hl-chips">
        {options.map((o) => (
          <span key={o.id}>
            <input type="radio" name="hl-biz" id={`hl-biz-${o.id}`} value={o.id} checked={biz === o.id} onChange={() => setBiz(o.id)} />
            <label htmlFor={`hl-biz-${o.id}`}>{o.label}</label>
          </span>
        ))}
      </div>
    </fieldset>
  );
}

/** The customer's search, typed out once the stop is on screen (motion allowed only). */
export function SearchQuery({ queries }: { queries: Record<BizId, string> }) {
  const { biz } = useBiz();
  const live = useMotionAllowed();
  const ref = useRef<HTMLParagraphElement>(null);
  const [seen, setSeen] = useState(false);
  const [typed, setTyped] = useState("");

  useEffect(() => {
    const el = ref.current;
    if (!el || !live) return;
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { setSeen(true); io.disconnect(); } }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [live]);

  const typing = live && seen;
  useEffect(() => {
    if (!typing) return;
    const q = queries[biz];
    let i = 0;
    const t = setInterval(() => { i += 1; setTyped(q.slice(0, i)); if (i >= q.length) clearInterval(t); }, 70);
    return () => clearInterval(t);
  }, [biz, typing, queries]);

  return (
    <p ref={ref} className="hl-query">
      <span className="hl-sr">Searched for: </span>
      <span>{typing ? typed : queries[biz]}</span>
      <span className="hl-caret" aria-hidden="true" />
    </p>
  );
}
