import { useEffect, useRef, useState } from "react";
import { BatteryFull, Signal, Wifi } from "lucide-react";

import handMockup from "@/assets/hand-mockup.png";
import handHole from "@/assets/hand-hole.png";
import { ConversationCloud, MobileCloud } from "@/components/site/ConversationCloud";
import { NativeCallScreen } from "@/components/site/AppScreens";

const INNER_W = 402;
const INNER_H = 874;
const CYCLE_HOLD = 16500;
const CYCLE_LEAVE = 1000;

function Phone({ className, timerKey }: { className: string; timerKey: number }) {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(0.4);
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setScale(el.clientWidth / INNER_W));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div className={`relative aspect-[2000/2222] shrink-0 [mask-image:linear-gradient(to_bottom,black_80%,transparent)] ${className}`}>
      <div
        className="absolute inset-0"
        style={{
          WebkitMaskImage: `url(${handHole})`,
          maskImage: `url(${handHole})`,
          WebkitMaskSize: "100% 100%",
          maskSize: "100% 100%",
        }}
      >
        <div ref={boxRef} className="absolute left-[18.2%] top-[5.6%] h-[75%] w-[38.5%]">
          <div className="relative origin-top-left overflow-hidden" style={{ width: INNER_W, height: INNER_H, transform: `scale(${scale})` }}>
            <div className="relative h-full px-4 pb-4 pt-11 text-[13px]">
              <NativeCallScreen minimal timerKey={timerKey} />
              <div className="absolute inset-x-0 top-[21px] z-10 flex items-center justify-between px-[36px] text-[13px] font-semibold text-white">
                <span>9:41</span>
                <span className="flex items-center gap-1.5">
                  <Signal className="size-3.5" strokeWidth={2.5} />
                  <Wifi className="size-3.5" strokeWidth={2.5} />
                  <BatteryFull className="size-4" strokeWidth={2.2} />
                </span>
              </div>
              <div className="absolute left-[138px] top-[13.5px] z-20 h-[36px] w-[126px] rounded-full bg-black">
                <span className="absolute right-[7px] top-1/2 size-[24px] -translate-y-1/2 rounded-full bg-[#0b0b10] shadow-[inset_0_0_0_1px_rgb(255_255_255/0.05)]">
                  <span className="absolute left-1/2 top-1/2 size-[13px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_35%_30%,#6d8bff_0,#2b2f8f_35%,#0c0c30_70%,#050510_100%)] shadow-[0_0_0_2px_#15151f]" />
                  <span className="absolute left-[38%] top-[34%] size-[3px] rounded-full bg-white/60" />
                </span>
                <span className="absolute right-[38px] top-1/2 size-[6px] -translate-y-1/2 rounded-full bg-orange-400 shadow-[0_0_6px_rgb(251_146_60)]" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <img
        src={handMockup}
        alt="A hand holding a phone showing MyAssistant answering a call"
        className="pointer-events-none absolute inset-0 h-full w-full select-none"
        draggable={false}
      />
    </div>
  );
}

const STAGE_W = 1140;
const STAGE_H = 1000;
const MOBILE_W = 400;
const MOBILE_H = 980;

/** Hand-held iPhone with conversations around it. Wide screens get the full stage, scaled to fit. */
export function HandMockup() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [avail, setAvail] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setAvail(el.clientWidth));
    ro.observe(el);
    setAvail(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setStarted(true);
          setCycle((n) => n + 1);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const t1 = setTimeout(() => setLeaving(true), CYCLE_HOLD);
    const t2 = setTimeout(() => {
      setCycle((n) => n + 1);
      setLeaving(false);
    }, CYCLE_HOLD + CYCLE_LEAVE);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [cycle, started]);

  const s = Math.min(1, (avail || 1000) / STAGE_W);
  const ms = Math.min(1, (avail || 343) / MOBILE_W);

  return (
    <div ref={wrapRef} className="w-full">
      <div className="-mx-3 hidden min-[480px]:block sm:mx-0" style={{ height: STAGE_H * s }}>
        <div className="relative origin-top-left" style={{ width: STAGE_W, height: STAGE_H, transform: `scale(${s}) translateX(-30px)` }}>
          <Phone className="absolute left-[331px] top-[60px] w-[720px]" timerKey={cycle} />
          <div key={cycle} className="absolute inset-0">
            {started && <ConversationCloud leaving={leaving} />}
          </div>
        </div>
      </div>
      <div className="min-[480px]:hidden" style={{ height: MOBILE_H * ms }}>
        <div className="relative origin-top-left" style={{ width: MOBILE_W, height: MOBILE_H, transform: `scale(${ms})` }}>
          <Phone className="absolute left-[28px] top-[300px] w-[460px]" timerKey={cycle} />
          <div key={cycle} className="absolute inset-0">
            {started && <MobileCloud leaving={leaving} />}
          </div>
        </div>
      </div>
    </div>
  );
}
