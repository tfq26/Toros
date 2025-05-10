import React from "react"
import Layout    from "./pages/Layout/Layout.jsx"
import AppRoutes from "./Routing/AppRoutes.jsx"
import "./index.css"
import { useAuth } from "@/contexts/AuthContext.jsx"

export default function App() {
    // Pull tournament setup info directly from your authenticated user
    const { user } = useAuth()
    const tournamentSetupComplete = user?.tournamentSetupComplete ?? false
    const tournamentConfig        = user?.tournamentConfig ?? null

    return (
        <div className="flex min-h-screen w-screen bg-gradient-to-br from-emerald-400/50
                 via-rose-400/50 to-red-700/50 dark:from-rose-950/30
                  dark:via-gray-950/50 dark:to-emerald-950/30">
            <Layout>
                <AppRoutes
                    tournamentSetupComplete={tournamentSetupComplete}
                    tournamentConfig={tournamentConfig}
                />
            </Layout>
        </div>
    )
}

