// Mock/demo data only — mirrors the schema in database/migrations.
// Replace with real API calls once the Spring Boot backend endpoints exist.

export const sectors = [
  "Information Technology", "Construction", "Manufacturing", "Agriculture",
  "Finance and Accounting", "Retail and Wholesale Trade", "Hospitality and Tourism",
  "Health and Social Development", "Transport and Logistics", "Energy",
  "Education and Training", "Mining", "Media, Design and ICT",
];

export const nqfLevels = [
  { id: 1, name: "NQF Level 1", framework: "GFETQSF", example: "Grade 9 / ABET Level 4" },
  { id: 2, name: "NQF Level 2", framework: "GFETQSF", example: "Grade 10 / NCV Level 2" },
  { id: 3, name: "NQF Level 3", framework: "GFETQSF", example: "Grade 11 / NCV Level 3" },
  { id: 4, name: "NQF Level 4", framework: "GFETQSF", example: "Grade 12 / NSC / NCV Level 4" },
  { id: 5, name: "NQF Level 5", framework: "HEQSF", example: "Higher Certificate" },
  { id: 6, name: "NQF Level 6", framework: "HEQSF", example: "Diploma / Advanced Certificate" },
  { id: 7, name: "NQF Level 7", framework: "HEQSF", example: "Bachelor's Degree" },
  { id: 8, name: "NQF Level 8", framework: "HEQSF", example: "Honours Degree" },
  { id: 9, name: "NQF Level 9", framework: "HEQSF", example: "Master's Degree" },
  { id: 10, name: "NQF Level 10", framework: "HEQSF", example: "Doctoral Degree" },
];

export const skills = [
  "Microsoft Excel", "Microsoft Word", "Customer Service", "Communication", "Bookkeeping",
  "Java Programming", "Python Programming", "SQL / Databases", "Electrical Wiring", "Plumbing",
  "Welding", "Carpentry", "Forklift Operation", "First Aid", "Project Management",
  "Teamwork", "Problem Solving", "Sales", "Driving (Code 8/10/14)", "Data Analysis",
];

export const currentApplicant = {
  name: "Lindiwe Mokoena",
  initials: "LM",
  province: "Gauteng",
  town: "Soweto",
  profileStrength: 85,
  qualifications: [
    { title: "National Senior Certificate (Matric)", institution: "Kwena Secondary School", year: 2022, nqf: 4, verified: true },
    { title: "National Certificate (Vocational) Level 4", institution: "Tshwane North TVET College", year: 2023, nqf: 4, verified: false },
  ],
  skillTags: [
    { name: "Microsoft Excel", level: "intermediate" },
    { name: "Customer Service", level: "advanced" },
    { name: "SQL / Databases", level: "beginner" },
    { name: "Communication", level: "advanced" },
    { name: "Data Analysis", level: "beginner" },
  ],
  cv: { fileName: "Lindiwe_Mokoena_CV.pdf", uploadedAt: "2026-06-02" },
};

export const opportunities = [
  {
    id: 1, title: "Software Development Learnership", type: "learnership", sector: "Information Technology",
    provider: "ABC Training Institute", nqf: 5, stipend: 5500, stipendPeriod: "monthly",
    location: "Johannesburg", province: "Gauteng", duration: 12, positions: 15,
    closingDate: "2026-08-15", status: "approved", applications: 45,
    description: "A 12-month learnership combining classroom-based software fundamentals with structured on-the-job mentoring at partner companies. Learners rotate through front-end, back-end, and QA teams.",
    requirements: ["Matric with Mathematics", "Own laptop or willingness to use provided lab", "Reliable transport to Braamfontein campus"],
    requiredSkills: ["SQL / Databases", "Problem Solving"],
  },
  {
    id: 2, title: "Data Analyst Learnership", type: "learnership", sector: "Information Technology",
    provider: "DataTech SA", nqf: 5, stipend: 6000, stipendPeriod: "monthly",
    location: "Sandton", province: "Gauteng", duration: 12, positions: 10,
    closingDate: "2026-08-20", status: "approved", applications: 32,
    description: "Learn to clean, model and visualise data using industry-standard BI tools, with a placement guarantee for top performers at the close of the programme.",
    requirements: ["NQF Level 5 or currently studying towards one", "Basic Excel proficiency", "Analytical mindset"],
    requiredSkills: ["Microsoft Excel", "Data Analysis"],
  },
  {
    id: 3, title: "IT Support Apprenticeship", type: "apprenticeship", sector: "Information Technology",
    provider: "Tech Solutions SA", nqf: 4, stipend: 4200, stipendPeriod: "monthly",
    location: "Pretoria", province: "Gauteng", duration: 18, positions: 8,
    closingDate: "2026-09-01", status: "approved", applications: 28,
    description: "Hands-on desktop support and networking apprenticeship leading to an A+/N+ aligned occupational certificate.",
    requirements: ["Matric", "Comfortable working with the public", "Own transport an advantage"],
    requiredSkills: ["Customer Service", "Communication"],
  },
  {
    id: 4, title: "Business Administration Internship", type: "internship", sector: "Finance and Accounting",
    provider: "Future Leaders (Pty) Ltd", nqf: 6, stipend: 5000, stipendPeriod: "monthly",
    location: "Midrand", province: "Gauteng", duration: 6, positions: 5,
    closingDate: "2026-08-10", status: "approved", applications: 19,
    description: "Rotational internship across finance, HR and operations for recent diploma graduates.",
    requirements: ["National Diploma in Business or related field", "Strong Excel skills"],
    requiredSkills: ["Microsoft Excel", "Bookkeeping"],
  },
  {
    id: 5, title: "Marketing Learnership", type: "learnership", sector: "Media, Design and ICT",
    provider: "Creative Minds Academy", nqf: 5, stipend: 4800, stipendPeriod: "monthly",
    location: "Cape Town", province: "Western Cape", duration: 12, positions: 12,
    closingDate: "2026-07-30", status: "closed", applications: 51,
    description: "Digital marketing fundamentals, content creation and campaign analytics.",
    requirements: ["Matric", "Social-media literate"],
    requiredSkills: ["Communication", "Sales"],
  },
  {
    id: 6, title: "Project Management Internship", type: "internship", sector: "Construction",
    provider: "PM Institute", nqf: 6, stipend: 6500, stipendPeriod: "monthly",
    location: "Rosebank", province: "Gauteng", duration: 9, positions: 6,
    closingDate: "2026-09-05", status: "approved", applications: 14,
    description: "Support site and portfolio project managers on active construction programmes.",
    requirements: ["Diploma in Project Management, Construction or related", "Valid driver's licence"],
    requiredSkills: ["Project Management", "Teamwork"],
  },
  {
    id: 7, title: "Cybersecurity Learnership", type: "learnership", sector: "Information Technology",
    provider: "SecureNet Academy", nqf: 5, stipend: 5800, stipendPeriod: "monthly",
    location: "Centurion", province: "Gauteng", duration: 12, positions: 10,
    closingDate: "2026-08-28", status: "pending_approval", applications: 0,
    description: "Foundational security operations training with a SOC-analyst work placement component.",
    requirements: ["NQF Level 4", "Interest in networks and security"],
    requiredSkills: ["SQL / Databases", "Problem Solving"],
  },
  {
    id: 8, title: "Electrical Apprenticeship", type: "apprenticeship", sector: "Energy",
    provider: "PowerGrid Training Centre", nqf: 4, stipend: 4500, stipendPeriod: "monthly",
    location: "Vanderbijlpark", province: "Gauteng", duration: 24, positions: 20,
    closingDate: "2026-09-15", status: "approved", applications: 63,
    description: "Trade-test aligned electrical apprenticeship with a host employer for the full duration.",
    requirements: ["Grade 10 minimum with Maths & Science", "Physically fit for site work"],
    requiredSkills: ["Electrical Wiring", "First Aid"],
  },
];

export const applicationStatuses = ["submitted", "under_review", "shortlisted", "rejected", "offered", "accepted"];

export const myApplications = [
  { id: 101, opportunityId: 1, title: "Software Development Learnership", org: "ABC Training Institute", status: "shortlisted", appliedAt: "2026-07-05", updatedAt: "2026-07-18" },
  { id: 102, opportunityId: 4, title: "Business Administration Internship", org: "Future Leaders (Pty) Ltd", status: "under_review", appliedAt: "2026-07-10", updatedAt: "2026-07-15" },
  { id: 103, opportunityId: 3, title: "IT Support Apprenticeship", org: "Tech Solutions SA", status: "submitted", appliedAt: "2026-07-14", updatedAt: "2026-07-14" },
  { id: 104, opportunityId: 5, title: "Marketing Learnership", org: "Creative Minds Academy", status: "rejected", appliedAt: "2026-06-20", updatedAt: "2026-07-02" },
];

export const providerApplicants = [
  { id: 1, name: "Anele Dlamini", opportunity: "Software Developer Learnership", status: "shortlisted", appliedAt: "2026-07-18", nqf: 5, match: 92 },
  { id: 2, name: "Sipho Khumalo", opportunity: "IT Support Apprenticeship", status: "under_review", appliedAt: "2026-07-17", nqf: 4, match: 81 },
  { id: 3, name: "Nomsa Zulu", opportunity: "Data Analyst Learnership", status: "submitted", appliedAt: "2026-07-16", nqf: 5, match: 88 },
  { id: 4, name: "Thando Maseko", opportunity: "Software Developer Learnership", status: "under_review", appliedAt: "2026-07-15", nqf: 5, match: 74 },
  { id: 5, name: "Kgosi Matlala", opportunity: "IT Support Apprenticeship", status: "rejected", appliedAt: "2026-07-10", nqf: 3, match: 55 },
  { id: 6, name: "Palesa Nkosi", opportunity: "Data Analyst Learnership", status: "offered", appliedAt: "2026-07-08", nqf: 6, match: 95 },
];

export const notifications = [
  { id: 1, type: "application_status", title: "Application shortlisted", message: 'Your application for "Software Development Learnership" is now: shortlisted', read: false, at: "2026-07-18T09:20:00" },
  { id: 2, type: "new_match", title: "New match for you", message: "Cybersecurity Learnership matches 88% of your profile.", read: false, at: "2026-07-17T14:05:00" },
  { id: 3, type: "closing_reminder", title: "Closing soon", message: "Business Administration Internship closes in 5 days.", read: false, at: "2026-07-16T08:00:00" },
  { id: 4, type: "application_status", title: "Application received", message: 'We received your application for "IT Support Apprenticeship".', read: true, at: "2026-07-14T11:40:00" },
  { id: 5, type: "system", title: "Profile verified", message: "Your ID document was verified by an admin.", read: true, at: "2026-07-10T10:00:00" },
];

export const recommended = [
  { id: 7, title: "Cybersecurity Learnership", org: "SecureNet Academy", match: 88, nqf: 5 },
  { id: 6, title: "Project Management Internship", org: "PM Institute", match: 74, nqf: 6 },
  { id: 2, title: "Data Analyst Learnership", org: "DataTech SA", match: 92, nqf: 5 },
];

export const adminUsers = [
  { id: 1, name: "Lindiwe Mokoena", email: "lindiwe.m@example.co.za", role: "applicant", status: "active", joined: "2026-03-14" },
  { id: 2, name: "Thabo Ndlovu", email: "thabo@techsolutions.co.za", role: "provider", status: "active", joined: "2026-02-02" },
  { id: 3, name: "ABC Training Institute", email: "admin@abctraining.co.za", role: "provider", status: "pending", joined: "2026-07-19" },
  { id: 4, name: "Nomvula Sithole", email: "nomvula.s@example.co.za", role: "applicant", status: "active", joined: "2026-06-30" },
  { id: 5, name: "Sipho Khumalo", email: "sipho.k@example.co.za", role: "applicant", status: "suspended", joined: "2026-01-11" },
  { id: 6, name: "PM Institute", email: "hr@pminstitute.co.za", role: "provider", status: "active", joined: "2025-11-08" },
];

export const auditLog = [
  { id: 1, action: "OPPORTUNITY_APPROVED", entity: "Software Development Learnership", user: "Admin User", at: "2026-07-19 09:12" },
  { id: 2, action: "APPLICATION_SHORTLISTED", entity: "Application #101", user: "Thabo Ndlovu", at: "2026-07-18 09:20" },
  { id: 3, action: "PROVIDER_VERIFIED", entity: "ABC Training Institute", user: "Admin User", at: "2026-07-18 08:03" },
  { id: 4, action: "LOGIN", entity: "User #1", user: "Lindiwe Mokoena", at: "2026-07-18 07:55" },
  { id: 5, action: "QUALIFICATION_ADDED", entity: "Occupational Certificate (Trade)", user: "Admin User", at: "2026-07-17 16:40" },
  { id: 6, action: "OPPORTUNITY_REJECTED", entity: "Unpaid Retail Internship", user: "Admin User", at: "2026-07-16 12:10" },
];

export const placementBySector = [
  { sector: "Information Technology", rate: 78 },
  { sector: "Engineering", rate: 72 },
  { sector: "Business & Finance", rate: 65 },
  { sector: "Health & Social Services", rate: 60 },
  { sector: "Education & Training", rate: 58 },
];

export const applicationVolumeMonths = [
  { month: "Feb", value: 1450 }, { month: "Mar", value: 1780 }, { month: "Apr", value: 1690 },
  { month: "May", value: 2120 }, { month: "Jun", value: 2340 }, { month: "Jul", value: 2560 },
];

export const statusColor = {
  submitted: "teal", received: "teal", under_review: "sun", shortlisted: "veld",
  offered: "veld", accepted: "veld", rejected: "rust", closed: "stone",
  approved: "veld", pending_approval: "sun", draft: "stone", filled: "stone",
  active: "veld", pending: "sun", suspended: "rust",
};

export const statusLabel = {
  submitted: "Received", received: "Received", under_review: "In Review", shortlisted: "Shortlisted",
  offered: "Offer Made", accepted: "Accepted", rejected: "Rejected", closed: "Closed",
  approved: "Approved", pending_approval: "Pending Approval", draft: "Draft", filled: "Filled",
  active: "Active", pending: "Pending", suspended: "Suspended",
};
