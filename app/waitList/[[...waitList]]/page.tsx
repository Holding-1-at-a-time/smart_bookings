/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 20/02/2025 - 16:08:23
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 20/02/2025
    * - Author          : rrome
    * - Modification    : 
**/

import { Waitlist } from "@clerk/clerk-react";
import { JSX } from "react";

/**
 * WaitlistPage
 *
 * This page renders the Waitlist component from @clerk/nextjs.
 * The component is styled with custom styles for the card, header title, header subtitle, primary form button, form field labels, and form field inputs.
 *
 * @returns {JSX.Element} A JSX element representing the Waitlist component.
 */
export default function WaitlistPage(): JSX.Element {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-900">
            <Waitlist
                /**
                 * The appearance of the Waitlist component is customized using the `appearance` prop.
                 * The `elements` property is used to customize the styles of the component's elements.
                 * The `card` property is used to customize the styles of the card element of the component.
                 * The `headerTitle` property is used to customize the styles of the header title element of the component.
                 * The `headerSubtitle` property is used to customize the styles of the header subtitle element of the component.
                 * The `formButtonPrimary` property is used to customize the styles of the primary form button element of the component.
                 * The `formFieldLabel` property is used to customize the styles of the form field label element of the component.
                 * The `formFieldInput` property is used to customize the styles of the form field input element of the component.
                 */
                appearance={{
                    elements: {
                        card: "bg-gray-800 border-gray-700",
                        headerTitle: "text-white",
                        headerSubtitle: "text-gray-300",
                        formButtonPrimary: "bg-primary hover:bg-primary/90 text-white",
                        formFieldLabel: "text-gray-300",
                        formFieldInput: "bg-gray-700 border-gray-600 text-white",
                    },
                }}
            />
        </div>
    )
}

