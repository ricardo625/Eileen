import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { SidebarProvider } from './contexts/SidebarContext'
import { DarkModeProvider } from './contexts/DarkModeContext'
import TheShelf from './pages/TheShelf'
import AllSubmissions from './pages/AllSubmissions'
import BrandManagement from './pages/BrandManagement'
import BrandManagementStores from './pages/BrandManagementStores'
import CampaignHub from './pages/CampaignHub'
import CampaignAnalytics from './pages/CampaignAnalytics'
import CampaignConfiguration from './pages/CampaignConfiguration'
import Banners from './pages/Banners'
import AILeon from './pages/AILeon'
import SubmissionDetail from './pages/SubmissionDetail'

function App() {
  return (
    <DarkModeProvider>
    <SidebarProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/shelf" replace />} />
        <Route path="/ai-leon" element={<AILeon />} />
        <Route path="/shelf" element={<TheShelf />} />
        <Route path="/submissions" element={<AllSubmissions />} />
        <Route path="/submissions/:id" element={<SubmissionDetail />} />
        <Route path="/brand-management" element={<BrandManagement />} />
        <Route path="/brand-management/stores" element={<BrandManagementStores />} />
        <Route path="/campaign-hub" element={<CampaignHub />} />
        <Route path="/campaign-hub/:id/analytics" element={<CampaignAnalytics />} />
        <Route path="/campaign-hub/:id/configuration" element={<CampaignConfiguration />} />
        <Route path="/banners" element={<Banners />} />
      </Routes>
    </BrowserRouter>
    </SidebarProvider>
    </DarkModeProvider>
  )
}

export default App
