import React, { useState } from "react";

const useDevTools = () => {
    const [windowRef, setWindowRef] = useState(null);

    const openDevTools = () => {
        // If the dev tools window is already open and not closed, bring it to focus.
        if (windowRef && !windowRef.closed) {
            windowRef.focus();
            return;
        }

        const newWindow = window.open(
            "",
            "DevTools",
            "width=600,height=600,left=100,top=100"
        );

        // This mapping correlates each collection with its respective endpoint.
        // Adjust the URLs here if your backend port or paths differ.
        const endpoints = {
            players: "http://localhost:8080/api/devtools/players",
            matches: "http://localhost:8080/api/devtools/matches",
            teams: "http://localhost:8080/api/devtools/teams",
            // For tournaments, we are using the endpoint that marks active tournaments as inactive.
            tournaments: "http://localhost:8080/api/devtools/tournaments/active"
        };

        if (newWindow) {
            newWindow.document.write(`
        <html lang="en">
          <head>
            <title>Dev Tools</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h2 { text-align: center; }
              select, button {
                display: block;
                width: 90%;
                margin: 12px auto;
                padding: 10px;
                font-size: 16px;
              }
            </style>
          </head>
          <body>
            <h2>Development Tools</h2>
            <select id="collectionSelect">
              <option value="">-- Select Collection --</option>
              <option value="players">Players</option>
              <option value="matches">Matches</option>
              <option value="teams">Teams</option>
              <option value="tournaments">Tournaments</option>
            </select>
            <button id="deleteButton" style="background: red; color: white;">Delete Selected</button>
            <button id="deleteAllButton" style="background: darkred; color: white;">Delete All (All Collections)</button>
            <button id="loadPlayersButton" style="background: blue; color: white;">Load All Players</button>
            <button id="endTournamentButton" style="background: orange; color: white;">End Tournament</button>
            <button id="refreshButton" style="background: green; color: white;">Refresh Main</button>
            <script>
              // Inject the endpoints mapping into the inline script.
              const endpoints = ${JSON.stringify(endpoints)};
              
              // Delete Selected: uses DELETE on the endpoint based on the selected collection.
              document.getElementById("deleteButton").addEventListener("click", async () => {
                const selected = document.getElementById("collectionSelect").value;
                if (!selected) {
                  alert("Please select a collection.");
                  return;
                }
                const confirmDelete = confirm("Delete all data from " + selected + "?");
                if (!confirmDelete) return;
                const endpoint = endpoints[selected];
                try {
                  const res = await fetch(endpoint, {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                  });
                  // Assuming the backend returns JSON with a message field.
                  const data = await res.json();
                  alert(data.message || "Deleted " + selected + ".");
                } catch (err) {
                  console.error("Error deleting data from " + selected + ":", err);
                  alert("Error deleting data from " + selected + ".");
                }
              });

              // Delete All: calls DELETE on each endpoint defined in our mapping sequentially.
              document.getElementById("deleteAllButton").addEventListener("click", async () => {
                if (!confirm("Are you sure you want to delete ALL data for all collections?")) return;
                let results = [];
                for (const key in endpoints) {
                  try {
                    const res = await fetch(endpoints[key], {
                      method: "DELETE",
                      headers: { "Content-Type": "application/json" },
                    });
                    const data = await res.json();
                    results.push(key + ": " + (data.message || "Deleted."));
                  } catch (err) {
                    console.error("Error deleting " + key + ":", err);
                    results.push(key + ": " + "Error.");
                  }
                }
                alert(results.join("\\n"));
              });

              // Load All Players: issues a GET request to the players endpoint.
              document.getElementById("loadPlayersButton").addEventListener("click", async () => {
                try {
                  const res = await fetch(endpoints["players"]);
                  const data = await res.json();
                  console.log("Players:", data);
                  alert("Players loaded. Check console for details.");
                } catch (err) {
                  console.error("Error loading players:", err);
                  alert("Error loading players.");
                }
              });

              // End Tournament: calls a POST to the tournament end endpoint.
              // Adjust the URL if needed based on your backend.
              document.getElementById("endTournamentButton").addEventListener("click", async () => {
                try {
                  const res = await fetch("http://localhost:8080/api/tournament/end", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" }
                  });
                  if (res.status === 200) {
                    console.log("🏁 Tournament ended successfully.");
                    alert("Tournament ended successfully.");
                  } else {
                    throw new Error("Failed to end tournament.");
                  }
                } catch (err) {
                  console.error("❌ Error ending tournament:", err);
                  alert("Error ending tournament.");
                }
              });

              // Refresh Main: sends a message to the opener (main) window.
              document.getElementById("refreshButton").addEventListener("click", () => {
                window.opener?.postMessage({ type: "DEV_COMMAND", command: "REFRESH_MAIN" }, "*");
              });
            </script>
          </body>
        </html>
      `);
            newWindow.document.close();
            setWindowRef(newWindow);
        }
    };

    return { openDevTools };
};

export default useDevTools;
