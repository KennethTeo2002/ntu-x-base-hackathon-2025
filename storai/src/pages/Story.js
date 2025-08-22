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
      const getResponse = await fetch(`http://localhost:5000/room/${storyId}`);
      console.log(getResponse.json());
      // For demo purposes, create a story based on the ID
      // In real implementation, this would fetch from your API
      const demoStory = {
        id: storyId,
        title:
          storyId === "demo1"
            ? "Elara's Equation"
            : storyId === "demo2"
            ? "The Cosmic Discovery"
            : storyId === "demo3"
            ? "Ocean's Secret"
            : "Generated Story",
        originalPrompt:
          storyId === "demo1"
            ? "Write me a story about a scientist who discovered gravity"
            : storyId === "demo2"
            ? "Tell me about a space adventure"
            : storyId === "demo3"
            ? "Create a story about ocean mysteries"
            : "A magical adventure",
        type: storyId.startsWith("demo") ? "borrowed" : "original",
        created_at: new Date().toISOString(),
      };

      const demoChapters = [
        {
          chapter: 0,
          title: "Chapter 0: The Discovery",
          content:
            storyId === "demo1"
              ? "In the quiet halls of Cambridge University, Dr. Elara Voss worked late into the night, her calculations sprawling across multiple blackboards. The equations seemed to dance before her tired eyes, but something was different tonight. As she dropped her chalk and watched it fall, a profound realization struck her. The force that pulled the chalk to the ground was the same force that kept the planets in their orbits. She had discovered what would later be known as universal gravitation, though she didn't know it yet. Her heart raced as she began to understand the implications of her work."
              : storyId === "demo2"
              ? "Captain Maya Chen gazed out at the infinite expanse of stars from the bridge of the starship Horizon. Three years into their deep space mission, they had discovered something extraordinary - a signal from an unknown civilization. The rhythmic pulses seemed to contain mathematical patterns, almost like a cosmic equation waiting to be solved. As the ship's AI analyzed the data, Maya couldn't shake the feeling that this discovery would change humanity forever."
              : "Dr. Sarah Martinez descended into the Mariana Trench in her state-of-the-art submersible. At depths where sunlight had never touched, her sonar detected something impossible - geometric structures too perfect to be natural. As she approached, bioluminescent creatures illuminated what appeared to be an ancient underwater city, its architecture unlike anything seen on Earth.",
          image_url:
            storyId === "demo1"
              ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&auto=format"
              : storyId === "demo2"
              ? "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800&h=600&fit=crop&auto=format"
              : "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=600&fit=crop&auto=format",
        },
      ];

      setStory(demoStory);
      setChapters(demoChapters);
      setCurrentChapter(0);
    } catch (error) {
      console.error("Error loading story:", error);
    } finally {
      setLoading(false);
    }
  }, [storyId]);

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

  if (!story || chapters.length === 0) {
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

  const currentChapterData = chapters[currentChapter];

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
                      key={index}
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
                          Chapter 1
                        </Text>
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
                  src={currentChapterData.image_url}
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
                >
                  {currentChapterData.content}
                </Text>
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
