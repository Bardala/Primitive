import { NavBar } from "./components/NavBar";
import { Login } from "./pages/Login";
import { TestGetSpace } from "./pages/TestGetSpace";
import { SignUp } from "./pages/signup";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<h1>Home</h1>} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/space/:id" element={<TestGetSpace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
