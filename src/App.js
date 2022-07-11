import CryptidMap from './components/Map';
import './App.css';

function App() {
  return (
    <>
      <div className='header'>
        <h2>Wide World of Cryptids</h2>
        <p>Click on a marker to learn more about a cryptid!</p>
      </div>
      <CryptidMap />
    </>
  )
}

export default App;
