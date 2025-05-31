import { useEffect, useRef } from 'react';
import styles from './Stars.module.css';
import gsap from 'gsap';

const STAR_COUNT = 200;

const Stars = () => {
  const starsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!starsContainerRef.current) return;
    
    const stars = starsContainerRef.current.children;
    gsap.fromTo(stars, 
      {
        opacity: 0,
      },
      {
        opacity: () => Math.random() * 0.7 + 0.3, // 최종 투명도: 0.3~1.0
        delay: 1,
        duration: 1,
        stagger: 0.03,
        ease: 'power1.out',
      }
    );
  }, []);

  const starsDot = Array.from({ length: STAR_COUNT }).map((_, i) => {
    const left = Math.random() * 100;
    const top = Math.random() * 90;
    const size = Math.random() * 2 + 1;

    return (
      <div
        key={i}
        className={styles.starDot}
        style={{
          left: `${left}%`,
          top: `${top}%`,
          width: size,
          height: size,
          opacity: 0,
        }}
      />
    );
  });

  return <div ref={starsContainerRef} className={styles.starsBg}>{starsDot}</div>;
};

export default Stars;
