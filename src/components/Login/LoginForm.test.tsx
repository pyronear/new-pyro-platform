import { createEvent, fireEvent, render, screen } from '@testing-library/react';

import LoginForm from './LoginForm';

vi.mock('../../hooks/useTranslationPrefix', () => ({
  useTranslationPrefix: () => ({
    t: (key: string) => key,
  }),
}));

describe('LoginForm', () => {
  test('renders username and password fields and submit button', () => {
    render(<LoginForm />);

    expect(
      screen.getByRole('textbox', { name: /username/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /button/i })).toBeInTheDocument();
  });

  test('updates username and password values on change', () => {
    render(<LoginForm />);

    const usernameInput = screen.getByRole('textbox', { name: /username/i });
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(usernameInput, { target: { value: 'alexis' } });
    fireEvent.change(passwordInput, { target: { value: 'secret' } });

    expect(usernameInput).toHaveValue('alexis');
    expect(passwordInput).toHaveValue('secret');
  });

  test('prevents default on submit', () => {
    render(<LoginForm />);

    const submitButton = screen.getByRole('button', { name: /button/i });
    const form = submitButton.closest('form');

    expect(form).not.toBeNull();
    if (form === null) throw new Error('Form not found in DOM');

    const preventDefault = vi.fn();
    const submitEvent = createEvent.submit(form);
    submitEvent.preventDefault = preventDefault;

    fireEvent(form, submitEvent);
    expect(preventDefault).toHaveBeenCalled();
  });

  test('form fields are required', () => {
    render(<LoginForm />);
    expect(screen.getByRole('textbox', { name: /username/i })).toBeRequired();
    expect(screen.getByLabelText(/password/i)).toBeRequired();
  });
});
