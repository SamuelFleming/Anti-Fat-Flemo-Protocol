import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthenticatedShell } from './AuthenticatedShell'
import { LoginPage } from '../features/auth/LoginPage'
import { ProtectedRoute } from '../features/auth/ProtectedRoute'
import { RegisterPage } from '../features/auth/RegisterPage'
import { DashboardPage } from '../features/dashboard/DashboardPage'
import { DailyLogPage } from '../features/dailyLog/DailyLogPage'
import { GoalsPage } from '../features/goals/GoalsPage'
import { ProgressPage } from '../features/progress/ProgressPage'
import { SettingsPage } from '../features/settings/SettingsPage'
import { CompanionPrototypePage } from '../features/companion/CompanionPrototypePage'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* Isolation harness for GoalStateCompanion (3009) — not in nav / not Dashboard. */}
        <Route path="/dev/companion-prototype" element={<CompanionPrototypePage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AuthenticatedShell />}>
            <Route index element={<DashboardPage />} />
            <Route path="daily-log" element={<DailyLogPage />} />
            <Route path="progress" element={<ProgressPage />} />
            <Route path="goals" element={<GoalsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
