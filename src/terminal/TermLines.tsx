import type { Line, Seg } from "./commands";

type RunFn = (command: string) => void;

const isExternal = (href: string) => /^https?:\/\//.test(href);

function Segment({ seg, onRun }: { seg: Seg; onRun: RunFn }) {
  const cls = seg.tone ? `term-seg term-seg--${seg.tone}` : "term-seg";
  if (seg.run && seg.href) {
    // A command that is also a real link: plain click runs it in the terminal,
    // Cmd/Ctrl/Shift/middle-click keep the browser's link behavior.
    const command = seg.run;
    const external = isExternal(seg.href);
    return (
      <a
        className={`${cls} term-seg--cmd`}
        href={seg.href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        onClick={(e) => {
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
          e.preventDefault();
          onRun(command);
        }}
      >
        {seg.text}
      </a>
    );
  }
  if (seg.href) {
    const external = isExternal(seg.href);
    return (
      <a
        className={`${cls} term-seg--link`}
        href={seg.href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {seg.text}
        {external && <span aria-hidden="true"> ↗</span>}
      </a>
    );
  }
  if (seg.run) {
    const command = seg.run;
    return (
      <button type="button" className={`${cls} term-seg--cmd`} onClick={() => onRun(command)}>
        {seg.text}
      </button>
    );
  }
  return <span className={cls}>{seg.text}</span>;
}

export default function TermLines({ lines, onRun }: { lines: Line[]; onRun: RunFn }) {
  return (
    <>
      {lines.map((l, i) => (
        <div key={i} className={l.cols ? `term-line term-line--cols${l.cols}` : "term-line"}>
          {l.segs.map((seg, j) => (
            <Segment key={j} seg={seg} onRun={onRun} />
          ))}
        </div>
      ))}
    </>
  );
}
