const express = require('express');
const router = express.Router();
const db = require('../config/db');

// List All Victims
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM VICTIM ORDER BY victim_id DESC');
        res.render('victims/index', { victims: rows });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Add Form
router.get('/add', (req, res) => {
    res.render('victims/add');
});

// Add Process
router.post('/add', async (req, res) => {
    const { victim_id, name, organization, age, gender, contact_info } = req.body;
    try {
        await db.query(
            'INSERT INTO VICTIM (victim_id, name, organization, age, gender, contact_info) VALUES (?, ?, ?, ?, ?, ?)',
            [victim_id, name, organization, age || null, gender, contact_info]
        );
        res.redirect('/victims');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error adding victim');
    }
});

// Edit Form
router.get('/edit/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM VICTIM WHERE victim_id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).send('Victim not found');
        res.render('victims/edit', { victim: rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Edit Process
router.post('/edit/:id', async (req, res) => {
    const { name, organization, age, gender, contact_info } = req.body;
    try {
        await db.query(
            'UPDATE VICTIM SET name=?, organization=?, age=?, gender=?, contact_info=? WHERE victim_id=?',
            [name, organization, age || null, gender, contact_info, req.params.id]
        );
        res.redirect('/victims');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating victim');
    }
});

// Delete
router.get('/delete/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM VICTIM WHERE victim_id = ?', [req.params.id]);
        res.redirect('/victims');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting victim');
    }
});

module.exports = router;
