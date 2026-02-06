// Code Walkthrough - Variable Scope with let
let bool: boolean = true;
if (bool) {
    let result: number = 10;
    console.log(result);
}
// console.log(result); // Error: result is not defined here

// Code Walkthrough - Redeclaration Rules
let animal: string = "cat";
// let animal: string = "dog"; // Error: Cannot redeclare
console.log(animal);

// Code Walkthrough - Same Name in Different Blocks
let bool2: boolean = false;
if (bool2) {
    let num: number = 1;
    console.log(num);
} else {
    let num: number = 2;
    console.log(num);
}

// Code Walkthrough - const declaration
const lang: string = 'TypeScript';
const PI: number = 3.14;
console.log(`Language: ${lang}`);
console.log(`Value of PI: ${PI}`);

// Code Walkthrough - const rules
if (true) {
    const PI2: number = 3.14;
    console.log(PI2);
    // const PI2: number = 3.14; // Error: Cannot redeclare
    // PI2 = 3.15; // Error: Cannot assign to constant
}

// Challenge 1: Declare score with let
let score: number = 100;
console.log(score);

// Challenge 2: score in different block
if (true) {
    let score: number = 50;
    console.log(score);
}

// Challenge 3: Declare constant COUNTRY
const COUNTRY: string = "[YOUR_COUNTRY]";
console.log(COUNTRY);

// Challenge 4: Try to change COUNTRY
// COUNTRY = "Japan"; // Error: Cannot assign to 'COUNTRY' because it is a constant

// Challenge 5: Try to re-declare score
// let score: number = 200; // Error: Cannot redeclare block-scoped variable
