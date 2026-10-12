const express = require('express');
const router = express.Router();
const db = require('../config/db');

// List All Locations
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM LOCATION ORDER BY location_id DESC');
        res.render('locations/index', { locations: rows });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Add Form
router.get('/add', (req, res) => {
    res.render('locations/add');
});

// Add Process
router.post('/add', async (req, res) => {
    const { location_id, city, state, country, ip_address } = req.body;
    try {
        await db.query(
            'INSERT INTO LOCATION (location_id, city, state, country, ip_address) VALUES (?, ?, ?, ?, ?)',
            [location_id, city, state, country, ip_address]
        );
        res.redirect('/locations');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error adding location');
    }
});

// Edit Form
router.get('/edit/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM LOCATION WHERE location_id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).send('Location not found');
        res.render('locations/edit', { location: rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Edit Process
router.post('/edit/:id', async (req, res) => {
    const { city, state, country, ip_address } = req.body;
    try {
        await db.query(
            'UPDATE LOCATION SET city=?, state=?, country=?, ip_address=? WHERE location_id=?',
            [city, state, country, ip_address, req.params.id]
        );
        res.redirect('/locations');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating location');
    }
});

// Delete
router.get('/delete/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM LOCATION WHERE location_id = ?', [req.params.id]);
        res.redirect('/locations');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting location');
    }
});

module.exports = router;
