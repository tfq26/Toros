// src/pages/AppRoutes.jsx
import  { useContext } from 'react'
import { Routes, Route }      from 'react-router-dom'
import { SidebarProvider }    from '@/components/ui/sidebar.jsx'
import LoadingModal           from '@/pages/Modals/LoadingModal.jsx'
import { useAuth }            from '@/contexts/AuthContext.jsx'
import { LoadingContext }     from '@/contexts/LoadingContext.jsx'
import { TournamentProvider } from '@/contexts/TournamentContext.jsx'

import PublicRoutes      from '../Routing/PublicRoutes.jsx'
import NewsRoutes        from '../Routing/NewsRoutes.jsx'
import TournamentRoutes  from '../Routing/TournamentRoutes.jsx'

export default function AppRoutes() {
    const { loadingProfile } = useAuth()
    const { isLoading }      = useContext(LoadingContext)

    return (
        <SidebarProvider>
            <TournamentProvider>
                <div className="relative flex h-screen w-screen">
                    <main className="flex-1 overflow-y-auto">
                        <Routes>
                            {/* News section */}
                            <Route path="/news/*" element={<NewsRoutes />} />

                            {/* Tournament section */}
                            <Route path="/tournament/*" element={<TournamentRoutes />} />

                            {/* Public section: home, players, profile, explore, test-matches, viewer */}
                            <Route path="/*" element={<PublicRoutes />} />
                        </Routes>
                    </main>

                    {/* Overlaid loading/auth modals */}
                    {loadingProfile && (
                        <LoadingModal
                            isLoading
                            message="Checking permissions…"
                            description="Hang tight while we verify your account."
                        />
                    )}
                    {!loadingProfile && isLoading && (
                        <LoadingModal
                            isLoading
                            message="Loading…"
                            description="Please wait while data is fetched."
                        />
                    )}
                </div>
            </TournamentProvider>
        </SidebarProvider>
    )
}
