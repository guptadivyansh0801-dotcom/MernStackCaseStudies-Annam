// Code Walkthrough - Generic FeedbackBox class
class FeedbackBox<T> {
    private feedbacks: T[] = [];

    addFeedback(feedback: T) {
        this.feedbacks.push(feedback);
    }

    getAllFeedback(): T[] {
        return [...this.feedbacks];
    }
}

// Code Walkthrough - Using the Generic Class
const quizFeedback = new FeedbackBox<string>();
quizFeedback.addFeedback("Great quiz!");
quizFeedback.addFeedback("Too hard!");
console.log(quizFeedback.getAllFeedback());

type LessonFeedback = { rating: number; comment: string };
const lessonFeedback = new FeedbackBox<LessonFeedback>();
lessonFeedback.addFeedback({ rating: 5, comment: "Loved it!" });
console.log(lessonFeedback.getAllFeedback());

// Code Walkthrough - Generic Functions
function getFirstItem<T>(items: T[]): T | undefined {
    return items[0];
}

const firstQuizFeedback = getFirstItem(quizFeedback.getAllFeedback());
const firstLessonFeedback = getFirstItem(lessonFeedback.getAllFeedback());

console.log(firstQuizFeedback);
console.log(firstLessonFeedback);

// Challenge 1: FeedbackBox<T> - already implemented above

// Challenge 2: getFirstItem<T> - already implemented above
