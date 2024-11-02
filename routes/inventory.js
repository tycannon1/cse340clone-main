// routes/inventory.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/inventory', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM inventory');
        res.render('inventory', { title: 'Inventory', cars: result.rows });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving inventory data');
    }
});

module.exports = router;