import React, { useState } from "react";

const useDevTools = () => {
    const [windowRef, setWindowRef] = useState(null);

    const openDevTools = () => {
        if (windowRef && !windowRef.closed) {
            windowRef.focus();
            return;
        }

        const newWindow = window.open(
            "",
            "DevTools",
            "width=600,height=600,left=100,top=100"
        );

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
            <button id="deleteAllButton" style="background: darkred; color: white;">Delete All</button>
            <button id="loadPlayersButton" style="background: blue; color: white;">Load All Players</button>
            <button id="endTournamentButton" style="background: orange; color: white;">End Tournament</button>
            <button id="refreshButton" style="background: green; color: white;">Refresh Main</button>
            <script>
              // Delete Selected: calls DELETE on an assumed endpoint
              document.getElementById("deleteButton").addEventListener("click", async () => {
                const selected = document.getElementById("collectionSelect").value;
                if (!selected) {
                  alert("Please select a collection.");
                  return;
                }
                const confirmDelete = confirm("Delete all data from " + selected + "?");
                if (!confirmDelete) return;
                try {
                  const res = await fetch("http://localhost:8080/api/devtools/players/delete/" + selected, {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                  });
                  const data = await res.json();
                  alert(data.message || "Deleted.");
                } catch (err) {
                  console.error("Error deleting data:", err);
                  alert("Error deleting data.");
                }
              });
              
              // Delete All: calls DELETE on an assumed endpoint
              document.getElementById("deleteAllButton").addEventListener("click", async () => {
                if (!confirm("Are you sure you want to delete ALL data?")) return;
                try {
                  const res = await fetch("http://localhost:8080/api/devtools/players/deleteAll", {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                  });
                  const data = await res.json();
                  alert(data.message || "All data deleted.");
                } catch (err) {
                  console.error("Error deleting all data:", err);
                  alert("Error deleting all data.");
                }
              });

              // Load All Players: calls GET from your controller
              document.getElementById("loadPlayersButton").addEventListener("click", async () => {
                try {
                  const res = await fetch("http://localhost:8080/api/devtools/players");
                  const data = await res.json();
                  console.log("Players:", data);
                  alert("Players loaded. Check console for details.");
                } catch (err) {
                  console.error("Error loading players:", err);
                  alert("Error loading players.");
                }
              });

              // End Tournament: calls POST on the tournament end endpoint
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

              // Refresh Main: sends a message to the opener window
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
