import { AuthProvider } from './contexts/AuthContext'
import { AppRouter } from './app/router'

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  )
}

export default App
