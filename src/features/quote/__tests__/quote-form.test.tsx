import { quoteStore } from '@/lib/quote';
import { toastStore } from '@/lib/toast';
import { renderUi, screen } from '@/testing/test-utils';

import { QuoteForm } from '../components/quote-form';

describe('QuoteForm', () => {
  beforeEach(() => {
    localStorage.clear();
    quoteStore._reset();
    toastStore.dismiss();
  });

  it('starts empty and adds products from the chips', async () => {
    const { user } = renderUi(<QuoteForm submit={vi.fn()} />);
    expect(screen.getByText('Your quote is empty. Add products below or from any product page.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '+ Hass avocado' }));
    expect(screen.getByText('Saved on this device. Pick up where you left off any time.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '16–18' })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('button', { name: '12–14' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.queryByRole('button', { name: '+ Hass avocado' })).not.toBeInTheDocument();
  });

  it('shows the design’s errors and sends nothing when the quote is incomplete', async () => {
    const submit = vi.fn();
    const { user } = renderUi(<QuoteForm submit={submit} />);
    await user.click(screen.getByRole('button', { name: 'Send enquiry' }));
    expect(screen.getByText('Add at least one product')).toBeInTheDocument();
    expect(screen.getByText('Enter your company name')).toBeInTheDocument();
    expect(screen.getByText('Please agree so we can use your details to reply')).toBeInTheDocument();
    expect(submit).not.toHaveBeenCalled();
    // The errors are also listed in a toast, so none is missed off screen.
    expect(toastStore.getSnapshot()).toMatchObject({
      tone: 'error',
      text: 'Please fix these 6 things before sending:',
      items: [
        'Add at least one product',
        'Enter your company name',
        'Enter your name',
        'Enter a valid work email',
        'Enter your country',
        'Please agree so we can use your details to reply',
      ],
    });
    await user.type(screen.getByRole('textbox', { name: /Company/ }), 'Acme');
    expect(screen.queryByText('Enter your company name')).not.toBeInTheDocument();
  });

  it('jumps to the first field that needs fixing and names the single problem in the toast', async () => {
    quoteStore.add('hass');
    quoteStore.setItem('hass', 'volume', '20 t');
    quoteStore.setDetail('company', 'Acme');
    quoteStore.setDetail('name', 'Jane');
    quoteStore.setDetail('email', 'not-an-email');
    quoteStore.setDetail('country', 'Oman');
    const { user } = renderUi(<QuoteForm submit={vi.fn()} />);
    await user.click(screen.getByRole('checkbox'));
    await user.click(screen.getByRole('button', { name: 'Send enquiry' }));
    expect(toastStore.getSnapshot()).toMatchObject({ tone: 'error', text: 'Enter a valid work email' });
    expect(screen.getByRole('textbox', { name: /Work email/ })).toHaveFocus();
  });

  it('sends a complete quote, shows the confirmation and clears the products', async () => {
    quoteStore.add('hass');
    quoteStore.add('iqf-mango-dice');
    const submit = vi.fn().mockResolvedValue({ ok: true, ref: 'TD-Q-54321', desk: 'fresh fruit desk and frozen desk' });
    const { user } = renderUi(<QuoteForm submit={submit} />);
    for (const box of screen.getAllByRole('textbox', { name: 'Volume' })) await user.type(box, '20 t');
    await user.type(screen.getByRole('textbox', { name: /Company/ }), 'Acme Foods');
    await user.type(screen.getByRole('textbox', { name: /Your name/ }), 'Jane Buyer');
    await user.type(screen.getByRole('textbox', { name: /Work email/ }), 'jane@acme.example');
    await user.type(screen.getByRole('textbox', { name: /Country/ }), 'Netherlands');
    await user.click(screen.getByRole('checkbox'));
    await user.click(screen.getByRole('button', { name: 'Send enquiry' }));

    expect(await screen.findByText('Thank you, Jane.')).toBeInTheDocument();
    expect(screen.getByText(/TD-Q-54321/)).toBeInTheDocument();
    expect(screen.getByText(/gone to our fresh fruit desk and frozen desk/)).toBeInTheDocument();
    expect(quoteStore.getSnapshot().basket).toEqual([]);
    const payload = JSON.parse(String((submit.mock.calls[0]![0] as FormData).get('quote')));
    expect(payload.basket).toHaveLength(2);
    expect(payload.consent).toBe(true);

    await user.click(screen.getByRole('button', { name: 'New enquiry' }));
    expect(screen.getByText('Your quote is empty. Add products below or from any product page.')).toBeInTheDocument();
    expect(quoteStore.getSnapshot().details.company).toBe('');
  });

  it('keeps the quote and explains what to do when sending fails', async () => {
    quoteStore.add('mango');
    quoteStore.setItem('mango', 'volume', '5 t');
    quoteStore.setDetail('company', 'Acme');
    quoteStore.setDetail('name', 'Jane');
    quoteStore.setDetail('email', 'jane@acme.example');
    quoteStore.setDetail('country', 'Oman');
    const submit = vi.fn().mockResolvedValue({ ok: false, message: 'We could not send your enquiry just now.' });
    const { user } = renderUi(<QuoteForm submit={submit} />);
    await user.click(screen.getByRole('checkbox'));
    await user.click(screen.getByRole('button', { name: 'Send enquiry' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('We could not send your enquiry just now.');
    expect(toastStore.getSnapshot()).toMatchObject({ tone: 'error', text: 'We could not send your enquiry just now.' });
    expect(quoteStore.getSnapshot().basket).toHaveLength(1);
  });
});
