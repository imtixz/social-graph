import Home from "./pages/Home";
import { Routes, Route } from "react-router";
import People from "./pages/People";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/people" element={<People />} />
    </Routes>
  );
}

export default App;
