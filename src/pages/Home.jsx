import React from 'react';
import HeroBanner from '../components/home/HeroBanner';
import OurProducts from '../components/home/OurProducts';
import HowItWorks from '../components/home/HowItWorks';
import CustomerFeedback from '../components/home/CustomerFeedback';
import { Helmet } from 'react-helmet-async';

const Home = () => {
    return (
        <>
            <Helmet>
                <title>LoomWare - Garment Order & Production Tracker</title>
                <meta name="description" content="Streamline your garment production workflow with LoomWare's comprehensive tracking system" />
            </Helmet>

            <HeroBanner />
            <OurProducts />
            <HowItWorks />
            <CustomerFeedback />

            {/* Additional Sections */}
            <section className="py-20 bg-gradient-to-r from-primary-50 to-secondary-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12" data-aos="fade-up">
                        <h2 className="text-4xl font-bold mb-4">Why Choose LoomWare?</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Our platform is designed specifically for the unique needs of garment manufacturers
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: 'Real-time Tracking', desc: 'Monitor every stage of production in real-time' },
                            { title: 'Inventory Management', desc: 'Keep track of raw materials and finished products' },
                            { title: 'Quality Control', desc: 'Ensure every product meets quality standards' },
                        ].map((item, index) => (
                            <div key={index} className="bg-white p-6 rounded-xl shadow-lg" data-aos="fade-up" data-aos-delay={index * 100}>
                                <h3 className="text-xl font-bold mb-3 text-primary-600">{item.title}</h3>
                                <p className="text-gray-600">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};

export default Home;