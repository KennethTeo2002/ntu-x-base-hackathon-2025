import {
  Text,
  Flex,
  Button,
  Box,
  Image,
  IconButton,
  Spinner,
} from "@chakra-ui/react";

import { FaRobot } from "react-icons/fa";
import { FaBookOpen } from "react-icons/fa6";
import { IoIosRocket } from "react-icons/io";
import { EditIcon } from "@chakra-ui/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Spinner } from '@chakra-ui/react';



import "@fontsource/poppins"; // Defaults to weight 400

const PromptPopOut = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [story, setStory] = useState(null);
  const [originalPrompt, setOriginalPrompt] = useState("");

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
        image_url: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=500&h=300&fit=crop",
        prompt: "Write me a story about a scientist who discovered gravity",
        type: "original"
      });
      setOriginalPrompt("Write me a story about a scientist who discovered gravity");
    }
  }, [location.state]);

  const handleLibraryClick = () => {
    navigate('/library');
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleNextChapter = () => {
    // Demo: Update to next chapter
    setStory(prev => ({
      ...prev,
      chapter: prev.chapter + 1,
      content: "Chapter " + (prev.chapter + 1) + ": Dickson is a bit zesty and gay."
    }));
  };

  const handleSaveStory = () => {
    // Demo: Show success message (in production, this would save to backend)
    alert("Story saved to library!");
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
      <Flex
        dir="row"
        align="center"
        justify="space-between"
        padding="8vh"
        w="100vw"
      >
        <Text
          fontFamily="Poppins"
          fontWeight="medium"
          fontSize="50"
          color="black"
        >
          Stor.ai
        </Text>
        <Button
          variant="outline"
          color="#477DFE" // Sets border + text color
          borderRadius="full"
          border="2px"
          size="lg"
          fontWeight="medium"
        >
          Log out
        </Button>
      </Flex>

      {/* Main Content */}
      <Flex
        direction="row"
        paddingX="8vh"
        paddingBottom="10vh"
        gap="8"
        height="calc(100vh - 24vh)"
      >
        {/* Left Side - User Input */}
        <Box
          flex="1"
          bg="white"
          borderRadius="20px"
          padding="6"
          shadow="lg"
          border="1px"
          borderColor="gray.200"
        >
          <Text
            fontSize="lg"
            fontFamily="Poppins"
            fontWeight="semibold"
            color="black"
            mb="4"
          >
            {originalPrompt}
          </Text>
          
          <Text
            fontSize="md"
            fontFamily="Poppins"
            color="gray.600"
            lineHeight="1.6"
            mb="6"
          >
            Hmm, the user wants a story about a scientist discovering gravity, but historically it was Newton who formulated the law of universal gravitation. However, the user might be looking for a fictional twist or an alternate reality take.
          </Text>

          <Text
            fontSize="md"
            fontFamily="Poppins"
            color="gray.600"
            lineHeight="1.6"
            mb="8"
          >
            I could create a narrative where gravity isn't yet understood in a world, and a scientist rediscovers it through observation and experimentation. The story should feel grounded in scientific curiosity but also have
          </Text>

          {/* Chat Section */}
          <Box
            bg="gray.50"
            borderRadius="15px"
            padding="4"
            position="relative"
          >
            <Text
              fontSize="md"
              fontFamily="Poppins"
              color="gray.600"
              mb="2"
            >
              Chat with Stor.ai
            </Text>
            <Flex align="center" justify="center" height="60px">
              <Spinner
                thickness="3px"
                speed="0.65s"
                emptyColor="gray.200"
                color="#477DFE"
                size="lg"
              />
            </Flex>
          </Box>
        </Box>

        {/* Right Side - Story Output */}
        <Box
          flex="1"
          bg="white"
          borderRadius="20px"
          padding="6"
          shadow="lg"
          border="1px"
          borderColor="gray.200"
        >
          {/* Story Header */}
          <Flex align="center" justify="space-between" mb="4">
            <Box>
              <Text
                fontSize="2xl"
                fontFamily="Poppins"
                fontWeight="bold"
                color="black"
              >
                {story.title}
              </Text>
              <Text
                fontSize="lg"
                fontFamily="Poppins"
                color="#477DFE"
                fontWeight="medium"
              >
                Chapter {story.chapter}
              </Text>
            </Box>
            <IconButton
              icon={<EditIcon />}
              variant="ghost"
              color="gray.500"
              size="lg"
            />
          </Flex>

          {/* Story Content */}
          <Text
            fontSize="md"
            fontFamily="Poppins"
            color="black"
            lineHeight="1.7"
            mb="6"
          >
            {story.content}
          </Text>

          {/* Story Image */}
          <Box
            width="100%"
            height="200px"
            bg="gray.800"
            borderRadius="15px"
            mb="6"
            overflow="hidden"
          >
            <Image
              src={story.image_url}
              alt="Story illustration"
              width="100%"
              height="100%"
              objectFit="cover"
            />
          </Box>

          {/* Action Buttons */}
          <Flex gap="4" justify="center">
            <Button
              variant="outline"
              color="#477DFE"
              borderColor="#477DFE"
              borderRadius="full"
              size="lg"
              fontWeight="medium"
              flex="1"
              onClick={handleNextChapter}
            >
              Next Chapter
            </Button>
            <Button
              bg="#477DFE"
              color="white"
              borderRadius="full"
              size="lg"
              fontWeight="medium"
              flex="1"
              onClick={handleSaveStory}
              _hover={{
                bg: "#3465d8",
              }}
            >
              Save
            </Button>
          </Flex>
        </Box>
      </Flex>

      {/* Navigation Tabs */}
      <Flex
        position="fixed"
        bottom="0px"
        height="8vh"
        width="100vw"
        shadow="inner"
        align="center"
        justify="space-between"
        direction="row"
        paddingX="8vh"
        bg="white"
      >
        <IconButton variant="link" color="#477DFE" fontSize="3xl">
          <FaRobot />
        </IconButton>

        <IconButton 
          variant="link" 
          color="gray.400" 
          fontSize="3xl"
          onClick={handleHomeClick}
        >
          <IoIosRocket />
        </IconButton>

        <IconButton 
          variant="link" 
          color="gray.400" 
          fontSize="3xl"
          onClick={handleLibraryClick}
        >
          <FaBookOpen />
        </IconButton>
      </Flex>
    </>
  );
};

export default PromptPopOut;

