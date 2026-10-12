const express = require('express');
const router = express.Router();
const db = require('../config/db');

// List All Criminals
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM CRIMINAL ORDER BY criminal_id DESC');
        res.render('criminals/index', { criminals: rows });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Add Form
router.get('/add', (req, res) => {
    res.render('criminals/add');
});

// Add Process
router.post('/add', async (req, res) => {
    const { criminal_id, name, alias, age, gender, address, contact_info } = req.body;
    try {
        await db.query(
            'INSERT INTO CRIMINAL (criminal_id, name, alias, age, gender, address, contact_info) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [criminal_id, name, alias, age, gender, address, contact_info]
        );
        res.redirect('/criminals');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error adding criminal');
    }
});

// Edit Form
router.get('/edit/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM CRIMINAL WHERE criminal_id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).send('Criminal not found');
        res.render('criminals/edit', { criminal: rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Edit Process
router.post('/edit/:id', async (req, res) => {
    const { name, alias, age, gender, address, contact_info } = req.body;
    try {
        await db.query(
            'UPDATE CRIMINAL SET name=?, alias=?, age=?, gender=?, address=?, contact_info=? WHERE criminal_id=?',
            [name, alias, age, gender, address, contact_info, req.params.id]
        );
        res.redirect('/criminals');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating criminal');
    }
});

// Delete
router.get('/delete/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM CRIMINAL WHERE criminal_id = ?', [req.params.id]);
        res.redirect('/criminals');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting criminal');
    }
});

module.exports = router;
