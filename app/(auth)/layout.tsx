/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 24/02/2025 - 01:58:28
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 24/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
"use client";

import React from "react";
import Image from "next/image";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import { ClerkProvider } from "@clerk/nextjs";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <ClerkProvider>
            <div className="min-h-screen flex flex-col md:flex-row">
                <div className="md:w-1/2 bg-[#00AE98] p-8 flex flex-col justify-center items-center">
                    <Image src="/logo.svg" alt="Auto Detailing AI Logo" width={200} height={200} className="mb-8" />
                    <h1 className="text-4xl font-bold text-white mb-4">Auto Detailing AI</h1>
                    <p className="text-white text-center max-w-md">
                        Streamline your auto detailing business with our AI-powered management system.
                    </p>
                </div>
                <div className="md:w-1/2 p-8 flex items-center justify-center">
                    <ConvexClientProvider>
                        {children}
                    </ConvexClientProvider>
                </div>
            </div>
        </ClerkProvider>
    )
}

