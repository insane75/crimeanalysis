const express = require('express');
const router = express.Router();
const db = require('../config/db');

// List All Patterns
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM PATTERN ORDER BY pattern_id DESC');
        res.render('patterns/index', { patterns: rows });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Add Form
router.get('/add', (req, res) => {
    res.render('patterns/add');
});

// Add Process
router.post('/add', async (req, res) => {
    const { pattern_id, pattern_type, description } = req.body;
    try {
        await db.query(
            'INSERT INTO PATTERN (pattern_id, pattern_type, description) VALUES (?, ?, ?)',
            [pattern_id, pattern_type, description]
        );
        res.redirect('/patterns');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error adding pattern');
    }
});

// Edit Form
router.get('/edit/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM PATTERN WHERE pattern_id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).send('Pattern not found');
        res.render('patterns/edit', { pattern: rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Edit Process
router.post('/edit/:id', async (req, res) => {
    const { pattern_type, description } = req.body;
    try {
        await db.query(
            'UPDATE PATTERN SET pattern_type=?, description=? WHERE pattern_id=?',
            [pattern_type, description, req.params.id]
        );
        res.redirect('/patterns');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating pattern');
    }
});

// Delete
router.get('/delete/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM PATTERN WHERE pattern_id = ?', [req.params.id]);
        res.redirect('/patterns');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting pattern');
    }
});

module.exports = router;
