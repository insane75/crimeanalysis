const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Session Configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// Global Variables for Views
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.success_msg = null;
    res.locals.error_msg = null;
    next();
});

// Auth Middleware
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    }
    res.redirect('/login');
};

// Routes
const indexRoutes = require('./routes/index');
const criminalRoutes = require('./routes/criminal');
const crimeRoutes = require('./routes/crime');
const victimRoutes = require('./routes/victim');
const locationRoutes = require('./routes/location');
const evidenceRoutes = require('./routes/evidence');
const investigationRoutes = require('./routes/investigation');
const patternRoutes = require('./routes/pattern');
const relationshipRoutes = require('./routes/relationship');
const analyticsRoutes = require('./routes/analytics');
const dbmsRoutes = require('./routes/dbms');

app.use('/', indexRoutes);
app.use('/criminals', isAuthenticated, criminalRoutes);
app.use('/crimes', isAuthenticated, crimeRoutes);
app.use('/victims', isAuthenticated, victimRoutes);
app.use('/locations', isAuthenticated, locationRoutes);
app.use('/evidence', isAuthenticated, evidenceRoutes);
app.use('/investigations', isAuthenticated, investigationRoutes);
app.use('/patterns', isAuthenticated, patternRoutes);
app.use('/relationships', isAuthenticated, relationshipRoutes);
app.use('/analytics', isAuthenticated, analyticsRoutes);
app.use('/dbms-queries', isAuthenticated, dbmsRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
