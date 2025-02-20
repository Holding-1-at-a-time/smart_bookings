/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 19/02/2025 - 10:23:00
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 19/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Header() {
    return (
        <header className="bg-white shadow-sm">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link href="/" className="text-xl font-bold">
                    Your SaaS App
                </Link>
                <nav>
                    <SignedIn>
                        <Link href="/dashboard" className="mr-4">Dashboard</Link>
                        <UserButton afterSignOutUrl="/" />
                    </SignedIn>
                    <SignedOut>
                        <Link href="/auth/sign-in" className="mr-4">Sign In</Link>
                        <Link href="/auth/sign-up">Sign Up</Link>
                    </SignedOut>
                </nav>
            </div>
        </header>
    );
}