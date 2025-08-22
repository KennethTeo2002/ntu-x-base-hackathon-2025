import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Container,
  Text,
  Image,
  VStack,
  HStack,
  Button,
  Heading,
  Flex,
  useColorModeValue,
  Spinner,
  Center,
  useToast,
  Badge,
  Divider,
} from "@chakra-ui/react";
import Header from "../components/Header";
import BottomNavigation from "../components/BottomNavigation";
import ApiService from "../services/api";

import "@fontsource/poppins"; // Defaults to weight 400
import "@fontsource/merriweather"; // Defaults to weight 400

const PromptPopOut = () => {
  const navigate = useNavigate();
  const handleHomeClick = () => navigate("/");
  const handleLibraryClick = () => navigate("/library");
  const location = useLocation();
  const toast = useToast();

  const [story, setStory] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingNext, setIsGeneratingNext] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const subtitleColor = useColorModeValue("gray.600", "gray.300");
  const promptBg = useColorModeValue("gray.100", "gray.700");

  useEffect(() => {
    // Get story data from navigation state or localStorage
    console.log(location);
    const storyData =
      location.state?.story ||
      JSON.parse(localStorage.getItem("currentStory") || "null");

    if (storyData) {
      setStory(storyData);
      // Save to localStorage for page refresh
      localStorage.setItem("currentStory", JSON.stringify(storyData));
    } else {
      // Redirect back to prompt if no story data
      navigate("/prompt");
    }
  }, [location.state, navigate]);

  const handleNextChapter = async () => {
    if (!story) return;

    try {
      setIsGeneratingNext(true);

      const response = await ApiService.generateNextChapter(story.id, story);

      if (response.success) {
        const updatedStory = {
          ...story,
          chapter: response.chapter.chapter,
          content: response.chapter.content,
          image_url: response.chapter.image_url,
        };

        setStory(updatedStory);
        localStorage.setItem("currentStory", JSON.stringify(updatedStory));

        toast({
          title: "Next chapter generated!",
          description: `Chapter ${response.chapter.chapter} is ready to read.`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error generating next chapter:", error);
      toast({
        title: "Generation failed",
        description: "Could not generate next chapter. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsGeneratingNext(false);
    }
  };

  const handleSaveStory = async () => {
    if (!story) return;

    try {
      setIsSaving(true);

      const response = await ApiService.saveStory(story);

      if (response.success) {
        toast({
          title: "Story saved!",
          description: "Your story has been added to your library.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        // Navigate to library after saving
        setTimeout(() => {
          navigate("/library");
        }, 1500);
      }
    } catch (error) {
      console.error("Error saving story:", error);
      toast({
        title: "Save failed",
        description: "Could not save story. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChatWithStory = () => {
    // Navigate to a chat interface (could be implemented later)
    toast({
      title: "Coming soon!",
      description: "Chat with Stor.ai feature will be available soon.",
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  };

  if (!story) {
    return (
      <Box minH="100vh" bg={bgColor}>
        <Header />
        <Center h="60vh">
          <Spinner size="xl" color="blue.500" />
        </Center>
        <BottomNavigation />
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg={bgColor}>
      <Header />

      <Container maxW="6xl" py={8} px={4}>
        <Flex gap={8} direction={{ base: "column", lg: "row" }}>
          {/* Left Side - User Prompt & Chat */}
          <Box w={{ base: "100%", lg: "400px" }} flexShrink={0}>
            <VStack align="stretch" spacing={6}>
              {/* User Prompt Display */}
              <Box bg={cardBg} rounded="xl" shadow="md" p={6}>
                <VStack align="stretch" spacing={4}>
                  <Heading size="md" color={textColor}>
                    Your Prompt
                  </Heading>

                  <Box bg={promptBg} rounded="lg" p={4}>
                    <Text fontSize="md" color={textColor} fontStyle="italic">
                      "{story.prompt}"
                    </Text>
                  </Box>

                  <Divider />

                  {/* AI Response to Prompt */}
                  <Box>
                    <Text fontSize="sm" color={subtitleColor} mb={2}>
                      Stor.ai's interpretation:
                    </Text>
                    <Text fontSize="sm" color={textColor} lineHeight="1.6">
                      {story.storyline}
                    </Text>
                  </Box>

                  {/* Chat with Stor.ai Button */}
                  <Button
                    colorScheme="blue"
                    variant="outline"
                    size="sm"
                    onClick={handleChatWithStory}
                    isDisabled={isLoading}
                  >
                    Chat with Stor.ai
                  </Button>
                </VStack>
              </Box>

              {/* Story Metadata */}
              <Box bg={cardBg} rounded="xl" shadow="md" p={6}>
                <VStack align="stretch" spacing={3}>
                  <Heading size="sm" color={textColor}>
                    Story Details
                  </Heading>

                  <HStack justify="space-between">
                    <Text fontSize="sm" color={subtitleColor}>
                      Type:
                    </Text>
                    <Badge colorScheme="blue" variant="subtle">
                      {story.type === "original" ? "Original" : "Generated"}
                    </Badge>
                  </HStack>

                  <HStack justify="space-between">
                    <Text fontSize="sm" color={subtitleColor}>
                      Chapter:
                    </Text>
                    <Text fontSize="sm" color={textColor} fontWeight="medium">
                      {story.chapter}
                    </Text>
                  </HStack>
                </VStack>
              </Box>
            </VStack>
          </Box>

          {/* Right Side - Generated Story */}
          <Box flex={1}>
            <Box bg={cardBg} rounded="xl" shadow="lg" overflow="hidden">
              {/* Story Header */}
              <Box p={6} borderBottom="1px" borderColor="gray.200">
                <VStack align="start" spacing={2}>
                  <Heading size="xl" color={textColor}>
                    {story.title}
                  </Heading>
                  <Text color="blue.500" fontSize="lg" fontWeight="medium">
                    Chapter {story.chapter}
                  </Text>
                </VStack>
              </Box>

              {/* Story Image - Fixed sizing */}
              <Box position="relative" w="100%" h="400px" overflow="hidden">
                <Image
                  src={story.imageURL}
                  alt={`${story.title} - Chapter ${story.chapter}`}
                  w="100%"
                  h="100%"
                  objectFit="cover"
                  objectPosition="center"
                  fallbackSrc="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&auto=format"
                  loading="lazy"
                />

                {/* Loading overlay for image */}
                {isLoading && (
                  <Box
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    bg="blackAlpha.600"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Spinner size="xl" color="white" />
                  </Box>
                )}
              </Box>

              {/* Story Content */}
              <Box p={6}>
                <Text
                  fontSize="lg"
                  lineHeight="1.8"
                  color={textColor}
                  whiteSpace="pre-wrap"
                  textAlign="justify"
                >
                  {story.storyline}
                </Text>
              </Box>

              {/* Action Buttons */}
              <Box p={6} borderTop="1px" borderColor="gray.200">
                <HStack spacing={4} justify="center">
                  <Button
                    colorScheme="blue"
                    variant="outline"
                    size="lg"
                    flex={1}
                    maxW="200px"
                    onClick={handleNextChapter}
                    isLoading={isGeneratingNext}
                    loadingText="Generating..."
                    isDisabled={isLoading || isSaving}
                  >
                    Next Chapter
                  </Button>
                  <Button
                    colorScheme="blue"
                    size="lg"
                    flex={1}
                    maxW="200px"
                    onClick={handleSaveStory}
                    isLoading={isSaving}
                    loadingText="Saving..."
                    isDisabled={isLoading || isGeneratingNext}
                  >
                    Save
                  </Button>
                </HStack>
              </Box>
            </Box>
          </Box>
        </Flex>
      </Container>

      {/* Navigation */}
      <BottomNavigation
        activeTab="prompt"
        onRobotClick={() => navigate("/prompt")}
        onHomeClick={handleHomeClick}
        onLibraryClick={handleLibraryClick}
      />
    </Box>
  );
};

export default PromptPopOut;
