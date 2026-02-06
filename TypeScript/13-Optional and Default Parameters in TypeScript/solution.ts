// Code Walkthrough - Example 1: Optional Parameter
function greet(name: string, age?: number): void {
    if (typeof age === "number") {
        console.log(`Hello ${name}, you are ${age} years old.`);
    } else {
        console.log(`Hello ${name}`);
    }
}

greet("Alice");
greet("Bob", 30);

// Code Walkthrough - Example 2: Default Parameter
function greetDefault(name: string, age: number = 25): void {
    console.log(`Hello ${name}, you are ${age} years old.`);
}

greetDefault("Charlie");
greetDefault("Diana", 40);

// Code Walkthrough - Example 5: Default as Optional
function add(x: number, y: number = 10): number {
    return x + y;
}

console.log(add(5));
console.log(add(5, 20));

// Challenge 1: describePerson
function describePerson(name: string, age?: number): void {
    if (typeof age === "number") {
        console.log(`Name: ${name}, Age: ${age}`);
    } else {
        console.log(`Name: ${name}, Age: Unknown`);
    }
}

// Challenge 2: calculatePrice
function calculatePrice(basePrice: number, discount: number = 0.1): number {
    return basePrice - basePrice * discount;
}

// Challenge 3: Test calls
describePerson("Eve");
describePerson("Frank", 28);
console.log(calculatePrice(100));
console.log(calculatePrice(100, 0.2));
