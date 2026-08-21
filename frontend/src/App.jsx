import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute, { PublicOnlyRoute } from "./components/ProtectedRoute";

import Landing from "./pages/public/Landing";
import OpportunitiesPreview from "./pages/public/OpportunitiesPreview";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import ApplicantLayout from "./layouts/ApplicantLayout";
import ApplicantDashboard from "./pages/applicant/Dashboard";
import FindOpportunities from "./pages/applicant/FindOpportunities";
import OpportunityDetail from "./pages/applicant/OpportunityDetail";
import MyApplications from "./pages/applicant/MyApplications";
import ApplicantProfile from "./pages/applicant/Profile";
import ApplicantMessages from "./pages/applicant/Messages";
import ApplicantNotifications from "./pages/applicant/Notifications";
import MyDocuments from "./pages/applicant/MyDocuments";
import SavedOpportunities from "./pages/applicant/SavedOpportunities";
import Recommended from "./pages/applicant/Recommended";
import ApplicantSettings from "./pages/applicant/Settings";

import ProviderLayout from "./layouts/ProviderLayout";
import ProviderDashboard from "./pages/provider/Dashboard";
import MyOpportunities from "./pages/provider/MyOpportunities";
import PostOpportunity from "./pages/provider/PostOpportunity";
import ProviderApplications from "./pages/provider/Applications";
import ShortlistedCandidates from "./pages/provider/ShortlistedCandidates";
import ProviderReports from "./pages/provider/Reports";
import OrganisationProfile from "./pages/provider/OrganisationProfile";
import ProviderMessages from "./pages/provider/Messages";
import ProviderNotifications from "./pages/provider/Notifications";
import ProviderSettings from "./pages/provider/Settings";

import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import UserManagement from "./pages/admin/UserManagement";
import OpportunitiesAdmin from "./pages/admin/OpportunitiesAdmin";
import ApplicationsAdmin from "./pages/admin/ApplicationsAdmin";
import ReportsAdmin from "./pages/admin/ReportsAdmin";
import NQFManagement from "./pages/admin/NQFManagement";
import ContentManagement from "./pages/admin/ContentManagement";
import SystemSettings from "./pages/admin/SystemSettings";
import AuditLogs from "./pages/admin/AuditLogs";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public site */}
          <Route path="/" element={<Landing />} />
          <Route path="/opportunities-preview" element={<OpportunitiesPreview />} />

          {/* Public-only auth pages — redirect if already logged in */}
          <Route element={<PublicOnlyRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Applicant portal — requires applicant role */}
          <Route element={<ProtectedRoute requiredRole="applicant" />}>
            <Route path="/applicant" element={<ApplicantLayout />}>
              <Route index element={<ApplicantDashboard />} />
              <Route path="opportunities" element={<FindOpportunities />} />
              <Route path="opportunities/:id" element={<OpportunityDetail />} />
              <Route path="applications" element={<MyApplications />} />
              <Route path="profile" element={<ApplicantProfile />} />
              <Route path="messages" element={<ApplicantMessages />} />
              <Route path="notifications" element={<ApplicantNotifications />} />
              <Route path="documents" element={<MyDocuments />} />
              <Route path="saved" element={<SavedOpportunities />} />
              <Route path="recommended" element={<Recommended />} />
              <Route path="settings" element={<ApplicantSettings />} />
            </Route>
          </Route>

          {/* Provider portal — requires provider role */}
          <Route element={<ProtectedRoute requiredRole="provider" />}>
            <Route path="/provider" element={<ProviderLayout />}>
              <Route index element={<ProviderDashboard />} />
              <Route path="opportunities" element={<MyOpportunities />} />
              <Route path="opportunities/new" element={<PostOpportunity />} />
              <Route path="applications" element={<ProviderApplications />} />
              <Route path="shortlisted" element={<ShortlistedCandidates />} />
              <Route path="reports" element={<ProviderReports />} />
              <Route path="profile" element={<OrganisationProfile />} />
              <Route path="messages" element={<ProviderMessages />} />
              <Route path="notifications" element={<ProviderNotifications />} />
              <Route path="settings" element={<ProviderSettings />} />
            </Route>
          </Route>

          {/* Admin console — requires admin role */}
          <Route element={<ProtectedRoute requiredRole="admin" />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="opportunities" element={<OpportunitiesAdmin />} />
              <Route path="applications" element={<ApplicationsAdmin />} />
              <Route path="reports" element={<ReportsAdmin />} />
              <Route path="nqf" element={<NQFManagement />} />
              <Route path="content" element={<ContentManagement />} />
              <Route path="settings" element={<SystemSettings />} />
              <Route path="audit" element={<AuditLogs />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Landing />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
