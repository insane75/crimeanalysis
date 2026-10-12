-- schema.sql
CREATE DATABASE IF NOT EXISTS crime_analysis;
USE crime_analysis;

-- 1. CRIMINAL
CREATE TABLE IF NOT EXISTS CRIMINAL (
    criminal_id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    alias VARCHAR(100),
    age INT,
    gender VARCHAR(10),
    address VARCHAR(255),
    contact_info VARCHAR(100)
);

-- 2. LOCATION
CREATE TABLE IF NOT EXISTS LOCATION (
    location_id INT PRIMARY KEY,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    ip_address VARCHAR(50)
);

-- 3. CRIME
CREATE TABLE IF NOT EXISTS CRIME (
    crime_id INT PRIMARY KEY,
    type VARCHAR(100) NOT NULL,
    description_level VARCHAR(255),
    date DATE NOT NULL,
    time TIME,
    severity_level ENUM('Low', 'Medium', 'High') NOT NULL,
    location_id INT,
    FOREIGN KEY (location_id) REFERENCES LOCATION(location_id) ON DELETE SET NULL
);

-- 4. VICTIM
CREATE TABLE IF NOT EXISTS VICTIM (
    victim_id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    organization VARCHAR(100),
    age INT,
    gender VARCHAR(10),
    contact_info VARCHAR(100)
);

-- 5. EVIDENCE
CREATE TABLE IF NOT EXISTS EVIDENCE (
    evidence_id INT PRIMARY KEY,
    type VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    collected_data TEXT,
    crime_id INT,
    FOREIGN KEY (crime_id) REFERENCES CRIME(crime_id) ON DELETE CASCADE
);

-- 6. INVESTIGATION
CREATE TABLE IF NOT EXISTS INVESTIGATION (
    investigation_id INT PRIMARY KEY,
    status ENUM('Open', 'Closed', 'Pending') NOT NULL,
    officer_name VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    crime_id INT,
    FOREIGN KEY (crime_id) REFERENCES CRIME(crime_id) ON DELETE CASCADE
);

-- 7. PATTERN
CREATE TABLE IF NOT EXISTS PATTERN (
    pattern_id INT PRIMARY KEY,
    pattern_type VARCHAR(100) NOT NULL,
    description VARCHAR(255)
);

-- 8. CRIMINAL_CRIME (Junction Table)
CREATE TABLE IF NOT EXISTS CRIMINAL_CRIME (
    criminal_id INT,
    crime_id INT,
    PRIMARY KEY (criminal_id, crime_id),
    FOREIGN KEY (criminal_id) REFERENCES CRIMINAL(criminal_id) ON DELETE CASCADE,
    FOREIGN KEY (crime_id) REFERENCES CRIME(crime_id) ON DELETE CASCADE
);

-- 9. CRIME_VICTIM (Junction Table)
CREATE TABLE IF NOT EXISTS CRIME_VICTIM (
    crime_id INT,
    victim_id INT,
    PRIMARY KEY (crime_id, victim_id),
    FOREIGN KEY (crime_id) REFERENCES CRIME(crime_id) ON DELETE CASCADE,
    FOREIGN KEY (victim_id) REFERENCES VICTIM(victim_id) ON DELETE CASCADE
);

-- 10. CRIME_PATTERN (Junction Table)
CREATE TABLE IF NOT EXISTS CRIME_PATTERN (
    crime_id INT,
    pattern_id INT,
    PRIMARY KEY (crime_id, pattern_id),
    FOREIGN KEY (crime_id) REFERENCES CRIME(crime_id) ON DELETE CASCADE,
    FOREIGN KEY (pattern_id) REFERENCES PATTERN(pattern_id) ON DELETE CASCADE
);

-- SQL VIEW
CREATE OR REPLACE VIEW crime_details_view AS
SELECT c.crime_id, c.type, c.severity_level, c.date, l.city, l.state
FROM CRIME c
LEFT JOIN LOCATION l ON c.location_id = l.location_id;

-- STORED PROCEDURE
DELIMITER //
CREATE PROCEDURE GetCrimesBySeverity(IN severity VARCHAR(10))
BEGIN
    SELECT * FROM CRIME WHERE severity_level = severity;
END //
DELIMITER ;

-- TRIGGER (Example: Validate investigation end_date)
DELIMITER //
CREATE TRIGGER validate_investigation_dates
BEFORE INSERT ON INVESTIGATION
FOR EACH ROW
BEGIN
    IF NEW.end_date IS NOT NULL AND NEW.end_date < NEW.start_date THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'End date cannot be earlier than start date';
    END IF;
END //
DELIMITER ;
