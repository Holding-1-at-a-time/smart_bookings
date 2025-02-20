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
    constructor(public statusCode: number, message: string) {
        super(message);
        this.name = "AppError";
    }
}

export const handleConvexError = (error: unknown) => {
    console.error("Convex Error:", error);
    if (error instanceof AppError) {
        throw error;
    }
    throw new AppError(500, "An unexpected error occurred");
};