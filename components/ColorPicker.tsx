/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 22/02/2025 - 15:30:20
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 22/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
"use client"

import { useState } from "react"
import { HexColorPicker } from "react-colorful"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"

interface ColorPickerProps {
    color: string
    onChange: (color: string) => void
}

export default function ColorPicker({ color, onChange }: ColorPickerProps) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" className="w-[220px] justify-start text-left font-normal">
                    <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: color }} />
                    {color}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <HexColorPicker color={color} onChange={onChange} />
            </PopoverContent>
        </Popover>
    )
}

