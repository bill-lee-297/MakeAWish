import { useEffect, useRef, useState } from 'react';
import { type Wish } from '../../firebase/wishes';
import styles from './WishList.module.css';
import gsap from 'gsap';
import { subscribeToWishes } from '../../firebase/wishes';
import { FaRegThumbsUp, FaThumbsUp } from 'react-icons/fa';
import { ref, update } from 'firebase/database';
import { database } from '../../firebase/config';

const WishList = ({ showWishList }: {showWishList: boolean}) => {
  const wishRef = useRef<HTMLDivElement>(null);
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [currentWishIndex, setCurrentWishIndex] = useState(0);

  useEffect(() => {
    if (!showWishList) return;

    const unsubscribe = subscribeToWishes((updatedWishes) => {
      setWishes(updatedWishes);
    });

    return () => {
      unsubscribe();
    };
  }, [showWishList]);

  useEffect(() => {
    if (wishes.length === 0) return;


    const showWish = () => {
      if (!wishRef.current) return;

      let x = Math.random() * 60 + 20;
      let y = Math.random() * 40 + 20;
      while (x > 35 && x < 65 && y > 35 && y < 55) {
        x = Math.random() * 60 + 20;
        y = Math.random() * 40 + 20;
      }

      gsap.set(wishRef.current, {
        x: `${x}vw`,
        y: `${y}vh`,
        opacity: 0,
        scale: 0.8,
      });

      gsap.to(wishRef.current, {
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: 'power2.out',
        onComplete: () => {
          gsap.to(wishRef.current, {
            opacity: 0,
            scale: 0.8,
            duration: 1,
            delay: 1,
            ease: 'power2.in',
            onComplete: () => {
              setCurrentWishIndex((prev) => (prev + 1) % wishes.length);
            }
          });
        }
      });
    };

    showWish();
  }, [wishes, currentWishIndex]);

  useEffect(() => {
    return () => {
      setWishes([]);
    };
  }, []);

  const handleLike = async () => {
    const wish = wishes[currentWishIndex];
    const wishRef = ref(database, `wishes/${wish.id}`);
    await update(wishRef, { like: !wish.like });
  };

  if (wishes.length === 0) return null;

  return (
    <div className={styles.wishListContainer}>
      <div ref={wishRef} className={styles.wishItem}>
        <div className={styles.wishRow}>
          <p className={styles.wishContent}>
            {wishes[currentWishIndex].content}
          </p>
          <button
            className={styles.likeButton}
            onClick={handleLike}
          >
            {wishes[currentWishIndex].like ? (
              <FaThumbsUp className={styles.likedThumb} />
            ) : (
              <FaRegThumbsUp className={styles.unlikedThumb} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WishList;