import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = ({ setAuthToken }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null); // Reset error on new attempt

        try {
            console.log("Attempting to log in with:", { username, password });

            const response = await axios.post(
                "http://localhost:8080/auth/login",
                { username, password },
                { headers: { "Content-Type": "application/json" } }
            );

            console.log("Login response:", response);

            // ✅ Extract JWT Token
            const { token } = response.data;
            if (!token) throw new Error("No token received");

            console.log("Received token:", token);

            // ✅ Store Token Securely
            localStorage.setItem("authToken", token);
            setAuthToken(token); // Update auth state

            // ✅ Redirect to home
            navigate("/");
        } catch (err) {
            console.error("Login Error:", err);

            if (err.response) {
                console.log("Error Response Data:", err.response.data);
                console.log("Error Response Status:", err.response.status);
                console.log("Error Response Headers:", err.response.headers);

                if (err.response.status === 401) {
                    setError("Invalid username or password.");
                } else if (err.response.status === 403) {
                    setError("Access denied.");
                } else {
                    setError("Failed to authenticate. Please try again.");
                }
            } else if (err.request) {
                console.log("No response received:", err.request);
                setError("Could not connect to the server. Check your connection.");
            } else {
                console.log("Unexpected Error:", err.message);
                setError("An unexpected error occurred.");
            }
        }
    };

    return (
        <div
            className="flex justify-center items-center h-screen bg-cover bg-center"
            style={{
                backgroundImage: `url('https://images.axios.com/tEKRllKFCtdUQx34QOndSiLQxKM=/0x306:3936x2520/1920x1080/2021/11/04/1636048442154.jpg?w=3840')`
            }}
        >
            <form
                onSubmit={handleLogin}
                className="bg-white bg-opacity-80 p-6 rounded shadow-md w-80 space-y-4"
            >
                <h2 className="text-2xl font-bold text-center mb-4">Login</h2>

                {/* ✅ Show error message if login fails */}
                {error && <p className="text-red-500 text-center">{error}</p>}

                <div>
                    <label className="block text-gray-700">Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-2 border rounded"
                        placeholder="Enter username"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border rounded"
                        placeholder="Enter password"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
                >
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;
