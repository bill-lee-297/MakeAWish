import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from './Sunset.module.css';

const Sunset = () => {
  const sunsetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sunsetRef.current) return;
    const bgTl = gsap.timeline();
    sunsetRef.current.style.background = 'linear-gradient(to bottom,rgb(103, 163, 236),rgb(211, 227, 254))';

    // 초기 일몰 배경
    // sunsetRef.current.style.background = 'linear-gradient(to bottom, #ff7e5f, #feb47b)';


    bgTl.to(sunsetRef.current, {
      delay: 0.5,
      background: 'linear-gradient(to bottom,rgb(255, 126, 95), rgb(254, 180, 123))',
      duration: 1,
      ease: 'power2.inOut',
    });

    // 6초 동안 밤하늘로 전환
    bgTl.to(sunsetRef.current, {
      background: 'linear-gradient(to bottom,rgb(4, 5, 11),rgb(20, 47, 106))',
      duration: 2,
      ease: 'power2.inOut',
    });
  }, []);

  return <div ref={sunsetRef} className={styles.sunsetBg} />;
};

export default Sunset;
