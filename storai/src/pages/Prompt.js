import { Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import Header from "../components/Header";
import BottomNavigation from "../components/BottomNavigation";
import PageTitle from "../components/PageTitle";
import PromptInput from "../components/PromptInput";

import "@fontsource/poppins";
import "@fontsource/merriweather";

const Prompt = () => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLibraryClick = () => {
    navigate('/library');
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleLogout = () => {
    // Handle logout logic here
    console.log("Logout clicked");
  };

  const handlePromptSubmit = () => {
    if (!prompt.trim()) {
      alert("Please enter a prompt");
      return;
    }

    setIsLoading(true);
    
    // Demo mode - simulate API call delay
    setTimeout(() => {
      // Navigate to PromptPopOut with demo story data
      navigate('/prompt-popout', { 
        state: { 
          story: {
            id: 1,
            title: "Dickson",
            chapter: 0,
            content: "Dickson is Zesty and Gay",
            image_url: "https://c4.wallpaperflare.com/wallpaper/101/380/61/cat-animals-bokeh-cute-wallpaper-preview.jpg",
            prompt: prompt,
            type: "original"
          },
          originalPrompt: prompt 
        } 
      });
      setIsLoading(false);
    }, 2000);
  };

  return (
    <>
      {/* Header */}
      <Header onLogout={handleLogout} />

      {/* Main Content */}
      <Flex
        direction="column"
        align="center"
        justify="center"
        paddingX="8vh"
        paddingBottom="10vh"
        height="calc(100vh - 24vh)"
      >
        <PageTitle 
          title="AI Storyteller"
          subtitle="Enter a prompt to begin your custom interactive story."
        />

        <PromptInput
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onSubmit={handlePromptSubmit}
          isLoading={isLoading}
        />
      </Flex>

      {/* Navigation */}
      <BottomNavigation
        activeTab="prompt"
        onRobotClick={() => {}} // Already on prompt page
        onHomeClick={handleHomeClick}
        onLibraryClick={handleLibraryClick}
      />
    </>
  );
};

export default Prompt;

