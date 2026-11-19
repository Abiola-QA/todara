import { ERROR_TOAST_MS, showErrorToast, showToast, TOAST_MS, toastStore } from '..';

describe('toast store', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    toastStore.dismiss();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows a confirmation for 3.2 seconds, as in the design', () => {
    showToast('Hass avocado added to your quote');
    expect(toastStore.getSnapshot()).toEqual({ tone: 'info', text: 'Hass avocado added to your quote' });
    vi.advanceTimersByTime(TOAST_MS);
    expect(toastStore.getSnapshot()).toBeNull();
  });

  it('keeps errors up longer, with their list', () => {
    showErrorToast('Please fix these 2 things before sending:', ['Enter your name', 'Enter your country']);
    expect(toastStore.getSnapshot()).toMatchObject({ tone: 'error', items: ['Enter your name', 'Enter your country'] });
    vi.advanceTimersByTime(TOAST_MS);
    expect(toastStore.getSnapshot()).not.toBeNull();
    vi.advanceTimersByTime(ERROR_TOAST_MS - TOAST_MS);
    expect(toastStore.getSnapshot()).toBeNull();
  });

  it('replaces the current message and can be dismissed', () => {
    const listener = vi.fn();
    const unsubscribe = toastStore.subscribe(listener);
    showToast('first');
    showErrorToast('second');
    expect(toastStore.getSnapshot()?.text).toBe('second');
    toastStore.dismiss();
    expect(toastStore.getSnapshot()).toBeNull();
    expect(listener).toHaveBeenCalledTimes(3);
    unsubscribe();
  });
});
