import React from 'react';
import { FaClipboardList, FaCut, FaCheckCircle, FaTruck } from 'react-icons/fa';
import { GiSewingMachine } from 'react-icons/gi';

const HowItWorks = () => {
    const steps = [
        {
            icon: <FaClipboardList className="text-4xl" />,
            title: 'Place Order',
            description: 'Customer places order with specifications and requirements',
            color: 'from-blue-500 to-cyan-500',
        },
        {
            icon: <FaCut className="text-4xl" />,
            title: 'Cutting',
            description: 'Fabric is cut according to pattern specifications',
            color: 'from-purple-500 to-pink-500',
        },
        {
            icon: <GiSewingMachine className="text-4xl" />,
            title: 'Sewing',
            description: 'Pieces are assembled and stitched together',
            color: 'from-green-500 to-emerald-500',
        },
        {
            icon: <FaCheckCircle className="text-4xl" />,
            title: 'Finishing',
            description: 'Quality checks, ironing, and final touches',
            color: 'from-yellow-500 to-orange-500',
        },
        {
            icon: <FaTruck className="text-4xl" />,
            title: 'Delivery',
            description: 'Packaged and shipped to customer',
            color: 'from-red-500 to-rose-500',
        },
    ];

    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12" data-aos="fade-up">
                    <h2 className="text-4xl font-bold mb-4">How It Works</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        From order placement to delivery, track every step of your garment production journey
                    </p>
                </div>

                <div className="relative">
                    {/* Timeline line */}
                    <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-primary-500 to-secondary-500"></div>

                    <div className="space-y-12">
                        {steps.map((step, index) => (
                            <div
                                key={index}
                                className={`flex flex-col md:flex-row items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''
                                    }`}
                                data-aos="fade-up"
                                data-aos-delay={index * 100}
                            >
                                {/* Step Content */}
                                <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                                    <div className="bg-white p-6 rounded-xl shadow-lg">
                                        <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center text-white mb-4 mx-auto md:mx-0`}>
                                            {step.icon}
                                        </div>
                                        <h3 className="text-xl font-bold mb-2 text-center md:text-left">
                                            Step {index + 1}: {step.title}
                                        </h3>
                                        <p className="text-gray-600 text-center md:text-left">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Step Number */}
                                <div className="hidden md:flex w-12 h-12 rounded-full bg-white border-4 border-primary-500 items-center justify-center absolute left-1/2 transform -translate-x-1/2 z-10">
                                    <span className="font-bold text-primary-600">{index + 1}</span>
                                </div>

                                {/* Empty div for alignment */}
                                <div className="md:w-1/2"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;