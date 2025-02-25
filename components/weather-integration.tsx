/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 23/02/2025 - 19:38:57
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 23/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
"use client"

import { useState, useEffect } from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface WeatherData {
    temperature: number
    description: string
    icon: string
}

export function WeatherIntegration({ organizationId }: { organizationId: string }) {
    const [weather, setWeather] = useState<WeatherData | null>(null)

    const weatherData = useQuery(api.weather.getWeatherData, { organizationId })

    useEffect(() => {
        if (weatherData) {
            setWeather(weatherData)
        }
    }, [weatherData])

    if (!weather) {
        return null
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Current Weather</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center space-x-4">
                    <img
                        src={`http://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                        alt={weather.description}
                        className="w-16 h-16"
                    />
                    <div>
                        <p className="text-2xl font-bold">{weather.temperature}°C</p>
                        <p className="text-gray-500">{weather.description}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

