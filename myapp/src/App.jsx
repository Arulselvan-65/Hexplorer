import Navigation from './landingPage';
import './App.css';
import Tran from './Transactions';
import { Routes,Route } from 'react-router-dom';


function App() {
  return (
    <div className="App">
      <Routes>
		
    <Route path='/transactions/:data' element={<Tran/>}/>
    <Route path="/" element={<Navigation />}/>
      </Routes>
    </div>
  );
}

export default App;
