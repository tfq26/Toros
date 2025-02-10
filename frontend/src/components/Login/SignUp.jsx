import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [tosAccepted, setTosAccepted] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        // ✅ Validate password match
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        // ✅ Ensure TOS is accepted
        if (!tosAccepted) {
            setError("You must accept the Terms of Service.");
            return;
        }

        try {
            console.log("Attempting signup with:", { name, email, username, phone });

            const response = await axios.post(
                "http://localhost:8080/auth/signup", // Ensure backend endpoint exists
                { name, email, username, password, phone },
                { headers: { "Content-Type": "application/json" } }
            );

            console.log("Signup response:", response);

            if (response.status === 201) {
                setSuccess("Account created successfully! Redirecting to login...");
                setTimeout(() => navigate("/auth/login"), 2000); // Redirect after success
            }
        } catch (err) {
            console.error("Signup Error:", err);
            if (err.response) {
                if (err.response.status === 400) {
                    setError("Invalid input. Please check your details.");
                } else if (err.response.status === 409) {
                    setError("Username or email already exists.");
                } else {
                    setError("Failed to create an account. Please try again.");
                }
            } else {
                setError("Could not connect to the server. Please try again later.");
            }
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <form onSubmit={handleSignup} className="bg-white p-6 rounded shadow-md w-80 space-y-4">
                <h2 className="text-2xl font-bold text-center mb-4">Sign Up</h2>

                {/* ✅ Show success or error messages */}
                {error && <p className="text-red-500 text-center">{error}</p>}
                {success && <p className="text-green-500 text-center">{success}</p>}

                <div>
                    <label className="block text-gray-700">Full Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2 border rounded"
                        placeholder="Enter your full name"
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-700">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border rounded"
                        placeholder="Enter your email"
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-700">Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-2 border rounded"
                        placeholder="Choose a username"
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
                        placeholder="Create a password"
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-700">Confirm Password</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full p-2 border rounded"
                        placeholder="Re-enter password"
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-700">Phone Number</label>
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full p-2 border rounded"
                        placeholder="Enter your phone number"
                        required
                    />
                </div>

                {/* ✅ Terms of Service Checkbox */}
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        checked={tosAccepted}
                        onChange={() => setTosAccepted(!tosAccepted)}
                        className="mr-2"
                        required
                    />
                    <label className="text-gray-700">
                        I accept the <a href="/tos" className="text-blue-500 underline">Terms of Service</a>
                    </label>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
                >
                    Sign Up
                </button>
            </form>
        </div>
    );
};

export default Signup;
