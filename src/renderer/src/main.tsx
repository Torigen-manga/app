import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { appRoutes } from './route'
import { Toaster } from '@renderer/components/ui/sonner'
import './style/globals.css'
import { Providers } from './providers'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Providers>
      <RouterProvider router={appRoutes} />
      <Toaster />
    </Providers>
  </StrictMode>
)
