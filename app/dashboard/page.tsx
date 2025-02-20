/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 19/02/2025 - 10:25:15
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 19/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
import { UserProfile, UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import React from "react";

export default function ProfilePage() {
    return (
        <>
            <SignedIn>
                <div className="container mx-auto p-4">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold">User Profile</h1>
                        <SignedOut>
                            <p> Not signed in. </p>
                        </SignedOut>

                        <UserProfile
                            appearance={{
                                elements: {
                                    rootBox: "max-w-3xl mx-auto",
                                    card: "shadow-md rounded-lg",
                                    avatar: "w-12 h-12 rounded-full",
                                    button: "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded",
                                },
                            }}
                        >
                            <UserButton afterSignOutUrl="/" />
                        </UserProfile>
                    </div>
                </div>
            </SignedIn>
        </>
    );
}