// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// React Router
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Context providers
import { ErrorProvider }         from "@/contexts/ErrorContext.jsx";
import { ModalProvider }         from "@/contexts/ModalContext.jsx";
import { NotificationProvider }  from "@/contexts/NotificationContext.jsx";
import { NetworkProvider }       from "@/contexts/NetworkContext.jsx";
import { FeatureFlagProvider }   from "@/contexts/FeatureFlagContext.jsx";
import { ThemeProvider }         from "@/contexts/ThemeContext.jsx";
import { LoadingProvider }       from "@/contexts/LoadingContext.jsx";
import { AuthProvider }          from "@/contexts/AuthContext.jsx";

// Error page
import ErrorPage from "@/pages/Error.jsx";

function Root() {
    return <App />;
}

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter>
            <ErrorProvider>
                <ModalProvider>
                    <NotificationProvider>
                        <NetworkProvider>
                            <FeatureFlagProvider>
                                <ThemeProvider>
                                    <LoadingProvider>
                                        <AuthProvider>
                                            <Routes>
                                                {/* Centralized error route */}
                                                <Route path="/error" element={<ErrorPage />} />
                                                {/* All other routes */}
                                                <Route path="/*" element={<Root />} />
                                            </Routes>
                                        </AuthProvider>
                                    </LoadingProvider>
                                </ThemeProvider>
                            </FeatureFlagProvider>
                        </NetworkProvider>
                    </NotificationProvider>
                </ModalProvider>
            </ErrorProvider>
        </BrowserRouter>
    </React.StrictMode>
);
