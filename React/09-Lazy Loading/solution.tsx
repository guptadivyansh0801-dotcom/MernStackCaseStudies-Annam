import React, { Suspense, lazy, useState, Component, ErrorInfo, ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// ============================================================
// SECTION 5: STEP-BY-STEP DATA MODELING & CODE WALKTHROUGH
// ============================================================

// ------------------------------------------------------------
// A. Lazy Loading a Feature Component
// ------------------------------------------------------------

// In a real app, Quiz would be in a separate file:
// const Quiz = React.lazy(() => import('./Quiz'));

// For demonstration, we'll create a mock Quiz component
const QuizComponent: React.FC = () => (
    <div>
        <h3>Quiz Time!</h3>
        <p>This component was lazy loaded.</p>
    </div>
);

// Simulate lazy loading with a delay
const Quiz = lazy(() =>
    new Promise<{ default: React.ComponentType }>((resolve) =>
        setTimeout(() => resolve({ default: QuizComponent }), 1000)
    )
);

function CoursePage() {
    const [showQuiz, setShowQuiz] = useState(false);

    return (
        <div>
            <h2>Course Content</h2>
            <p>Welcome to the course! Click below to take the quiz.</p>
            <button onClick={() => setShowQuiz(true)}>Take Quiz</button>

            {/* The Quiz code is only loaded when the user clicks "Take Quiz" */}
            {showQuiz && (
                <Suspense fallback={<div>Loading quiz...</div>}>
                    <Quiz />
                </Suspense>
            )}
        </div>
    );
}

// ------------------------------------------------------------
// B. Route-Based Code Splitting Example
// ------------------------------------------------------------

// In a real app, these would be in separate files:
// const VideoLecture = lazy(() => import('./VideoLecture'));
// const Forum = lazy(() => import('./Forum'));

// Mock components for demonstration
const VideoLectureComponent: React.FC = () => <div><h2>Video Lecture</h2><p>Watch the video here.</p></div>;
const ForumComponent: React.FC = () => <div><h2>Discussion Forum</h2><p>Join the discussion.</p></div>;

const VideoLecture = lazy(() =>
    new Promise<{ default: React.ComponentType }>((resolve) =>
        setTimeout(() => resolve({ default: VideoLectureComponent }), 500)
    )
);

const Forum = lazy(() =>
    new Promise<{ default: React.ComponentType }>((resolve) =>
        setTimeout(() => resolve({ default: ForumComponent }), 500)
    )
);

function EduStreamApp() {
    return (
        <Router>
            <nav>
                <Link to="/lecture/1">Video Lecture</Link> | <Link to="/forum">Forum</Link>
            </nav>
            {/* Each page loads its own bundle, reducing initial load time */}
            <Suspense fallback={<div>Loading page...</div>}>
                <Routes>
                    <Route path="/lecture/:id" element={<VideoLecture />} />
                    <Route path="/forum" element={<Forum />} />
                </Routes>
            </Suspense>
        </Router>
    );
}

// ------------------------------------------------------------
// C. Dynamic Import for Conditional Loading
// ------------------------------------------------------------
// Useful for loading third-party libraries, modals, or admin tools only when needed

function loadHelpWidget() {
    // In a real app:
    // import('./HelpWidget').then(({ default: HelpWidget }) => {
    //     // Render or use HelpWidget as needed
    // });
    console.log('Help widget would be dynamically loaded here');
}


// ============================================================
// SECTION 6: INTERACTIVE CHALLENGE / MINI-PROJECT
// ============================================================

// ------------------------------------------------------------
// Challenge 1: Create a ProfileSettings component that is only 
// loaded when the user clicks a "Settings" button
// ------------------------------------------------------------
const ProfileSettingsComponent: React.FC = () => (
    <div>
        <h3>Profile Settings</h3>
        <p>Edit your profile settings here.</p>
        <form>
            <label>Display Name: <input type="text" defaultValue="User" /></label>
            <br />
            <label>Email: <input type="email" defaultValue="user@example.com" /></label>
            <br />
            <button type="submit">Save Settings</button>
        </form>
    </div>
);

// Challenge 2: Use React.lazy() and Suspense to load the component with a loading spinner
const ProfileSettings = lazy(() =>
    new Promise<{ default: React.ComponentType }>((resolve) =>
        setTimeout(() => resolve({ default: ProfileSettingsComponent }), 1500)
    )
);

// Loading spinner component
const LoadingSpinner: React.FC = () => (
    <div style={{ textAlign: 'center', padding: '20px' }}>
        <div style={{
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #3498db',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
        }} />
        <p>Loading settings...</p>
    </div>
);

function UserProfile() {
    const [showSettings, setShowSettings] = useState(false);

    return (
        <div>
            <h2>User Profile</h2>
            <button onClick={() => setShowSettings(true)}>Settings</button>

            {showSettings && (
                <Suspense fallback={<LoadingSpinner />}>
                    <ProfileSettings />
                </Suspense>
            )}
        </div>
    );
}

// ------------------------------------------------------------
// Challenge 3: Add a route /admin that lazy-loads an AdminPanel 
// component only when visited
// ------------------------------------------------------------
const AdminPanelComponent: React.FC = () => (
    <div>
        <h2>Admin Panel</h2>
        <p>Manage users, settings, and system configuration.</p>
        <ul>
            <li>User Management</li>
            <li>System Settings</li>
            <li>Analytics Dashboard</li>
        </ul>
    </div>
);

const AdminPanel = lazy(() =>
    new Promise<{ default: React.ComponentType }>((resolve) =>
        setTimeout(() => resolve({ default: AdminPanelComponent }), 1000)
    )
);

// ------------------------------------------------------------
// Challenge 4: Show how to handle loading errors with an error boundary
// ------------------------------------------------------------
interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Lazy loading error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback || (
                <div style={{ color: 'red', padding: '20px' }}>
                    <h3>Something went wrong!</h3>
                    <p>{this.state.error?.message}</p>
                    <button onClick={() => this.setState({ hasError: false, error: null })}>
                        Try Again
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

// Complete App with all routes and lazy loading
function LazyLoadingApp() {
    return (
        <Router>
            <nav>
                <Link to="/">Home</Link> |{' '}
                <Link to="/profile">Profile</Link> |{' '}
                <Link to="/admin">Admin</Link>
            </nav>

            <ErrorBoundary>
                <Suspense fallback={<div>Loading...</div>}>
                    <Routes>
                        <Route path="/" element={<CoursePage />} />
                        <Route path="/profile" element={<UserProfile />} />
                        <Route path="/admin" element={<AdminPanel />} />
                    </Routes>
                </Suspense>
            </ErrorBoundary>
        </Router>
    );
}

// Export all components
export {
    CoursePage,
    EduStreamApp,
    loadHelpWidget,
    ProfileSettings,
    UserProfile,
    AdminPanel,
    ErrorBoundary,
    LazyLoadingApp
};
