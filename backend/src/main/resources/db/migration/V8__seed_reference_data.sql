-- =====================================================================
-- V8__seed_reference_data.sql
-- Seed data for NQF levels, common registered qualification types,
-- sectors, and a starter skills list.
-- Source: SAQA (South African Qualifications Authority)
--   https://www.saqa.org.za/level-descriptors-for-the-south-african-national-qualifications-framework/
-- =====================================================================

INSERT INTO nqf_levels (id, level_name, sub_framework, typical_example) VALUES
    (1,  'NQF Level 1',  'GFETQSF', 'Grade 9 / ABET Level 4'),
    (2,  'NQF Level 2',  'GFETQSF', 'Grade 10 / National Certificate (Vocational) Level 2'),
    (3,  'NQF Level 3',  'GFETQSF', 'Grade 11 / National Certificate (Vocational) Level 3'),
    (4,  'NQF Level 4',  'GFETQSF', 'Grade 12 / National Senior Certificate / NCV Level 4'),
    (5,  'NQF Level 5',  'HEQSF',   'Higher Certificate'),
    (6,  'NQF Level 6',  'HEQSF',   'Diploma / Advanced Certificate'),
    (7,  'NQF Level 7',  'HEQSF',   'Bachelor''s Degree / Advanced Diploma'),
    (8,  'NQF Level 8',  'HEQSF',   'Honours Degree / Postgraduate Diploma'),
    (9,  'NQF Level 9',  'HEQSF',   'Master''s Degree'),
    (10, 'NQF Level 10', 'HEQSF',   'Doctoral Degree');

INSERT INTO qualification_types (title, nqf_level_id, qualification_category) VALUES
    ('National Senior Certificate (Matric)',            4,  'School Leaving'),
    ('National Certificate (Vocational) Level 4',       4,  'TVET Certificate'),
    ('Learnership Certificate - Level 2',                2,  'Learnership'),
    ('Learnership Certificate - Level 3',                3,  'Learnership'),
    ('Learnership Certificate - Level 4',                4,  'Learnership'),
    ('Occupational Certificate (Trade)',                4,  'Trade/Occupational'),
    ('Higher Certificate',                              5,  'Higher Certificate'),
    ('National Diploma',                                6,  'Diploma'),
    ('Advanced Certificate',                            6,  'Certificate'),
    ('Bachelor''s Degree',                              7,  'Degree'),
    ('Advanced Diploma',                                7,  'Diploma'),
    ('Postgraduate Diploma',                            8,  'Diploma'),
    ('Honours Degree',                                  8,  'Degree'),
    ('Master''s Degree',                                9,  'Degree'),
    ('Doctoral Degree',                                 10, 'Degree');

INSERT INTO sectors (name) VALUES
    ('Information Technology'),
    ('Construction'),
    ('Manufacturing'),
    ('Agriculture'),
    ('Finance and Accounting'),
    ('Retail and Wholesale Trade'),
    ('Hospitality and Tourism'),
    ('Health and Social Development'),
    ('Transport and Logistics'),
    ('Energy'),
    ('Education and Training'),
    ('Mining'),
    ('Media, Design and ICT');

INSERT INTO skills (name, category) VALUES
    ('Microsoft Excel', 'Technical'),
    ('Microsoft Word', 'Technical'),
    ('Customer Service', 'Soft Skill'),
    ('Communication', 'Soft Skill'),
    ('Bookkeeping', 'Technical'),
    ('Java Programming', 'Technical'),
    ('Python Programming', 'Technical'),
    ('SQL / Databases', 'Technical'),
    ('Electrical Wiring', 'Trade'),
    ('Plumbing', 'Trade'),
    ('Welding', 'Trade'),
    ('Carpentry', 'Trade'),
    ('Forklift Operation', 'Trade'),
    ('First Aid', 'Trade'),
    ('Project Management', 'Soft Skill'),
    ('Teamwork', 'Soft Skill'),
    ('Problem Solving', 'Soft Skill'),
    ('Sales', 'Soft Skill'),
    ('Driving (Code 8/10/14)', 'Trade'),
    ('Data Analysis', 'Technical');
