"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentService = exports.StripeBillingService = exports.EmailService = exports.SMSService = void 0;
require("reflect-metadata");
const typedi_1 = require("typedi");
const express_1 = __importDefault(require("express"));
// ------------------------------------------------------------
// C. Creating Injectable Implementations: Real-World Providers
// ------------------------------------------------------------
// notifications/SMSService.ts
let SMSService = class SMSService {
    send(to, message) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`SMS sent to ${to}: ${message}`);
        });
    }
};
exports.SMSService = SMSService;
exports.SMSService = SMSService = __decorate([
    (0, typedi_1.Service)()
], SMSService);
// notifications/EmailService.ts
let EmailService = class EmailService {
    send(to, message) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Email sent to ${to}: ${message}`);
        });
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, typedi_1.Service)()
], EmailService);
// billing/StripeBillingService.ts
let StripeBillingService = class StripeBillingService {
    charge(patient, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Charged $${amount} to ${patient} via Stripe`);
        });
    }
};
exports.StripeBillingService = StripeBillingService;
exports.StripeBillingService = StripeBillingService = __decorate([
    (0, typedi_1.Service)()
], StripeBillingService);
// ------------------------------------------------------------
// D. Injecting Services into Appointment Logic
// ------------------------------------------------------------
// appointments/AppointmentService.ts
let AppointmentService = class AppointmentService {
    constructor(notifier, billing) {
        this.notifier = notifier;
        this.billing = billing;
    }
    bookAppointment(patient, time, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.billing.charge(patient, amount);
            yield this.notifier.send(patient, `Your appointment is booked for ${time}`);
            return { status: "confirmed" };
        });
    }
};
exports.AppointmentService = AppointmentService;
exports.AppointmentService = AppointmentService = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typedi_1.Inject)(() => SMSService)),
    __param(1, (0, typedi_1.Inject)(() => StripeBillingService)),
    __metadata("design:paramtypes", [Object, Object])
], AppointmentService);
// ------------------------------------------------------------
// E. Swapping Implementations for Growth or Testing
// ------------------------------------------------------------
// You can register any implementation with the container at runtime
function swapToEmailNotifications() {
    // Swap to EmailService for notifications
    typedi_1.Container.set("NotificationService", new EmailService());
    const appointmentService = typedi_1.Container.get(AppointmentService);
    appointmentService.bookAppointment("alice@example.com", "Monday 10am", 50);
}
// ------------------------------------------------------------
// F. Testing with Mocks: Safe, Isolated, and Reliable
// ------------------------------------------------------------
class MockNotifier {
    constructor() {
        this.messages = [];
    }
    send(to, message) {
        return __awaiter(this, void 0, void 0, function* () {
            this.messages.push(`${to}: ${message}`);
        });
    }
}
class MockBilling {
    constructor() {
        this.charges = [];
    }
    charge(patient, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            this.charges.push(`${patient}: $${amount}`);
        });
    }
}
function testWithMocks() {
    return __awaiter(this, void 0, void 0, function* () {
        // In your test setup
        const mockNotifier = new MockNotifier();
        const mockBilling = new MockBilling();
        // Create service with mocks
        const testService = new AppointmentService(mockNotifier, mockBilling);
        yield testService.bookAppointment("bob@example.com", "Tuesday 2pm", 75);
        // Assert that the mocks recorded the expected actions
        console.log("Notifications:", mockNotifier.messages);
        console.log("Charges:", mockBilling.charges);
    });
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
function testBillingCharge() {
    return __awaiter(this, void 0, void 0, function* () {
        const mockBilling = new MockBilling();
        const mockNotifier = new MockNotifier();
        const service = new AppointmentService(mockNotifier, mockBilling);
        yield service.bookAppointment("test@example.com", "Wednesday 3pm", 100);
        // Verify the charge was made
        if (mockBilling.charges.includes("test@example.com: $100")) {
            console.log("✓ Test passed: Billing charge was recorded");
        }
        else {
            console.error("✗ Test failed: Billing charge was not recorded");
        }
        // Verify notification was sent
        if (mockNotifier.messages.length > 0) {
            console.log("✓ Test passed: Notification was sent");
        }
        else {
            console.error("✗ Test failed: Notification was not sent");
        }
    });
}
// Run example
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("=== Running Appointment Service ===");
        const appointmentService = typedi_1.Container.get(AppointmentService);
        const result = yield appointmentService.bookAppointment("john@example.com", "Friday 9am", 50);
        console.log("Result:", result);
        console.log("\n=== Running Mock Tests ===");
        yield testWithMocks();
        console.log("\n=== Running Billing Test ===");
        yield testBillingCharge();
    });
}
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.post("/appointments", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const appointmentService = typedi_1.Container.get(AppointmentService);
        const { patient, time, amount } = req.body;
        const result = yield appointmentService.bookAppointment(patient, time, amount);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
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
