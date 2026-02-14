// src/pages/AppRoutes.jsx
import { Routes, Route } from "react-router-dom"
import PropTypes from "prop-types"

import Home              from "../Home.jsx"
import Players           from "../Players/Players.jsx"
import TournamentSetup   from "../Setup/TournamentSetup.jsx"
import TournamentList    from "../Tournament/Lists/TournamentList.jsx"
import TournamentBracket from "../Standings/TeamStandings.jsx"
import LiveTournament    from "../Tournament/LiveTournament.jsx"
import MatchTest         from "../Tournament/MatchTest.jsx"
import WindowView        from "../Tournament/Viewer/WindowView.jsx"
import ErrorPage         from "../Error.jsx"

const AppRoutes = ({
                       setTournamentSetupComplete,
                       tournamentConfig,
                       setTournamentConfig,
                   }) => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/players" element={<Players />} />

            {/* Tournament Setup Flow */}
            <Route
                path="/tournament/setup"
                element={
                    <TournamentSetup
                        onSetupComplete={() => setTournamentSetupComplete(true)}
                        setTournamentConfig={setTournamentConfig}
                    />
                }
            />
            <Route path="/tournament/list" element={<TournamentList />} />
            <Route
                path="/tournament/live/:tournamentId"
                element={
                    <LiveTournament
                        setTournamentSetupComplete={setTournamentSetupComplete}
                        tournamentConfig={tournamentConfig}
                    />
                }
            />

            {/* Bracket & Matches */}
            <Route path="/bracket"      element={<TournamentBracket />} />
            <Route path="/test-matches" element={<MatchTest />} />

            {/* Viewer */}
            <Route path="/viewer" element={<WindowView />} />

            {/* Catch-all */}
            <Route path="*" element={<ErrorPage statusCode={404} />} />
        </Routes>
    )
}

AppRoutes.propTypes = {
    setTournamentSetupComplete: PropTypes.func.isRequired,
    tournamentConfig:           PropTypes.any,
    setTournamentConfig:        PropTypes.func.isRequired,
}

export default AppRoutes
