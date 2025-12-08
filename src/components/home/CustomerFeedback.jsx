import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';

const CustomerFeedback = () => {
    const testimonials = [
        {
            name: 'Sarah Johnson',
            role: 'Fashion Boutique Owner',
            feedback: 'LoomWare has revolutionized how we manage our garment production. The tracking system is incredible!',
            rating: 5,
            image: 'https://randomuser.me/api/portraits/women/32.jpg',
        },
        {
            name: 'Michael Chen',
            role: 'Production Manager',
            feedback: 'The real-time updates and inventory management have saved us countless hours and reduced errors significantly.',
            rating: 5,
            image: 'https://randomuser.me/api/portraits/men/75.jpg',
        },
        {
            name: 'Emma Williams',
            role: 'Quality Control Head',
            feedback: 'The quality tracking features ensure every product meets our high standards. Highly recommended! keep up the good work.',
            rating: 4,
            image: 'https://randomuser.me/api/portraits/women/44.jpg',
        },
        {
            name: 'David Brown',
            role: 'Supply Chain Director',
            feedback: 'Integration with our existing systems was seamless. The dashboard provides perfect visibility. i would recommend this to every garment manufacturer.',
            rating: 5,
            image: 'https://randomuser.me/api/portraits/men/22.jpg',
        },
    ];

    return (
        <section className="py-20 bg-gradient-to-r from-primary-50 to-secondary-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12" data-aos="fade-up">
                    <h2 className="text-4xl font-bold mb-4">What Our Customers Say</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Join hundreds of satisfied garment manufacturers who trust LoomWare
                    </p>
                </div>

                <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={30}
                    slidesPerView={1}
                    navigation
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 5000 }}
                    breakpoints={{
                        640: { slidesPerView: 1 },
                        768: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                    }}
                    className="pb-12"
                >
                    {testimonials.map((testimonial, index) => (
                        <SwiperSlide key={index}>
                            <div className="bg-white p-8 rounded-xl shadow-lg h-full" data-aos="zoom-in">
                                <FaQuoteLeft className="text-4xl text-primary-300 mb-6" />
                                <p className="text-gray-700 mb-6 italic">{testimonial.feedback}</p>
                                <div className="flex items-center">
                                    <img
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                        className="w-12 h-12 rounded-full mr-4"
                                    />
                                    <div>
                                        <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
                                        <p className="text-gray-600 text-sm">{testimonial.role}</p>
                                        <div className="flex mt-1">
                                            {[...Array(5)].map((_, i) => (
                                                <FaStar
                                                    key={i}
                                                    className={`${i < testimonial.rating
                                                        ? 'text-yellow-400'
                                                        : 'text-gray-300'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
};

export default CustomerFeedback;