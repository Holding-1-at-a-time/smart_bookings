/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 23/02/2025 - 04:03:24
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 23/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
// components/Pricing.tsx
export function Pricing() {
    const plans = [
        {
            name: 'Starter',
            price: '$49',
            features: ['1 Location', 'Up to 3 Staff Members', 'Basic AI Scheduling', 'Email Support'],
        },
        {
            name: 'Professional',
            price: '$99',
            features: ['Up to 3 Locations', 'Up to 10 Staff Members', 'Advanced AI Scheduling', 'Priority Support'],
        },
        {
            name: 'Enterprise',
            price: 'Custom',
            features: ['Unlimited Locations', 'Unlimited Staff Members', 'Custom AI Solutions', 'Dedicated Account Manager'],
        },
    ];

    return (
        <div className="grid gap-8 grid-cols-1 md:grid-cols-3">
            {plans.map((plan) => (
                <div key={plan.name} className="bg-gray-800 shadow-glow rounded-lg p-6 flex flex-col">
                    <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
                    <p className="text-4xl font-bold text-[#00AE98] mb-6">{plan.price}<span className="text-sm text-gray-400">/month</span></p>
                    <ul className="flex-grow space-y-2 mb-6">
                        {plan.features.map((feature) => (
                            <li key={feature} className="flex items-center">
                                <svg className="h-5 w-5 text-[#00AE98] mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                    <path d="M5 13l4 4L19 7"></path>
                                </svg>
                                {feature}
                            </li>
                        ))}
                    </ul>
                    <button className="bg-[#00AE98] text-white font-bold py-2 px-4 rounded-lg hover:bg-[#009B86] transition duration-300">
                        Get Started
                    </button>
                </div>
            ))}
        </div>
    );
}

// components/FAQ.tsx
export function FAQ() {
    const faqs = [
        {
            question: 'How does AI improve my scheduling?',
            answer: 'Our AI analyzes historical data, service durations, and staff availability to optimize your schedule. It can predict busy periods, suggest ideal time slots for specific services, and automatically adjust for cancellations or delays.',
        },
        {
            question: 'Can I integrate Smart Bookings with my existing systems?',
            answer: 'Yes, Smart Bookings is designed to integrate seamlessly with popular CRM, accounting, and payment processing systems. We also offer API access for custom integrations.',
        },
        {
            question: 'Is my data secure with Smart Bookings?',
            answer: 'Absolutely. We use industry-standard encryption and security practices to protect your data. Our systems are regularly audited and comply with data protection regulations.',
        },
        {
            question: 'How does multi-location support work?',
            answer: 'Our multi-location feature allows you to manage all your detailing locations from a single dashboard. You can set location-specific services, prices, and staff, while getting aggregated reports across all locations.',
        },
    ];

    return (
        <div className="space-y-8">
            {faqs.map((faq, index) => (
                <div key={index} className="bg-gray-800 shadow-glow rounded-lg p-6">
                    <h3 className="text-xl font-bold mb-2">{faq.question}</h3>
                    <p className="text-gray-300">{faq.answer}</p>
                </div>
            ))}
        </div>
    );
}

// components/Testimonials.tsx
export function Testimonials() {
    const testimonials = [
        {
            name: 'John Doe',
            role: 'Owner, Shine Bright Auto Detailing',
            content: 'Smart Bookings has revolutionized how we manage our appointments. The AI scheduling has increased our efficiency by 30%!',
        },
        {
            name: 'Jane Smith',
            role: 'Manager, Luxury Car Spa',
            content: 'The multi-location support is a game-changer. I can now easily manage all our branches from a single dashboard.',
        },
        {
            name: 'Mike Johnson',
            role: 'Founder, Mobile Detailing Pros',
            content: 'The customer insights provided by Smart Bookings have helped us tailor our services and increase customer retention significantly.',
        },
    ];

    return (
        <div className="grid gap-8 grid-cols-1 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-gray-800 shadow-glow rounded-lg p-6">
                    <p className="text-gray-300 mb-4">"{testimonial.content}"</p>
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <svg className="h-10 w-10 text-[#00AE98]" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 14c3.31 0 6-2.69 6-6s-2.69-6-6-6-6 2.69-6 6 2.69 6 6 6zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium">{testimonial.name}</p>
                            <p className="text-xs text-gray-400">{testimonial.role}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

// components/NewsletterSignup.tsx
export function NewsletterSignup() {
    return (
        <div className="bg-gray-800 shadow-glow rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">Subscribe to Our Newsletter</h3>
            <p className="text-gray-300 mb-4">Stay updated with the latest features and auto detailing industry news.</p>
            <form className="flex flex-col sm:flex-row gap-4">
                <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-grow px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#00AE98]"
                />
                <button
                    type="submit"
                    className="bg-[#00AE98] text-white font-bold py-2 px-6 rounded-lg hover:bg-[#009B86] transition duration-300"
                >
                    Subscribe
                </button>
            </form>
        </div>
    );
}