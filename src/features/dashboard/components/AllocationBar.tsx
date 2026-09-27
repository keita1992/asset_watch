import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { formatMan, formatPct } from "../portfolio";

export type Segment = {
  key: string;
  name: string;
  value: number;
  color: string;
  onColor: string;
  hatch?: boolean;
};

type Props = {
  label: string;
  segments: Segment[];
  // 構成比の分母
  total: number;
  // false のときは区画に名前を書かず、構成比と金額だけにする
  showName?: boolean;
  // small: 区画に名前を書けなかった項目だけ凡例に出す / all: すべて出す / none: 出さない
  legend?: "small" | "all" | "none";
};

// 凡例の「small」で、区画に名前を書けなかったとみなす構成比
const LEGEND_THRESHOLD = 0.07;

type Active = { key: string; x: number };

// 合計が 100% になる内訳を 1 本の横棒で示す。区画はホバー・タップ・フォーカスで名前・金額・構成比を出す
export const AllocationBar = ({ label, segments, total, showName = true, legend = "small" }: Props) => {
  const rows = segments.filter((s) => s.value > 0);
  const legendRows =
    legend === "all" ? rows : legend === "small" ? rows.filter((s) => s.value / total <= LEGEND_THRESHOLD) : [];
  const barRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<Active | null>(null);
  const activeSegment = rows.find((s) => s.key === active?.key);

  // タップで開いた詳細は、棒の外をタップしたら閉じる
  useEffect(() => {
    if (!active) return;
    const close = (e: PointerEvent) => {
      if (!barRef.current?.contains(e.target as Node)) setActive(null);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [active]);

  const open = (key: string, el: HTMLElement) => {
    const bar = barRef.current;
    if (!bar) return;
    // 詳細が棒の外にはみ出さないよう、中心の位置を棒の幅の中に収める
    const half = 90;
    const center = el.offsetLeft + el.offsetWidth / 2;
    setActive({ key, x: Math.min(Math.max(center, half), Math.max(bar.clientWidth - half, half)) });
  };

  return (
    <>
      <div ref={barRef} className="aw-alloc" role="group" aria-label={label}>
        {rows.map((s) => (
          <AllocationSegment
            key={s.key}
            segment={s}
            total={total}
            showName={showName}
            active={active?.key === s.key}
            onOpen={(el) => open(s.key, el)}
            onToggle={(el) => (active?.key === s.key ? setActive(null) : open(s.key, el))}
            onClose={() => setActive((a) => (a?.key === s.key ? null : a))}
          />
        ))}
        {activeSegment && (
          <div className="aw-tip" role="status" style={{ left: active!.x }}>
            <div className="aw-tip__name">{activeSegment.name}</div>
            <div className="aw-tip__row">
              {formatMan(activeSegment.value)}円・{formatPct(activeSegment.value, total)}
            </div>
          </div>
        )}
      </div>
      {legendRows.length > 0 && (
        <ul className="aw-legend">
          {legendRows.map((s) => (
            <li key={s.key}>
              <span className={`aw-dot${s.hatch ? " aw-hatch" : ""}`} style={fillStyle(s)} />
              {s.name} <b>{formatPct(s.value, total)}</b> {formatMan(s.value)}
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

const fillStyle = (s: Segment) => ({ backgroundColor: s.color });

type SegmentProps = {
  segment: Segment;
  total: number;
  showName: boolean;
  active: boolean;
  onOpen: (el: HTMLElement) => void;
  onToggle: (el: HTMLElement) => void;
  onClose: () => void;
};

// 区画に収まる範囲で文字を減らす。名前を優先し、入らなければ構成比、それも入らなければ何も書かない
const AllocationSegment = ({ segment: s, total, showName, active, onOpen, onToggle, onClose }: SegmentProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const width = useRef(0);
  // タップ時は focus も発生するので、指で押している間の focus では開かない（開閉は指を離したときに行う）
  const pressing = useRef(false);
  const [level, setLevel] = useState(0);
  // 幅が変わるたびに増やし、いちばん多い表示から測り直す
  const [resized, setResized] = useState(0);
  const pct = formatPct(s.value, total);
  const man = formatMan(s.value);

  // 区画に書く文字。番号が大きいほど短い
  const label = (n: number) => {
    const steps: [string, string?][] = showName
      ? [[`${s.name} ${pct}`, man], [s.name, pct], [s.name], [pct]]
      : [[pct, man], [pct]];
    const step = steps[n];
    if (!step) return null;
    return (
      <>
        <span>{step[0]}</span>
        {step[1] && <span>{step[1]}</span>}
      </>
    );
  };
  const last = showName ? 4 : 2;

  useLayoutEffect(() => {
    setLevel(0);
  }, [resized, pct, showName]);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || level >= last) return;
    if (el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1) setLevel(level + 1);
  }, [level, last, resized, pct, showName]);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const w = Math.round(entry.contentRect.width);
      if (w !== width.current) {
        width.current = w;
        setResized((n) => n + 1);
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`aw-alloc__seg${s.hatch ? " aw-hatch" : ""}`}
      style={{ flex: `${s.value} 1 0`, color: s.onColor, ...fillStyle(s) }}
      tabIndex={0}
      aria-label={`${s.name} ${man}円 ${pct}`}
      data-active={active || undefined}
      onPointerEnter={(e) => e.pointerType === "mouse" && onOpen(e.currentTarget)}
      onPointerLeave={(e) => e.pointerType === "mouse" && onClose()}
      onPointerDown={(e) => {
        if (e.pointerType !== "mouse") pressing.current = true;
      }}
      onPointerUp={(e) => {
        if (e.pointerType === "mouse") return;
        pressing.current = false;
        onToggle(e.currentTarget);
      }}
      onFocus={(e) => !pressing.current && onOpen(e.currentTarget)}
      onBlur={onClose}
    >
      {label(Math.min(level, last))}
    </div>
  );
};
