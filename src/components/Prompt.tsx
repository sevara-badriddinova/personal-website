type PromptProps = { command: string; className?: string };

// A shell prompt line, e.g. "~ $ ls projects/". Purely decorative framing for a section.
export default function Prompt({ command, className }: PromptProps) {
  return (
    <p className={className ? `prompt ${className}` : "prompt"}>
      <span className="prompt__sign">~ $</span> {command}
    </p>
  );
}
