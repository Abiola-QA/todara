/** The short confirmation shown at the bottom of the screen ("Hass avocado added to your quote"). */
let message = '';
let timer: ReturnType<typeof setTimeout> | undefined;
const listeners = new Set<() => void>();

/** How long a message stays up, as in the design. */
export const TOAST_MS = 3200;

function emit() {
  listeners.forEach((l) => l());
}

export const toastStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot: () => message,
  getServerSnapshot: () => '',
  show(text: string) {
    clearTimeout(timer);
    message = text;
    emit();
    timer = setTimeout(() => {
      message = '';
      emit();
    }, TOAST_MS);
  },
};

export function showToast(text: string) {
  toastStore.show(text);
}
