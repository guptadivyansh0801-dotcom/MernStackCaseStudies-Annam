// Code Walkthrough from case study - Variable
let productName: string = "Bananas";

// Code Walkthrough - Function
function printProduct(name: string): void {
    console.log("Product: " + name);
}
printProduct(productName);

// Code Walkthrough - Comment example
// This prints the product name
printProduct(productName);

// Code Walkthrough - Class
class Store {
    open(): void {
        console.log("Store is open!");
    }
}
let store = new Store();
store.open();

// Challenge 1: Create variable for favorite fruit
let favoriteFruit: string = "Mango";
console.log(favoriteFruit);

// Challenge 2: Function that prints double of a number
function printDouble(num: number): void {
    console.log(num * 2);
}
printDouble(5);

// Challenge 3: Single-line and multi-line comments
// This is a single-line comment
/* This is 
   a multi-line comment */

// Challenge 4: Person class with sayHello method
class Person {
    sayHello(): void {
        console.log("Hello!");
    }
}
let person = new Person();
person.sayHello();
