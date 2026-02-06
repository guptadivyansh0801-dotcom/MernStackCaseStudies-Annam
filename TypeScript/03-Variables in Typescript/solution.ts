// Code Walkthrough - Type Assertion
var str = '1';
var str2: number = <number><any>str;
console.log(typeof (str2));

// Code Walkthrough - Inferred Typing
var num = 2;
console.log("value of num " + num);
// num = "12"; // Error: Cannot assign string to number

// Code Walkthrough - Variable Scope
var global_num = 12;
class Numbers {
    num_val = 13;
    static sval = 10;
    storeNum(): void {
        var local_num = 14;
    }
}
console.log("Global num: " + global_num);
console.log(Numbers.sval);
var obj = new Numbers();
console.log("Class num: " + obj.num_val);

// Challenge 1: Declare city variable
var city: string = "[YOUR_CITY]";

// Challenge 2: Declare temperature with type number
var temperature: number = 28;

// Challenge 3: Let TypeScript infer type
var isRaining = false;

// Challenge 4: weatherReport function
function weatherReport(city: string, temperature: number, isRaining: boolean): void {
    console.log("In " + city + ", it is " + temperature + "°C. Is it raining? " + isRaining);
}

// Challenge 5: Call the function
weatherReport(city, temperature, isRaining);
