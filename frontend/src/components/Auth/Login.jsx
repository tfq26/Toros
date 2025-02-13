import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../utils/authUtils.js";

const Login = ({ setAuthToken }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null); // Reset error on new attempt

        try {
            const data = await login(username, password);
            localStorage.setItem("authToken", data.token); // ✅ Store token
            setAuthToken(data.token);
            navigate("/dashboard"); // ✅ Redirect to dashboard
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="relative h-screen flex justify-center items-center bg-cover bg-center"
             style={{
                 backgroundImage: `url('https://images.axios.com/tEKRllKFCtdUQx34QOndSiLQxKM=/0x306:3936x2520/1920x1080/2021/11/04/1636048442154.jpg?w=3840')`
             }}
        >
            <div className="absolute inset-0 bg-black opacity-60"></div>

            <form
                onSubmit={handleLogin}
                className="relative z-10 bg-red-900 bg-opacity-90 p-6 rounded-lg shadow-xl w-80 space-y-4"
            >
                <h2 className="text-2xl font-bold text-center text-white mb-4">Login</h2>

                {error && <p className="text-red-500 text-center">{error}</p>}

                <div>
                    <label className="block text-white font-semibold">Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter username"
                        required
                    />
                </div>

                <div>
                    <label className="block text-white font-semibold">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter password"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-emerald-500 text-white py-2 rounded-lg hover:bg-emerald-600 transition font-semibold"
                >
                    Login
                </button>

                {/* Sign Up Button */}
                <button
                    type="button"
                    onClick={() => navigate("/auth/signup")}
                    className="w-full bg-amber-500 text-gray-100 py-2 rounded-lg hover:bg-amber-600 transition font-semibold mt-2"
                >
                    Sign Up
                </button>
            </form>
        </div>
    );
};

export default Login;
