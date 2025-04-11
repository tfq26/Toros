import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "@/utils/functions/authUtils.js";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export function SignupForm({ className, ...props }) {
  const [userData, setUserData] = useState({
    // firstName: "",
    // lastName: "",
    // username: "",
    email: "",
    // phone: "",
    password: "",
    // confirmPassword: "",
    // tosAccepted: false,
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

    // Since we're only using email and password,
    // remove validation for confirm password and TOS.
    // if (userData.password !== userData.confirmPassword) {
    //   setError("Passwords do not match.");
    //   return;
    // }
    // if (!userData.tosAccepted) {
    //   setError("You must accept the Terms of Service.");
    //   return;
    // }

    try {
      const message = await signup(userData);
      setSuccessMessage(message);
      setTimeout(() => navigate("/auth/login"), 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
      <form
          onSubmit={handleSignup}
          className={cn("flex flex-col gap-6 dark:bg-gray-800 p-10 rounded-lg", className)}
          {...props}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold dark:text-gray-100">
            Sign up for an account
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email and password to create an account
          </p>
        </div>

        {error && <p className="text-center font-semibold text-amber-500">{error}</p>}
        {successMessage && <p className="text-center font-semibold text-green-500">{successMessage}</p>}

        {/*
      <div className="grid grid-cols-2 gap-6">
        <div className="grid gap-3">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            name="firstName"
            type="text"
            value={userData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            name="lastName"
            type="text"
            value={userData.lastName}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="grid gap-3">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          name="username"
          type="text"
          value={userData.username}
          onChange={handleChange}
          required
        />
      </div>

      <div className="grid gap-3">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          name="phone"
          type="text"
          value={userData.phone}
          onChange={handleChange}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="grid gap-3">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={userData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={userData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Checkbox
          id="tosAccepted"
          name="tosAccepted"
          checked={userData.tosAccepted}
          onChange={handleChange}
        />
        <Label htmlFor="tosAccepted" className="text-sm font-medium">
          Accept Terms and Conditions
        </Label>
      </div>
      */}

        {/* Only Email Field */}
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
              id="email"
              name="email"
              type="email"
              value={userData.email}
              onChange={handleChange}
              required
          />
        </div>

        {/* Only Password Field */}
        <div className="grid gap-3">
          <Label htmlFor="password">Password</Label>
          <Input
              id="password"
              name="password"
              type="password"
              value={userData.password}
              onChange={handleChange}
              required
          />
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full">
          Create Account
        </Button>

        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
        <span className="bg-background text-muted-foreground relative z-10 px-2 rounded-lg">
          Or continue with
        </span>
        </div>

        <Button variant="outline" className="w-full">
          <img
              src="/svgs/microsoft-logo-svgrepo-com.svg"
              alt="Microsoft Icon"
              className="w-20"
          />
          Signup with Microsoft
        </Button>

        <Button variant="outline" className="w-full">
          <img
              src="/svgs/google-icon-logo-svgrepo-com.svg"
              alt="Google Icon"
              className="w-6 h-6"
          />
          Signup with Google
        </Button>

        <div className="text-center text-sm">
          Have an account?{" "}
          <a href="/auth/Login" className="underline underline-offset-4">
            Login
          </a>
        </div>
      </form>
  );
}
