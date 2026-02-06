import React, { useMemo, useCallback, useState } from 'react';

// ============================================================
// SECTION 5: STEP-BY-STEP DATA MODELING & CODE WALKTHROUGH
// ============================================================

// ------------------------------------------------------------
// A. Memoizing Expensive Chart Data
// ------------------------------------------------------------
interface DataItem {
    id: string;
    value: number;
}

function computeAnalytics(data: DataItem[]): number {
    // Simulate heavy computation
    console.log('Computing analytics...');
    return data.reduce((acc, item) => acc + item.value, 0);
}

interface AnalyticsChartProps {
    data: DataItem[];
}

const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ data }) => {
    // useMemo ensures computeAnalytics only runs when data changes
    const analytics = useMemo(() => computeAnalytics(data), [data]);
    return <div>Analytics Value: {analytics}</div>;
};

// ------------------------------------------------------------
// B. Memoizing Event Handlers with useCallback
// ------------------------------------------------------------
interface Comment {
    id: string;
    text: string;
}

interface FilterInputProps {
    onFilter: (value: string) => void;
}

const FilterInput = React.memo(({ onFilter }: FilterInputProps) => {
    console.log('FilterInput rendered');
    return (
        <input
            onChange={(e) => onFilter(e.target.value)}
            placeholder="Filter comments..."
        />
    );
});

interface CommentsPanelProps {
    comments: Comment[];
}

const CommentsPanel: React.FC<CommentsPanelProps> = ({ comments }) => {
    const [filter, setFilter] = useState('');

    const filtered = useMemo(
        () => comments.filter((c) => c.text.includes(filter)),
        [comments, filter]
    );

    // Memoize setFilter to avoid unnecessary re-renders of FilterInput
    const handleFilter = useCallback(setFilter, []);

    return (
        <div>
            <FilterInput onFilter={handleFilter} />
            <ul>
                {filtered.map((c) => (
                    <li key={c.id}>{c.text}</li>
                ))}
            </ul>
        </div>
    );
};

// ------------------------------------------------------------
// C. Memoizing Components with React.memo
// ------------------------------------------------------------
interface Overlay {
    id: string;
    label: string;
}

interface VideoOverlayProps {
    overlays: Overlay[];
}

const VideoOverlay = React.memo(({ overlays }: VideoOverlayProps) => {
    console.log('VideoOverlay rendered');
    return (
        <div>
            {overlays.map((o) => (
                <span key={o.id}>{o.label}</span>
            ))}
        </div>
    );
});


// ============================================================
// SECTION 6: INTERACTIVE CHALLENGE / MINI-PROJECT
// ============================================================

// ------------------------------------------------------------
// Challenge 1: Create a TagList component that:
// - Receives a list of tags and a filter string
// - Uses useMemo to compute the filtered list
// - Is wrapped in React.memo to avoid unnecessary re-renders
// ------------------------------------------------------------
interface Tag {
    id: string;
    name: string;
}

interface TagListProps {
    tags: Tag[];
    filter: string;
}

const TagList = React.memo(({ tags, filter }: TagListProps) => {
    console.log('TagList rendered');

    // Use useMemo to compute the filtered list
    const filteredTags = useMemo(() => {
        console.log('Filtering tags...');
        return tags.filter((tag) =>
            tag.name.toLowerCase().includes(filter.toLowerCase())
        );
    }, [tags, filter]);

    return (
        <ul>
            {filteredTags.map((tag) => (
                <li key={tag.id}>{tag.name}</li>
            ))}
        </ul>
    );
});

// ------------------------------------------------------------
// Challenge 2: Create a TagInput component that:
// - Accepts a memoized onAddTag callback via useCallback
// - Only re-renders when the callback or input value changes
// ------------------------------------------------------------
interface TagInputProps {
    onAddTag: (tagName: string) => void;
}

const TagInput = React.memo(({ onAddTag }: TagInputProps) => {
    const [value, setValue] = useState('');
    console.log('TagInput rendered');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (value.trim()) {
            onAddTag(value.trim());
            setValue('');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Add a tag..."
            />
            <button type="submit">Add</button>
        </form>
    );
});

// ------------------------------------------------------------
// Challenge 3: Show how changing unrelated state in the parent 
// does NOT re-render the memoized TagList or TagInput
// ------------------------------------------------------------
function TagManager() {
    const [tags, setTags] = useState<Tag[]>([
        { id: '1', name: 'React' },
        { id: '2', name: 'TypeScript' },
        { id: '3', name: 'JavaScript' },
    ]);
    const [filter, setFilter] = useState('');
    const [unrelatedCounter, setUnrelatedCounter] = useState(0);

    // Memoized callback - TagInput won't re-render when unrelatedCounter changes
    const handleAddTag = useCallback((tagName: string) => {
        setTags((prev) => [...prev, { id: Date.now().toString(), name: tagName }]);
    }, []);

    return (
        <div>
            <h2>Tag Manager</h2>

            {/* This button changes unrelated state */}
            <button onClick={() => setUnrelatedCounter((c) => c + 1)}>
                Unrelated Counter: {unrelatedCounter}
            </button>
            <p>
                <em>
                    Clicking this button does NOT re-render TagList or TagInput
                    (check console logs)
                </em>
            </p>

            <hr />

            <input
                type="text"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Filter tags..."
            />

            {/* Memoized components - won't re-render on unrelated state changes */}
            <TagList tags={tags} filter={filter} />
            <TagInput onAddTag={handleAddTag} />
        </div>
    );
}

// Export all components
export {
    AnalyticsChart,
    CommentsPanel,
    FilterInput,
    VideoOverlay,
    TagList,
    TagInput,
    TagManager
};
