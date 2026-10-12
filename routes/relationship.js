const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Main Relationships Page
router.get('/', async (req, res) => {
    try {
        const [criminalCrimes] = await db.query(`
            SELECT cc.*, c.name as criminal_name, cr.type as crime_type 
            FROM CRIMINAL_CRIME cc
            JOIN CRIMINAL c ON cc.criminal_id = c.criminal_id
            JOIN CRIME cr ON cc.crime_id = cr.crime_id
        `);

        const [crimeVictims] = await db.query(`
            SELECT cv.*, cr.type as crime_type, v.name as victim_name 
            FROM CRIME_VICTIM cv
            JOIN CRIME cr ON cv.crime_id = cr.crime_id
            JOIN VICTIM v ON cv.victim_id = v.victim_id
        `);

        const [crimePatterns] = await db.query(`
            SELECT cp.*, cr.type as crime_type, p.pattern_type 
            FROM CRIME_PATTERN cp
            JOIN CRIME cr ON cp.crime_id = cr.crime_id
            JOIN PATTERN p ON cp.pattern_id = p.pattern_id
        `);

        // Fetch data for dropdowns
        const [criminals] = await db.query('SELECT criminal_id, name FROM CRIMINAL');
        const [crimes] = await db.query('SELECT crime_id, type FROM CRIME');
        const [victims] = await db.query('SELECT victim_id, name FROM VICTIM');
        const [patterns] = await db.query('SELECT pattern_id, pattern_type FROM PATTERN');

        res.render('relationships/index', {
            criminalCrimes,
            crimeVictims,
            crimePatterns,
            criminals,
            crimes,
            victims,
            patterns
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Map Criminal to Crime
router.post('/criminal-crime', async (req, res) => {
    const { criminal_id, crime_id } = req.body;
    try {
        await db.query('INSERT INTO CRIMINAL_CRIME (criminal_id, crime_id) VALUES (?, ?)', [criminal_id, crime_id]);
        res.redirect('/relationships');
    } catch (err) {
        console.error(err);
        res.status(500).send('Relationship already exists or DB error');
    }
});

// Delete Criminal-Crime Mapping
router.post('/criminal-crime/delete', async (req, res) => {
    const { criminal_id, crime_id } = req.body;
    try {
        await db.query('DELETE FROM CRIMINAL_CRIME WHERE criminal_id = ? AND crime_id = ?', [criminal_id, crime_id]);
        res.redirect('/relationships');
    } catch (err) {
        console.error(err);
        res.status(500).send('Delete failed');
    }
});

// Map Crime to Victim
router.post('/crime-victim', async (req, res) => {
    const { crime_id, victim_id } = req.body;
    try {
        await db.query('INSERT INTO CRIME_VICTIM (crime_id, victim_id) VALUES (?, ?)', [crime_id, victim_id]);
        res.redirect('/relationships');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error');
    }
});

// Delete Crime-Victim Mapping
router.post('/crime-victim/delete', async (req, res) => {
    const { crime_id, victim_id } = req.body;
    try {
        await db.query('DELETE FROM CRIME_VICTIM WHERE crime_id = ? AND victim_id = ?', [crime_id, victim_id]);
        res.redirect('/relationships');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error');
    }
});

// Map Crime to Pattern
router.post('/crime-pattern', async (req, res) => {
    const { crime_id, pattern_id } = req.body;
    try {
        await db.query('INSERT INTO CRIME_PATTERN (crime_id, pattern_id) VALUES (?, ?)', [crime_id, pattern_id]);
        res.redirect('/relationships');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error');
    }
});

// Delete Crime-Pattern Mapping
router.post('/crime-pattern/delete', async (req, res) => {
    const { crime_id, pattern_id } = req.body;
    try {
        await db.query('DELETE FROM CRIME_PATTERN WHERE crime_id = ? AND pattern_id = ?', [crime_id, pattern_id]);
        res.redirect('/relationships');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error');
    }
});

module.exports = router;
