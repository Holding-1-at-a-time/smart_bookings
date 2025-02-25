/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 23/02/2025 - 19:40:09
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 23/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
type LogLevel = "info" | "warn" | "error"

class BasicLoggingService {
    private static instance: BasicLoggingService

    private constructor() { }

    public static getInstance(): BasicLoggingService {
        if (!BasicLoggingService.instance) {
            BasicLoggingService.instance = new BasicLoggingService()
        }
        return BasicLoggingService.instance
    }

    public log(level: LogLevel, message: string, data?: any) {
        const timestamp = new Date().toISOString()
        const logEntry = {
            timestamp,
            level,
            message,
            data,
        }

        console.log(JSON.stringify(logEntry))

        // In a production environment, you would send this log entry to a logging service
        // For example, using an API call to a logging service:
        // fetch('/api/logs', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(logEntry),
        // })
    }

    public info(message: string, data?: any) {
        this.log("info", message, data)
    }

    public warn(message: string, data?: any) {
        this.log("warn", message, data)
    }

    public error(message: string, data?: any) {
        this.log("error", message, data)
    }
}

export const loggingService = BasicLoggingService.getInstance()

