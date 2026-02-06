import express, { Request, Response, NextFunction } from "express";

// ============================================================
// SECTION 5: STEP-BY-STEP DATA MODELING & CODE WALKTHROUGH
// ============================================================

const app = express();
app.use(express.json());

// Extend Express Request type to include dischargeLog
declare global {
    namespace Express {
        interface Request {
            dischargeLog?: { step: string; time: string }[];
        }
    }
}

// ------------------------------------------------------------
// A. Logging Every Discharge Request
// ------------------------------------------------------------
function logDischargeRequest(req: Request, res: Response, next: NextFunction) {
    req.dischargeLog = req.dischargeLog || [];
    req.dischargeLog.push({ step: "requestReceived", time: new Date().toISOString() });
    next();
}

// ------------------------------------------------------------
// B. Checking Doctor Sign-Off
// ------------------------------------------------------------
function doctorSignoffCheck(req: Request, res: Response, next: NextFunction) {
    if (!req.body.doctorSigned) {
        return res.status(400).json({ error: "Doctor sign-off required before discharge." });
    }
    req.dischargeLog!.push({ step: "doctorSignoff", time: new Date().toISOString() });
    next();
}

// ------------------------------------------------------------
// C. Checking Pharmacy Review
// ------------------------------------------------------------
function pharmacyReview(req: Request, res: Response, next: NextFunction) {
    if (!req.body.pharmacyChecked) {
        return res.status(400).json({ error: "Pharmacy review required before discharge." });
    }
    req.dischargeLog!.push({ step: "pharmacyReview", time: new Date().toISOString() });
    next();
}

// ------------------------------------------------------------
// D. Checking Follow-Up Scheduling
// ------------------------------------------------------------
function followupCheck(req: Request, res: Response, next: NextFunction) {
    if (!req.body.followupScheduled) {
        return res.status(400).json({ error: "Follow-up appointment must be scheduled." });
    }
    req.dischargeLog!.push({ step: "followupCheck", time: new Date().toISOString() });
    next();
}

// ------------------------------------------------------------
// E. Centralized Error Handling
// ------------------------------------------------------------
function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    console.error("Discharge log:", req.dischargeLog);
    res.status(500).json({ error: err.message || "Internal server error" });
}

// ------------------------------------------------------------
// F. Full Example: Putting It All Together
// ------------------------------------------------------------
app.use(logDischargeRequest);

app.post(
    "/discharge",
    doctorSignoffCheck,
    pharmacyReview,
    followupCheck,
    (req: Request, res: Response) => {
        req.dischargeLog!.push({ step: "dischargeComplete", time: new Date().toISOString() });
        res.json({
            status: "Discharge complete",
            patient: req.body.patientName,
            log: req.dischargeLog,
        });
    }
);

app.use(errorHandler);


// ============================================================
// SECTION 6: INTERACTIVE CHALLENGE / MINI-PROJECT
// ============================================================

// ------------------------------------------------------------
// Challenge: Add middleware that checks for insurance approval
// - If req.body.insuranceApproved is not present, return 403 Forbidden
// ------------------------------------------------------------
function insuranceApprovalCheck(req: Request, res: Response, next: NextFunction) {
    if (!req.body.insuranceApproved) {
        return res.status(403).json({
            error: "Insurance approval required before discharge.",
            status: "Forbidden"
        });
    }
    req.dischargeLog!.push({ step: "insuranceApproval", time: new Date().toISOString() });
    next();
}

// Updated discharge route with insurance check
app.post(
    "/discharge-with-insurance",
    doctorSignoffCheck,
    pharmacyReview,
    insuranceApprovalCheck,
    followupCheck,
    (req: Request, res: Response) => {
        req.dischargeLog!.push({ step: "dischargeComplete", time: new Date().toISOString() });
        res.json({
            status: "Discharge complete (with insurance verification)",
            patient: req.body.patientName,
            log: req.dischargeLog,
        });
    }
);

// Start server
app.listen(3000, () => console.log("Hospital system running on port 3000"));

export {
    logDischargeRequest,
    doctorSignoffCheck,
    pharmacyReview,
    followupCheck,
    insuranceApprovalCheck,
    errorHandler
};
