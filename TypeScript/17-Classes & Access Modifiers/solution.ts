// Code Walkthrough - Access Modifiers with Constructors
class Person {
    constructor(public name: string, private age: number) { }
    public getAge(): number { return this.age; }
}

const john = new Person('John', 30);
console.log(john.name);
console.log(john.getAge());

// Code Walkthrough - Abstract Class
abstract class Content {
    public readonly title: string;
    public readonly author: string;
    private published: boolean = false;

    constructor(title: string, author: string) {
        this.title = title;
        this.author = author;
    }

    public publish() { this.published = true; }
    protected isPublished(): boolean { return this.published; }
    abstract getType(): string;
}

// Code Walkthrough - Quiz Class
class Quiz extends Content {
    private questions: string[] = [];

    constructor(title: string, author: string, questions: string[] = []) {
        super(title, author);
        this.questions = questions;
    }

    public addQuestion(question: string, isInstructor: boolean) {
        if (!this.isPublished() && isInstructor) {
            this.questions.push(question);
        } else {
            throw new Error("Cannot add questions after publishing or if not an instructor.");
        }
    }

    public getQuestions(): string[] { return [...this.questions]; }
    getType(): string { return "Quiz"; }
}

// Code Walkthrough - Lesson Class
class Lesson extends Content {
    private content: string;

    constructor(title: string, author: string, content: string) {
        super(title, author);
        this.content = content;
    }

    public editContent(newContent: string, isInstructor: boolean) {
        if (!this.isPublished() && isInstructor) {
            this.content = newContent;
        } else {
            throw new Error("Cannot edit content after publishing or if not an instructor.");
        }
    }

    public getContent(): string { return this.content; }
    getType(): string { return "Lesson"; }
}

// Challenge: Assignment Class
class Assignment extends Content {
    private dueDate: Date;

    constructor(title: string, author: string, dueDate: Date) {
        super(title, author);
        this.dueDate = dueDate;
    }

    public setDueDate(newDate: Date, isInstructor: boolean) {
        if (!this.isPublished() && isInstructor) {
            this.dueDate = newDate;
        } else {
            throw new Error("Cannot update due date after publishing or if not an instructor.");
        }
    }

    public getDueDate(): Date { return this.dueDate; }
    getType(): string { return "Assignment"; }
}

// Test
const quiz = new Quiz("TypeScript Basics", "Divyansh Gupta");
quiz.addQuestion("What is TypeScript?", true);
console.log(quiz.getQuestions());

const assignment = new Assignment("Week 1 Assignment", "Divyansh Gupta", new Date());
console.log(assignment.getType());
