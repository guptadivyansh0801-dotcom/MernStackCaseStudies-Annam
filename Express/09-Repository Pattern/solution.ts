import express, { Request, Response } from "express";

// ============================================================
// SECTION 5: STEP-BY-STEP DATA MODELING & CODE WALKTHROUGH
// ============================================================

// ------------------------------------------------------------
// A. Define the Domain Model
// ------------------------------------------------------------
// models/Course.ts
export interface Course {
    id: string;
    name: string;
    capacity: number;
    students: string[];
}

// ------------------------------------------------------------
// B. Create the Repository Interface
// ------------------------------------------------------------
// repositories/interfaces/ICourseRepository.ts
export interface ICourseRepository {
    findAll(): Promise<Course[]>;
    findById(id: string): Promise<Course | null>;
    save(course: Course): Promise<void>;
    enrollStudent(courseId: string, studentId: string): Promise<void>;
    findByStudentId(studentId: string): Promise<Course[]>;
    delete(courseId: string): Promise<boolean>;
}

// ------------------------------------------------------------
// C. Implement an In-Memory Repository
// ------------------------------------------------------------
// repositories/InMemoryCourseRepository.ts
export class InMemoryCourseRepository implements ICourseRepository {
    private courses: Course[] = [];

    async findAll(): Promise<Course[]> {
        return this.courses;
    }

    async findById(id: string): Promise<Course | null> {
        return this.courses.find(course => course.id === id) || null;
    }

    async save(course: Course): Promise<void> {
        const idx = this.courses.findIndex(c => c.id === course.id);
        if (idx >= 0) {
            this.courses[idx] = course;
        } else {
            this.courses.push(course);
        }
    }

    async enrollStudent(courseId: string, studentId: string): Promise<void> {
        const course = await this.findById(courseId);
        if (course && !course.students.includes(studentId)) {
            course.students.push(studentId);
            await this.save(course);
        }
    }

    async findByStudentId(studentId: string): Promise<Course[]> {
        return this.courses.filter(course => course.students.includes(studentId));
    }

    async delete(courseId: string): Promise<boolean> {
        const idx = this.courses.findIndex(c => c.id === courseId);
        if (idx >= 0) {
            this.courses.splice(idx, 1);
            return true;
        }
        return false;
    }
}

// ------------------------------------------------------------
// D. Implement a Database Repository (Example Outline)
// ------------------------------------------------------------
// repositories/DatabaseCourseRepository.ts
export class DatabaseCourseRepository implements ICourseRepository {
    // Assume db is a connected database client
    constructor(private db: any) { }

    async findAll(): Promise<Course[]> {
        // Use real database queries here
        return this.db.query("SELECT * FROM courses");
    }

    async findById(id: string): Promise<Course | null> {
        const result = await this.db.query("SELECT * FROM courses WHERE id = ?", [id]);
        return result[0] || null;
    }

    async save(course: Course): Promise<void> {
        // Implement upsert logic
    }

    async enrollStudent(courseId: string, studentId: string): Promise<void> {
        // Implement enrollment in database
    }

    async findByStudentId(studentId: string): Promise<Course[]> {
        // Query courses by student
        return [];
    }

    async delete(courseId: string): Promise<boolean> {
        // Delete from database
        return false;
    }
}

// ------------------------------------------------------------
// E. Use the Repository in a Service
// ------------------------------------------------------------
// services/CourseService.ts
export class CourseService {
    constructor(private courseRepo: ICourseRepository) { }

    async enroll(courseId: string, studentId: string) {
        const course = await this.courseRepo.findById(courseId);
        if (!course) throw new Error("Course not found");
        if (course.students.length >= course.capacity) throw new Error("Course full");

        await this.courseRepo.enrollStudent(courseId, studentId);
        return { message: "Enrolled successfully" };
    }

    async getStudentCourses(studentId: string) {
        return this.courseRepo.findByStudentId(studentId);
    }

    async getAllCourses() {
        return this.courseRepo.findAll();
    }

    async deleteCourse(courseId: string) {
        const deleted = await this.courseRepo.delete(courseId);
        if (!deleted) throw new Error("Course not found");
        return { message: "Course deleted successfully" };
    }
}

// ------------------------------------------------------------
// F. Hook Up in Your App
// ------------------------------------------------------------
// app.ts
const app = express();
app.use(express.json());

const courseRepo = new InMemoryCourseRepository();
const courseService = new CourseService(courseRepo);

// Add sample courses
courseRepo.save({ id: "1", name: "Introduction to Programming", capacity: 30, students: [] });
courseRepo.save({ id: "2", name: "Data Structures", capacity: 25, students: ["student1"] });
courseRepo.save({ id: "3", name: "Web Development", capacity: 20, students: ["student1", "student2"] });

app.get("/courses", async (req, res) => {
    const courses = await courseService.getAllCourses();
    res.json(courses);
});

app.post("/courses/:id/enroll", async (req: Request, res: Response) => {
    try {
        const result = await courseService.enroll(req.params.id as string, req.body.studentId);
        res.json(result);
    } catch (e: any) {
        res.status(400).json({ error: e.message });
    }
});

app.get("/students/:id/courses", async (req: Request, res: Response) => {
    const courses = await courseService.getStudentCourses(req.params.id as string);
    res.json(courses);
});


// ============================================================
// SECTION 6: CHALLENGE
// ============================================================

// Challenge: Implement a delete(courseId: string) method in the repository
// (Already implemented above in InMemoryCourseRepository)

// Add a service and route to allow admins to delete a course
app.delete("/courses/:id", async (req: Request, res: Response) => {
    try {
        const result = await courseService.deleteCourse(req.params.id as string);
        res.json(result);
    } catch (e: any) {
        res.status(400).json({ error: e.message });
    }
});

app.listen(3004, () => console.log("Server running on port 3004"));
