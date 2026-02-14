// src/hooks/useDevTools.js
import { useState } from "react"
import ReactDOM from "react-dom/client"
import DevDebugPanel from "@/pages/DevTools/DebugPanel.jsx"

const useDevTools = () => {
    const [windowRef, setWindowRef] = useState(null)

    const openDevTools = () => {
        // If already open, just focus
        if (windowRef && !windowRef.closed) {
            windowRef.focus()
            return
        }

        // Otherwise open a new popup
        const newWindow = window.open(
            "",
            "DevTools",
            "width=600,height=600,left=100,top=100"
        )
        if (!newWindow) return

        // Copy over existing styles so panel looks correct
        Array.from(document.styleSheets).forEach(sheet => {
            let rules
            try {
                rules = sheet.cssRules
            } catch {
                return
            }
            const css = Array.from(rules).map(r => r.cssText).join("\n")
            const style = newWindow.document.createElement("style")
            style.textContent = css
            newWindow.document.head.appendChild(style)
        })

        // Create a root container for React
        const container = newWindow.document.createElement("div")
        container.id = "dev-tools-root"
        Object.assign(container.style, {
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            overflow: "auto",
            background: "rgba(0,0,0,0.8)",
            color: "#fff",
            fontFamily: "sans-serif",
            padding: "1rem",
            boxSizing: "border-box"
        })
        newWindow.document.body.appendChild(container)

        // Mount your React-based DevDebugPanel
        ReactDOM.createRoot(container).render(<DevDebugPanel />)

        setWindowRef(newWindow)
    }

    return { openDevTools }
}

export default useDevTools
