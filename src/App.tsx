import Sunset from './components/background/sunset/Sunset';
import Mountains from './components/background/mountains/Mountains';
import Stars from './components/background/stars/Stars';
import WishInput from './components/wish/WishInput';
import WishList from './components/wish/WishList';
import { useWishStore } from './store/wishStore';

function App() {
  const showWishList = useWishStore((state) => state.showWishList);


  return (
    <div className="app">
      <Mountains />
      <Sunset />
      <Stars />
      <WishInput />
      {showWishList && <WishList showWishList={showWishList} />}
    </div>
  );
}

export default App;
