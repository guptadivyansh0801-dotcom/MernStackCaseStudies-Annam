// Code Walkthrough - any type
let surveyAnswer: any;

surveyAnswer = "Yes";
surveyAnswer = 5;
surveyAnswer = ["Option A", "Option B"];

// Code Walkthrough - Store answers in array
let allAnswers: any[] = [];
allAnswers.push("No");
allAnswers.push(10);
allAnswers.push({ comment: "N/A" });

// Code Walkthrough - Process answers
for (let ans of allAnswers) {
    console.log("Received answer:", ans);
}

// Challenge 1: Create recordAnswer function
let recordedAnswers: { [questionId: string]: any } = {};

function recordAnswer(questionId: string, answer: any): void {
    recordedAnswers[questionId] = answer;
}

// Challenge 2: Add three answers
recordAnswer("Q1", "Yes, I agree");
recordAnswer("Q2", 42);
recordAnswer("Q3", ["Option A", "Option C"]);

// Challenge 3: Print all recorded answers
console.log("All recorded answers:", recordedAnswers);
