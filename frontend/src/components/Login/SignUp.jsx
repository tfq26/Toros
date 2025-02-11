import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../utils/authUtils.js";

const Signup = () => {
    const [userData, setUserData] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        tosAccepted: false,
    });
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setUserData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        if (userData.password !== userData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        if (!userData.tosAccepted) {
            setError("You must accept the Terms of Service.");
            return;
        }

        try {
            const message = await signup(userData);
            setSuccessMessage(message);
            setTimeout(() => navigate("/auth/login"), 2000);
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

            <form onSubmit={handleSignup} className="relative z-10 bg-white p-6 rounded shadow-md w-80 space-y-4">
                <h2 className="text-2xl font-bold text-center mb-4">Sign Up</h2>

                {error && <p className="text-red-500 text-center">{error}</p>}
                {successMessage && <p className="text-green-500 text-center">{successMessage}</p>}

                <div>
                    <label className="block text-gray-700">First Name</label>
                    <input type="text" name="firstName" value={userData.firstName} onChange={handleChange} className="w-full p-2 border rounded" required />
                </div>
                <div>
                    <label className="block text-gray-700">Last Name</label>
                    <input type="text" name="lastName" value={userData.lastName} onChange={handleChange} className="w-full p-2 border rounded" required />
                </div>
                <div>
                    <label className="block text-gray-700">Username</label>
                    <input type="text" name="username" value={userData.username} onChange={handleChange} className="w-full p-2 border rounded" required />
                </div>
                <div>
                    <label className="block text-gray-700">Email</label>
                    <input type="email" name="email" value={userData.email} onChange={handleChange} className="w-full p-2 border rounded" required />
                </div>
                <div>
                    <label className="block text-gray-700">Phone</label>
                    <input type="text" name="phone" value={userData.phone} onChange={handleChange} className="w-full p-2 border rounded" required />
                </div>
                <div>
                    <label className="block text-gray-700">Password</label>
                    <input type="password" name="password" value={userData.password} onChange={handleChange} className="w-full p-2 border rounded" required />
                </div>
                <div>
                    <label className="block text-gray-700">Confirm Password</label>
                    <input type="password" name="confirmPassword" value={userData.confirmPassword} onChange={handleChange} className="w-full p-2 border rounded" required />
                </div>

                <div className="flex items-center">
                    <input type="checkbox" name="tosAccepted" checked={userData.tosAccepted} onChange={handleChange} className="mr-2" required />
                    <label className="text-gray-700">
                        I accept the <a href="/tos" className="text-blue-500 underline">Terms of Service</a>
                    </label>
                </div>

                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition">
                    Sign Up
                </button>
            </form>
        </div>
    );
};

export default Signup;
