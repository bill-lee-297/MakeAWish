import { ref, push, onValue, query, limitToLast, orderByChild } from 'firebase/database';
import { database } from './config';

export interface Wish {
  id?: string;
  content: string;
  createdAt: string;
  like: boolean;
}

export const saveWish = async (content: string): Promise<void> => {
  const wishesRef = ref(database, 'wishes');
  await push(wishesRef, {
    content,
    createdAt: new Date().toISOString(),
    like: false
  });
};

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
          createdAt: wish.createdAt,
          like: wish.like
        });
      });
    }

    wishes.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    onWishesUpdate(wishes);
  });
  
  return unsubscribe;
}; 