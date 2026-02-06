// Code Walkthrough - Check eligibility
function checkEligibility(attendance: number): boolean {
    if (attendance >= 75) {
        console.log("Eligible: attendance is sufficient.");
        return true;
    } else {
        console.log("Not eligible: attendance below 75%.");
        return false;
    }
}

// Code Walkthrough - Pass/Fail
function passOrFail(score: number): boolean {
    if (score >= 40) {
        console.log("Result: Pass");
        return true;
    } else {
        console.log("Result: Fail");
        return false;
    }
}

// Code Walkthrough - Assign letter grade
function assignGrade(score: number): string {
    if (score >= 90) {
        return "A";
    } else if (score >= 80) {
        return "B";
    } else if (score >= 70) {
        return "C";
    } else if (score >= 60) {
        return "D";
    } else {
        return "F";
    }
}

// Code Walkthrough - Provide feedback via switch
function provideFeedback(grade: string): void {
    switch (grade) {
        case "A":
            console.log("Feedback: Excellent performance!");
            break;
        case "B":
            console.log("Feedback: Great job! Keep it up.");
            break;
        case "C":
            console.log("Feedback: Good effort; aim higher next time.");
            break;
        case "D":
            console.log("Feedback: Needs improvement; review your work.");
            break;
        default:
            console.log("Feedback: Unsatisfactory; please seek help.");
            break;
    }
}

// Code Walkthrough - Main evaluator
function evaluateStudent(attendance: number, score: number): void {
    if (!checkEligibility(attendance)) return;
    if (!passOrFail(score)) return;
    const grade = assignGrade(score);
    console.log(`Assigned Grade: ${grade}`);
    provideFeedback(grade);
}

evaluateStudent(80, 85);

// Challenge 1: checkSign
function checkSign(num: number): void {
    if (num > 0) {
        console.log("Positive");
    }
}

// Challenge 2: evenOrOdd
function evenOrOdd(num: number): void {
    if (num % 2 === 0) {
        console.log("Even");
    } else {
        console.log("Odd");
    }
}

// Challenge 3: getGrade
function getGrade(score: number): string {
    if (score >= 90) return "A";
    else if (score >= 80) return "B";
    else if (score >= 70) return "C";
    else if (score >= 60) return "D";
    else return "F";
}

checkSign(5);
evenOrOdd(7);
console.log(getGrade(75));
