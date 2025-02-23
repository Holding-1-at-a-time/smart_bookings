/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 23/02/2025 - 17:24:47
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 23/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
interface EmailTemplateProps {
    type: "confirmation" | "reminder"
    data: {
        customerName: string
        serviceName: string
        date: string
        time: string
        businessName: string
        businessAddress: string
        businessPhone: string
    }
}

export function EmailTemplate({ type, data }: EmailTemplateProps) {
    const { customerName, serviceName, date, time, businessName, businessAddress, businessPhone } = data

    const templateStyles = {
        container: {
            fontFamily: "Arial, sans-serif",
            maxWidth: "600px",
            margin: "0 auto",
            padding: "20px",
            border: "1px solid #e0e0e0",
            borderRadius: "5px",
        },
        header: {
            backgroundColor: "#00AE98",
            color: "#ffffff",
            padding: "20px",
            textAlign: "center" as const,
        },
        content: {
            padding: "20px",
        },
        footer: {
            backgroundColor: "#f0f0f0",
            padding: "10px",
            textAlign: "center" as const,
            fontSize: "12px",
        },
    }

    const confirmationContent = (
        <>
            <p>Dear {customerName},</p>
            <p>Thank you for booking an appointment with {businessName}. Your booking details are as follows:</p>
            <ul>
                <li>Service: {serviceName}</li>
                <li>Date: {date}</li>
                <li>Time: {time}</li>
            </ul>
            <p>We look forward to seeing you!</p>
        </>
    )

    const reminderContent = (
        <>
            <p>Dear {customerName},</p>
            <p>This is a friendly reminder of your upcoming appointment with {businessName}:</p>
            <ul>
                <li>Service: {serviceName}</li>
                <li>Date: {date}</li>
                <li>Time: {time}</li>
            </ul>
            <p>We're looking forward to seeing you soon!</p>
        </>
    )

    return (
        <div style={templateStyles.container}>
            <div style={templateStyles.header}>
                <h1>{type === "confirmation" ? "Booking Confirmation" : "Appointment Reminder"}</h1>
            </div>
            <div style={templateStyles.content}>{type === "confirmation" ? confirmationContent : reminderContent}</div>
            <div style={templateStyles.footer}>
                <p>{businessName}</p>
                <p>{businessAddress}</p>
                <p>Phone: {businessPhone}</p>
            </div>
        </div>
    )
}

