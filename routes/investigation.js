const express = require('express');
const router = express.Router();
const db = require('../config/db');

// List All Investigations
router.get('/', async (req, res) => {
    try {
        const query = `
            SELECT i.*, c.type as crime_type 
            FROM INVESTIGATION i 
            LEFT JOIN CRIME c ON i.crime_id = c.crime_id 
            ORDER BY i.start_date DESC`;
        const [rows] = await db.query(query);
        res.render('investigations/index', { investigations: rows });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Add Form
router.get('/add', async (req, res) => {
    try {
        const [crimes] = await db.query('SELECT crime_id, type FROM CRIME');
        res.render('investigations/add', { crimes });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Add Process
router.post('/add', async (req, res) => {
    const { investigation_id, status, officer_name, start_date, end_date, crime_id } = req.body;
    try {
        await db.query(
            'INSERT INTO INVESTIGATION (investigation_id, status, officer_name, start_date, end_date, crime_id) VALUES (?, ?, ?, ?, ?, ?)',
            [investigation_id, status, officer_name, start_date, end_date || null, crime_id || null]
        );
        res.redirect('/investigations');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error adding investigation');
    }
});

// Edit Form
router.get('/edit/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM INVESTIGATION WHERE investigation_id = ?', [req.params.id]);
        const [crimes] = await db.query('SELECT crime_id, type FROM CRIME');
        if (rows.length === 0) return res.status(404).send('Investigation not found');
        res.render('investigations/edit', { investigation: rows[0], crimes });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Edit Process
router.post('/edit/:id', async (req, res) => {
    const { status, officer_name, start_date, end_date, crime_id } = req.body;
    try {
        await db.query(
            'UPDATE INVESTIGATION SET status=?, officer_name=?, start_date=?, end_date=?, crime_id=? WHERE investigation_id=?',
            [status, officer_name, start_date, end_date || null, crime_id || null, req.params.id]
        );
        res.redirect('/investigations');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating investigation');
    }
});

// Delete
router.get('/delete/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM INVESTIGATION WHERE investigation_id = ?', [req.params.id]);
        res.redirect('/investigations');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting investigation');
    }
});

module.exports = router;
