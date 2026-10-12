const express = require('express');
const router = express.Router();
const db = require('../config/db');

// DBMS Showcase Page
router.get('/', async (req, res) => {
    try {
        // 1. Fetch from SQL VIEW
        const [viewData] = await db.query('SELECT * FROM crime_details_view LIMIT 10');
        
        // 2. Call STORED PROCEDURE (Example: High severity)
        // Note: mysql2 uses [[data], [metadata]] for procedure calls
        const [procResults] = await db.query('CALL GetCrimesBySeverity(?)', ['High']);
        const highSeverityCrimes = procResults[0];

        res.render('dbms_queries', {
            viewData,
            highSeverityCrimes,
            req,
            error: null
        });
    } catch (err) {
        console.error(err);
        res.render('dbms_queries', { viewData: [], highSeverityCrimes: [], req, error: err.message });
    }
});

// Trigger Demo (Attempting to insert invalid investigation dates)
router.post('/test-trigger', async (req, res) => {
    try {
        // Attempting to insert an investigation where end_date < start_date
        // This should trigger the 'validate_investigation_dates' trigger in schema.sql
        await db.query(`
            INSERT INTO INVESTIGATION (investigation_id, status, officer_name, start_date, end_date, crime_id) 
            VALUES (999, 'Open', 'Test Officer', '2026-05-01', '2026-04-01', 1)
        `);
        res.redirect('/dbms-queries?trigger_status=failed_to_trigger');
    } catch (err) {
        // The trigger should SIGNAL SQLSTATE '45000'
        console.log('Trigger Worked:', err.message);
        res.redirect(`/dbms-queries?trigger_status=worked&msg=${encodeURIComponent(err.message)}`);
    }
});

module.exports = router;
