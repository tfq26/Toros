import React, { useState } from "react";
import { cn } from "@/lib/utils.js";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { useAuth } from "@/Contexts/AuthContext.jsx";

export function LoginForm({ className, ...props }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    await login({ email, password });
  };

  const handleSocialLogin = async (connection) => {
    await login({ connection });
  };

  return (
    <form
      className={cn("flex flex-col gap-6 dark:bg-gray-800 bg-white p-6 rounded-lg", className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold dark:text-gray-100">Login to your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your email below to login to your account
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
              Forgot your password?
            </a>
          </div>
          {/* Password field can be kept or disabled if you're redirecting to Universal Login */}
          <Input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button type="submit" className="w-full">
          Login
        </Button>
        <div className="relative text-center text-sm">
          <span className="bg-background text-muted-foreground relative z-10 px-2 rounded-lg">
            Or continue with
          </span>
        </div>
        <div className="grid gap-4">
          <Button variant="outline" className="w-full" onClick={() => handleSocialLogin("google-oauth2")}>
            Login with Google
          </Button>
          <Button variant="outline" className="w-full" onClick={() => handleSocialLogin("github")}>
            Login with GitHub
          </Button>
        </div>
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <a href="/Older Components/SignUp" className="underline underline-offset-4">
          Sign up
        </a>
      </div>
    </form>
  );
}
export default LoginForm;