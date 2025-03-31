import { LoginForm } from "@/components/login-form.jsx"
import {SignupForm} from "../Auth/Signup/signup-form-email-pass.jsx"

export default function SignupUpdated() {
    return (
        // Changed grid columns to 1fr for login and 2fr for image
        // <div className="grid min-h-svh lg:grid-cols-[1fr]">
        //     <div className="flex flex-col gap-4 p-6 md:p-10">
        //         <div className="flex justify-center gap-2 md:justify-start">
        //         </div>
        //         <div className="flex flex-1 items-center justify-center">
        //             <div className="w-full max-w-s">
        //                 <SignupForm className={"bg-white p-10 rounded-lg"}/>
        //             </div>
        //         </div>
        //     </div>
        // </div>
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <a href="#" className="flex items-center gap-2 self-center font-medium">
                </a>
                <SignupForm/>
            </div>
        </div>
    );
}
