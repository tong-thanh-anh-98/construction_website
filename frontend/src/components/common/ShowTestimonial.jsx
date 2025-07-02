import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Pagination } from 'swiper/modules';
import 'swiper/css/pagination';
import { useTranslation } from 'react-i18next';
import AvatarImg from '../../assets/images/author-2.jpg';
import { useCallback, useEffect, useState } from 'react';
import { apiUrlFront } from './http';
import { toast } from 'react-toastify';

const ShowTestimonial = () => {
    const { t, i18n } = useTranslation();
    const [testimonials, setTestimonials] = useState([]);

    const fetchAllTestimonials = useCallback(async () => {
        try {
            const response = await fetch(`${apiUrlFront}/get-all-testimonials`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Locale': i18n.language,
                }
            });
            const result = await response.json();
            console.log(result.data);

            if (result.status === 200) {
                setTestimonials(result.data);
            } else {
                toast.error(result.message);
            }
        } catch (err) {
            console.error(err);
        }
    }, [i18n.language]);

    useEffect(() => {
        fetchAllTestimonials()
    }, [fetchAllTestimonials]);

    return (
        <section className="section-5 py-5">
            <div className="container">
                <div className="section-header text-center">
                    <span>{t('testimonial_tag')}</span>
                    <h2>{t('testimonial_title')}</h2>
                    <p>{t('testimonial_description')}</p>
                </div>
            </div>
            <Swiper
                modules={[Pagination]}
                spaceBetween={50}
                slidesPerView={3}
                pagination={{ clickable: true }}
                breakpoints={{
                    200: {
                        slidesPerView: 1,
                        spaceBetween: 20
                    },
                    768: {
                        slidesPerView: 2,
                        spaceBetween: 20
                    },
                    1024: {
                        slidesPerView: 3,
                        spaceBetween: 50
                    }
                }}
            >
                {
                    testimonials && testimonials.map(testimonial => {
                        return (
                            <SwiperSlide>
                                <div className="card shadow border-0" key={`testimonial-${testimonial.id}`}>
                                    <div className="card-body p-5">
                                        <div className="rating">
                                            {[...Array(5)].map((_, index) => (
                                                <svg key={index} xmlns="http://www.w3.org/2000/svg" width="16" height="20" fill="currentColor" className="bi bi-star-fill" viewBox="0 0 16 16">
                                                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                                </svg>
                                            ))}
                                        </div>
                                        <div className="content pt-4 pb-2">
                                            <p>{testimonial.testimonial}</p>
                                        </div>


                                        <hr />

                                        <div className="d-flex meta">
                                            <div>
                                                <img src={AvatarImg} alt="" width={50} />
                                            </div>
                                            <div className='ps-3'>
                                                <div className='name'>{testimonial.citation}</div>
                                                <div>{testimonial.designation}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        )
                    })
                }
            </Swiper>
        </section>
    )
}

export default ShowTestimonial