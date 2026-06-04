import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { TopLoadingBar } from '@/components'
import { router } from '@/routes/router'
import '@/styles/index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <TopLoadingBar />
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
)
