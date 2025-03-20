import { GalleryVerticalEnd } from "lucide-react"

import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
    return (
        // Changed grid columns to 1fr for login and 2fr for image
        <div className="grid min-h-svh lg:grid-cols-[1fr_3fr]">
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex justify-center gap-2 md:justify-start">
                </div>
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-xs">
                        <LoginForm />
                    </div>
                </div>
            </div>
            <div className="relative hidden bg-muted lg:block">
                <img
                    src="/login_img.webp"
                    alt="Image"
                    className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.6]"
                />
            </div>
        </div>
    );
}
