import { useState, useRef, useLayoutEffect, useEffect } from 'react';
import styles from './WishInput.module.css';
import gsap from 'gsap';
import ShootingStar from '../background/stars/ShootingStar';
import { IoRefreshSharp } from 'react-icons/io5';
import { saveWish } from '../../firebase/wishes';
import classNames from 'classnames';
import { useWishStore } from '../../store/wishStore';

const WishInput = () => {
  const wishTextRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  const wishInputContainerRef = useRef<HTMLDivElement>(null);
  const wishInputRef = useRef<HTMLInputElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const showWishListBtnRef = useRef<HTMLButtonElement>(null);

  const [wish, setWish] = useState('');
  const [showWish, setShowWish] = useState(false);
  const [showShootingStar, setShowShootingStar] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [isSecret, setIsSecret] = useState(false);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  const setShowWishList = useWishStore((state) => state.setShowWishList);

  useEffect(() => {
    if (wishInputRef.current) {
      wishInputRef.current.focus();
    }
  }, []);

  useLayoutEffect(() => {
    if(wishInputContainerRef.current) {
      gsap.fromTo(wishInputContainerRef.current, {
        opacity: 0,
        y: 100,
        scale: 0.9
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.5,
        ease: 'power1.inOut'
      });
    }
  }, []);

  useEffect(() => {
    if(!showWish) return;
    const showTl = gsap.timeline({
      delay: 3
    });
    
    if (wishTextRef.current) {
      showTl.fromTo(wishTextRef.current, 
        { opacity: 0, scale: 0.8, y: 100 }, 
        { opacity: 1, scale: 1, y: 0, duration: 2, ease: 'power1.out' }
      );
    }
    if (messageRef.current) {
      showTl.fromTo(messageRef.current, 
        { opacity: 0, y: 50, scale: 0.8 }, 
        { opacity: 1, y: 0, scale: 1, duration: 2, ease: 'power1.out' },
        "-=1"
      );
    }
    showTl.to(wishTextRef.current, {
      delay: 1,
      opacity: 0,
      duration: 1,
      ease: 'circ.out',
    })
    showTl.to(messageRef.current, {
      opacity: 0,
      duration: 1,
      ease: 'circ.out',
    }, "<")
    showTl.to(buttonsRef.current, {
      opacity: 1,
      duration: 1,
      ease: 'power1.out',
      onStart: () => setShowButtons(true)
    });
  }, [showWish]);

  const handleButtonClick = async () => {
    if (wish.trim() === '') return;
    
    try {
      if (!isSecret) {
        await saveWish(wish.trim());
      }
      setShowWish(true);
      setShowShootingStar(true);
      setShowButtons(false);
    } catch (error) {
      console.error('소원 저장 중 오류 발생:', error);
      alert('소원을 저장하는 중 오류가 발생했습니다.');
    }
  };

  const handleRestart = () => {
    setShowWish(false);
    setShowShootingStar(false);
    setShowButtons(false);
    setWish('');
    setShowWishList(false);
  };

  const handleViewOtherWishes = () => {
    if (showWishListBtnRef.current) {
      showWishListBtnRef.current.style.display = 'none';
    }
    setShowWishList(true);
  };

  return (
    <div className={styles.wishCenter}>
      {showShootingStar && <ShootingStar isActive={showShootingStar} />}
      {!showWish && (
        <div ref={wishInputContainerRef} className={styles.wishInputContainer}>
          <div className={styles.wishInputWrap}>
            <div className={styles.wishInputTitle}>
              나의 소원은
            </div>
            <input
              ref={wishInputRef}
              type="text"
              className={styles.wishInput}
              value={wish}
              onChange={(e) => setWish(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.repeat) {
                  handleButtonClick();
                }
              }}
              onFocus={() => setIsTooltipVisible(true)}
              onBlur={() => setIsTooltipVisible(false)}
            />
            {isTooltipVisible && wish.trim() === '' && (
              <div className={classNames(styles.customTooltip, styles.visible)}>
                소원을 입력 후 엔터(Enter)를 눌러주세요!!
              </div>
            )}
          </div>
          <div className={styles.checkboxContainer}>
            <input
              type="checkbox"
              id="secretWish"
              checked={isSecret}
              onChange={(e) => setIsSecret(e.target.checked)}
              className={styles.checkbox}
            />
            <label htmlFor="secretWish" className={styles.checkboxLabel}>
              소원을 비밀로 해줘
            </label>
            <span
              className={styles.infoIcon}
              tabIndex={0}
            >
              <span className={styles.infoIconInner}>i</span>
              <span className={styles.customTooltip}>
                선택할 경우 다른 사람들과 소원이 공유되지 않습니다.
              </span>
            </span>
          </div>
        </div>
      )}
      {showWish && !showButtons && (
        <div className={styles.wishResultWrap}>
          <div ref={wishTextRef} className={styles.wishResult}>
            {wish}
          </div>
          <div ref={messageRef} className={styles.wishMessage}>
            너의 소원이 이루어질 거야!
          </div>
        </div>
      )}

      <div ref={buttonsRef} className={styles.actionButtons} style={{ opacity: 0 }}>
        {showButtons && (
          <>
            <button className={styles.actionButton} onClick={handleRestart}>
              <IoRefreshSharp size={24} />
            </button>
            <button 
              ref={showWishListBtnRef}
              className={styles.actionButton}
              onClick={handleViewOtherWishes}
            >
              다른 사람의 소원 보기
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default WishInput;
