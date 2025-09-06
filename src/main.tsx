import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { JsEngineProvider } from './context/js-engine-context.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <JsEngineProvider>
      <App />
    </JsEngineProvider>
  </StrictMode>,
)
