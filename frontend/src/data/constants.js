/**
 * Status → colour / label maps used by StatusBadge and other widgets.
 * These are display configuration, not mock data — they map backend
 * status codes to the design-system colour tokens and human labels.
 */

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
