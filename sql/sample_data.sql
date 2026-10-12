-- sample_data.sql
USE crime_analysis;

-- Insert Locations
INSERT INTO LOCATION (location_id, city, state, country, ip_address) VALUES
(1, 'Mumbai', 'Maharashtra', 'India', '192.168.1.1'),
(2, 'Delhi', 'Delhi', 'India', '103.25.14.2'),
(3, 'Bangalore', 'Karnataka', 'India', '172.16.0.45'),
(4, 'New York', 'NY', 'USA', '65.43.21.10'),
(5, 'London', 'London', 'UK', '82.16.5.9');

-- Insert Criminals
INSERT INTO CRIMINAL (criminal_id, name, alias, age, gender, address, contact_info) VALUES
(1, 'Amit Sharma', 'Cyber_Ghost', 28, 'Male', 'Dharavi, Mumbai', '9876543210'),
(2, 'John Doe', 'Shadow', 35, 'Male', 'Queens, NYC', '1234567890'),
(3, 'Priya Verma', 'Phish_Queen', 24, 'Female', 'HSR Layout, Bangalore', '7766554433'),
(4, 'Robert Miller', 'Ransom_King', 40, 'Male', 'Baker St, London', '4422331100'),
(5, 'Sunil Yadav', 'Spider', 31, 'Male', 'Rohini, Delhi', '9988776655');

-- Insert Crimes
INSERT INTO CRIME (crime_id, type, description_level, date, time, severity_level, location_id) VALUES
(1, 'Phishing', 'Bulk email scam targeting bank clones', '2026-03-01', '10:30:00', 'Medium', 1),
(2, 'Ransomware', 'WannaCry variant targeting hospitals', '2026-03-15', '02:00:00', 'High', 4),
(3, 'Identity Theft', 'Stolen credit card information from e-com site', '2026-03-20', '18:45:00', 'High', 2),
(4, 'Cyber Bullying', 'Social media harassment campaign', '2026-04-05', '09:15:00', 'Low', 3),
(5, 'Online Fraud', 'Fake holiday package scam', '2026-04-10', '14:20:00', 'Medium', 5);

-- Insert Victims
INSERT INTO VICTIM (victim_id, name, organization, age, gender, contact_info) VALUES
(1, 'HDFC Bank Customer', 'HDFC Bank', NULL, NULL, 'support@bank.com'),
(2, 'St. Mary Hospital', 'Healthcare Inc', NULL, NULL, 'admin@hospital.org'),
(3, 'Rahul Khanna', NULL, 32, 'Male', 'rahul@gmail.com'),
(4, 'Sophia Wilson', NULL, 19, 'Female', 'sophia@edu.com'),
(5, 'Travel Shoppe', 'Travel Agency', NULL, NULL, 'contact@travel.com');

-- Insert Evidence
INSERT INTO EVIDENCE (evidence_id, type, description, collected_data, crime_id) VALUES
(1, 'Log Files', 'Server logs showing unauthorized access', 'Access Logs from 2026-03-01', 1),
(2, 'Bitcoin Wallet', 'Ransom payment address', '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', 2),
(3, 'IP Trace', 'Tracing the attacker origin', 'Origin IP: 103.25.14.2', 3),
(4, 'Screenshots', 'Harassment messages on platform', 'IMG_001.jpg, IMG_002.jpg', 4),
(5, 'Bank Statements', 'Transaction records of fraud money', 'Transfer from ACC123 to ACC999', 5);

-- Insert Investigations
INSERT INTO INVESTIGATION (investigation_id, status, officer_name, start_date, end_date, crime_id) VALUES
(1, 'Open', 'Inspector Vikram', '2026-03-02', NULL, 1),
(2, 'Pending', 'Agnet Smith', '2026-03-16', NULL, 2),
(3, 'Closed', 'DCP Sharma', '2026-03-21', '2026-04-01', 3),
(4, 'Open', 'Inspector Anjali', '2026-04-06', NULL, 4),
(5, 'Pending', 'Officer Brown', '2026-04-11', NULL, 5);

-- Insert Patterns
INSERT INTO PATTERN (pattern_id, pattern_type, description) VALUES
(1, 'Social Engineering', 'Manipulating individuals into divulging info'),
(2, 'Zero-Day Exploit', 'Attacking unpatched software vulnerabilities'),
(3, 'Brute Force', 'Repeatedly trying passwords'),
(4, 'DDOS', 'Overwhelming servers with traffic'),
(5, 'Spear Phishing', 'Targeted phishing for high-value individuals');

-- Insert Junctions (Mappings)
INSERT INTO CRIMINAL_CRIME (criminal_id, crime_id) VALUES (1, 1), (3, 1), (4, 2), (2, 3), (5, 5);
INSERT INTO CRIME_VICTIM (crime_id, victim_id) VALUES (1, 1), (2, 2), (3, 3), (4, 4), (5, 5);
INSERT INTO CRIME_PATTERN (crime_id, pattern_id) VALUES (1, 1), (2, 2), (3, 1), (4, 5), (5, 1);
