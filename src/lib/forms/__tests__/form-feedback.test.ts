import { focusFirstFormError, formErrorToast } from '../form-feedback';

describe('formErrorToast', () => {
  it('uses the message itself for one error', () => {
    expect(formErrorToast(['Enter your company name'])).toEqual({ text: 'Enter your company name' });
  });

  it('lists several errors once each, in order, under a heading', () => {
    expect(formErrorToast(['Enter your name', undefined, 'Enter your country', 'Enter your name', ' '])).toEqual({
      text: 'Please fix these 2 things before sending:',
      items: ['Enter your name', 'Enter your country'],
    });
  });

  it('falls back to a general message', () => {
    expect(formErrorToast([])).toEqual({ text: 'Please check the form and try again.' });
  });
});

describe('focusFirstFormError', () => {
  it('scrolls to and focuses the first field marked invalid, in page order', () => {
    document.body.innerHTML = `
      <form>
        <input id="ok" />
        <span data-form-error>Add at least one product</span>
        <input id="company" aria-invalid="true" />
      </form>`;
    const first = focusFirstFormError(document.body);
    expect(first?.textContent).toBe('Add at least one product');
    expect(first?.scrollIntoView).toHaveBeenCalled();
    expect(first).not.toHaveFocus();

    document.querySelector('[data-form-error]')!.remove();
    expect(focusFirstFormError(document.body)?.id).toBe('company');
    expect(document.getElementById('company')).toHaveFocus();
  });

  it('does nothing when there is no error', () => {
    document.body.innerHTML = '<form><input /></form>';
    expect(focusFirstFormError(document.body)).toBeNull();
  });
});
