import React, { useState, useEffect } from "react";

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
            "width=400,height=500,left=100,top=100"
        );

        if (newWindow) {
            newWindow.document.write(`
        <html>
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
            <button id="refreshButton" style="background: green; color: white;">Refresh Main</button>
            <script>
              document.getElementById("deleteButton").addEventListener("click", async () => {
                const selected = document.getElementById("collectionSelect").value;
                if (!selected) {
                  alert("Please select a collection.");
                  return;
                }
                const confirmDelete = confirm("Delete all data from " + selected + "?");
                if (!confirmDelete) return;
                try {
                  const res = await fetch("http://localhost:8080/api/dev/delete/" + selected, {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                  });
                  const data = await res.json();
                  alert(data.message || "Deleted.");
                } catch (err) {
                  console.error("Error:", err);
                  alert("Error deleting data.");
                }
              });
              
              document.getElementById("deleteAllButton").addEventListener("click", async () => {
                if (!confirm("Are you sure you want to delete ALL data?")) return;
                try {
                  const res = await fetch("http://localhost:8080/api/dev/deleteAll", {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                  });
                  const data = await res.json();
                  alert(data.message || "All data deleted.");
                } catch (err) {
                  console.error("Error:", err);
                  alert("Error deleting all data.");
                }
              });
              
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
