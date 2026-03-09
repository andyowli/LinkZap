import ForgotPasswordForm from "../../../components/forgot-password";
import { AuthFooter } from "../../../components/auth-footer";
import Banner from "../../../components/banner";
import { Navbar } from "../../../components/navbar-wrapper";
import Image from "next/image";

export default function SignInPage() {
    return (
        <div>
            <Banner />

            <Navbar topClass="top-10"/>

            <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
                <div className="flex w-full max-w-sm flex-col gap-6">
                    <a href="/" className="flex items-center gap-2 self-center font-medium">
                        <div className="text-primary-foreground flex  items-center justify-center rounded-md">
                            <Image src="/logo.svg" alt="Logo" width={30} height={30} />
                        </div>
                        LinkZap
                    </a>
                    <ForgotPasswordForm />
                </div>

                <footer className="fixed bottom-2 left-0 right-0">
                    <AuthFooter />
                </footer>
            </div>
        </div>
    );
}