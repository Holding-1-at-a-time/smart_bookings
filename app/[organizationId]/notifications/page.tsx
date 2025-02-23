/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 23/02/2025 - 16:13:40
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
import { api } from "@/convex/_generated/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"

interface NotificationSettings {
    emailNotifications: boolean
    smsNotifications: boolean
    reminderFrequency: "1day" | "2days" | "1week"
}

export default function NotificationCenter() {
    const { organizationId } = useParams()
    const [settings, setSettings] = useState<NotificationSettings>({
        emailNotifications: true,
        smsNotifications: false,
        reminderFrequency: "1day",
    })

    const notificationSettings = useQuery(api.notifications.getSettings, { organizationId: organizationId as string })
    const updateSettings = useMutation(api.notifications.updateSettings)

    useEffect(() => {
        if (notificationSettings) {
            setSettings(notificationSettings)
        }
    }, [notificationSettings])

    const handleSettingChange = async (setting: keyof NotificationSettings, value: boolean | string) => {
        try {
            await updateSettings({
                organizationId: organizationId as string,
                [setting]: value,
            })
            setSettings((prev) => ({ ...prev, [setting]: value }))
            toast({
                title: "Settings Updated",
                description: "Your notification settings have been updated successfully.",
            })
        } catch (error) {
            console.error("Error updating notification settings:", error)
            toast({
                title: "Error",
                description: "Failed to update notification settings. Please try again.",
                variant: "destructive",
            })
        }
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Notification Center</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Notification Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="emailNotifications">Email Notifications</Label>
                        <Switch
                            id="emailNotifications"
                            checked={settings.emailNotifications}
                            onCheckedChange={(checked) => handleSettingChange("emailNotifications", checked)}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="smsNotifications">SMS Notifications</Label>
                        <Switch
                            id="smsNotifications"
                            checked={settings.smsNotifications}
                            onCheckedChange={(checked) => handleSettingChange("smsNotifications", checked)}
                        />
                    </div>
                    <div>
                        <Label htmlFor="reminderFrequency">Reminder Frequency</Label>
                        <select
                            id="reminderFrequency"
                            value={settings.reminderFrequency}
                            onChange={(e) => handleSettingChange("reminderFrequency", e.target.value)}
                            className="w-full p-2 mt-1 border rounded"
                        >
                            <option value="1day">1 Day Before</option>
                            <option value="2days">2 Days Before</option>
                            <option value="1week">1 Week Before</option>
                        </select>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

function setSettings(notificationSettings: any) {
    throw new Error("Function not implemented.")
}
