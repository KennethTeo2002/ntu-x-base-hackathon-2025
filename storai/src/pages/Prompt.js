import {
  Text,
  Flex,
  Button,
  Box,
  Textarea,
  IconButton,
  useToast,
} from "@chakra-ui/react";

import { FaRobot } from "react-icons/fa";
import { FaBookOpen } from "react-icons/fa6";
import { IoIosRocket } from "react-icons/io";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ApiService from "../services/api";

import "@fontsource/poppins"; // Defaults to weight 400

const Prompt = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLibraryClick = () => {
    navigate('/library');
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  const handlePromptSubmit = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Please enter a prompt",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await ApiService.generateStory(prompt);
      if (response.success) {
        // Navigate to PromptPopOut with the generated story data
        navigate('/prompt-popout', { 
          state: { 
            story: response.story,
            originalPrompt: prompt 
          } 
        });
      } else {
        throw new Error(response.message || 'Failed to generate story');
      }
    } catch (error) {
      toast({
        title: "Error generating story",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

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
        direction="column"
        alignItems="center"
        justifyContent="center"
        paddingX="8vh"
        paddingTop="4vh"
      >
        {/* Title */}
        <Text
          fontSize="6xl"
          fontFamily="Poppins"
          fontWeight="bold"
          color="black"
          textAlign="center"
          mb="4"
        >
          AI storyteller
        </Text>

        {/* Subtitle */}
        <Text
          fontSize="xl"
          fontFamily="Poppins"
          color="gray.600"
          textAlign="center"
          mb="8"
        >
          Enter a prompt to begin your custom interactive story.
        </Text>

        {/* Text Input Area */}
        <Box
          position="relative"
          width="100%"
          maxWidth="800px"
          mb="8"
        >
          <Textarea
            placeholder="Once upon a time..."
            _placeholder={{ color: "gray.400", fontSize: "lg" }}
            height="300px"
            shadow="lg"
            borderRadius="20px"
            padding="6"
            fontSize="lg"
            fontFamily="Poppins"
            resize="none"
            border="1px"
            borderColor="gray.200"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            _hover={{
              borderColor: "#477DFE",
            }}
            _focus={{
              borderColor: "#477DFE",
              boxShadow: "0 0 0 1px #477DFE",
            }}
          />
          
          {/* Submit Button */}
          <IconButton
            position="absolute"
            bottom="4"
            right="4"
            icon={<ChevronRightIcon />}
            colorScheme="blue"
            bg="#477DFE"
            color="white"
            size="lg"
            borderRadius="full"
            onClick={handlePromptSubmit}
            isLoading={isLoading}
            loadingText="Generating..."
            _hover={{
              bg: "#3465d8",
            }}
          />
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

export default Prompt;

