import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from './ShootingStar.module.css';

interface ShootingStarProps {
  isActive: boolean;
}

const getRandom = (min: number, max: number) => Math.random() * (max - min) + min;
const convertPercentageToPixels = (percentage: number, viewport: 'width' | 'height') => {
  return percentage * (viewport === 'width' ? window.innerWidth : window.innerHeight) / 100;
}

const ShootingStar: React.FC<ShootingStarProps> = ({ isActive }) => {
  const starRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if(!isActive) return;

    const startX = convertPercentageToPixels(getRandom(75, 85), 'width'); // 시작 x
    const startY = convertPercentageToPixels(getRandom(15, 25), 'height'); // 시작 y
    const endX = convertPercentageToPixels(getRandom(20, 30), 'width'); // 끝 x
    const endY = convertPercentageToPixels(getRandom(50, 60), 'height'); // 끝 y

    const duration = 2;

    const dy = endY - startY;
    const dx = endX - startX;
    const angleRadians = Math.atan2(dy, dx)

    const angleDegrees = (angleRadians * 180 / Math.PI)+180;

    if (starRef.current) {
      gsap.fromTo(
        starRef.current,
        {
          left: startX,
          top: startY,
          opacity: 1,
          rotate: angleDegrees,
        },
        {
          left: endX,
          top: endY,
          opacity: 0,
          duration,
          ease: 'none',
        }
      );
    }
  }, [isActive]);

  return <div ref={starRef} className={styles.shootingStar} />;
};

export default ShootingStar;
