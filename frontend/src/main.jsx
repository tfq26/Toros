import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Auth0Provider } from "@auth0/auth0-react";
import { NotificationProvider } from "./utils/NotificationProvider.jsx";

function Root() {
    useEffect(() => {
        const media = window.matchMedia("(prefers-color-scheme: dark)");
        document.documentElement.classList.toggle("dark", media.matches);

        const listener = (e) => {
            document.documentElement.classList.toggle("dark", e.matches);
        };
        media.addEventListener("change", listener);
        return () => media.removeEventListener("change", listener);
    }, []);

    return <App />;
}

const domain       = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId     = import.meta.env.VITE_AUTH0_CLIENT_ID;
const audience     = import.meta.env.VITE_AUTH0_AUDIENCE;
const redirectUri  = import.meta.env.VITE_AUTH0_CALLBACK_URL;
const logoutReturn = import.meta.env.VITE_AUTH0_LOGOUT_URL;

ReactDOM.createRoot(document.getElementById("root")).render(
    <Auth0Provider
        domain={domain}
        clientId={clientId}
        authorizationParams={{
            redirect_uri: redirectUri,
            audience:     audience,
            scope:         "openid profile email",
        }}
        logoutParams={{ returnTo: logoutReturn }}
    >
        <NotificationProvider>
            <Root />
        </NotificationProvider>
    </Auth0Provider>
);
