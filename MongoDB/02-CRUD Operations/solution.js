// Code Walkthrough - Sample Product Document
/*
{
    _id: ObjectId("665f4d7e8b3e6c1e24a7b3e1"),
    name: "Smartwatch Pro",
    category: "Wearables",
    price: { value: 199.99, currency: "USD", discount: 20 },
    stock: 25,
    ratings: [4.6, 4.8],
    tags: ["fitness", "bluetooth"]
}
*/

// Code Walkthrough - Insert a New Product
db.products.insertOne({
    name: "4K Smart TV",
    category: "Electronics",
    price: { value: 599.99, currency: "USD" },
    stock: 10,
    tags: ["television", "streaming"]
});

// Code Walkthrough - Query Products
// Find all TVs under $600
db.products.find({
    category: "Electronics",
    "price.value": { $lt: 600 },
    name: /TV/i
});

// Project name and price only
db.products.find(
    { category: "Electronics" },
    { name: 1, "price.value": 1, _id: 0 }
);

// Code Walkthrough - Update Product Stock
db.products.updateOne(
    { _id: ObjectId("665f4d7e8b3e6c1e24a7b3e2") },
    { $inc: { stock: -1 } }
);

// Add a "sale" tag
db.products.updateOne(
    { name: "4K Smart TV" },
    { $push: { tags: "sale" } }
);

// Code Walkthrough - Delete a Product
db.products.deleteOne({ name: "Legacy DVD Player" });

// Challenge 1: Add new vegan dish
db.menu.insertOne({
    name: "Tofu Buddha Bowl",
    cuisine: "Asian",
    price: 9.50,
    tags: ["vegan", "gluten-free"],
    available: true
});

// Challenge 2: Find available vegan dishes under $12
db.menu.find(
    { available: true, tags: "vegan", price: { $lt: 12 } },
    { name: 1, price: 1, _id: 0 }
);

// Challenge 3: Update price and add tag
db.menu.updateOne(
    { name: "Tofu Buddha Bowl" },
    { $set: { price: 10.00 }, $push: { tags: "popular" } }
);

// Challenge 4: Delete dish
db.menu.deleteOne({ name: "Old Special Soup" });
