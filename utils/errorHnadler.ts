/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 19/02/2025 - 04:51:07
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 19/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
export class AppError extends Error {
    public stack?: string; // Add stack property

    constructor(public statusCode: number, message: string, stack?: string) {
        super(message);
        this.name = "AppError";
        this.stack = stack; // Assign stack trace
    }

    toString() {
        return `${this.name}: ${this.message}`;
    }
};

export const handleConvexError = (error: unknown) => {
    console.error("Convex Error:", error);
    if (error instanceof AppError) {
        console.error("AppError details:", error.message, error.stack); // Log AppError details
        throw error;
    }

    if (error instanceof Error) {
        console.error("Error details:", error.message, error.stack); // Log general error details
        throw new AppError(500, "An unexpected error occurred", error.stack); // Include stack trace
    }

    console.error("Unknown error:", error); // Log unknown errors
    throw new AppError(500, "An unexpected error occurred");
};