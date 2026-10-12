const express = require('express');
const router = express.Router();
const db = require('../config/db');

// List All Crimes
router.get('/', async (req, res) => {
    try {
        const query = `
            SELECT c.*, l.city, l.state 
            FROM CRIME c 
            LEFT JOIN LOCATION l ON c.location_id = l.location_id 
            ORDER BY c.date DESC, c.time DESC`;
        const [rows] = await db.query(query);
        res.render('crimes/index', { crimes: rows });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Add Form
router.get('/add', async (req, res) => {
    try {
        const [locations] = await db.query('SELECT * FROM LOCATION');
        res.render('crimes/add', { locations });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Add Process
router.post('/add', async (req, res) => {
    const { crime_id, type, description_level, date, time, severity_level, location_id } = req.body;
    try {
        await db.query(
            'INSERT INTO CRIME (crime_id, type, description_level, date, time, severity_level, location_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [crime_id, type, description_level, date, time, severity_level, location_id || null]
        );
        res.redirect('/crimes');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error adding crime');
    }
});

// Edit Form
router.get('/edit/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM CRIME WHERE crime_id = ?', [req.params.id]);
        const [locations] = await db.query('SELECT * FROM LOCATION');
        if (rows.length === 0) return res.status(404).send('Crime not found');
        res.render('crimes/edit', { crime: rows[0], locations });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Edit Process
router.post('/edit/:id', async (req, res) => {
    const { type, description_level, date, time, severity_level, location_id } = req.body;
    try {
        await db.query(
            'UPDATE CRIME SET type=?, description_level=?, date=?, time=?, severity_level=?, location_id=? WHERE crime_id=?',
            [type, description_level, date, time, severity_level, location_id || null, req.params.id]
        );
        res.redirect('/crimes');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating crime');
    }
});

// Delete
router.get('/delete/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM CRIME WHERE crime_id = ?', [req.params.id]);
        res.redirect('/crimes');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting crime');
    }
});

module.exports = router;
