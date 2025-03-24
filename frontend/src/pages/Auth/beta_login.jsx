import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
    return (
        // Changed grid columns to 1fr for login and 2fr for image
        <div className="grid min-h-svh lg:grid-cols-[1fr_3fr]">
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex justify-center gap-2 md:justify-start">
                </div>
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-s">
                        <LoginForm className={"bg-white p-20 rounded-lg"}/>
                    </div>
                </div>
            </div>
            <div className="hidden lg:block flex-1 relative bg-transparent">
                {/* Top‑left */}
                <div className="absolute top-[10%] left-[5%] w-60 h-60 rounded-full overflow-hidden">
                    <img src="/login_img.webp" className="w-full h-full object-cover" alt="Decor" loading="lazy"/>
                </div>

                {/* Top‑right */}
                <div className="absolute top-[10%] right-[23%] w-72 h-72 rounded-full overflow-hidden">
                    <img src="/login_img.webp" className="w-full h-full object-cover" alt="Decor" loading="lazy"/>
                </div>

                {/* Center */}
                <div
                    className="absolute top-5/7 left-2/7 transform -translate-x-1/2 -translate-y-1/2 w-104 h-104 rounded-full overflow-hidden">
                    <img src="/login_img.webp" className="w-full h-full object-cover" alt="Decor" loading="lazy"/>
                </div>

                {/* Bottom-left */}
                <div className="absolute bottom-[30%] left-[50%] w-36 h-36 rounded-full overflow-hidden">
                    <img src="/login_img.webp" className="w-full h-full object-cover" alt="Decor" loading="lazy"/>
                </div>

                {/* Bottom-right */}
                <div className="absolute bottom-[20%] right-12 w-84 h-84 rounded-full overflow-hidden">
                    <img src="/login_img.webp" className="w-full h-full object-cover" alt="Decor" loading="lazy"/>
                </div>
            </div>

        </div>
    );
}
