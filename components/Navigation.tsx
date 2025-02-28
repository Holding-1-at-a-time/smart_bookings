/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 24/02/2025 - 09:13:07
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 24/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { UserButton, OrganizationSwitcher, SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs"
import { useOrganization } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"

export function Navigation() {
    const { organization } = useOrganization()
    const { organizationId } = useParams()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const NavItems = () => (
        <>
            <SignedIn>
                {organization && (
                    <>
                        <Link href={`/dashboard/${organization.id}`} className="text-white hover:underline">
                            Dashboard
                        </Link>
                        <Link href={`/${organization.id}/booking`} className="text-white hover:underline">
                            Booking
                        </Link>
                        <Link href={`/${organization.id}/services`} className="text-white hover:underline">
                            Services
                        </Link>
                        <Link href={`/${organization.id}/chat`} className="text-white hover:underline">
                            Chat
                        </Link>
                        <Link href={`/${organization.id}/settings`} className="text-white hover:underline">
                            Settings
                        </Link>
                    </>
                )}
                <Link href="/user-profile" className="text-white hover:underline">
                    Profile
                </Link>
                <Link href="/org-management" className="text-white hover:underline">
                    Org Management
                </Link>
            </SignedIn>
            <SignedOut>
                <SignInButton mode="modal">
                    <Button variant="secondary">Sign In</Button>
                </SignInButton>
                <SignUpButton mode="modal">
                    <Button variant="outline">Sign Up</Button>
                </SignUpButton>
            </SignedOut>
        </>
    )

    return (
        <nav className="bg-[#00AE98] p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-white text-2xl font-bold">
                    Auto Detailing AI
                </Link>
                <div className="hidden md:flex items-center space-x-4">
                    <NavItems />
                    <SignedIn>
                        <OrganizationSwitcher
                            appearance={{
                                elements: {
                                    organizationSwitcherTrigger: "bg-white text-[#00AE98]",
                                },
                            }}
                        />
                        <UserButton
                            appearance={{
                                elements: {
                                    userButtonAvatarBox: "w-10 h-10",
                                },
                            }}
                        />
                    </SignedIn>
                </div>
                <div className="md:hidden">
                    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-white">
                                <Menu />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                            <div className="flex flex-col space-y-4 mt-4">
                                <NavItems />
                                <SignedIn>
                                    <OrganizationSwitcher
                                        appearance={{
                                            elements: {
                                                organizationSwitcherTrigger: "bg-[#00AE98] text-white w-full",
                                            },
                                        }}
                                    />
                                    <UserButton
                                        appearance={{
                                            elements: {
                                                userButtonAvatarBox: "w-10 h-10",
                                            },
                                        }}
                                    />
                                </SignedIn>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </nav>
    )
}