import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaGithub, FaInstagram, FaLinkedin, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-white">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div>
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xl">LW</span>
                            </div>
                            <span className="text-2xl font-bold">LoomWare</span>
                        </div>
                        <p className="text-gray-400 mb-6">
                            Streamlining garment production with cutting-edge tracking technology for small to medium-sized factories.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <FaFacebook size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <FaXTwitter size={20} />
                            </a>
                            <a href="https://github.com/MaahinSK" className="text-gray-400 hover:text-white transition-colors">
                                <FaGithub size={20} />
                            </a>
                            <a href="http://linkedin.com/in/maahin-sikder" className="text-gray-400 hover:text-white transition-colors">
                                <FaLinkedin size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/products" className="text-gray-400 hover:text-white transition-colors">
                                    Products
                                </Link>
                            </li>
                            <li>
                                <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">Services</h3>
                        <ul className="space-y-2">
                            <li className="text-gray-400">Order Tracking</li>
                            <li className="text-gray-400">Production Management</li>
                            <li className="text-gray-400">Inventory Control</li>
                            <li className="text-gray-400">Quality Assurance</li>
                            <li className="text-gray-400">Delivery Management</li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">Contact Us</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start space-x-3">
                                <FaMapMarkerAlt className="text-primary-400 mt-1" />
                                <span className="text-gray-400">123 Fashion Street, Garment District, Dhaka 1212</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <FaPhone className="text-primary-400" />
                                <span className="text-gray-400">+880 17151476475</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <FaEnvelope className="text-primary-400" />
                                <span className="text-gray-400">info@loomware.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-800 my-8"></div>

                {/* Copyright */}
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-400">
                        © {currentYear} LoomWare. All rights reserved by Maahin Sikder.
                    </p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">
                            Privacy Policy
                        </Link>
                        <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;