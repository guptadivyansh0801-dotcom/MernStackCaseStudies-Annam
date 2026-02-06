// Code Walkthrough - Simple Declaration & Optional Parameter
function displayMember(id: number, name: string, email?: string): void {
    console.log(`ID: ${id}, Name: ${name}`);
    if (email) console.log(`Email: ${email}`);
}

// Code Walkthrough - Rest Parameters
function calculateFines(...fines: number[]): number {
    let total = 0;
    for (let fine of fines) total += fine;
    return total;
}

// Code Walkthrough - Default Parameter
function membershipFee(price: number, discountRate: number = 0.1): number {
    return price - price * discountRate;
}

// Code Walkthrough - Anonymous Function & Callback
function greetVisitor(visitor: string, formatter: (name: string) => void): void {
    formatter(visitor);
}
const vipGreet = (name: string) => console.log(`Welcome VIP ${name}!`);

// Code Walkthrough - Recursion
function factorial(n: number): number {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

// Code Walkthrough - Function Overloads
function generateReport(data: object[]): string;
function generateReport(data: object[], format: "json"): string;
function generateReport(data: any[], format?: string): string {
    if (format === "json") {
        return JSON.stringify(data, null, 2);
    }
    return data.map(item => item.toString()).join("\n");
}

// Code Walkthrough - Function Type & Alias
type VisitorFormatter = (name: string) => void;
let consoleGreet: VisitorFormatter = (n) => console.log(`Hello, ${n}!`);

// Challenge 1: Call displayMember
displayMember(1, "Divyansh Gupta", "email@example.com");
displayMember(2, "Bob");

// Challenge 2: Use calculateFines
console.log(calculateFines(5, 10, 2.5));

// Challenge 3: Membership fee
console.log(membershipFee(100));
console.log(membershipFee(100, 0.2));

// Challenge 4: Greet visitors
greetVisitor("Alice", vipGreet);
greetVisitor("Bob", consoleGreet);

// Challenge 5: Factorial
console.log(factorial(5));

// Challenge 6: Generate reports
const books = [{ title: "1984" }, { title: "Brave New World" }];
console.log(generateReport(books));
console.log(generateReport(books, "json"));
