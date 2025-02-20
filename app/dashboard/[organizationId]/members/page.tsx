/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 19/02/2025 - 10:41:59
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 19/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
import { OrganizationList, OrganizationProfile, SignedIn } from "@clerk/nextjs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function OrganizationManagementPage() {
    return (
        <SignedIn>
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold mb-6">Organization Management</h1>
                <Tabs defaultValue="members">
                    <TabsList>
                        <TabsTrigger value="members">Members</TabsTrigger>
                        <TabsTrigger value="profile">Organization Profile</TabsTrigger>
                    </TabsList>
                    <TabsContent value="members">
                        <OrganizationList
                            hidePersonal
                            appearance={{
                                elements: {
                                    rootBox: "max-w-3xl mx-auto",
                                    card: "shadow-md rounded-lg",
                                },
                            }}
                        />
                    </TabsContent>
                    <TabsContent value="profile">
                        <OrganizationProfile
                            appearance={{
                                elements: {
                                    rootBox: "max-w-3xl mx-auto",
                                    card: "shadow-md rounded-lg",
                                },
                            }}
                        />
                    </TabsContent>
                </Tabs>
            </div>
        </SignedIn>
    );
}