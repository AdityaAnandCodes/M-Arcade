import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Games from "./pages/Games";


const App = () => {
  return (
    <Router>
      <section className="min-h-screen w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/games" element={<Games />}/>
        </Routes>
      </section>
    </Router>
  );
};

export default App;
