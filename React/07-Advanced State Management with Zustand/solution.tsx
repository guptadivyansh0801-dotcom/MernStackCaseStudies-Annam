import React from 'react';
import { create } from 'zustand';
import { persist, createJSONStorage, devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// ============================================================
// SECTION 5: STEP-BY-STEP DATA MODELING & CODE WALKTHROUGH
// ============================================================

// ------------------------------------------------------------
// A. Persisted Preferences Store with Migration
// ------------------------------------------------------------
interface PreferencesState {
    theme: 'light' | 'dark';
    fontSize: number;
    setTheme: (theme: 'light' | 'dark') => void;
    setFontSize: (size: number) => void;
}

const usePreferencesStore = create<PreferencesState>()(
    persist(
        (set) => ({
            theme: 'light',
            fontSize: 14,
            setTheme: (theme) => set({ theme }),
            setFontSize: (size) => set({ fontSize: size }),
        }),
        {
            name: 'collabnotes-preferences',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ theme: state.theme, fontSize: state.fontSize }),
            version: 2,
            migrate: (persisted: any, version) => {
                if (version < 2) return { ...persisted, fontSize: 14 };
                return persisted;
            },
        }
    )
);

// ------------------------------------------------------------
// B. Notes Store with Devtools, Immer, and Logging
// ------------------------------------------------------------
interface Note {
    id: string;
    text: string;
}

interface NoteState {
    notes: Note[];
    addNote: (note: Note) => void;
    updateNote: (id: string, text: string) => void;
    deleteNote: (id: string) => void;
    setNotes: (notes: Note[]) => void;
}

// Custom logging middleware
const logMiddleware = (config: any) => (set: any, get: any, api: any) =>
    config(
        (args: any) => {
            console.log('Before:', get());
            set(args);
            console.log('After:', get());
        },
        get,
        api
    );

const useNoteStore = create<NoteState>()(
    devtools(
        immer(
            logMiddleware((set: any) => ({
                notes: [],
                addNote: (note: Note) =>
                    set((state: NoteState) => {
                        state.notes.push(note);
                    }),
                updateNote: (id: string, text: string) =>
                    set((state: NoteState) => {
                        const note = state.notes.find((n) => n.id === id);
                        if (note) note.text = text;
                    }),
                deleteNote: (id: string) =>
                    set((state: NoteState) => {
                        state.notes = state.notes.filter((n) => n.id !== id);
                    }),
                setNotes: (notes: Note[]) =>
                    set((state: NoteState) => {
                        state.notes = notes;
                    }),
            }))
        )
    )
);

// ------------------------------------------------------------
// C. Syncing Notes with React Query
// ------------------------------------------------------------
// Note: This requires @tanstack/react-query to be installed
// import { useQuery } from '@tanstack/react-query';

// Mock API function
async function fetchNotesFromAPI(): Promise<Note[]> {
    // Simulate API call
    return [
        { id: '1', text: 'Note 1' },
        { id: '2', text: 'Note 2' },
    ];
}

function NotesList() {
    const setNotes = useNoteStore((s) => s.setNotes);
    const notes = useNoteStore((s) => s.notes);

    // In a real app, you would use:
    // const { data, isLoading } = useQuery(['notes'], fetchNotesFromAPI, {
    //     onSuccess: setNotes,
    // });

    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        fetchNotesFromAPI().then((data) => {
            setNotes(data);
            setIsLoading(false);
        });
    }, [setNotes]);

    if (isLoading) return <div>Loading...</div>;

    return (
        <ul>
            {notes.map((n) => (
                <li key={n.id}>{n.text}</li>
            ))}
        </ul>
    );
}


// ============================================================
// SECTION 6: INTERACTIVE CHALLENGE / MINI-PROJECT
// ============================================================

// ------------------------------------------------------------
// Challenge 1: Create a persisted Zustand store for user session
// - Fields: userId: string, token: string, expiresAt: number
// - Only persist userId and token, not expiresAt
// - Add a migration to handle a new field, role (default 'user'), in version 2
// ------------------------------------------------------------
interface SessionState {
    userId: string;
    token: string;
    expiresAt: number;
    role: 'admin' | 'user';
    setSession: (userId: string, token: string, expiresAt: number) => void;
    setRole: (role: 'admin' | 'user') => void;
    clearSession: () => void;
}

const useSessionStore = create<SessionState>()(
    persist(
        (set) => ({
            userId: '',
            token: '',
            expiresAt: 0,
            role: 'user',
            setSession: (userId, token, expiresAt) => set({ userId, token, expiresAt }),
            setRole: (role) => set({ role }),
            clearSession: () => set({ userId: '', token: '', expiresAt: 0, role: 'user' }),
        }),
        {
            name: 'user-session',
            storage: createJSONStorage(() => localStorage),
            // Only persist userId and token, not expiresAt
            partialize: (state) => ({ userId: state.userId, token: state.token, role: state.role }),
            version: 2,
            migrate: (persisted: any, version) => {
                // Add role field with default 'user' in version 2
                if (version < 2) {
                    return { ...persisted, role: 'user' };
                }
                return persisted;
            },
        }
    )
);

// ------------------------------------------------------------
// Challenge 2: Use devtools and immer middleware for a note history log
// - Actions: addHistoryEntry, clearHistory
// - Log each entry as { noteId: string, action: string, timestamp: number }
// ------------------------------------------------------------
interface HistoryEntry {
    noteId: string;
    action: string;
    timestamp: number;
}

interface HistoryState {
    history: HistoryEntry[];
    addHistoryEntry: (noteId: string, action: string) => void;
    clearHistory: () => void;
}

const useHistoryStore = create<HistoryState>()(
    devtools(
        immer((set) => ({
            history: [],
            addHistoryEntry: (noteId: string, action: string) =>
                set((state) => {
                    state.history.push({
                        noteId,
                        action,
                        timestamp: Date.now(),
                    });
                }),
            clearHistory: () =>
                set((state) => {
                    state.history = [];
                }),
        }))
    )
);

// ------------------------------------------------------------
// Challenge 3: Combine Zustand and React Query
// - Fetch a list of collaborators from an API
// - Store collaborators in Zustand
// - Display collaborators in a component
// ------------------------------------------------------------
interface Collaborator {
    id: string;
    name: string;
    email: string;
}

interface CollaboratorState {
    collaborators: Collaborator[];
    setCollaborators: (collaborators: Collaborator[]) => void;
}

const useCollaboratorStore = create<CollaboratorState>((set) => ({
    collaborators: [],
    setCollaborators: (collaborators) => set({ collaborators }),
}));

// Mock API function
async function fetchCollaboratorsFromAPI(): Promise<Collaborator[]> {
    // Simulate API call
    return [
        { id: '1', name: 'Alice', email: 'alice@example.com' },
        { id: '2', name: 'Bob', email: 'bob@example.com' },
    ];
}

function CollaboratorsList() {
    const setCollaborators = useCollaboratorStore((s) => s.setCollaborators);
    const collaborators = useCollaboratorStore((s) => s.collaborators);
    const [isLoading, setIsLoading] = React.useState(true);

    // In a real app with React Query:
    // const { data, isLoading } = useQuery(['collaborators'], fetchCollaboratorsFromAPI, {
    //     onSuccess: setCollaborators,
    // });

    React.useEffect(() => {
        fetchCollaboratorsFromAPI().then((data) => {
            setCollaborators(data);
            setIsLoading(false);
        });
    }, [setCollaborators]);

    if (isLoading) return <div>Loading collaborators...</div>;

    return (
        <ul>
            {collaborators.map((c) => (
                <li key={c.id}>
                    {c.name} ({c.email})
                </li>
            ))}
        </ul>
    );
}

// Export all stores and components
export {
    usePreferencesStore,
    useNoteStore,
    NotesList,
    useSessionStore,
    useHistoryStore,
    useCollaboratorStore,
    CollaboratorsList
};
