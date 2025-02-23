/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 23/02/2025 - 00:24:52
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 23/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
// components/FAQ.tsx
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

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
    ]

    const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

    return (
        <div className="space-y-4">
            {faqs.map((faq, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-800 shadow-glow rounded-lg overflow-hidden"
                >
                    <button
                        onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                        className="w-full px-6 py-4 flex justify-between items-center text-left"
                    >
                        <span className="text-xl font-bold">{faq.question}</span>
                        <motion.div
                            animate={{ rotate: expandedIndex === index ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <ChevronDown className="w-6 h-6 text-[#00AE98]" />
                        </motion.div>
                    </button>
                    <AnimatePresence>
                        {expandedIndex === index && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="px-6 pb-4"
                            >
                                <p className="text-gray-300">{faq.answer}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            ))}
        </div>
    )
}