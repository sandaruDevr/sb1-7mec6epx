import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './dashboard';
import UpgradePlan from './upgradePlan';
import SummariesHistory from './summariesHistory';
import AccountSettings from './accountSettings';
import AccountDetails from './accountSettings/AccountDetails';
import NotificationSettings from './accountSettings/NotificationSettings';
import SubscriptionManagement from './accountSettings/SubscriptionManagement';
import HelpSupport from './help';
import NewSummary from './newSummary';
import Login from './auth/Login';
import SignUp from './auth/SignUp';
import { AuthProvider } from './auth/AuthContext';
import PrivateRoute from './auth/PrivateRoute';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        <Route path="/upgrade" element={
          <PrivateRoute>
            <UpgradePlan />
          </PrivateRoute>
        } />
        <Route path="/history" element={
          <PrivateRoute>
            <SummariesHistory />
          </PrivateRoute>
        } />
        <Route path="/new" element={
          <PrivateRoute>
            <NewSummary />
          </PrivateRoute>
        } />
        <Route path="/settings/*" element={
          <PrivateRoute>
            <AccountSettings />
          </PrivateRoute>
        }>
          <Route index element={<Navigate to="account" replace />} />
          <Route path="account" element={<AccountDetails />} />
          <Route path="notifications" element={<NotificationSettings />} />
          <Route path="subscription" element={<SubscriptionManagement />} />
        </Route>
        <Route path="/help" element={<HelpSupport />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;