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

    it('fetches results when typing', async () => {
        render(
            <SearchBar isOpen={true} onClose={mockOnClose} onSelectNode={mockOnSelectNode} />
        );
        const input = screen.getByPlaceholderText(/search/i);
        fireEvent.change(input, { target: { value: 'test query' } });

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/api/search?q=test%20query')
            );
        }, { timeout: 1000 });
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

        await waitFor(() => {
            expect(screen.getByText('Test Note')).toBeInTheDocument();
        });
    });
});
