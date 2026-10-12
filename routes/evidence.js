const express = require('express');
const router = express.Router();
const db = require('../config/db');

// List All Evidence
router.get('/', async (req, res) => {
    try {
        const query = `
            SELECT e.*, c.type as crime_type 
            FROM EVIDENCE e 
            LEFT JOIN CRIME c ON e.crime_id = c.crime_id 
            ORDER BY e.evidence_id DESC`;
        const [rows] = await db.query(query);
        res.render('evidence/index', { evidence: rows });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Add Form
router.get('/add', async (req, res) => {
    try {
        const [crimes] = await db.query('SELECT crime_id, type FROM CRIME');
        res.render('evidence/add', { crimes });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Add Process
router.post('/add', async (req, res) => {
    const { evidence_id, type, description, collected_data, crime_id } = req.body;
    try {
        await db.query(
            'INSERT INTO EVIDENCE (evidence_id, type, description, collected_data, crime_id) VALUES (?, ?, ?, ?, ?)',
            [evidence_id, type, description, collected_data, crime_id || null]
        );
        res.redirect('/evidence');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error adding evidence');
    }
});

// Edit Form
router.get('/edit/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM EVIDENCE WHERE evidence_id = ?', [req.params.id]);
        const [crimes] = await db.query('SELECT crime_id, type FROM CRIME');
        if (rows.length === 0) return res.status(404).send('Evidence not found');
        res.render('evidence/edit', { evidence: rows[0], crimes });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Edit Process
router.post('/edit/:id', async (req, res) => {
    const { type, description, collected_data, crime_id } = req.body;
    try {
        await db.query(
            'UPDATE EVIDENCE SET type=?, description=?, collected_data=?, crime_id=? WHERE evidence_id=?',
            [type, description, collected_data, crime_id || null, req.params.id]
        );
        res.redirect('/evidence');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating evidence');
    }
});

// Delete
router.get('/delete/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM EVIDENCE WHERE evidence_id = ?', [req.params.id]);
        res.redirect('/evidence');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting evidence');
    }
});

module.exports = router;
