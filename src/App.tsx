import { Route, Routes } from "react-router-dom";
import Form from "./pages/Form";
import Home from "./pages/Home";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/form/:formId" element={<Form />} />
      </Routes>
    </div>
  );
}

export default App;
