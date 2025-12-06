import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaPaperPlane } from 'react-icons/fa';
import Button from '../components/common/Button';
import { toast } from 'react-toastify';

// Validation Schema
const schema = yup.object().shape({
    name: yup.string().required('Name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    subject: yup.string().required('Subject is required'),
    message: yup.string().required('Message is required').min(10, 'Message must be at least 10 characters'),
});

const Contact = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = (data) => {
        console.log(data);
        // Simulate API call
        setTimeout(() => {
            toast.success('Message sent successfully! We will get back to you soon.');
            reset();
        }, 1000);
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <Helmet>
                <title>Contact Us - LoomWare</title>
                <meta name="description" content="Get in touch with LoomWare for support, sales inquiries, or general questions." />
            </Helmet>

            {/* Hero Section */}
            <div className="bg-gradient-secondary text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4" data-aos="fade-up">Contact Us</h1>
                    <p className="text-xl max-w-2xl mx-auto opacity-90" data-aos="fade-up" data-aos-delay="100">
                        Have questions? We're here to help. Reach out to our team.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Contact Info */}
                    <div className="lg:w-1/3 space-y-8" data-aos="fade-right">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Get In Touch</h2>
                            <p className="text-gray-600 mb-8">
                                Whether you're interested in a demo, have a support request, or just want to say hello, we'd love to hear from you.
                            </p>
                        </div>

                        {/* Info Cards */}
                        <div className="bg-white p-6 rounded-xl shadow-md flex items-start space-x-4">
                            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <FaMapMarkerAlt className="text-xl text-primary-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800 mb-1">Visit Us</h3>
                                <p className="text-gray-600">123 Garment Ave, Textile City</p>
                                <p className="text-gray-600">Dhaka, Bangladesh 1234</p>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-md flex items-start space-x-4">
                            <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <FaPhoneAlt className="text-xl text-secondary-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800 mb-1">Call Us</h3>
                                <p className="text-gray-600">+880 123 456 7890</p>
                                <p className="text-gray-600">Mon - Fri, 9am - 6pm</p>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-md flex items-start space-x-4">
                            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <FaEnvelope className="text-xl text-primary-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800 mb-1">Email Us</h3>
                                <p className="text-gray-600">support@loomware.com</p>
                                <p className="text-gray-600">sales@loomware.com</p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:w-2/3" data-aos="fade-left">
                        <div className="bg-white p-8 rounded-xl shadow-lg">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Send a Message</h2>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            className={`input-field ${errors.name ? 'border-red-500' : ''}`}
                                            placeholder="Your Name"
                                            {...register('name')}
                                        />
                                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                        <input
                                            type="email"
                                            id="email"
                                            className={`input-field ${errors.email ? 'border-red-500' : ''}`}
                                            placeholder="your@email.com"
                                            {...register('email')}
                                        />
                                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                                    <input
                                        type="text"
                                        id="subject"
                                        className={`input-field ${errors.subject ? 'border-red-500' : ''}`}
                                        placeholder="How can we help?"
                                        {...register('subject')}
                                    />
                                    {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>}
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                    <textarea
                                        id="message"
                                        rows="5"
                                        className={`input-field ${errors.message ? 'border-red-500' : ''}`}
                                        placeholder="Write your message here..."
                                        {...register('message')}
                                    ></textarea>
                                    {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
                                </div>

                                <Button type="submit" size="lg" className="w-full flex items-center justify-center">
                                    <FaPaperPlane className="mr-2" />
                                    Send Message
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;