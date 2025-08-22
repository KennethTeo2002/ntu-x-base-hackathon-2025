import { Flex, Spinner } from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

import Header from "../components/Header";
import BottomNavigation from "../components/BottomNavigation";
import ChatSection from "../components/ChatSection";
import StoryDisplay from "../components/StoryDisplay";

import "@fontsource/poppins";

const PromptPopOut = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [story, setStory] = useState(null);
  const [originalPrompt, setOriginalPrompt] = useState("");
  const [isLoadingNext, setIsLoadingNext] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Get story data from navigation state or use default
    if (location.state && location.state.story) {
      setStory(location.state.story);
      setOriginalPrompt(location.state.originalPrompt || "");
    } else {
      // Default demo story
      setStory({
        id: 1,
        title: "Elara's Equation",
        chapter: 0,
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        image_url: "https://c4.wallpaperflare.com/wallpaper/101/380/61/cat-animals-bokeh-cute-wallpaper-preview.jpg",
        prompt: "Write me a story about Dickson",
        type: "original"
      });
      setOriginalPrompt("Write me a story about Dickson");
    }
  }, [location.state]);

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

  const handleNextChapter = () => {
    if (!story) return;
    
    setIsLoadingNext(true);
    
    // Demo mode - simulate API call delay
    setTimeout(() => {
      // Update the story with the new chapter
      setStory(prev => ({
        ...prev,
        chapter: prev.chapter + 1,
        content: `Chapter ${prev.chapter + 1}: Dickson is a bit zesty and gay.`
      }));
      alert("Next chapter generated!");
      setIsLoadingNext(false);
    }, 2000);
  };

  const handleSaveStory = () => {
    if (!story) return;
    
    setIsSaving(true);
    
    // Demo mode - simulate API call delay
    setTimeout(() => {
      alert("Story saved to library!");
      setIsSaving(false);
    }, 1000);
  };

  if (!story) {
    return (
      <Flex
        height="100vh"
        align="center"
        justify="center"
      >
        <Spinner size="xl" color="#477DFE" />
      </Flex>
    );
  }

  return (
    <>
      {/* Header */}
      <Header onLogout={handleLogout} />

      {/* Main Content */}
      <Flex
        direction="row"
        paddingX="8vh"
        paddingBottom="10vh"
        gap="8"
        height="calc(100vh - 24vh)"
      >
        {/* Left Side - Chat Section */}
        <ChatSection originalPrompt={originalPrompt} />

        {/* Right Side - Story Display */}
        <StoryDisplay
          story={story}
          onNextChapter={handleNextChapter}
          onSave={handleSaveStory}
          isLoadingNext={isLoadingNext}
          isSaving={isSaving}
        />
      </Flex>

      {/* Navigation */}
      <BottomNavigation
        activeTab="prompt"
        onRobotClick={() => navigate('/prompt')}
        onHomeClick={handleHomeClick}
        onLibraryClick={handleLibraryClick}
      />
    </>
  );
};

export default PromptPopOut;

