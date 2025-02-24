/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 23/02/2025 - 20:24:37
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 23/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
import { v } from "convex/values"
import { query } from "./_generated/server"
import { loggingService } from "../lib/logging-service"

export const getWeatherData = query({
    args: {
        organizationId: v.id("organizations"),
        latitude: v.number(),
        longitude: v.number(),
    },
    handler: async (ctx, args) => {
        const { organizationId, latitude, longitude } = args

        try {
            // Implement weather API call here (e.g., using OpenWeatherMap API)
            // For now, we'll return mock data
            const weatherData = {
                temperature: 22,
                description: "Partly cloudy",
                icon: "04d",
            }

            loggingService.info(`Weather data retrieved`, { organizationId, latitude, longitude })
            return weatherData
        } catch (error) {
            loggingService.error(`Error retrieving weather data: ${error}`, { organizationId, latitude, longitude })
            throw new Error("Failed to retrieve weather data")
        }
    },
})

