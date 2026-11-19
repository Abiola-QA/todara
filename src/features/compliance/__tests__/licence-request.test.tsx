import { act } from 'react';

import { toastStore } from '@/lib/toast';
import { renderUi, screen } from '@/testing/test-utils';

import { LicenceRequestDialog } from '../components/licence-request-dialog';
import { licenceRequestStore } from '../utils/licence-request-store';
import { errorsInFormOrder, listInWords, recipients, validateLicenceRequest, emptyDraft } from '../utils/validate-licence-request';

describe('licence request rules', () => {
  it('uses the design’s messages', () => {
    const errs = validateLicenceRequest({ ...emptyDraft(), picks: { afa: false, kephis: false, haccp: false, gap: false }, emails: ['', 'bad', ''] });
    expect(errs).toEqual({
      name: 'Enter your name',
      company: 'Enter your company name',
      e0: 'Enter a valid email address',
      e1: 'Enter a valid email address',
      picks: 'Choose at least one document',
      consent: 'Please agree so we can send the documents',
    });
    expect(errorsInFormOrder(errs, 3)[0]).toBe('Choose at least one document');
  });

  it('sends to each address once, lower-cased, and lists documents in words', () => {
    expect(recipients([' Jane@Acme.example ', 'jane@acme.example', '', 'ops@acme.example'])).toEqual(['jane@acme.example', 'ops@acme.example']);
    expect(listInWords(['A'])).toBe('A');
    expect(listInWords(['A', 'B', 'C'])).toBe('A, B and C');
  });
});

describe('LicenceRequestDialog', () => {
  beforeEach(() => {
    act(() => licenceRequestStore.open());
    toastStore.dismiss();
  });
  afterEach(() => {
    act(() => licenceRequestStore.close());
  });

  it('starts with every document ticked and the name focused', () => {
    renderUi(<LicenceRequestDialog submit={vi.fn()} />);
    for (const name of ['AFA–HCD export licence', 'KEPHIS exporter registration', 'HACCP certificate', 'GlobalG.A.P. certificate']) {
      expect(screen.getByRole('checkbox', { name: new RegExp(name) })).toBeChecked();
    }
    expect(screen.getByRole('textbox', { name: /Your name/ })).toHaveFocus();
  });

  it('shows the errors in a toast, jumps to the first and sends nothing', async () => {
    const submit = vi.fn();
    const { user } = renderUi(<LicenceRequestDialog submit={submit} />);
    await user.click(screen.getByRole('button', { name: 'Send request' }));
    expect(submit).not.toHaveBeenCalled();
    expect(screen.getByText('Enter your company name')).toBeInTheDocument();
    expect(toastStore.getSnapshot()).toMatchObject({
      tone: 'error',
      items: ['Enter your name', 'Enter your company name', 'Enter a valid email address', 'Please agree so we can send the documents'],
    });
    expect(screen.getByRole('textbox', { name: /Your name/ })).toHaveFocus();
  });

  it('adds and removes extra addresses, up to four', async () => {
    const { user } = renderUi(<LicenceRequestDialog submit={vi.fn()} />);
    for (let i = 0; i < 3; i++) await user.click(screen.getByRole('button', { name: '+ Add another email' }));
    expect(screen.getAllByPlaceholderText('name@company.com')).toHaveLength(4);
    expect(screen.queryByRole('button', { name: '+ Add another email' })).not.toBeInTheDocument();
    await user.click(screen.getAllByRole('button', { name: 'Remove this email' })[1]!);
    expect(screen.getAllByPlaceholderText('name@company.com')).toHaveLength(3);
  });

  it('sends the request and confirms the documents and addresses', async () => {
    const submit = vi.fn().mockResolvedValue({ ok: true, emails: [], documents: [] });
    const { user } = renderUi(<LicenceRequestDialog submit={submit} />);
    await user.click(screen.getByRole('checkbox', { name: /HACCP certificate/ }));
    await user.click(screen.getByRole('checkbox', { name: /GlobalG\.A\.P\. certificate/ }));
    await user.type(screen.getByRole('textbox', { name: /Your name/ }), 'Jane Buyer');
    await user.type(screen.getByRole('textbox', { name: /Company/ }), 'Acme Foods');
    await user.type(screen.getByPlaceholderText('name@company.com'), 'Jane@Acme.example');
    await user.click(screen.getByRole('button', { name: '+ Add another email' }));
    await user.type(screen.getAllByPlaceholderText('name@company.com')[1]!, 'quality@acme.example');
    await user.click(screen.getByRole('checkbox', { name: /I agree/ }));
    await user.click(screen.getByRole('button', { name: 'Send request' }));

    expect(await screen.findByText('Request received')).toBeInTheDocument();
    expect(screen.getByText('The export team will email the AFA–HCD export licence and KEPHIS exporter registration to:')).toBeInTheDocument();
    expect(screen.getByText('jane@acme.example')).toBeInTheDocument();
    expect(screen.getByText('quality@acme.example')).toBeInTheDocument();
    const payload = JSON.parse(String((submit.mock.calls[0]![0] as FormData).get('licence-request')));
    expect(payload).toMatchObject({ emails: ['jane@acme.example', 'quality@acme.example'], documents: ['afa', 'kephis'], consent: true });
    await user.click(screen.getByRole('button', { name: 'Done' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
