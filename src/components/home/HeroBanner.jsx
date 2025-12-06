import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';
import { FaArrowRight } from 'react-icons/fa';

const HeroBanner = () => {
    return (
        <section
            className="relative bg-cover bg-center bg-no-repeat overflow-hidden h-[600px] flex items-center"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1556906781-9a412961d28c?q=80&w=2070&auto=format&fit=crop')" }}
        >
            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-gray-900/70"></div>

            <div className="container mx-auto px-4 py-24 relative z-10">
                <div className="max-w-3xl mx-auto text-center" data-aos="fade-up">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-white drop-shadow-lg">
                        Streamline Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Garment Production</span>
                    </h1>
                    <p className="text-xl mb-8 text-gray-100 drop-shadow-md font-light">
                        From order to delivery, track every stitch with LoomWare's comprehensive production management system.
                        Designed for small to medium-sized garment factories.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/products">
                            <Button size="lg" className="flex items-center shadow-lg hover:shadow-cyan-500/50 transition-shadow">
                                View Products <FaArrowRight className="ml-2" />
                            </Button>
                        </Link>
                        <Link to="/register">
                            <Button variant="secondary" size="lg" className="shadow-lg hover:shadow-purple-500/50 transition-shadow">
                                Start Free Trial
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Decorative Wave */}
            <div className="absolute bottom-0 left-0 right-0 z-20">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
                    <path fill="#f9fafb" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                </svg>
            </div>
        </section>
    );
};

export default HeroBanner;