// Code Walkthrough - Singleton Pattern
class CafeManager {
    private static instance: CafeManager;
    private constructor() { }
    static getInstance(): CafeManager {
        if (!CafeManager.instance) {
            CafeManager.instance = new CafeManager();
        }
        return CafeManager.instance;
    }
}

const manager1 = CafeManager.getInstance();
const manager2 = CafeManager.getInstance();
console.log(manager1 === manager2);

// Code Walkthrough - Factory Pattern
interface Drink {
    serve(): void;
}

class Latte implements Drink {
    serve() { console.log("Latte!"); }
}

class Espresso implements Drink {
    serve() { console.log("Espresso!"); }
}

class DrinkFactory {
    static createDrink(type: string): Drink {
        if (type === "latte") return new Latte();
        if (type === "espresso") return new Espresso();
        throw new Error("Unknown drink");
    }
}

const drink = DrinkFactory.createDrink("latte");
drink.serve();

// Code Walkthrough - Observer Pattern
interface Observer {
    update(msg: string): void;
}

class Customer implements Observer {
    update(msg: string) { console.log("Customer:", msg); }
}

class InventoryObserver implements Observer {
    update(msg: string) { console.log("Inventory:", msg); }
}

class DrinkOrder {
    private observers: Observer[] = [];
    addObserver(obs: Observer) { this.observers.push(obs); }
    notifyAll(msg: string) { this.observers.forEach(obs => obs.update(msg)); }
    completeOrder() { this.notifyAll("Order complete!"); }
}

const order = new DrinkOrder();
order.addObserver(new Customer());
order.addObserver(new InventoryObserver());
order.completeOrder();

// Code Walkthrough - Strategy Pattern
interface PrepStrategy {
    prepare(): void;
}

class FastPrep implements PrepStrategy {
    prepare() { console.log("Fast prep!"); }
}

class EcoPrep implements PrepStrategy {
    prepare() { console.log("Eco prep!"); }
}

class Barista {
    constructor(private strategy: PrepStrategy) { }
    setStrategy(strategy: PrepStrategy) { this.strategy = strategy; }
    makeDrink() { this.strategy.prepare(); }
}

const barista = new Barista(new FastPrep());
barista.makeDrink();
barista.setStrategy(new EcoPrep());
barista.makeDrink();

// Challenge: PromotionSystem observer
class PromotionSystem implements Observer {
    update(msg: string) {
        console.log("PromotionSystem: Special offer - Buy 2 get 1 free!");
    }
}

const order2 = new DrinkOrder();
order2.addObserver(new Customer());
order2.addObserver(new PromotionSystem());
order2.completeOrder();
