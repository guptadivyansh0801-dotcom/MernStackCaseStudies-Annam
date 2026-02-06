import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// ============================================================
// SECTION 5: STEP-BY-STEP DATA MODELING & CODE WALKTHROUGH
// ============================================================

// ------------------------------------------------------------
// A. Article Approval Workflow
// ------------------------------------------------------------

// Simple useApproval hook
function useApproval() {
    const [approved, setApproved] = React.useState(false);
    const approve = () => setApproved(true);
    return { approved, approve };
}

// ArticleCard Component
interface ArticleCardProps {
    title: string;
    author: string;
    onApprove: () => void;
}

function ArticleCard({ title, author, onApprove }: ArticleCardProps) {
    return (
        <div>
            <h2>{title}</h2>
            <p>By: {author}</p>
            <button onClick={onApprove}>Approve</button>
        </div>
    );
}

// ArticleApproval Component
interface Article {
    title: string;
    author: string;
}

export function ArticleApproval({ article }: { article: Article }) {
    const { approved, approve } = useApproval();
    return (
        <div>
            <ArticleCard
                title={article.title}
                author={article.author}
                onApprove={approve}
            />
            {approved && <span>Approved!</span>}
        </div>
    );
}

// Test for ArticleApproval
test('shows Approved! after clicking approve', () => {
    render(<ArticleApproval article={{ title: 'Test Article', author: 'Test Author' }} />);
    fireEvent.click(screen.getByText('Approve'));
    expect(screen.getByText('Approved!')).toBeInTheDocument();
});

// ------------------------------------------------------------
// B. Linting and Formatting Example
// ------------------------------------------------------------
// Run npx eslint . and npx prettier --check . before every commit.
// Fix errors and warnings before pushing code.

// ------------------------------------------------------------
// C. Debugging Example
// ------------------------------------------------------------
// Set a breakpoint in useApproval or ArticleApproval in VSCode.
// Use React DevTools to inspect the approved state as you interact with the UI.


// ============================================================
// SECTION 6: INTERACTIVE CHALLENGE / MINI-PROJECT
// ============================================================

// ------------------------------------------------------------
// Challenge 1: Write a test for a CommentBox component that:
// - Renders an input and a "Post" button
// - Calls a provided onPost callback with the input value when clicked
// - Clears the input after posting
// ------------------------------------------------------------
interface CommentBoxProps {
    onPost: (comment: string) => void;
}

function CommentBox({ onPost }: CommentBoxProps) {
    const [value, setValue] = React.useState('');

    const handlePost = () => {
        if (value.trim()) {
            onPost(value);
            setValue(''); // Clear the input after posting
        }
    };

    return (
        <div>
            <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Write a comment..."
            />
            <button onClick={handlePost}>Post</button>
        </div>
    );
}

// Test for CommentBox
test('CommentBox calls onPost and clears input', () => {
    const mockOnPost = jest.fn();
    render(<CommentBox onPost={mockOnPost} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Hello World' } });
    fireEvent.click(screen.getByText('Post'));

    expect(mockOnPost).toHaveBeenCalledWith('Hello World');
    expect(input).toHaveValue('');
});

// ------------------------------------------------------------
// Challenge 2: Add a lint rule that forbids console.log 
// statements in production code
// ------------------------------------------------------------
// In .eslintrc.js:
// rules: {
//   'no-console': ['error', { allow: ['warn', 'error'] }]
// }

// ------------------------------------------------------------
// Challenge 3: Debug a failing test
// ------------------------------------------------------------
// If the test expects "Approved!" to appear but it doesn't, check:
// 1. Is the button click actually triggering the approve function?
// 2. Is the approved state being set to true?
// 3. Is the conditional rendering {approved && ...} working correctly?
// 4. Use console.log or debugger to trace the flow

// Export all components and hooks
export { ArticleCard, CommentBox, useApproval };
