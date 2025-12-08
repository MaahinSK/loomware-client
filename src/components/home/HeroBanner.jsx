import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';
import { FaArrowRight } from 'react-icons/fa';
import { DotLottiePlayer } from '@dotlottie/react-player';

const HeroBanner = () => {
    return (
        <section
            className="relative bg-cover bg-center bg-no-repeat overflow-hidden min-h-[600px] flex items-center"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1556906781-9a412961d28c?q=80&w=2070&auto=format&fit=crop')" }}
        >
            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/90 to-gray-900/80"></div>

            <div className="container mx-auto px-4 py-16 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    {/* Left Side - Text */}
                    <div className="text-left" data-aos="fade-right">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white drop-shadow-lg">
                            Streamline Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Garment Production</span>
                        </h1>
                        <p className="text-lg md:text-xl mb-8 text-gray-100 drop-shadow-md font-light max-w-lg">
                            From order to delivery, track every stitch with LoomWare's comprehensive production management system.
                            Designed for small to medium-sized garment factories.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-start">
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

                    {/* Right Side - Lottie Animation */}
                    <div className="flex justify-center md:justify-end" data-aos="fade-left">
                        <div className="w-full max-w-lg">
                            <DotLottiePlayer
                                src="https://lottie.host/510c9267-99ef-45e9-9c4b-b74830ddbb1d/dDQNPllQn6.lottie"
                                autoplay
                                loop
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroBanner;