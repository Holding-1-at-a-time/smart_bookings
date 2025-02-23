/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 23/02/2025 - 03:44:53
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 23/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
// components/PricingForm.tsx
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useMutation } from "convex/react";
import { api } from '@/convex/_generated/api';

interface PricingFormProps {
    tier: string
    price: string
    onClose: () => void
}

export function PricingForm({ tier, price, onClose }: PricingFormProps) {
    const [formData, setFormData] = useState({
        businessName: '',
        name: '',
        email: '',
        phone: '',
        locations: '1',
        employees: '1-5',
        currentSoftware: '',
        monthlyBookings: '0-50',
    })


    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState<string | null>(null)
    const [submitSuccess, setSubmitSuccess] = useState(false)


    const submitPricingRequest = useMutation(api.pricingRequests.submitPricingRequest);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setSubmitError(null)

        try {
            await submitPricingRequest({
                tier,
                price,
                ...formData,
            })
            setSubmitSuccess(true)
            setTimeout(() => {
                onClose()
            }, 3000)
        } catch (error) {
            console.error('Error submitting pricing request:', error)
            setSubmitError('An error occurred while submitting your request. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto"
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-gray-800 rounded-lg p-6 w-full max-w-lg mx-auto relative"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-white"
                        disabled={isSubmitting}
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <h2 className="text-2xl font-bold mb-4">Get Started with {tier}</h2>
                    <p className="mb-6 text-gray-300">
                        Tell us about your business to get a customized demo and pricing details.
                    </p>

                    {submitSuccess ? (
                        <div className="text-center text-green-500">
                            <p className="text-xl font-bold mb-2">Thank you for your interest!</p>
                            <p>We will contact you soon with more information.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Business Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-[#00AE98]"
                                        value={formData.businessName}
                                        onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                                        disabled={isSubmitting}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Your Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-[#00AE98]"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Email</label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-[#00AE98]"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        disabled={isSubmitting}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Phone</label>
                                    <input
                                        type="tel"
                                        required
                                        className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-[#00AE98]"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Number of Locations</label>
                                    <select
                                        className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-[#00AE98]"
                                        value={formData.locations}
                                        onChange={(e) => setFormData({ ...formData, locations: e.target.value })}
                                        disabled={isSubmitting}
                                    >
                                        <option value="1">1</option>
                                        <option value="2-5">2-5</option>
                                        <option value="6-10">6-10</option>
                                        <option value="10+">10+</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Number of Employees</label>
                                    <select
                                        className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-[#00AE98]"
                                        value={formData.employees}
                                        onChange={(e) => setFormData({ ...formData, employees: e.target.value })}
                                        disabled={isSubmitting}
                                    >
                                        <option value="1-5">1-5</option>
                                        <option value="6-15">6-15</option>
                                        <option value="16-30">16-30</option>
                                        <option value="31+">31+</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Current Booking Software</label>
                                <input
                                    type="text"
                                    placeholder="If any"
                                    className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-[#00AE98]"
                                    value={formData.currentSoftware}
                                    onChange={(e) => setFormData({ ...formData, currentSoftware: e.target.value })}
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Monthly Bookings</label>
                                <select
                                    className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-[#00AE98]"
                                    value={formData.monthlyBookings}
                                    onChange={(e) => setFormData({ ...formData, monthlyBookings: e.target.value })}
                                    disabled={isSubmitting}
                                >
                                    <option value="0-50">0-50</option>
                                    <option value="51-100">51-100</option>
                                    <option value="101-200">101-200</option>
                                    <option value="201+">201+</option>
                                </select>
                            </div>

                            {submitError && (
                                <div className="text-red-500 text-sm">{submitError}</div>
                            )}

                            <button
                                type="submit"
                                className="w-full bg-[#00AE98] text-white font-bold py-3 px-4 rounded-lg hover:bg-[#009B86] transition duration-300 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Submitting...' : 'Get Started'}
                            </button>
                        </form>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}