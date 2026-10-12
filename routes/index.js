const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Dashboard / Home
router.get('/', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    try {
        // Fetch some basic stats for the dashboard
        const [crimeCount] = await db.query('SELECT COUNT(*) as count FROM CRIME');
        const [criminalCount] = await db.query('SELECT COUNT(*) as count FROM CRIMINAL');
        const [victimCount] = await db.query('SELECT COUNT(*) as count FROM VICTIM');
        const [investigationCount] = await db.query('SELECT COUNT(*) as count FROM INVESTIGATION');

        res.render('dashboard', {
            stats: {
                crimes: crimeCount[0].count,
                criminals: criminalCount[0].count,
                victims: victimCount[0].count,
                investigations: investigationCount[0].count
            }
        });
    } catch (err) {
        console.error(err);
        res.render('dashboard', { stats: { crimes: 0, criminals: 0, victims: 0, investigations: 0 } });
    }
});

// Login Page
router.get('/login', (req, res) => {
    if (req.session.user) return res.redirect('/');
    res.render('login', { error: null });
});

// Login Process
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    // Simple demo logic: admin/password
    if (username === 'admin' && password === 'admin') {
        req.session.user = { id: 1, name: 'Administrator', role: 'Admin' };
        return res.redirect('/');
    } else {
        res.render('login', { error: 'Invalid username or password' });
    }
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

module.exports = router;
