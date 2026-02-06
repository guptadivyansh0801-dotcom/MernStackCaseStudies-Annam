// Code Walkthrough - Data Modeling
type Transaction = {
    id: number;
    type: "checkout" | "return" | "cancelled" | "priority";
};

const transactions: Transaction[] = [
    { id: 1, type: "checkout" },
    { id: 2, type: "cancelled" },
    { id: 3, type: "return" },
    { id: 4, type: "priority" },
    { id: 5, type: "checkout" }
];

const inventory: { [title: string]: number } = {
    "The Hobbit": 3,
    "1984": 5,
    "TypeScript Guide": 2
};

const visitors: string[] = ["Alice", "Bob", "Carol"];

// Code Walkthrough - for Loop
let totalProcessed = 0;
for (let i = 0; i < transactions.length; i++) {
    const tx = transactions[i];
    if (tx.type === "cancelled") {
        continue;
    }
    if (tx.type === "priority") {
        console.log("Priority transaction encountered, stopping.");
        break;
    }
    console.log(`Processing transaction ${tx.id}: ${tx.type}`);
    totalProcessed++;
}
console.log(`Total processed: ${totalProcessed}`);

// Code Walkthrough - while Loop
let queue = [...transactions];
let processedWhile = 0;
while (queue.length > 0) {
    const tx = queue.shift()!;
    if (tx.type === "cancelled") continue;
    console.log(`While loop processed: ${tx.id}`);
    processedWhile++;
}

// Code Walkthrough - do...while Loop
let pendingReturns = 0;
let idx = 0;
do {
    const tx = transactions[idx];
    if (tx.type === "return") {
        console.log(`Handling return transaction ${tx.id}`);
        pendingReturns++;
    }
    idx++;
} while (idx < transactions.length);
console.log(`Pending returns: ${pendingReturns}`);

// Challenge 1: Counter for each type
let counters: { [key: string]: number } = { checkout: 0, return: 0, priority: 0, cancelled: 0 };
for (let i = 0; i < transactions.length; i++) {
    counters[transactions[i].type]++;
}
console.log(counters);

// Challenge 2: while(true) with break
let idx2 = 0;
while (true) {
    if (transactions[idx2].type === "priority") {
        console.log("Priority found, breaking");
        break;
    }
    idx2++;
}

// Challenge 4: for...in to reset inventory
for (let title in inventory) {
    inventory[title] = 0;
}
console.log(inventory);

// Challenge 5: Visitors in reverse
for (let i = visitors.length - 1; i >= 0; i--) {
    console.log(visitors[i]);
}
