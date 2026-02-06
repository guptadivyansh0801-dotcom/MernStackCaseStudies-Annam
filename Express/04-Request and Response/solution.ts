import express, { Request, Response } from "express";

// ============================================================
// SECTION 5: STEP-BY-STEP DATA MODELING & CODE WALKTHROUGH
// ============================================================

const app = express();

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ------------------------------------------------------------
// A. Understanding the Request Object
// ------------------------------------------------------------

// req.params - URL parameters (from route path)
app.get("/users/:userId/posts/:postId", (req: Request, res: Response) => {
    // Access URL parameters
    const { userId, postId } = req.params;
    res.json({
        message: "URL Parameters Example",
        userId,
        postId
    });
});

// req.query - Query string parameters (from ?key=value)
app.get("/search", (req: Request, res: Response) => {
    // Access query parameters
    const { q, page, limit } = req.query;
    res.json({
        message: "Query Parameters Example",
        searchTerm: q,
        page: page || 1,
        limit: limit || 10
    });
});

// req.body - Request body (POST/PUT data)
app.post("/users", (req: Request, res: Response) => {
    // Access request body (requires body parser middleware)
    const { name, email, age } = req.body;
    res.json({
        message: "Request Body Example",
        user: { name, email, age }
    });
});

// req.headers - Request headers
app.get("/headers", (req: Request, res: Response) => {
    // Access request headers
    const userAgent = req.headers["user-agent"];
    const contentType = req.headers["content-type"];
    const authorization = req.headers["authorization"];

    res.json({
        message: "Request Headers Example",
        userAgent,
        contentType,
        authorization
    });
});

// ------------------------------------------------------------
// B. Understanding the Response Object
// ------------------------------------------------------------

// res.send() - Send a response (text, HTML, Buffer)
app.get("/text", (req: Request, res: Response) => {
    res.send("Hello, World!");
});

// res.json() - Send JSON response
app.get("/json", (req: Request, res: Response) => {
    res.json({ message: "This is JSON", success: true });
});

// res.status() - Set HTTP status code
app.get("/not-found", (req: Request, res: Response) => {
    res.status(404).json({ error: "Resource not found" });
});

app.get("/created", (req: Request, res: Response) => {
    res.status(201).json({ message: "Resource created", id: "123" });
});

// res.set() / res.setHeader() - Set response headers
app.get("/custom-headers", (req: Request, res: Response) => {
    res.set("X-Custom-Header", "MyCustomValue");
    res.set("X-Request-Id", "abc-123");
    res.json({ message: "Response with custom headers" });
});

// res.cookie() - Set cookies
app.get("/set-cookie", (req: Request, res: Response) => {
    res.cookie("sessionId", "abc123", {
        httpOnly: true,
        maxAge: 3600000 // 1 hour
    });
    res.json({ message: "Cookie set" });
});

// res.redirect() - Redirect to another URL
app.get("/old-page", (req: Request, res: Response) => {
    res.redirect(301, "/new-page");
});

app.get("/new-page", (req: Request, res: Response) => {
    res.json({ message: "Welcome to the new page!" });
});


// ============================================================
// SECTION 6: INTERACTIVE CHALLENGE / MINI-PROJECT
// ============================================================

// ------------------------------------------------------------
// Challenge 1: Create an endpoint that uses all request properties
// - Route params, query params, body, and headers
// ------------------------------------------------------------
interface ProductUpdateBody {
    name?: string;
    price?: number;
    description?: string;
}

app.put("/products/:productId", (req: Request, res: Response) => {
    // Route parameter
    const { productId } = req.params;

    // Query parameter (optional fields to update)
    const { fields } = req.query;

    // Request body
    const { name, price, description }: ProductUpdateBody = req.body;

    // Request header
    const authorization = req.headers["authorization"];

    // Check authorization
    if (!authorization) {
        return res.status(401).json({ error: "Authorization header required" });
    }

    res.json({
        message: "Product updated",
        productId,
        fieldsRequested: fields,
        updatedData: { name, price, description },
        authorizedBy: authorization
    });
});

// ------------------------------------------------------------
// Challenge 2: Create an endpoint that demonstrates all response types
// ------------------------------------------------------------
app.get("/demo/response-types", (req: Request, res: Response) => {
    const type = req.query.type;

    switch (type) {
        case "text":
            res.send("This is plain text");
            break;
        case "html":
            res.send("<h1>This is HTML</h1>");
            break;
        case "json":
            res.json({ type: "json", data: { foo: "bar" } });
            break;
        case "error":
            res.status(500).json({ error: "Internal server error" });
            break;
        default:
            res.json({
                availableTypes: ["text", "html", "json", "error"],
                usage: "/demo/response-types?type=json"
            });
    }
});

// ------------------------------------------------------------
// Challenge 3: Create an endpoint with comprehensive response options
// ------------------------------------------------------------
app.post("/api/form-submit", (req: Request, res: Response) => {
    const { email, message } = req.body;

    // Validate input
    if (!email || !message) {
        return res.status(400).json({
            error: "Missing required fields",
            required: ["email", "message"]
        });
    }

    // Set custom headers
    res.set("X-Submission-Id", Date.now().toString());
    res.set("X-Processed-By", "form-handler");

    // Set cookie
    res.cookie("lastSubmit", new Date().toISOString());

    // Send success response with 201 Created
    res.status(201).json({
        message: "Form submitted successfully",
        data: { email, message },
        submittedAt: new Date().toISOString()
    });
});

// Start server
app.listen(3000, () => {
    console.log("Server running on port 3000");
});

export default app;
