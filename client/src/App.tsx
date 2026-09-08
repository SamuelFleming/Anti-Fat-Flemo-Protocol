import { AuthProvider } from './contexts/AuthContext'
import { ProfileProvider } from './contexts/ProfileContext'
import { AppRouter } from './app/router'

function App() {
  return (
    <AuthProvider>
      <ProfileProvider>
        <AppRouter />
      </ProfileProvider>
    </AuthProvider>
  )
}

export default App
