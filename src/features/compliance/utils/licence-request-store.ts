/** Whether the "Request licence copies" pop-up is open; both buttons on the page open the same one. */
let open = false;
let returnFocus: HTMLElement | null = null;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export const licenceRequestStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot: () => open,
  getServerSnapshot: () => false,
  open() {
    returnFocus = typeof document !== 'undefined' ? (document.activeElement as HTMLElement | null) : null;
    open = true;
    emit();
  },
  close() {
    open = false;
    emit();
    // Back to the button that opened it, for keyboard users.
    returnFocus?.focus?.();
    returnFocus = null;
  },
};
