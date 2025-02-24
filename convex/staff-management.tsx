/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 23/02/2025 - 21:48:13
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 23/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { useQuery, useMutation } from "convex/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { api } from "@/convex/_generated/api"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"

interface StaffMember {
    id: string
    name: string
    email: string
    role: string
}

export function StaffManagement() {
    const { organizationId } = useParams()
    const [staffMembers, setStaffMembers] = useState<StaffMember[]>([])
    const [newStaff, setNewStaff] = useState({ name: "", email: "", role: "" })

    const staffData = useQuery(api.staff.listStaffMembers, { organizationId: organizationId as string })
    const addStaffMember = useMutation(api.staff.addStaffMember)

    useEffect(() => {
        if (staffData) {
            setStaffMembers(staffData)
        }
    }, [staffData])

    const handleAddStaff = async () => {
        try {
            await addStaffMember({
                organizationId: organizationId as string,
                ...newStaff,
            })
            setNewStaff({ name: "", email: "", role: "" })
            toast({
                title: "Success",
                description: "New staff member added successfully.",
            })
        } catch (error) {
            console.error("Error adding staff member:", error)
            toast({
                title: "Error",
                description: "Failed to add staff member. Please try again.",
                variant: "destructive",
            })
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Staff Management</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                        
                        <Input
                            placeholder="Name"
                            value={newStaff.name}
                            onChange={(e: { target: { value: any } }) => setNewStaff({ ...newStaff, name: e.target.value })}
                        />
                        <Input
                            placeholder="Email"
                            value={newStaff.email}
                            onChange={(e: { target: { value: any } }) => setNewStaff({ ...newStaff, email: e.target.value })}
                        />
                        <Input
                            placeholder="Role"
                            value={newStaff.role}
                            onChange={(e: { target: { value: any } }) => setNewStaff({ ...newStaff, role: e.target.value })}
                        />
                    </div>
                    <Button onClick={handleAddStaff}>Add Staff Member</Button>
                </div>
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Current Staff</h3>
                    {staffMembers.map((staff) => (
                        <div key={staff.id} className="flex justify-between items-center py-2 border-b">
                            <div>
                                <p className="font-medium">{staff.name}</p>
                                <p className="text-sm text-gray-500">{staff.email}</p>
                            </div>
                            <p>{staff.role}</p>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

