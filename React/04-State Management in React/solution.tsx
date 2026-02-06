import React, { useState, useContext } from 'react';
import { create } from 'zustand';

// ============================================================
// SECTION 5: STEP-BY-STEP DATA MODELING & CODE WALKTHROUGH
// ============================================================

// ------------------------------------------------------------
// A. User Context Provider (Theme Example)
// ------------------------------------------------------------
interface ThemeContextType {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const toggleTheme = () => setTheme(t => (t === 'light' ? 'dark' : 'light'));

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
    return ctx;
};

// ------------------------------------------------------------
// B. Zustand Store for Tasks
// ------------------------------------------------------------
interface Task {
    id: string;
    title: string;
    completed: boolean;
}

interface TaskStore {
    tasks: Task[];
    addTask: (title: string) => void;
    toggleTask: (id: string) => void;
}

const useTaskStore = create<TaskStore>((set) => ({
    tasks: [],
    addTask: (title) =>
        set((state) => ({
            tasks: [...state.tasks, { id: Date.now().toString(), title, completed: false }],
        })),
    toggleTask: (id) =>
        set((state) => ({
            tasks: state.tasks.map((task) =>
                task.id === id ? { ...task, completed: !task.completed } : task
            ),
        })),
}));

// ------------------------------------------------------------
// C. Using Zustand Store in Components
// ------------------------------------------------------------
function TaskList() {
    const tasks = useTaskStore((state) => state.tasks);
    const toggleTask = useTaskStore((state) => state.toggleTask);

    return (
        <ul>
            {tasks.map((task) => (
                <li key={task.id}>
                    <label>
                        <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => toggleTask(task.id)}
                        />
                        {task.title}
                    </label>
                </li>
            ))}
        </ul>
    );
}

function TaskInput() {
    const [title, setTitle] = useState('');
    const addTask = useTaskStore((state) => state.addTask);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim()) {
            addTask(title.trim());
            setTitle('');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Add a task..."
            />
            <button type="submit">Add</button>
        </form>
    );
}


// ============================================================
// SECTION 6: INTERACTIVE CHALLENGE / MINI-PROJECT
// ============================================================

// ------------------------------------------------------------
// Challenge 1: Create a Zustand store for notifications
// - Each notification has id, message, type ('info' | 'error' | 'success'), and read: boolean
// - Add actions: addNotification, markAsRead, and clearNotifications
// ------------------------------------------------------------
interface Notification {
    id: string;
    message: string;
    type: 'info' | 'error' | 'success';
    read: boolean;
}

interface NotificationStore {
    notifications: Notification[];
    addNotification: (message: string, type: 'info' | 'error' | 'success') => void;
    markAsRead: (id: string) => void;
    clearNotifications: () => void;
}

const useNotificationStore = create<NotificationStore>((set) => ({
    notifications: [],
    addNotification: (message, type) =>
        set((state) => ({
            notifications: [
                ...state.notifications,
                { id: Date.now().toString(), message, type, read: false }
            ],
        })),
    markAsRead: (id) =>
        set((state) => ({
            notifications: state.notifications.map((n) =>
                n.id === id ? { ...n, read: true } : n
            ),
        })),
    clearNotifications: () => set({ notifications: [] }),
}));

// ------------------------------------------------------------
// Challenge 2: Use the store in a NotificationList component to 
// display unread notifications and mark them as read
// ------------------------------------------------------------
function NotificationList() {
    const notifications = useNotificationStore((state) => state.notifications);
    const markAsRead = useNotificationStore((state) => state.markAsRead);
    const clearNotifications = useNotificationStore((state) => state.clearNotifications);

    const unreadNotifications = notifications.filter((n) => !n.read);

    return (
        <div>
            <h3>Notifications ({unreadNotifications.length} unread)</h3>
            <ul>
                {unreadNotifications.map((n) => (
                    <li key={n.id} className={`notification-${n.type}`}>
                        <span>{n.message}</span>
                        <button onClick={() => markAsRead(n.id)}>Mark as Read</button>
                    </li>
                ))}
            </ul>
            <button onClick={clearNotifications}>Clear All</button>
        </div>
    );
}

// Export all components and hooks
export {
    ThemeContext,
    useTaskStore,
    TaskList,
    TaskInput,
    useNotificationStore,
    NotificationList
};
