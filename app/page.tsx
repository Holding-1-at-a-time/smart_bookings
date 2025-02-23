/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 22/02/2025 - 23:38:26
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 22/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
// app/page.tsx
import { Waitlist } from '@clerk/nextjs';
import Image from 'next/image';
import { Pricing } from '../components/Pricing';
import { FAQ } from '../components/FAQ';
import { Testimonials } from '../components/Testimonials';
import { NewsletterSignup } from '../components/NewsletterSignup';

export default function Home() {
    return (
        <div className="min-h-screen bg-gray-900 text-white overflow-hidden">
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[#00AE98] opacity-20 blur-3xl"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-transparent"></div>
            </div>

            <header className="relative z-10">
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <Image src="/logo.svg" alt="Smart Bookings Logo" width={40} height={40} className="filter drop-shadow-glow" />
                            <span className="ml-2 text-xl font-bold">Smart Bookings</span>
                        </div>
                        <div className="hidden md:flex space-x-4">
                            <a href="#features" className="text-gray-300 hover:text-white transition">Features</a>
                            <a href="#pricing" className="text-gray-300 hover:text-white transition">Pricing</a>
                            <a href="#testimonials" className="text-gray-300 hover:text-white transition">Testimonials</a>
                            <a href="#faq" className="text-gray-300 hover:text-white transition">FAQ</a>
                        </div>
                    </div>
                </nav>
            </header>

            <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                    <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
                        <h1 className="text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl">
                            <span className="block">Revolutionize Your</span>
                            <span className="block text-[#00AE98] filter drop-shadow-glow">Auto Detailing Business</span>
                        </h1>
                        <p className="mt-3 text-base text-gray-300 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                            Smart Bookings uses AI to optimize your schedule, increase efficiency, and boost your revenue. Join the waitlist for early access!
                        </p>
                        <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                            <Waitlist />
                        </div>
                    </div>
                    <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
                        <div className="relative mx-auto w-full rounded-lg shadow-glow lg:max-w-md">
                            <Image
                                className="w-full rounded-lg"
                                src="/auto-detailing.jpg"
                                alt="Auto detailing"
                                width={640}
                                height={360}
                            />
                        </div>
                    </div>
                </div>

                <section id="features" className="mt-24">
                    <h2 className="text-3xl font-extrabold sm:text-4xl">
                        Why Choose Smart Bookings?
                    </h2>
                    <div className="mt-12 grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {features.map((feature) => (
                            <div key={feature.name} className="bg-gray-800 shadow-glow rounded-lg p-6 transform transition duration-500 hover:scale-105">
                                <div className="text-[#00AE98] text-3xl mb-4 filter drop-shadow-glow">{feature.icon}</div>
                                <h3 className="text-xl font-medium">{feature.name}</h3>
                                <p className="mt-2 text-base text-gray-300">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section id="product-details" className="mt-24">
                    <h2 className="text-3xl font-extrabold sm:text-4xl mb-8">
                        Detailed Product Information
                    </h2>
                    <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
                        <div className="bg-gray-800 shadow-glow rounded-lg p-6">
                            <h3 className="text-2xl font-bold mb-4">AI-Powered Scheduling</h3>
                            <ul className="list-disc list-inside text-gray-300 space-y-2">
                                <li>Dynamic time slot allocation based on service complexity</li>
                                <li>Automatic staff assignment optimization</li>
                                <li>Real-time schedule adjustments for cancellations and no-shows</li>
                                <li>Predictive booking suggestions for customers</li>
                            </ul>
                        </div>
                        <div className="bg-gray-800 shadow-glow rounded-lg p-6">
                            <h3 className="text-2xl font-bold mb-4">Customer Management</h3>
                            <ul className="list-disc list-inside text-gray-300 space-y-2">
                                <li>Detailed customer profiles with service history</li>
                                <li>Automated reminders and follow-ups</li>
                                <li>Loyalty program integration</li>
                                <li>Personalized service recommendations</li>
                            </ul>
                        </div>
                        <div className="bg-gray-800 shadow-glow rounded-lg p-6">
                            <h3 className="text-2xl font-bold mb-4">Business Analytics</h3>
                            <ul className="list-disc list-inside text-gray-300 space-y-2">
                                <li>Real-time revenue tracking and forecasting</li>
                                <li>Service popularity and trend analysis</li>
                                <li>Staff performance metrics</li>
                                <li>Customer retention and churn prediction</li>
                            </ul>
                        </div>
                        <div className="bg-gray-800 shadow-glow rounded-lg p-6">
                            <h3 className="text-2xl font-bold mb-4">Multi-Location Support</h3>
                            <ul className="list-disc list-inside text-gray-300 space-y-2">
                                <li>Centralized management for multiple locations</li>
                                <li>Location-specific pricing and services</li>
                                <li>Cross-location staff scheduling</li>
                                <li>Aggregated reporting across all locations</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <section id="pricing" className="mt-24">
                    <h2 className="text-3xl font-extrabold sm:text-4xl mb-8">
                        Pricing Plans
                    </h2>
                    <Pricing />
                </section>

                <section id="testimonials" className="mt-24">
                    <h2 className="text-3xl font-extrabold sm:text-4xl mb-8">
                        What Our Customers Say
                    </h2>
                    <Testimonials />
                </section>

                <section id="faq" className="mt-24">
                    <h2 className="text-3xl font-extrabold sm:text-4xl mb-8">
                        Frequently Asked Questions
                    </h2>
                    <FAQ />
                </section>

                <section id="newsletter" className="mt-24">
                    <h2 className="text-3xl font-extrabold sm:text-4xl mb-8">
                        Stay Updated
                    </h2>
                    <NewsletterSignup />
                </section>
            </main>

            <footer className="relative z-10 bg-gray-800 mt-24">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
                    <div className="flex justify-center space-x-6 md:order-2">
                        {/* Add your social media links here */}
                    </div>
                    <div className="mt-8 md:mt-0 md:order-1">
                        <p className="text-center text-base text-gray-400">
                            &copy; 2025 Smart Bookings. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

const features = [
    {
        name: 'AI-Powered Scheduling',
        description: 'Our advanced AI optimizes your schedule to maximize efficiency and revenue.',
        icon: '🧠',
    },
    {
        name: 'Multi-Location Support',
        description: 'Manage multiple detailing locations from a single, intuitive dashboard.',
        icon: '📍',
    },
    {
        name: 'Customer Insights',
        description: 'Gain valuable insights into customer preferences and booking patterns.',
        icon: '📊',
    },
    {
        name: 'Automated Marketing',
        description: 'Send targeted promotions and reminders to boost repeat business.',
        icon: '📱',
    },
    {
        name: 'Real-time Analytics',
        description: 'Track your business performance with detailed, real-time reports.',
        icon: '📈',
    },
    {
        name: 'Integration Ready',
        description: 'Easily connect with your favorite tools and payment processors.',
        icon: '🔗',
    },
];