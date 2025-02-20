/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 20/02/2025 - 07:13:30
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 20/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
import { Waitlist } from '@clerk/nextjs'

export default function WaitListPage() {
    return <Waitlist
        appearance={{
            layout: {
                socialButtonsPlacement: 'bottom',
                socialButtonsVariant: 'iconButton',
                shimmer: true,
                animations: true,
                afterJoinWaitlistUrl: "auth/app/page",
            },
        }}
        signInUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL}
    />
}