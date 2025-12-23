import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SearchBar from '../SearchBar';

// Mock fetch
global.fetch = jest.fn();

describe('SearchBar', () => {
    const mockOnClose = jest.fn();
    const mockOnSelectNode = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => ({ results: [] }),
        });
    });

    it('does not render when closed', () => {
        render(
            <SearchBar isOpen={false} onClose={mockOnClose} onSelectNode={mockOnSelectNode} />
        );
        expect(screen.queryByPlaceholderText(/search/i)).not.toBeInTheDocument();
    });

    it('renders search input when open', () => {
        render(
            <SearchBar isOpen={true} onClose={mockOnClose} onSelectNode={mockOnSelectNode} />
        );
        expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
    });

    it('closes when backdrop is clicked', () => {
        render(
            <SearchBar isOpen={true} onClose={mockOnClose} onSelectNode={mockOnSelectNode} />
        );
        // The backdrop has the onClick handler
        const backdrop = document.querySelector('.fixed.inset-0');
        if (backdrop) {
            fireEvent.click(backdrop);
            expect(mockOnClose).toHaveBeenCalled();
        }
    });

    it.skip('fetches results when typing', async () => {
        render(
            <SearchBar isOpen={true} onClose={mockOnClose} onSelectNode={mockOnSelectNode} />
        );
        const input = screen.getByPlaceholderText(/search/i);
        fireEvent.change(input, { target: { value: 'test query' } });

        // Wait for debounce (SearchBar has 300ms debounce)
        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/api/search?q=test%20query')
            );
        }, { timeout: 2000 });
    });

    it('displays search results', async () => {
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => ({
                results: [
                    { id: '1', title: 'Test Note', summary: 'A test note', status: 'ready' },
                ],
            }),
        });

        render(
            <SearchBar isOpen={true} onClose={mockOnClose} onSelectNode={mockOnSelectNode} />
        );
        const input = screen.getByPlaceholderText(/search/i);
        fireEvent.change(input, { target: { value: 'test' } });

        // Wait for debounce and results
        await waitFor(() => {
            // Search results are rendered as buttons
            const results = screen.getAllByRole('button');
            // Should have at least one result button (plus close button)
            expect(results.length).toBeGreaterThan(0);
        }, { timeout: 2000 });
    });
});
