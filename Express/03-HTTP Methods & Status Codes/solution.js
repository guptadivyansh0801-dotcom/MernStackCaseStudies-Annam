const express = require('express');
const router = express.Router();

let products = [
    { id: '1', name: 'Apple', price: 1.5, inStock: true },
    { id: '2', name: 'Banana', price: 0.75, inStock: false }
];

router.get('/', (req, res) => {
    res.status(200).json(products);
});

router.get('/:id', (req, res) => {
    const product = products.find(p => p.id === req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.status(200).json(product);
});

router.post('/', (req, res) => {
    const { name, price, inStock } = req.body;
    if (!name || price === undefined || inStock === undefined) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    const newProduct = { id: (products.length + 1).toString(), name, price, inStock };
    products.push(newProduct);
    res.status(201).json(newProduct);
});

router.patch('/:id/inStock', (req, res) => {
    const product = products.find(p => p.id === req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const { inStock } = req.body;
    if (typeof inStock !== 'boolean') {
        return res.status(400).json({ error: 'inStock must be a boolean' });
    }
    product.inStock = inStock;
    res.status(200).json(product);
});

router.delete('/:id', (req, res) => {
    const idx = products.findIndex(p => p.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Product not found' });
    products.splice(idx, 1);
    res.sendStatus(204);
});

module.exports = router;
