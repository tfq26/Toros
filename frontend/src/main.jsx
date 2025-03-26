import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

function Root() {
    useEffect(() => {
        const media = window.matchMedia("(prefers-color-scheme: dark)");

        // Set initial mode
        document.documentElement.classList.toggle("dark", media.matches);

        // Update whenever system preference changes
        const listener = (e) => {
            document.documentElement.classList.toggle("dark", e.matches);
        };
        media.addEventListener("change", listener);
        return () => media.removeEventListener("change", listener);
    }, []);

    return <App />;
}

ReactDOM.createRoot(document.getElementById("root")).render(<Root />);
