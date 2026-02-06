// Code Walkthrough - Types for EduFlow
type Learner = { id: string; quizzesCompleted: number };
type Instructor = { id: string; coursesTaught: number };
type Admin = { id: string; accessLevel: string };

type AnyUser = Learner | Instructor | Admin;

// Code Walkthrough - Union Types
function printUserInfo(user: AnyUser) {
    if ("quizzesCompleted" in user) {
        console.log(`Learner: ${user.quizzesCompleted} quizzes completed`);
    } else if ("coursesTaught" in user) {
        console.log(`Instructor: ${user.coursesTaught} courses taught`);
    } else {
        console.log(`Admin: Access - ${user.accessLevel}`);
    }
}

// Code Walkthrough - Intersection Types
type MultiRoleUser = Learner & Instructor;
const alice: MultiRoleUser = {
    id: "alice123",
    quizzesCompleted: 10,
    coursesTaught: 2
};

// Code Walkthrough - Mapped Types
type ModuleStatus = "not-started" | "in-progress" | "completed";
type ProgressMap<Modules extends string> = {
    [K in Modules]: ModuleStatus;
};

type MyModules = "quiz1" | "video2" | "assignment3";
type MyProgress = ProgressMap<MyModules>;

// Code Walkthrough - Utility Types
type LearnerReport = { name: string; score: number; feedback: string; };
type DraftReport = Partial<LearnerReport>;
type ReadonlyReport = Readonly<LearnerReport>;

// Challenge 1: InstructorOrAdmin
type InstructorOrAdmin = Instructor | Admin;

// Challenge 2: ReadonlyAssignment
type Assignment = { title: string; dueDate: Date; points: number; };
type ReadonlyAssignment = Readonly<Assignment>;

// Challenge 3: StatsAsStrings
type LearnerStats = { quizzes: number; videos: number; assignments: number; };
type StatsAsStrings = { [K in keyof LearnerStats]: string };

// Test
const stats: StatsAsStrings = { quizzes: "10", videos: "5", assignments: "3" };
console.log(stats);
