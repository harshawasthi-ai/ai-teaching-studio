import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from './integrations/supabase/client'
import InputPage from './pages/InputPage'
import OutputPage from './pages/OutputPage'
import LibraryPage from './pages/LibraryPage'
import AuthPage from './pages/AuthPage'

function App() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={!user ? <AuthPage /> : <Navigate to="/" />} />
        <Route path="/" element={user ? <InputPage /> : <Navigate to="/auth" />} />
        <Route path="/lesson" element={user ? <OutputPage /> : <Navigate to="/auth" />} />
        <Route path="/library" element={user ? <LibraryPage /> : <Navigate to="/auth" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
