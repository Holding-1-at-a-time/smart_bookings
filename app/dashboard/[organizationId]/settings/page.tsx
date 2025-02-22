/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 22/02/2025 - 15:28:10
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 22/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
"use client"

import { useState, useEffect } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import BusinessHoursManager from "./components/BusinessHoursManager"
import ColorPicker from "./components/ColorPicker"
import ImageUploader from "./components/ImageUploader"

export default function OrganizationSettingsPage({ params }: { params: { organizationId: string } }) {
    const { toast } = useToast()
    const organizationId = params.organizationId as Id<"organizations">
    const organization = useQuery(api.organizations.getOrganizationSettings, { organizationId })
    const updateOrganization = useMutation(api.organizations.updateOrganizationSettings)

    const [name, setName] = useState("")
    const [timezone, setTimezone] = useState("")
    const [currency, setCurrency] = useState("")
    const [locale, setLocale] = useState("")
    const [address, setAddress] = useState("")
    const [phone, setPhone] = useState("")
    const [email, setEmail] = useState("")
    const [website, setWebsite] = useState("")
    const [description, setDescription] = useState("")
    const [brandColor, setBrandColor] = useState("")
    const [logo, setLogo] = useState("")
    const [facebook, setFacebook] = useState("")
    const [twitter, setTwitter] = useState("")
    const [instagram, setInstagram] = useState("")
    const [linkedin, setLinkedin] = useState("")

    useEffect(() => {
        if (organization) {
            setName(organization.name)
            setTimezone(organization.settings.timezone)
            setCurrency(organization.settings.currency)
            setLocale(organization.settings.locale)
            setAddress(organization.address)
            setPhone(organization.phone)
            setEmail(organization.email)
            setWebsite(organization.website)
            setDescription(organization.description || "")
            setBrandColor(organization.brandColor || "")
            setLogo(organization.logo || "")
            setFacebook(organization.socialMedia?.facebook || "")
            setTwitter(organization.socialMedia?.twitter || "")
            setInstagram(organization.socialMedia?.instagram || "")
            setLinkedin(organization.socialMedia?.linkedin || "")
        }
    }, [organization])

    const handleSave = async () => {
        try {
            await updateOrganization({
                organizationId,
                name,
                settings: { timezone, currency, locale },
                address,
                phone,
                email,
                website,
                description,
                brandColor,
                logo,
                socialMedia: { facebook, twitter, instagram, linkedin },
            })
            toast({
                title: "Settings saved",
                description: "Your organization settings have been updated successfully.",
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to save settings. Please try again.",
                variant: "destructive",
            })
        }
    }

    if (!organization) {
        return <div>Loading...</div>
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Organization Settings</h1>
            <Tabs defaultValue="general">
                <TabsList>
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="branding">Branding</TabsTrigger>
                    <TabsTrigger value="business-hours">Business Hours</TabsTrigger>
                    <TabsTrigger value="social-media">Social Media</TabsTrigger>
                </TabsList>
                <TabsContent value="general">
                    <Card>
                        <CardHeader>
                            <CardTitle>General Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Organization Name</Label>
                                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="timezone">Timezone</Label>
                                    <Select value={timezone} onValueChange={setTimezone}>
                                        <SelectTrigger id="timezone">
                                            <SelectValue placeholder="Select timezone" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="America/New_York">Eastern Time</SelectItem>
                                            <SelectItem value="America/Chicago">Central Time</SelectItem>
                                            <SelectItem value="America/Denver">Mountain Time</SelectItem>
                                            <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="currency">Currency</Label>
                                    <Select value={currency} onValueChange={setCurrency}>
                                        <SelectTrigger id="currency">
                                            <SelectValue placeholder="Select currency" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="USD">US Dollar</SelectItem>
                                            <SelectItem value="EUR">Euro</SelectItem>
                                            <SelectItem value="GBP">British Pound</SelectItem>
                                            <SelectItem value="JPY">Japanese Yen</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="locale">Locale</Label>
                                    <Select value={locale} onValueChange={setLocale}>
                                        <SelectTrigger id="locale">
                                            <SelectValue placeholder="Select locale" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="en-US">English (US)</SelectItem>
                                            <SelectItem value="es-ES">Spanish (Spain)</SelectItem>
                                            <SelectItem value="fr-FR">French (France)</SelectItem>
                                            <SelectItem value="de-DE">German (Germany)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="address">Address</Label>
                                <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="website">Website</Label>
                                <Input id="website" value={website} onChange={(e) => setWebsite(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={4}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="branding">
                    <Card>
                        <CardHeader>
                            <CardTitle>Branding</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Brand Color</Label>
                                <ColorPicker color={brandColor} onChange={setBrandColor} />
                            </div>
                            <div className="space-y-2">
                                <Label>Logo</Label>
                                <ImageUploader currentImage={logo} onUpload={setLogo} organizationId={organizationId} />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="business-hours">
                    <BusinessHoursManager organizationId={organizationId} />
                </TabsContent>
                <TabsContent value="social-media">
                    <Card>
                        <CardHeader>
                            <CardTitle>Social Media</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="facebook">Facebook</Label>
                                <Input id="facebook" value={facebook} onChange={(e) => setFacebook(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="twitter">Twitter</Label>
                                <Input id="twitter" value={twitter} onChange={(e) => setTwitter(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="instagram">Instagram</Label>
                                <Input id="instagram" value={instagram} onChange={(e) => setInstagram(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="linkedin">LinkedIn</Label>
                                <Input id="linkedin" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
            <Button onClick={handleSave}>Save Settings</Button>
        </div>
    )
}

