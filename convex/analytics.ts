/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 23/02/2025 - 20:23:39
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
import { Id } from "@/convex/_generated/dataModel";
import { prophet } from 'prophet-js'
export const generateBasicRevenueReport = query({
    args: {
        organizationId: v.id("organizations"),
        startDate: v.string(),
        endDate: v.string(),
    },
    handler: async (ctx, args) => {
        const { organizationId, startDate, endDate } = args

        try {
            const bookings = await ctx.db
                .query("bookings")
                .withIndex("by_organization_and_by_date", (q) =>
                    q.eq("organizationId", organizationId).gte("date", startDate).lte("date", endDate),
                )
                .collect()

            const totalRevenue = bookings.reduce((sum, booking) => sum + (booking.totalPrice || 0), 0)
            const averageRevenue = totalRevenue / bookings.length || 0

            const report = {
                totalRevenue,
                averageRevenue,
                totalBookings: bookings.length,
                startDate,
                endDate,
            }

            loggingService.info(`Basic revenue report generated`, { organizationId, startDate, endDate })
            return report
        } catch (error) {
            loggingService.error(`Error generating basic revenue report: ${error}`, { organizationId, startDate, endDate })
            throw new Error("Failed to generate basic revenue report")
        }
    },
})

export const calculateBookingStats = query({
    args: {
        organizationId: v.id("organizations"),
        startDate: v.string(),
        endDate: v.string(),
    },
    handler: async (ctx, args) => {
        const { organizationId, startDate, endDate } = args

        try {
            const bookings = await ctx.db
                .query("bookings")
                .withIndex("by_organization_and_by_date", (q) =>
                    q.eq("organizationId", organizationId).gte("date", startDate).lte("date", endDate),
                )
                .collect()

            const totalBookings = bookings.length
            const completedBookings = bookings.filter((booking) => booking.status === "completed").length
            const cancelledBookings = bookings.filter((booking) => booking.status === "cancelled").length

            const stats = {
                totalBookings,
                completedBookings,
                cancelledBookings,
                completionRate: totalBookings > 0 ? completedBookings / totalBookings : 0,
                cancellationRate: totalBookings > 0 ? cancelledBookings / totalBookings : 0,
                startDate,
                endDate,
            }

            loggingService.info(`Booking stats calculated`, { organizationId, startDate, endDate })
            return stats
        } catch (error) {
            loggingService.error(`Error calculating booking stats: ${error}`, { organizationId, startDate, endDate })
            throw new Error("Failed to calculate booking stats")
        }
    },
})

export const analyzeServicePopularity = query({
    args: { organizationId: Id<"organizations">, serviceId: Id<"services"> },
    handler: async (ctx: any, args: { organizationId: string, serviceId: string }): Promise<number> => {
        const { organizationId, serviceId } = args;

        try {
            const bookings = await ctx.db
                .query("bookings")
                .withIndex("by_organization_and_by_service", (q: any) =>
                    q.eq("organizationId", organizationId).eq("serviceId", serviceId)
                )
                .collect();

            const totalBookings = bookings.length;

            // Assuming a heuristic where popularity is based on the number of bookings
            const maxBookings = 100; // hypothetical maximum number of bookings for scaling
            return Math.min(totalBookings / maxBookings, 1);
        } catch (error) {
            loggingService.error(`Error analyzing service popularity: ${error}`, { organizationId, serviceId });
            throw new Error("Failed to analyze service popularity");
        }
    },
});

export const forecastDemand = query({
    args: { organizationId: Id<"organizations">, serviceId: Id<"services"> },
    handler: async (ctx: any, args: { organizationId: string, serviceId: string }): Promise<number> => {
        const { organizationId, serviceId } = args;

        const bookings = await ctx.db
            .query("bookings")
            .withIndex("by_organization_and_by_service", (q: any) =>
                q.eq("organizationId", organizationId).eq("serviceId", serviceId)
            )
            .collect();

        const historicalBookings = bookings
            .filter((booking: any) => booking.date < new Date().toISOString())
            .map((booking: any) => booking.date);

        return await aiForecastDemand(historicalBookings);
    },
});
/**
 * Forecasts future demand based on historical booking data.
 *
 * @param bookings - An array of booking dates as strings.
 * @returns The forecasted demand as a number.
 */
export const aiForecastDemand = async (bookings: string[]): Promise<number> => {
    // Convert booking dates to timestamp objects
    const bookingData = bookings.map((date) => ({
        date: new Date(date).getTime(),
        value: 1,
    }));

    // Create a Prophet model and make a future forecast
    const model = await prophet(bookingData);
    const forecastResult = await model.makeFuture(30);

    // Extract future data points
    const futureData = forecastResult.result;

    // Find the last date in the future data points
    const lastDate = new Date(Math.max(...futureData.map((points: { ds: any; }) => points.ds)));

    // Filter future data points to only include those after the last date
    const futureBookings = futureData.filter((points: { ds: number; }) => points.ds > lastDate.getTime());

    // Calculate the average forecasted demand
    return futureBookings.reduce((sum: any, point: { yhat: any; }) => sum + point.yhat, 0) / futureBookings.length;
}

export default {
    generateBasicRevenueReport,
    calculateBookingStats,
    analyzeServicePopularity,
    forecastDemand,
};

/**
 * Forecasts future demand based on historical booking data.
 *
 * @param bookings - An array of booking dates as strings.
 * @returns The forecasted demand as a number.
/**
 * Forecasts future demand based on historical booking data.
 *
 * @param bookings - An array of booking dates as strings.
 * @returns The forecasted demand as a number.
 */
export const aiBookingForecast: (bookings: string[]) => Promise<number> = async (bookings: string[]): Promise<number> => {
    // Retrieve historical booking data for the organization
    const historicalBookings = await db.bookings
        .filter((booking: { organizationId: string; }) => booking.organizationId === organizationId)
    // Transform historical booking data into a format suitable for forecasting
    const data: { date: number; value: number }[] = historicalBookings.map((booking: { date: string | number | Date; }) => ({
        date: new Date(booking.date).getTime(),
        value: 1, // Assume each booking contributes equally to demand
    }));
    // Use Prophet model to forecast future demand
    const model = await prophet(data);
    const forecastResult = await model.makeFuture(30);

    // Extract predicted future data points
    const futureData = forecastResult.result;

    // Identify the latest date from the future data points
    const lastDate = new Date(Math.max(...futureData.map((point: { ds: number; }) => point.ds)));

    // Filter future data points to include only those after the last date
    const futureBookings = futureData.filter((point: { ds: number; }) => point.ds > lastDate.getTime());

    // Calculate the average forecasted demand from future bookings
    return futureBookings.reduce((sum: number, point: { yhat: number; }) => sum + point.yhat, 0) / futureBookings.length;
};

export async function prophet(data: any): Promise<any> {    // Create a new Prophet model instance
    const model = new prophet();

    // Train the model on the historical data
    model.fit(data);

    // Return the trained model
    return model;
}

        //* export const forecast = mutation({
        //*    args: {
        //*        bookings: v.array(v.string()),
        //*    },
        //*    handler: async (ctx: any, args: { bookings: string[] }): Promise<number> => {
        //*        // Get the organization ID from the bookings
        //*        const organizationId = await db.bookings
        //*            .filter((booking) => bookings.includes(booking.date))
        //*            .first()
        //*            .then((booking) => booking.organizationId);
        //*
        //*        // Get the historical booking data for the organization 
        //*        const historicalBookings = await db.bookings
        //*            .filter((booking) => booking.organizationId === organizationId)
        //*            .collect();
        //*        return {}
        //*    },
        //*    // Call the forecastDemand function with the historical booking data
        //*    forecastDemand(historicalBookings),
        //*    // Return the result of the forecastDemand function
        //*    result: v.number(),
        //*}, {
        //*    // Add a description to the mutation
        //*    description: 'Forecast demand for a given organization',
        //*});
        //*    
        //*
        //*
        //*        name: 'bookings',
        //*        type: 'array',
        //*        items: {
        //*            type: 'string',
        //*        },
        //*    },
        //*],
        //*    return: {
        //*    type: 'number',
        //*    },
        //*    async execute({ bookings }) {
        //*    // Get the organization ID from the bookings
        //*    const organizationId = await db.bookings
        //*        .filter((booking) => bookings.includes(booking.date))
        //*        .first()
        //*        .then((booking) => booking.organizationId);
        //*
        //*    // Get the historical booking data for the organization
        //*    const historicalBookings = await db.bookings
        //*        .filter((booking) => booking.organizationId === organizationId)
        //*        .collect();
        //*
        //*    // Convert the historical booking data to a format suitable for forecasting
        //*    const historicalBookingData = historicalBookings.map((booking) => ({
        //*        date: new Date(booking.date).getTime(),
        //*        value: 1,
        //*    }));
        //*
        //*    // Create a Prophet model and make a future forecast
        //*    const model = await prophet(historicalBookingData);
        //*    const forecastResult = await model.makeFuture(30);
        //*
        //*    // Extract the future data points
        //*    const futureData = forecastResult.result;
        //*
        //*    // Find the last date in the future data points
        //*    const lastDate = new Date(Math.max(...futureData.map((point) => point.ds)));
        //*
        //*    // Filter the future data points to only include those after the last date
        //*    const futureBookings = futureData.filter((point) => point.ds > lastDate.getTime());
        //*
        //*    // Calculate the average forecasted demand
        //*    const averageDemand = futureBookings.reduce((sum, point) => sum + point.yhat, 0) / futureBookings.length;
        //*
        //*    return averageDemand;
        //*},
        //*    };
        //*
        //*export default forecastDemand;
