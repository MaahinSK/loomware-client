import React from 'react';
import { Helmet } from 'react-helmet-async';
import { FaUsers, FaLightbulb, FaGlobe, FaHandsHelping } from 'react-icons/fa';

const AboutUs = () => {
    return (
        <div className="bg-gray-50 min-h-screen">
            <Helmet>
                <title>About Us - LoomWare</title>
                <meta name="description" content="Learn more about LoomWare, our mission, and our vision for the future of garment production management." />
            </Helmet>

            {/* Hero Section */}
            <div className="bg-gradient-primary text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4" data-aos="fade-up">About LoomWare</h1>
                    <p className="text-xl max-w-2xl mx-auto opacity-90" data-aos="fade-up" data-aos-delay="100">
                        Revolutionizing garment production management with innovation and precision.
                    </p>
                </div>
            </div>

            {/* Who We Are Section */}
            <div className="container mx-auto px-4 py-16">
                <div className="flex flex-col md:flex-row items-center gap-12">
                    <div className="md:w-1/2" data-aos="fade-right">
                        <img
                            src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1974&auto=format&fit=crop"
                            alt="Design team working"
                            className="rounded-xl shadow-2xl w-full"
                        />
                    </div>
                    <div className="md:w-1/2" data-aos="fade-left">
                        <h2 className="text-3xl font-bold text-gray-800 mb-6">Who We Are</h2>
                        <p className="text-gray-600 mb-6 leading-relaxed">
                            LoomWare is a cutting-edge software solution designed specifically for the garment manufacturing industry. We understand the complexities of the production floor, from inventory management to order fulfillment.
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                            Our team combines expertise in software engineering and textile manufacturing to bring you a tool that not only solves problems but drives efficiency and growth. We are dedicated to helping factories of all sizes modernize their operations.
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="bg-white py-16">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center" data-aos="fade-up">
                        <div className="p-6">
                            <h3 className="text-4xl font-bold text-primary-600 mb-2">500+</h3>
                            <p className="text-gray-600 font-medium">Factories Connected</p>
                        </div>
                        <div className="p-6">
                            <h3 className="text-4xl font-bold text-primary-600 mb-2">1M+</h3>
                            <p className="text-gray-600 font-medium">Orders Processed</p>
                        </div>
                        <div className="p-6">
                            <h3 className="text-4xl font-bold text-primary-600 mb-2">50+</h3>
                            <p className="text-gray-600 font-medium">Countries Served</p>
                        </div>
                        <div className="p-6">
                            <h3 className="text-4xl font-bold text-primary-600 mb-2">24/7</h3>
                            <p className="text-gray-600 font-medium">Customer Support</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mission & Vision */}
            <div className="container mx-auto px-4 py-20 text-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-12" data-aos="fade-up">Our Values</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Value Card 1 */}
                    <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-primary-500 hover:shadow-2xl transition-shadow" data-aos="fade-up" data-aos-delay="100">
                        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FaLightbulb className="text-3xl text-primary-600" />
                        </div>
                        <h3 className="text-xl font-bold mb-4">Innovation</h3>
                        <p className="text-gray-600">
                            We constantly push the boundaries of what's possible, integrating the latest tech to solve age-old problems.
                        </p>
                    </div>

                    {/* Value Card 2 */}
                    <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-secondary-500 hover:shadow-2xl transition-shadow" data-aos="fade-up" data-aos-delay="200">
                        <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FaUsers className="text-3xl text-secondary-600" />
                        </div>
                        <h3 className="text-xl font-bold mb-4">Community</h3>
                        <p className="text-gray-600">
                            We build strong relationships with our clients, listening to their needs and growing together.
                        </p>
                    </div>

                    {/* Value Card 3 */}
                    <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-primary-500 hover:shadow-2xl transition-shadow" data-aos="fade-up" data-aos-delay="300">
                        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FaGlobe className="text-3xl text-primary-600" />
                        </div>
                        <h3 className="text-xl font-bold mb-4">Sustainability</h3>
                        <p className="text-gray-600">
                            Promoting eco-friendly practices by optimizing resources and reducing waste in production.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;