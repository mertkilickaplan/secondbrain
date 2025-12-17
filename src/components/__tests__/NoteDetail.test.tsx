import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import NoteDetail from '../NoteDetail';

// Mock ToastContext
const mockAddToast = jest.fn();
jest.mock('@/contexts/ToastContext', () => ({
    useToast: () => ({ addToast: mockAddToast }),
}));

// Mock fetch
global.fetch = jest.fn();

const mockNode = {
    id: 'test-id',
    title: 'Test Note',
    content: 'Test content',
    type: 'text',
    status: 'ready',
    summary: 'Test summary',
    tags: '["tag1", "tag2"]',
    createdAt: new Date().toISOString(),
};

const mockEdges: any[] = [];
const mockAllNodes = [mockNode];
const mockOnClose = jest.fn();
const mockOnDataChange = jest.fn();

describe('NoteDetail', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (global.fetch as jest.Mock).mockResolvedValue({ ok: true, json: async () => ({}) });
    });

    it('renders note title and content', () => {
        render(
            <NoteDetail
                node={mockNode}
                edges={mockEdges}
                allNodes={mockAllNodes}
                onClose={mockOnClose}
            />
        );
        expect(screen.getByText('Test Note')).toBeInTheDocument();
        expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    it('displays tags', () => {
        render(
            <NoteDetail
                node={mockNode}
                edges={mockEdges}
                allNodes={mockAllNodes}
                onClose={mockOnClose}
            />
        );
        expect(screen.getByText('#tag1')).toBeInTheDocument();
        expect(screen.getByText('#tag2')).toBeInTheDocument();
    });

    it('calls onClose when close button clicked', () => {
        render(
            <NoteDetail
                node={mockNode}
                edges={mockEdges}
                allNodes={mockAllNodes}
                onClose={mockOnClose}
            />
        );
        fireEvent.click(screen.getByText('✕'));
        expect(mockOnClose).toHaveBeenCalled();
    });

    it('enters edit mode when Edit clicked', () => {
        render(
            <NoteDetail
                node={mockNode}
                edges={mockEdges}
                allNodes={mockAllNodes}
                onClose={mockOnClose}
            />
        );
        fireEvent.click(screen.getByText(/edit/i));
        expect(screen.getByPlaceholderText(/note title/i)).toBeInTheDocument();
    });

    it('shows delete confirmation dialog', () => {
        render(
            <NoteDetail
                node={mockNode}
                edges={mockEdges}
                allNodes={mockAllNodes}
                onClose={mockOnClose}
            />
        );
        fireEvent.click(screen.getByText(/delete/i));
        expect(screen.getByText('Delete Note?')).toBeInTheDocument();
    });

    it('deletes note when confirmed', async () => {
        render(
            <NoteDetail
                node={mockNode}
                edges={mockEdges}
                allNodes={mockAllNodes}
                onClose={mockOnClose}
                onDataChange={mockOnDataChange}
            />
        );
        // Click delete button to show confirmation
        fireEvent.click(screen.getByText(/🗑️ Delete/i));

        // Find and click the confirm delete button in the dialog
        const confirmButton = screen.getByRole('button', { name: /^delete$/i });
        fireEvent.click(confirmButton);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                `/api/notes/${mockNode.id}`,
                expect.objectContaining({ method: 'DELETE' })
            );
        });
    });
});
