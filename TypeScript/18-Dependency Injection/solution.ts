// Code Walkthrough - Interface Definition
interface PaymentGateway {
    processPayment(amount: number): Promise<boolean>;
}

// Code Walkthrough - Concrete Implementations
class StripeGateway implements PaymentGateway {
    async processPayment(amount: number): Promise<boolean> {
        console.log(`Processing payment of $${amount} via Stripe.`);
        return true;
    }
}

class PaypalGateway implements PaymentGateway {
    async processPayment(amount: number): Promise<boolean> {
        console.log(`Processing payment of $${amount} via PayPal.`);
        return true;
    }
}

// Code Walkthrough - Payment Processor with Constructor Injection
class PaymentProcessor {
    constructor(private gateway: PaymentGateway) { }

    async pay(amount: number): Promise<void> {
        const success = await this.gateway.processPayment(amount);
        if (success) {
            console.log("Payment successful!");
        } else {
            console.log("Payment failed.");
        }
    }
}

// Code Walkthrough - Using Different Gateways
const stripeGateway = new StripeGateway();
const paypalGateway = new PaypalGateway();

const processor1 = new PaymentProcessor(stripeGateway);
processor1.pay(100);

const processor2 = new PaymentProcessor(paypalGateway);
processor2.pay(200);

// Code Walkthrough - Mock Gateway for Testing
class MockGateway implements PaymentGateway {
    async processPayment(amount: number): Promise<boolean> {
        console.log(`Mock processing payment of $${amount}.`);
        return true;
    }
}

const mockGateway = new MockGateway();
const testProcessor = new PaymentProcessor(mockGateway);
testProcessor.pay(50);

// Challenge 1: BankTransferGateway
class BankTransferGateway implements PaymentGateway {
    async processPayment(amount: number): Promise<boolean> {
        console.log(`Processing bank transfer of $${amount}.`);
        return true;
    }
}

const bankGateway = new BankTransferGateway();
const processor3 = new PaymentProcessor(bankGateway);
processor3.pay(300);

// Challenge 2: Mock gateway that simulates failure
class FailingMockGateway implements PaymentGateway {
    async processPayment(amount: number): Promise<boolean> {
        console.log(`Mock: Payment of $${amount} failed.`);
        return false;
    }
}

const failingGateway = new FailingMockGateway();
const failProcessor = new PaymentProcessor(failingGateway);
failProcessor.pay(100);
