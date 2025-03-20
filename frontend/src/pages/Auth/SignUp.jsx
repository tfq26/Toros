import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../utils/authUtils.js";
import {Checkbox} from "../../components/ui/checkbox.jsx";

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
        <div className="relative h-screen flex justify-center items-center bg-cover bg-center px-4"
             style={{
                 backgroundImage: `url('https://images.axios.com/tEKRllKFCtdUQx34QOndSiLQxKM=/0x306:3936x2520/1920x1080/2021/11/04/1636048442154.jpg?w=3840')`
             }}
        >
            <div className="absolute inset-0 bg-black opacity-60"></div>

            <form onSubmit={handleSignup}
                  className="relative z-10 bg-red-900 dark:bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-2xl space-y-6">
                <h2 className="text-3xl font-bold text-center text-gray-100 mb-6">Create an Account</h2>

                {error && <p className="text-amber-500 text-center font-semibold">{error}</p>}
                {successMessage && <p className="text-green-500 text-center font-semibold">{successMessage}</p>}

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-100 font-medium">First Name</label>
                        <input type="text" name="firstName" value={userData.firstName} onChange={handleChange}
                               className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                               required/>
                    </div>
                    <div>
                        <label className="block text-gray-100 font-medium">Last Name</label>
                        <input type="text" name="lastName" value={userData.lastName} onChange={handleChange}
                               className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                               required/>
                    </div>
                </div>

                <div>
                    <label className="block text-gray-100 font-medium">Username</label>
                    <input type="text" name="username" value={userData.username} onChange={handleChange}
                           className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                           required/>
                </div>

                <div>
                    <label className="block text-gray-100 font-medium">Email</label>
                    <input type="email" name="email" value={userData.email} onChange={handleChange}
                           className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                           required/>
                </div>

                <div>
                    <label className="block text-gray-100 font-medium">Phone</label>
                    <input type="text" name="phone" value={userData.phone} onChange={handleChange}
                           className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                           required/>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-100 font-medium">Password</label>
                        <input type="password" name="password" value={userData.password} onChange={handleChange}
                               className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                               required/>
                    </div>
                    <div>
                        <label className="block text-gray-100 font-medium">Confirm Password</label>
                        <input type="password" name="confirmPassword" value={userData.confirmPassword}
                               onChange={handleChange}
                               className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                               required/>
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    <Checkbox>
                        onChecked={userData.tosAccepted}
                    </Checkbox>
                    <label
                        htmlFor="terms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        Accept terms and conditions
                    </label>
                    <p className="text-sm text-muted-foreground">
                        You agree to our Terms of Service and Privacy Policy.
                    </p>
                </div>


                <button type="submit"
                        className="w-full bg-emerald-500 text-white py-3 rounded-lg text-lg font-semibold hover:bg-emerald-600 transition duration-200">
                Sign Up
                </button>

                <p className="text-center text-sm text-gray-100 mt-4">
                    Already have an account?{" "}
                    <button onClick={() => navigate("/auth/login")}
                            className="text-emerald-500 font-semibold underline">
                        Login here
                    </button>
                </p>
            </form>
        </div>
    );
};

export default Signup;
