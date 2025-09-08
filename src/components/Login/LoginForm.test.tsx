import { createEvent, fireEvent, screen } from '@testing-library/react';

import { renderWithProviders } from '../../test/renderWithProviders';
import LoginForm from './LoginForm';

describe('LoginForm', () => {
  test('renders username and password fields and submit button', () => {
    renderWithProviders(<LoginForm />);

    expect(
      screen.getByRole('textbox', { name: /username/i })
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/password/i, { selector: 'input' })
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/login/i, { selector: 'button' })
    ).toBeInTheDocument();
  });

  test('updates username and password values on change', () => {
    renderWithProviders(<LoginForm />);

    const usernameInput = screen.getByRole('textbox', { name: /username/i });
    const passwordInput = screen.getByLabelText(/^password/i, {
      selector: 'input',
    });

    fireEvent.change(usernameInput, { target: { value: 'alexis' } });
    fireEvent.change(passwordInput, { target: { value: 'secret' } });

    expect(usernameInput).toHaveValue('alexis');
    expect(passwordInput).toHaveValue('secret');
  });

  test('prevents default on submit', () => {
    renderWithProviders(<LoginForm />);

    const submitButton = screen.getByLabelText(/login/i, {
      selector: 'button',
    });
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
    renderWithProviders(<LoginForm />);
    expect(screen.getByRole('textbox', { name: /username/i })).toBeRequired();
    expect(
      screen.getByLabelText(/^password/i, { selector: 'input' })
    ).toBeRequired();
  });

  test('toggles password aria-label and input type upon clicking the visibility switch', () => {
    renderWithProviders(<LoginForm />);

    const input = screen.getByLabelText<HTMLInputElement>(/^password/i, {
      selector: 'input',
    });

    // The toggle button starts with "show password"
    const toggleBtn = screen.getByRole('button', {
      name: /show password/i,
    });

    // Initial state: hidden password
    expect(input.type).toBe('password');

    // Click -> should show the password and update aria-label to "hide password"
    fireEvent.click(toggleBtn);
    expect(input.type).toBe('text');
    expect(
      screen.getByRole('button', { name: /hide password/i })
    ).toBeInTheDocument();

    // Click again -> should hide the password and revert aria-label
    const toggleBtnAfter = screen.getByRole('button', {
      name: /hide password/i,
    });
    fireEvent.click(toggleBtnAfter);

    expect(input.type).toBe('password');
    expect(
      screen.getByRole('button', { name: /show password/i })
    ).toBeInTheDocument();
  });
});
