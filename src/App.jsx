import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Games from "./pages/Games";
import Home2 from "./pages/Home2";
import MemoryMatch from "./games/MemoryMatch";


const App = () => {
  return (
    <Router>
      <section className="min-h-screen w-full">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/games" element={<Games />}/>
          <Route path="/memorymatch" element={<MemoryMatch />} />
          
        </Routes>
      </section>
    </Router>
  );
};

export default App;
