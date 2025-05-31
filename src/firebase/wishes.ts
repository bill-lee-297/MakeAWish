import { ref, push, onValue, query, limitToLast, orderByChild } from 'firebase/database';
import { database } from './config';

// 소원 타입 정의
export interface Wish {
  id?: string;
  content: string;
  createdAt: string;
}

// 소원 저장 함수
export const saveWish = async (content: string): Promise<void> => {
  const wishesRef = ref(database, 'wishes');
  await push(wishesRef, {
    content,
    createdAt: new Date().toISOString()
  });
};

// 소원 목록 구독 함수
export const subscribeToWishes = (
  onWishesUpdate: (wishes: Wish[]) => void
): () => void => {
  const wishesRef = ref(database, 'wishes');
  const recentWishesQuery = query(
    wishesRef,
    orderByChild('createdAt'),
    limitToLast(50)
  );
  
  const unsubscribe = onValue(recentWishesQuery, (snapshot) => {
    const data = snapshot.val();
    const wishes: Wish[] = [];
    
    if (data) {
      Object.entries(data).forEach(([id, wishData]) => {
        const wish = wishData as Omit<Wish, 'id'>;
        wishes.push({
          id,
          content: wish.content,
          createdAt: wish.createdAt
        });
      });
    }
    
    // 생성일 기준으로 정렬
    wishes.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    onWishesUpdate(wishes);
  });
  
  return unsubscribe;
}; 