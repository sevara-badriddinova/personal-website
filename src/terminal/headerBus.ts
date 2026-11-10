// Lets other parts of the page (the hero hint) run a command in the header prompt.
export const HEADER_RUN_EVENT = "terminal:run";

export function runInHeader(command: string) {
  window.dispatchEvent(new CustomEvent<string>(HEADER_RUN_EVENT, { detail: command }));
}
