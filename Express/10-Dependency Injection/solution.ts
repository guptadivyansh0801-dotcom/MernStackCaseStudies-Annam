import "reflect-metadata";
import { Service, Inject, Container } from "typedi";
import express, { Request, Response } from "express";

// ============================================================
// SECTION 5: STEP-BY-STEP DATA MODELING & CODE WALKTHROUGH
// ============================================================

// ------------------------------------------------------------
// A. Setting Up for Flexibility and Growth
// ------------------------------------------------------------
// 1. Install TypeDI and reflect-metadata:
//    npm install typedi reflect-metadata
// 2. Add at the top of your main file:
//    import "reflect-metadata";
// 3. Enable decorators in tsconfig.json:
//    "experimentalDecorators": true,
//    "emitDecoratorMetadata": true

// ------------------------------------------------------------
// B. Defining Interfaces: Contracts for Clinic Services
// ------------------------------------------------------------
// notifications/NotificationService.ts
export interface NotificationService {
    send(to: string, message: string): Promise<void>;
}

// billing/BillingService.ts
export interface BillingService {
    charge(patient: string, amount: number): Promise<void>;
}

// ------------------------------------------------------------
// C. Creating Injectable Implementations: Real-World Providers
// ------------------------------------------------------------
// notifications/SMSService.ts
@Service()
export class SMSService implements NotificationService {
    async send(to: string, message: string) {
        console.log(`SMS sent to ${to}: ${message}`);
    }
}

// notifications/EmailService.ts
@Service()
export class EmailService implements NotificationService {
    async send(to: string, message: string) {
        console.log(`Email sent to ${to}: ${message}`);
    }
}

// billing/StripeBillingService.ts
@Service()
export class StripeBillingService implements BillingService {
    async charge(patient: string, amount: number) {
        console.log(`Charged $${amount} to ${patient} via Stripe`);
    }
}

// ------------------------------------------------------------
// D. Injecting Services into Appointment Logic
// ------------------------------------------------------------
// appointments/AppointmentService.ts
@Service()
export class AppointmentService {
    constructor(
        @Inject(() => SMSService) private notifier: NotificationService,
        @Inject(() => StripeBillingService) private billing: BillingService
    ) { }

    async bookAppointment(patient: string, time: string, amount: number) {
        await this.billing.charge(patient, amount);
        await this.notifier.send(patient, `Your appointment is booked for ${time}`);
        return { status: "confirmed" };
    }
}

// ------------------------------------------------------------
// E. Swapping Implementations for Growth or Testing
// ------------------------------------------------------------
// You can register any implementation with the container at runtime
function swapToEmailNotifications() {
    // Swap to EmailService for notifications
    Container.set("NotificationService", new EmailService());
    const appointmentService = Container.get(AppointmentService);
    appointmentService.bookAppointment("alice@example.com", "Monday 10am", 50);
}

// ------------------------------------------------------------
// F. Testing with Mocks: Safe, Isolated, and Reliable
// ------------------------------------------------------------
class MockNotifier implements NotificationService {
    messages: string[] = [];
    async send(to: string, message: string) {
        this.messages.push(`${to}: ${message}`);
    }
}

class MockBilling implements BillingService {
    charges: string[] = [];
    async charge(patient: string, amount: number) {
        this.charges.push(`${patient}: $${amount}`);
    }
}

async function testWithMocks() {
    // In your test setup
    const mockNotifier = new MockNotifier();
    const mockBilling = new MockBilling();

    // Create service with mocks
    const testService = new AppointmentService(mockNotifier as any, mockBilling as any);

    await testService.bookAppointment("bob@example.com", "Tuesday 2pm", 75);

    // Assert that the mocks recorded the expected actions
    console.log("Notifications:", mockNotifier.messages);
    console.log("Charges:", mockBilling.charges);
}


// ============================================================
// SECTION 6: CHALLENGE
// ============================================================

// ------------------------------------------------------------
// Challenge 1: Add BillingService interface and StripeBillingService
// (Already implemented above in section B and C)
// ------------------------------------------------------------

// ------------------------------------------------------------
// Challenge 2: Inject BillingService into AppointmentService
// (Already implemented above in section D)
// ------------------------------------------------------------

// ------------------------------------------------------------
// Challenge 3: Write a test using mock billing service
// ------------------------------------------------------------
async function testBillingCharge() {
    const mockBilling = new MockBilling();
    const mockNotifier = new MockNotifier();

    const service = new AppointmentService(mockNotifier as any, mockBilling as any);

    await service.bookAppointment("test@example.com", "Wednesday 3pm", 100);

    // Verify the charge was made
    if (mockBilling.charges.includes("test@example.com: $100")) {
        console.log("✓ Test passed: Billing charge was recorded");
    } else {
        console.error("✗ Test failed: Billing charge was not recorded");
    }

    // Verify notification was sent
    if (mockNotifier.messages.length > 0) {
        console.log("✓ Test passed: Notification was sent");
    } else {
        console.error("✗ Test failed: Notification was not sent");
    }
}

// Run example
async function main() {
    console.log("=== Running Appointment Service ===");
    const appointmentService = Container.get(AppointmentService);
    const result = await appointmentService.bookAppointment("john@example.com", "Friday 9am", 50);
    console.log("Result:", result);

    console.log("\n=== Running Mock Tests ===");
    await testWithMocks();

    console.log("\n=== Running Billing Test ===");
    await testBillingCharge();
}

const app = express();
app.use(express.json());

app.post("/appointments", async (req: Request, res: Response) => {
    try {
        const appointmentService = Container.get(AppointmentService);
        const { patient, time, amount } = req.body;
        const result = await appointmentService.bookAppointment(patient, time, amount);
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3005, () => console.log("Clinic system running on port 3005"));

// export {
//     NotificationService,
//     BillingService,
//     SMSService,
//     EmailService,
//     StripeBillingService,
//     AppointmentService,
//     MockNotifier,
//     MockBilling
// };
