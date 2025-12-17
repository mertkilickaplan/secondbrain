import { render, screen, fireEvent } from '@testing-library/react';
import ThemeToggle from '../ThemeToggle';

// Mock the ThemeContext
const mockToggleTheme = jest.fn();
jest.mock('@/contexts/ThemeContext', () => ({
    useTheme: () => ({
        theme: 'dark',
        toggleTheme: mockToggleTheme,
    }),
}));

describe('ThemeToggle', () => {
    beforeEach(() => {
        mockToggleTheme.mockClear();
    });

    it('renders the toggle button', () => {
        render(<ThemeToggle />);
        const button = screen.getByRole('button', { name: /switch to/i });
        expect(button).toBeInTheDocument();
    });

    it('calls toggleTheme when clicked', () => {
        render(<ThemeToggle />);
        const button = screen.getByRole('button');
        fireEvent.click(button);
        expect(mockToggleTheme).toHaveBeenCalledTimes(1);
    });

    it('displays sun icon in dark mode', () => {
        render(<ThemeToggle />);
        // Sun icon should be visible in dark mode (to switch to light)
        const svg = document.querySelector('svg');
        expect(svg).toBeInTheDocument();
    });
});
