// Code Walkthrough - Built-in types
let accountBalance: number = 1000.50;
let accountName: string = "Savings";
let isActive: boolean = true;
let transactionId: symbol = Symbol("txn");
let account: object = { id: 1, name: "Main" };
let missingValue: null = null;
let notSet: undefined;

// Code Walkthrough - Function with void return
function printStatement(): void {
    console.log("Statement printed.");
}

// Code Walkthrough - Function with never return
function criticalError(): never {
    throw new Error("Critical failure!");
}

// Challenge: processTransaction function
function processTransaction(
    amount: number,
    description: string | undefined,
    isCredit: boolean
): void {
    if (amount < 0) {
        throw new Error("Amount cannot be negative");
    }

    let desc = description;
    if (desc === undefined) {
        desc = "No description provided";
    }

    let type = isCredit ? "CREDIT" : "DEBIT";
    console.log(type + ": $" + amount + " - " + desc);
}

processTransaction(100, "Subscription", true);
processTransaction(50, undefined, false);
