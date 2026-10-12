const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Analytics Page
router.get('/', async (req, res) => {
    try {
        // Query 1: Crimes by Type
        const [crimesByType] = await db.query('SELECT type, COUNT(*) as count FROM CRIME GROUP BY type');
        
        // Query 2: Crimes by Severity
        const [crimesBySeverity] = await db.query('SELECT severity_level, COUNT(*) as count FROM CRIME GROUP BY severity_level');
        
        // Query 3: Investigations by Status
        const [investigationsByStatus] = await db.query('SELECT status, COUNT(*) as count FROM INVESTIGATION GROUP BY status');

        // Query 4: Victims by Organization vs Individual
        const [victimsByOrg] = await db.query(`
            SELECT 
                CASE WHEN organization IS NULL OR organization = '' THEN 'Individual' ELSE 'Organization' END as category,
                COUNT(*) as count 
            FROM VICTIM 
            GROUP BY category
        `);

        res.render('analytics', {
            crimesByType,
            crimesBySeverity,
            investigationsByStatus,
            victimsByOrg
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
