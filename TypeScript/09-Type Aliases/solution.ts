// Code Walkthrough - Primitive Alias
type ProductID = number;
let widgetId: ProductID = 42;

// Code Walkthrough - Union Alias
type OrderStatus = "pending" | "shipped" | "returned";
let orderStatus: OrderStatus = "shipped";

// Code Walkthrough - Tuple Alias
type Coordinate = [aisle: number, shelf: number];
let loc: Coordinate = [3, 14];

// Code Walkthrough - Object Alias
type Product = {
    id: ProductID;
    name: string;
    location: Coordinate;
    price: number;
};

let product: Product = {
    id: widgetId,
    name: "Widget",
    location: loc,
    price: 19.99
};

// Code Walkthrough - Function Type Alias
type Logger = (message: string) => void;
const consoleLogger: Logger = msg => console.log(`[LOG] ${msg}`);

// Code Walkthrough - Generic Alias
type Container<T> = { value: T; timestamp: Date };

let productContainer: Container<Product> = {
    value: product,
    timestamp: new Date()
};

let idContainer: Container<ProductID> = {
    value: 7,
    timestamp: new Date()
};

// Challenge 1: CustomerID alias
type CustomerID = string;

// Challenge 2: Customer object alias
type Customer = {
    id: CustomerID;
    name: string;
    email?: string;
};

// Challenge 3: processOrder function type alias
type ProcessOrder = (orderId: number, callback: (status: OrderStatus) => void) => void;

const handleOrder: ProcessOrder = (orderId, callback) => {
    console.log(`Processing order ${orderId}`);
    callback("shipped");
};

// Challenge 4: Container<Customer>
let customer: Customer = {
    id: "CUST-001",
    name: "Divyansh Gupta",
    email: "customer@example.com"
};

let customerContainer: Container<Customer> = {
    value: customer,
    timestamp: new Date()
};

console.log(customerContainer);
