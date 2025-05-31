import Sunset from './components/background/sunset/Sunset';
import Mountains from './components/background/mountains/Mountains';
import Stars from './components/background/stars/Stars';
import WishInput from './components/wish/WishInput';

function App() {
  return (
    <div className="app">
      <Mountains />
      <Sunset />
      <Stars />
      <WishInput />
    </div>
  );
}

export default App;
