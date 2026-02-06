import "reflect-metadata";
import { JsonController, Get, Post, Param, Body, createExpressServer } from "routing-controllers";

// ============================================================
// SECTION 5: STEP-BY-STEP DATA MODELING & CODE WALKTHROUGH
// ============================================================

// ------------------------------------------------------------
// A. Defining the Order Data Structure
// ------------------------------------------------------------
interface Order {
    id: string;
    customerName: string;
    flavor: string;
    quantity: number;
    pickupDate: string;
}

// ------------------------------------------------------------
// B. Creating a Safe Place for Orders
// ------------------------------------------------------------
const orders: Order[] = [
    { id: "1", customerName: "Maria", flavor: "vanilla", quantity: 2, pickupDate: "2024-07-10" },
];

// ------------------------------------------------------------
// C. Building the Order Controller
// ------------------------------------------------------------
@JsonController("/orders")
export class OrderController {
    @Get("/")
    getAll() {
        return orders;
    }

    @Get("/:id")
    getOne(@Param("id") id: string) {
        const order = orders.find(o => o.id === id);
        if (!order) {
            return { status: "error", error: "Order not found" };
        }
        return { status: "success", data: order };
    }

    @Post("/")
    create(@Body() order: Omit<Order, "id">) {
        const newOrder: Order = {
            ...order,
            id: (orders.length + 1).toString(),
        };
        orders.push(newOrder);
        return { status: "success", data: newOrder };
    }
}

// D. Registering the Controller (done in app entry point)
// This sets up the bakery's "front counter"-all order-related requests
// are routed to the OrderController


// ============================================================
// SECTION 6: INTERACTIVE CHALLENGE / MINI-PROJECT
// ============================================================

// ------------------------------------------------------------
// Challenge: Create a BakingController for /baking routes
// - Add a POST /baking/start endpoint to start baking an order
// - Add a GET /baking/status/:id endpoint to check baking status
// ------------------------------------------------------------

interface BakingStatus {
    orderId: string;
    status: "not_started" | "in_progress" | "completed";
    startedAt?: string;
    completedAt?: string;
}

const bakingStatuses: Map<string, BakingStatus> = new Map();

@JsonController("/baking")
export class BakingController {
    @Post("/start")
    startBaking(@Body() body: { orderId: string }) {
        const order = orders.find(o => o.id === body.orderId);
        if (!order) {
            return { status: "error", error: "Order not found" };
        }

        const bakingStatus: BakingStatus = {
            orderId: body.orderId,
            status: "in_progress",
            startedAt: new Date().toISOString(),
        };
        bakingStatuses.set(body.orderId, bakingStatus);

        return { status: "success", message: `Baking started for order ${body.orderId}`, data: bakingStatus };
    }

    @Get("/status/:id")
    getStatus(@Param("id") id: string) {
        const bakingStatus = bakingStatuses.get(id);
        if (!bakingStatus) {
            return { status: "not_started", orderId: id };
        }
        return { status: "success", data: bakingStatus };
    }

    @Post("/complete/:id")
    completeBaking(@Param("id") id: string) {
        const bakingStatus = bakingStatuses.get(id);
        if (!bakingStatus) {
            return { status: "error", error: "Baking not started for this order" };
        }

        bakingStatus.status = "completed";
        bakingStatus.completedAt = new Date().toISOString();
        bakingStatuses.set(id, bakingStatus);

        return { status: "success", message: `Baking completed for order ${id}`, data: bakingStatus };
    }
}

// ============================================================
// SERVER SETUP
// ============================================================
// Testing Purposes only
const app = createExpressServer({
    controllers: [OrderController, BakingController],
});

app.listen(3000, () => {
    console.log("Bakery server running on port 3000");
});

export { Order, orders, BakingStatus, bakingStatuses };
