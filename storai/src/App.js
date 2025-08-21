import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme";

import Home from "./pages/Home"; // Import your Home component
import GenerateStory from "./pages/GenerateStory";

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/generate" element={<GenerateStory />} />
          </Routes>
        </div>
      </Router>
    </ChakraProvider>
  );
}

export default App;
