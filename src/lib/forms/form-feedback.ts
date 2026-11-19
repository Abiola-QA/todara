/**
 * Error feedback shared by every form on the site: a toast that lists what still needs fixing, and a jump to
 * the first field with a problem, so an error above or below the visible part of the page is never missed.
 * Fields with a problem carry aria-invalid="true"; messages that do not belong to one input (e.g. "Add at
 * least one product") carry data-form-error.
 */

/** The toast text for a set of field errors: the message itself for one, a heading and a list for several. */
export function formErrorToast(messages: readonly (string | undefined)[]): { text: string; items?: string[] } {
  const list = [...new Set(messages.filter((m): m is string => Boolean(m && m.trim())))];
  if (list.length === 0) return { text: 'Please check the form and try again.' };
  if (list.length === 1) return { text: list[0] as string };
  return { text: `Please fix these ${list.length} things before sending:`, items: list };
}

/** Scrolls to the first field or message with a problem inside `root` and moves the keyboard focus there. */
export function focusFirstFormError(root: ParentNode): HTMLElement | null {
  const el = root.querySelector<HTMLElement>('[aria-invalid="true"], [data-form-error]');
  if (!el) return null;
  const reduceMotion = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView?.({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
  if (el.matches('input, select, textarea, button, [tabindex]')) el.focus({ preventScroll: true });
  return el;
}
