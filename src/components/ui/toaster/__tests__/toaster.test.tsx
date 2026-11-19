import { act } from 'react';

import { showErrorToast, showToast, toastStore } from '@/lib/toast';
import { renderUi, screen } from '@/testing/test-utils';

import { Toaster } from '../toaster';

describe('Toaster', () => {
  afterEach(() => {
    act(() => toastStore.dismiss());
  });

  it('announces confirmations politely', () => {
    renderUi(<Toaster />);
    act(() => showToast('Mango added to your quote'));
    expect(screen.getByRole('status')).toHaveTextContent('Mango added to your quote');
    expect(screen.getByRole('alert')).toBeEmptyDOMElement();
  });

  it('announces errors straight away, with the list of what to fix, and can be dismissed', async () => {
    const { user } = renderUi(<Toaster />);
    act(() => showErrorToast('Please fix these 2 things before sending:', ['Enter your name', 'Enter your country']));
    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('Please fix these 2 things before sending:');
    expect(screen.getAllByRole('listitem').map((li) => li.textContent)).toEqual(['Enter your name', 'Enter your country']);
    await user.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(alert).toBeEmptyDOMElement();
  });
});
