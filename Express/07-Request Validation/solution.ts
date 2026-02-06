import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";

// ============================================================
// SECTION 5: STEP-BY-STEP DATA MODELING & CODE WALKTHROUGH
// ============================================================

const app = express();
app.use(express.json());

// ------------------------------------------------------------
// A. Designing the Application Data Structure
// ------------------------------------------------------------
interface Application {
    name: string;
    email: string;
    birthdate: string;
    grades: number[];
    essay: string;
    recommendationLetter: string; // URL to a file
}

// ------------------------------------------------------------
// B. Setting Up Validation Rules
// ------------------------------------------------------------
const applicationValidation = [
    body("name")
        .isString()
        .notEmpty()
        .withMessage("Name is required"),
    body("email")
        .isEmail()
        .withMessage("Valid email is required"),
    body("birthdate")
        .isISO8601()
        .withMessage("Birthdate must be a valid date (YYYY-MM-DD)"),
    body("grades")
        .isArray({ min: 1 })
        .withMessage("At least one grade is required"),
    body("grades.*")
        .isNumeric()
        .withMessage("All grades must be numbers"),
    body("essay")
        .isLength({ min: 100 })
        .withMessage("Essay must be at least 100 characters"),
    body("recommendationLetter")
        .isURL()
        .withMessage("A valid recommendation letter link is required"),
];

// ------------------------------------------------------------
// C. Implementing the Route Handler
// ------------------------------------------------------------
app.post("/apply", applicationValidation, (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Return all validation errors
        return res.status(400).json({ errors: errors.array() });
    }
    // If we reach here, the application is valid!
    res.json({ status: "Application received!" });
});


// ============================================================
// SECTION 6: INTERACTIVE CHALLENGE / MINI-PROJECT
// ============================================================

// ------------------------------------------------------------
// Challenge: Add a validation rule for "portfolioLink" field
// - Required for art applicants
// - Must be a valid URL
// ------------------------------------------------------------
const artApplicationValidation = [
    ...applicationValidation,
    body("portfolioLink")
        .isURL()
        .withMessage("A valid portfolio link is required for art applicants"),
];

app.post("/apply/art", artApplicationValidation, (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    res.json({ status: "Art application received!" });
});

// Additional validation examples for different application types
const scholarshipValidation = [
    ...applicationValidation,
    body("financialNeedStatement")
        .isLength({ min: 50 })
        .withMessage("Financial need statement must be at least 50 characters"),
    body("householdIncome")
        .isNumeric()
        .withMessage("Household income must be a number"),
];

app.post("/apply/scholarship", scholarshipValidation, (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    res.json({ status: "Scholarship application received!" });
});

// Start server
app.listen(3000, () => console.log("University admissions system running on port 3000"));

export {
    Application,
    applicationValidation,
    artApplicationValidation,
    scholarshipValidation
};
