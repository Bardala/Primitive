import { TestGetSpace } from "./pages/TestGetSpace";
import { SignUp } from "./pages/signup";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        {/* //todo: <NavBar /> */}
        <Routes>
          <Route path="/" element={<h1>Home</h1>} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/space/:id" element={<TestGetSpace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
