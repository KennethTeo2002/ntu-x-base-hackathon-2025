import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Container,
  Text,
  Input,
  Textarea,
  VStack,
  Button,
  Heading,
  useColorModeValue,
  useToast,
  Spinner,
  HStack,
  Flex,
} from "@chakra-ui/react";
import { ArrowForwardIcon, RepeatIcon } from "@chakra-ui/icons";
import Header from "../components/Header";
import BottomNavigation from "../components/BottomNavigation";
import ApiService from "../services/api";

import "@fontsource/poppins"; // Defaults to weight 400
import "@fontsource/merriweather"; // Defaults to weight 400

const Prompt = () => {
  const navigate = useNavigate();
  const handleHomeClick = () => navigate("/");
  const handleLibraryClick = () => navigate("/library");
  const location = useLocation();
  const toast = useToast();
  const createStoryURL = `http://localhost:5000/create-story`;

  const [prompt, setPrompt] = useState("");
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const subtitleColor = useColorModeValue("gray.600", "gray.300");
  const borderColor = useColorModeValue("blue.200", "blue.600");

  // Sample prompts for inspiration
  const samplePrompts = [
    "A young wizard discovers a mysterious portal in an ancient library",
    "Write about a scientist who discovers gravity in an alternate reality",
    "Tell me about a brave cat who saves the world from alien invasion",
    "Create a story about underwater cities and their ancient secrets",
    "A time traveler accidentally changes history and must fix it",
  ];

  useEffect(() => {
    // Check if there's an initial prompt from navigation state (from home page search)
    const initialPrompt = location.state?.initialPrompt;
    if (initialPrompt) {
      setPrompt(initialPrompt);
    }
  }, [location.state]);

  const generateStoryId = () => {
    const randomNumber = Math.floor(Math.random() * 16777215);
    let hexString = randomNumber.toString(16);
    while (hexString.length < 6) {
      hexString = "0" + hexString;
    }
    return hexString.toUpperCase();
  };

  const handlePromptSubmit = async () => {
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your story.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!prompt.trim()) {
      toast({
        title: "Prompt required",
        description: "Please enter a story prompt to generate your story.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (prompt.trim().length < 10) {
      toast({
        title: "Prompt too short",
        description:
          "Please provide a more detailed prompt (at least 10 characters).",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setIsLoading(true);
      while (true) {
        const roomId = generateStoryId();
        const res = await fetch(`${createStoryURL}/${roomId}`, {
          method: "POST", // Specify the HTTP method as POST
          headers: {
            "Content-Type": "application/json", // Set content type to JSON
          },
          // Convert the data to JSON string for the request body
          body: JSON.stringify({
            title: title,
            originalPrompt: prompt,
          }),
        });
        if (res.status === 201) {
          break;
        }
      }

      console.log("Generating story for:", prompt);

      const response = await ApiService.generateStory(prompt.trim());
      console.log(response);

      if (response) {
        // Navigate to results page with the generated story
        navigate("/prompt-result", {
          state: { story: response.payload },
        });
      } else {
        throw new Error(response.message || "Failed to generate story");
      }
    } catch (error) {
      console.error("Error generating story:", error);

      toast({
        title: "Generation failed",
        description:
          error.message || "Could not generate story. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSamplePrompt = (samplePrompt) => {
    setPrompt(samplePrompt);
  };

  const handleClearPrompt = () => {
    setPrompt("");
  };

  const hoverBg = useColorModeValue("gray.100", "gray.700");

  return (
    <Box minH="100vh" bg={bgColor}>
      <Header />

      <Container maxW="4xl" py={8} px={4} mb="8vh">
        <VStack spacing={8} align="stretch">
          {/* Page Header */}
          <VStack spacing={4} textAlign="center">
            <Heading size="2xl" color={textColor}>
              AI storyteller
            </Heading>
            <Text color={subtitleColor} fontSize="lg" maxW="2xl">
              Enter a prompt to begin your custom interactive story.
            </Text>
          </VStack>

          {/* Main Prompt Input */}
          <Box bg={cardBg} rounded="2xl" shadow="lg" p={8}>
            <VStack spacing={6} align="stretch">
              <Box position="relative">
                <Input
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  size="lg"
                  border="2px"
                  borderColor={borderColor}
                  _focus={{
                    borderColor: "blue.500",
                    boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)",
                  }}
                  fontSize="md"
                  mb="10px"
                />
                <Textarea
                  placeholder="Once upon a time..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  size="lg"
                  minH="200px"
                  resize="vertical"
                  border="2px"
                  borderColor={borderColor}
                  _focus={{
                    borderColor: "blue.500",
                    boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)",
                  }}
                  fontSize="md"
                  lineHeight="1.6"
                  isDisabled={isLoading}
                />

                {/* Character count */}
                <Text
                  position="absolute"
                  bottom={2}
                  right={3}
                  fontSize="xs"
                  color={subtitleColor}
                >
                  {prompt.length} characters
                </Text>
              </Box>

              {/* Action Buttons */}
              <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
                <HStack spacing={2}>
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<RepeatIcon />}
                    onClick={handleClearPrompt}
                    isDisabled={isLoading || !prompt}
                  >
                    Clear
                  </Button>
                </HStack>

                <Button
                  rightIcon={
                    isLoading ? <Spinner size="sm" /> : <ArrowForwardIcon />
                  }
                  colorScheme="blue"
                  size="lg"
                  onClick={handlePromptSubmit}
                  isLoading={isLoading}
                  loadingText="Generating story..."
                  isDisabled={!prompt.trim()}
                  px={8}
                >
                  Generate Story
                </Button>
              </Flex>
            </VStack>
          </Box>

          {/* Sample Prompts */}
          <Box bg={cardBg} rounded="xl" shadow="md" p={6}>
            <VStack spacing={4} align="stretch">
              <Heading size="md" color={textColor}>
                Need inspiration? Try these prompts:
              </Heading>

              <VStack spacing={3} align="stretch">
                {samplePrompts.map((samplePrompt, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    justifyContent="flex-start"
                    textAlign="left"
                    whiteSpace="normal"
                    height="auto"
                    py={3}
                    px={4}
                    onClick={() => handleSamplePrompt(samplePrompt)}
                    isDisabled={isLoading}
                    _hover={{ bg: hoverBg }}
                  >
                    <Text fontSize="sm" color={textColor}>
                      "{samplePrompt}"
                    </Text>
                  </Button>
                ))}
              </VStack>
            </VStack>
          </Box>

          {/* Tips Section */}
          <Box bg={cardBg} rounded="xl" shadow="md" p={6}>
            <VStack spacing={4} align="stretch">
              <Heading size="md" color={textColor}>
                Tips for better stories:
              </Heading>

              <VStack spacing={2} align="stretch">
                <Text fontSize="sm" color={subtitleColor}>
                  • Be specific about characters, settings, and situations
                </Text>
                <Text fontSize="sm" color={subtitleColor}>
                  • Include emotions or conflicts to make stories more engaging
                </Text>
                <Text fontSize="sm" color={subtitleColor}>
                  • Mention the genre or style you prefer (fantasy, sci-fi,
                  mystery, etc.)
                </Text>
                <Text fontSize="sm" color={subtitleColor}>
                  • Don't worry about length - our AI will expand your ideas
                  beautifully
                </Text>
              </VStack>
            </VStack>
          </Box>
        </VStack>
      </Container>

      <BottomNavigation
        activeTab="prompt"
        onRobotClick={() => {}} // Already on prompt page
        onHomeClick={handleHomeClick}
        onLibraryClick={handleLibraryClick}
      />
    </Box>
  );
};

export default Prompt;
