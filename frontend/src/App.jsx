// src/App.jsx
import React from "react"
import Layout    from "./pages/Layout.jsx"
import AppRoutes from "./pages/AppRoutes.jsx"
import "./index.css"
import Background from "@/assets/Background.jsx"
import { useAuth } from "@/contexts/AuthContext.jsx"

export default function App() {
    // Pull tournament setup info directly from your authenticated user
    const { user } = useAuth()
    const tournamentSetupComplete = user?.tournamentSetupComplete ?? false
    const tournamentConfig        = user?.tournamentConfig ?? null

    return (
        <div className="flex h-screen w-screen">
            <Background />
            <Layout>
                <AppRoutes
                    tournamentSetupComplete={tournamentSetupComplete}
                    tournamentConfig={tournamentConfig}
                />
            </Layout>
        </div>
    )
}
