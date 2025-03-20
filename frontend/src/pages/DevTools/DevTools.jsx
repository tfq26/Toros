import { useState } from "react";

const DevTools = () => {
    const [windowRef, setWindowRef] = useState(null);

    /** ✅ Open DevTools in a new window */
    const openDetachedWindow = () => {
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
                            select, button { display: block; margin: 10px auto; padding: 10px; font-size: 16px; }
                        </style>
                    </head>
                    <body>
                        <h2>Development Tools</h2>
                        <label>Select Collection:</label>
                        <select id="collectionSelect">
                            <option value="">-- Select --</option>
                            <option value="players">Players</option>
                            <option value="matches">Matches</option>
                            <option value="teams">Teams</option>
                            <option value="tournaments">Tournaments</option>
                        </select>
                        <button id="deleteButton" style="background: red; color: white;">Delete Data</button>
                        <button id="refreshButton" style="background: green; color: white;">Refresh Main Window</button>
                        <script>
                            document.getElementById("deleteButton").addEventListener("click", async () => {
                                const selectedCollection = document.getElementById("collectionSelect").value;
                                if (!selectedCollection) {
                                    alert("Please select a collection to delete.");
                                    return;
                                }
                                const confirmDelete = confirm("Are you sure you want to delete all data from " + selectedCollection + "?");
                                if (!confirmDelete) return;
                                
                                try {
                                    const response = await fetch("http://localhost:8080/api/dev/delete/" + selectedCollection, {
                                        method: "DELETE",
                                        headers: { "Content-Type": "application/json" },
                                    });
                                    const result = await response.json();
                                    alert(result.message || "Deletion successful!");
                                } catch (error) {
                                    console.error("❌ Error deleting data:", error);
                                    alert("Error deleting data. Check the console for details.");
                                }
                            });

                            document.getElementById("refreshButton").addEventListener("click", () => {
                                window.opener?.postMessage({ type: "DEV_COMMAND", command: "REFRESH_MAIN" }, "*");
                            });
                        </script>
                    </body>
                </html>
            `);
            setWindowRef(newWindow);
        }
    };

    return (
        <button
            onClick={openDetachedWindow}
            className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded shadow-lg hover:bg-blue-600 transition"
        >
            Open Dev Tools
        </button>
    );
};

export default DevTools;
