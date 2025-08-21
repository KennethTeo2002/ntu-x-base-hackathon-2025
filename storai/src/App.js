import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme";

import Home from "./pages/Home"; // Import your Home component
import Prompt from "./pages/Prompt"; // Import Prompt component
import PromptPopOut from "./pages/PromptPopOut"; // Import PromptPopOut component

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/prompt" element={<Prompt />} />
            <Route path="/prompt-popout" element={<PromptPopOut />} />
          </Routes>
        </div>
      </Router>
    </ChakraProvider>
  );
}

export default App;
