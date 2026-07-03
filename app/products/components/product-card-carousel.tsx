'use client';

import { Box } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import styles from './product-card.module.css';
import { useRef } from 'react';

type ProductCardImageProps = {
  productId: string;
  imageUrls: string[];
  productName: string;
};

export default function ProductCardCarousel({ productId, imageUrls, productName }: ProductCardImageProps) {
  const router = useRouter();
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <Swiper
      modules={[Autoplay, Pagination]}
      pagination={{ clickable: true }}
      autoplay={{
        delay: 2000,
        disableOnInteraction: false,
      }}
      onSwiper={(swiper) => {
        swiperRef.current = swiper;
        swiper.autoplay.stop();
      }}
      onMouseEnter={() => {
        swiperRef.current?.autoplay.start();
      }}
      onMouseLeave={() => {
        swiperRef.current?.autoplay.stop();
      }}
      className={styles.swiperWrapper}
    >
      {imageUrls.map((image, index) => (
        <SwiperSlide key={`${productId}-${index}`}>
          <Box sx={{ cursor: 'pointer' }} onClick={() => router.push(`/products/${productId}`)}>
            <Image src={image} alt={productName} width={500} height={500} className={styles.mainMedia} priority />
          </Box>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
