/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 22/02/2025 - 15:30:36
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 22/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
"use client"

import type React from "react"
import { useState } from "react"
import { useStorage } from "./_generated/server"
import type { Id } from "@/convex/_generated/dataModel"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface ImageUploaderProps {
    currentImage: string
    onUpload: (imageUrl: string) => void
    organizationId: Id<"organizations">
}

export default function ImageUploader({ currentImage, onUpload, organizationId }: ImageUploaderProps) {
    const [isUploading, setIsUploading] = useState(false)
    const storage = useStorage()
    const { toast } = useToast()

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return
    
        if (!file.type.startsWith('image/')) {
            toast({
                title: "Invalid file type",
                description: "Please upload an image file",
                variant: "destructive"
            })
            return
        }
    
        if (file.size > 5 * 1024 * 1024) {
            toast({
                title: "File too large",
                description: "Image must be less than 5MB",
                variant: "destructive"
            })
            return
        }

        setIsUploading(true)

        try {
            const storageId = await storage.storeFile(file)
            const imageUrl = await storage.getUrl(storageId)

            if (imageUrl) {
                onUpload(imageUrl)
                toast({
                    title: "Image uploaded",
                    description: "Your logo has been uploaded successfully.",
                })
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to upload image. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <div className="space-y-4">
            {currentImage && (
                <img src={currentImage || "/placeholder.svg"} alt="Current logo" className="w-32 h-32 object-contain" />
            )}
            <div>
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="logo-upload" />
                <label htmlFor="logo-upload">
                    <Button as="span" variant="outline" disabled={isUploading}>
                        {isUploading ? "Uploading..." : "Upload New Logo"}
                    </Button>
                </label>
            </div>
        </div>
    )
}

