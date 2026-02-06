import React from 'react';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// ============================================================
// SECTION 5: STEP-BY-STEP DATA MODELING & CODE WALKTHROUGH
// ============================================================

// ------------------------------------------------------------
// A. Create Feature Slices
// ------------------------------------------------------------

// Comment Slice
export interface Comment {
    id: string;
    fileId: string;
    author: string;
    text: string;
}

export interface CommentSlice {
    comments: Comment[];
    addComment: (comment: Comment) => void;
    getCommentsByFile: (fileId: string) => Comment[];
}

export const createCommentSlice = (set: any, get: any): CommentSlice => ({
    comments: [],
    addComment: (comment) =>
        set((state: any) => ({ comments: [...state.comments, comment] })),
    getCommentsByFile: (fileId) =>
        get().comments.filter((c: Comment) => c.fileId === fileId),
});

// User Slice (referenced in example)
export interface User {
    id: string;
    name: string;
    role: 'admin' | 'editor' | 'viewer';
}

export interface UserSlice {
    currentUser: User | null;
    setUser: (user: User) => void;
    logout: () => void;
}

export const createUserSlice = (set: any): UserSlice => ({
    currentUser: null,
    setUser: (user) => set({ currentUser: user }),
    logout: () => set({ currentUser: null }),
});

// File Slice (referenced in example)
export interface DesignFile {
    id: string;
    name: string;
    content: string;
}

export interface FileSlice {
    files: DesignFile[];
    addFile: (file: DesignFile) => void;
    removeFile: (id: string) => void;
}

export const createFileSlice = (set: any): FileSlice => ({
    files: [],
    addFile: (file) =>
        set((state: any) => ({ files: [...state.files, file] })),
    removeFile: (id) =>
        set((state: any) => ({ files: state.files.filter((f: DesignFile) => f.id !== id) })),
});

// ------------------------------------------------------------
// B. Combine All Slices in the Store
// ------------------------------------------------------------
type DesignHubStore = UserSlice & FileSlice & CommentSlice & NotificationSlice;

export const useDesignHubStore = create<DesignHubStore>()(
    devtools(
        persist(
            (set, get) => ({
                ...createUserSlice(set),
                ...createFileSlice(set),
                ...createCommentSlice(set, get),
                ...createNotificationSlice(set),
            }),
            { name: 'designhub-store' }
        )
    )
);

// ------------------------------------------------------------
// C. Using Slices in the App
// ------------------------------------------------------------
function CommentsPanel({ fileId }: { fileId: string }) {
    const comments = useDesignHubStore((s) => s.getCommentsByFile(fileId));
    const addComment = useDesignHubStore((s) => s.addComment);

    return (
        <div>
            <h3>Comments</h3>
            <ul>
                {comments.map((c) => (
                    <li key={c.id}>
                        <strong>{c.author}:</strong> {c.text}
                    </li>
                ))}
            </ul>
            <button
                onClick={() =>
                    addComment({
                        id: Date.now().toString(),
                        fileId,
                        author: 'Alex',
                        text: 'Hello!',
                    })
                }
            >
                Add Comment
            </button>
        </div>
    );
}


// ============================================================
// SECTION 6: INTERACTIVE CHALLENGE / MINI-PROJECT
// ============================================================

// ------------------------------------------------------------
// Challenge 1: Create a notificationsSlice
// - Fields: notifications: { id: string; message: string; read: boolean }[]
// - Actions: addNotification, markAsRead, clearNotifications
// ------------------------------------------------------------
export interface Notification {
    id: string;
    message: string;
    read: boolean;
}

export interface NotificationSlice {
    notifications: Notification[];
    addNotification: (message: string) => void;
    markAsRead: (id: string) => void;
    clearNotifications: () => void;
}

export const createNotificationSlice = (set: any): NotificationSlice => ({
    notifications: [],
    addNotification: (message) =>
        set((state: any) => ({
            notifications: [
                ...state.notifications,
                { id: Date.now().toString(), message, read: false }
            ],
        })),
    markAsRead: (id) =>
        set((state: any) => ({
            notifications: state.notifications.map((n: Notification) =>
                n.id === id ? { ...n, read: true } : n
            ),
        })),
    clearNotifications: () => set({ notifications: [] }),
});

// ------------------------------------------------------------
// Challenge 2: Add the slice to the main store
// (Already done above in useDesignHubStore)
// ------------------------------------------------------------

// ------------------------------------------------------------
// Challenge 3: Build a NotificationsPanel component that 
// displays unread notifications and lets users mark them as read
// ------------------------------------------------------------
function NotificationsPanel() {
    const notifications = useDesignHubStore((s) => s.notifications);
    const markAsRead = useDesignHubStore((s) => s.markAsRead);
    const clearNotifications = useDesignHubStore((s) => s.clearNotifications);
    const addNotification = useDesignHubStore((s) => s.addNotification);

    const unread = notifications.filter((n: Notification) => !n.read);

    return (
        <div>
            <h3>Notifications ({unread.length} unread)</h3>
            <ul>
                {unread.map((n: Notification) => (
                    <li key={n.id}>
                        {n.message}
                        <button onClick={() => markAsRead(n.id)}>Mark as Read</button>
                    </li>
                ))}
            </ul>
            <button onClick={clearNotifications}>Clear All</button>
            <button onClick={() => addNotification('New notification!')}>
                Add Test Notification
            </button>
        </div>
    );
}

// Export all components and slices
export {
    CommentsPanel,
    NotificationsPanel
};
