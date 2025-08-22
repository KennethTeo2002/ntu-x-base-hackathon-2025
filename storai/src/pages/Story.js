import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  IconButton,
  Divider,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon, EditIcon } from "@chakra-ui/icons";
import Header from "../components/Header";
import BottomNavigation from "../components/BottomNavigation";
import { FaRegCopy } from "react-icons/fa";

import "@fontsource/poppins"; // Defaults to weight 400
import "@fontsource/merriweather"; // Defaults to weight 400

const Story = () => {
  const { storyId } = useParams();
  const navigate = useNavigate();
  const handleHomeClick = () => navigate("/");
  const handleLibraryClick = () => navigate("/library");
  const [story, setStory] = useState(null);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const subtitleColor = useColorModeValue("gray.600", "gray.300");

  const loadStory = useCallback(async () => {
    try {
      setLoading(true);
      console.log(`Loading story with ID: ${storyId}`);

      const response = await fetch(`http://localhost:5000/story/${storyId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Story not found");
        }
        throw new Error(`Failed to fetch story: ${response.status}`);
      }

      const storyData = await response.json();
      console.log("Loaded story data:", storyData);

      // Your backend returns the story object directly
      setStory({
        id: storyData.id || storyId,
        title: storyData.title || "Untitled Story",
        originalPrompt: storyData.originalPrompt || "",
        imageURL: storyData.imageURL || "",
        storyline: storyData.storyline || "",
        type: storyData.type || "original",
        created_at: storyData.created_at || new Date().toISOString(),
        updated_at: storyData.updated_at || new Date().toISOString(),
      });

      // Set chapters - your backend stores them as an array
      const chaptersData = storyData.chapters || [];
      setChapters(chaptersData);

      // Set current chapter to first if available
      if (chaptersData.length > 0) {
        setCurrentChapter(0);
      }
    } catch (error) {
      console.error("Error loading story:", error);

      setStory(null);
      setChapters([]);

      toast({
        title: "Failed to load story",
        description:
          error.message || "Could not load the story. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [storyId, toast]);

  useEffect(() => {
    loadStory();
  }, [storyId, loadStory]);

  const handleBackToLibrary = () => {
    navigate("/library");
  };

  const handleChapterSelect = (chapterIndex) => {
    setCurrentChapter(chapterIndex);
  };

  if (loading) {
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

  if (!story || !chapters || chapters.length === 0) {
    return (
      <Box minH="100vh" bg={bgColor}>
        <Header />
        <Center h="60vh">
          <Text>Story not found</Text>
        </Center>
        <BottomNavigation />
      </Box>
    );
  }

  // Safe access to current chapter data
  const currentChapterData = chapters[currentChapter] || {};

  return (
    <Box minH="100vh" bg={bgColor}>
      <Header />

      <Container maxW="7xl" py={8} px={4} mb="8vh">
        <Flex gap={8} direction={{ base: "column", lg: "row" }}>
          {/* Left Sidebar - Chapters */}
          <Box w={{ base: "100%", lg: "300px" }} flexShrink={0}>
            <VStack align="stretch" spacing={4}>
              {/* Back Button */}
              <Button
                leftIcon={<ArrowBackIcon />}
                variant="ghost"
                justifyContent="flex-start"
                onClick={handleBackToLibrary}
                color={textColor}
              >
                Back to Library
              </Button>

              <Divider />

              {/* Chapters List */}
              <Box>
                <Heading size="md" color="blue.500" mb={4}>
                  Chapters
                </Heading>
                <VStack align="stretch" spacing={2}>
                  {chapters.map((chapter, index) => (
                    <Button
                      key={chapter.id || index}
                      variant={currentChapter === index ? "solid" : "ghost"}
                      colorScheme={currentChapter === index ? "blue" : "gray"}
                      justifyContent="flex-start"
                      size="sm"
                      onClick={() => handleChapterSelect(index)}
                      textAlign="left"
                      whiteSpace="normal"
                      height="auto"
                      py={3}
                    >
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="bold" fontSize="sm">
                          {chapter.title || `Chapter ${index + 1}`}
                        </Text>
                        {chapter.choices && chapter.choices.length > 0 && (
                          <Text fontSize="xs" color="gray.500">
                            {chapter.choices.length} choices
                          </Text>
                        )}
                      </VStack>
                    </Button>
                  ))}
                </VStack>
              </Box>
            </VStack>
          </Box>

          {/* Main Content */}
          <Box flex={1}>
            <Box bg={cardBg} rounded="xl" shadow="lg" overflow="hidden">
              {/* Story Header */}
              <Box p={6} borderBottom="1px" borderColor="gray.200">
                <HStack justify="space-between" align="start">
                  <VStack align="start" spacing={2}>
                    <Heading size="xl" color={textColor}>
                      {story.title}
                    </Heading>
                    {story.originalPrompt && (
                      <Text
                        fontSize="sm"
                        color={subtitleColor}
                        fontStyle="italic"
                      >
                        Original prompt: "{story.originalPrompt}"
                      </Text>
                    )}
                  </VStack>
                  <IconButton
                    icon={<EditIcon />}
                    variant="ghost"
                    colorScheme="blue"
                    aria-label="Edit story"
                  />
                </HStack>
              </Box>

              {/* Story Image */}
              <Box position="relative" w="100%" h="400px" overflow="hidden">
                <Image
                  src={story.imageURL}
                  alt={`${story.title} - ${currentChapterData.title}`}
                  w="100%"
                  h="100%"
                  objectFit="cover"
                  fallbackSrc="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&auto=format"
                />
              </Box>

              {/* Story Content */}
              <Box p={6}>
                <Text
                  fontSize="lg"
                  lineHeight="1.8"
                  color={textColor}
                  whiteSpace="pre-wrap"
                  mb={6}
                >
                  {currentChapterData.text ||
                    "No content available for this chapter."}
                </Text>

                {/* Show choices if available */}
                {currentChapterData.choices &&
                  currentChapterData.choices.length > 0 && (
                    <VStack spacing={3} align="stretch">
                      <Heading size="md" color="blue.500">
                        What do you choose?
                      </Heading>
                      {currentChapterData.choices.map((choice, index) => (
                        <Button
                          key={choice.id || index}
                          variant="outline"
                          colorScheme="blue"
                          justifyContent="flex-start"
                          textAlign="left"
                          whiteSpace="normal"
                          height="auto"
                          py={4}
                          px={6}
                        >
                          {choice.text}
                        </Button>
                      ))}
                    </VStack>
                  )}
              </Box>

              {/* Story Actions */}
              <Box p={6} borderTop="1px" borderColor="gray.200">
                <HStack spacing={4} justify="center">
                  <Button
                    colorScheme="blue"
                    rightIcon={<FaRegCopy />}
                    size="lg"
                    flex={1}
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      toast({
                        title: "Link copied!",
                        description: `You can now share this story with your friends.`,
                        status: "success",
                        duration: 3000,
                        isClosable: true,
                      });
                    }}
                  >
                    Copy Shareable Link
                  </Button>
                </HStack>
              </Box>
            </Box>
          </Box>
        </Flex>
      </Container>

      <BottomNavigation
        activeTab="prompt"
        onRobotClick={() => navigate("/prompt")}
        onHomeClick={handleHomeClick}
        onLibraryClick={handleLibraryClick}
      />
    </Box>
  );
};

export default Story;
