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
} from "@chakra-ui/react";
import { ArrowBackIcon, EditIcon } from "@chakra-ui/icons";
import Header from "../components/Header";
import BottomNavigation from "../components/BottomNavigation";

import "@fontsource/poppins"; // Defaults to weight 400
import "@fontsource/merriweather"; // Defaults to weight 400

const API_BASE =
  import.meta?.env?.VITE_API_BASE_URL || //change
  process.env.REACT_APP_API_BASE_URL ||
  "http://localhost:5000";

const Story = () => {
  const { storyId } = useParams();
  const navigate = useNavigate();
  const handleHomeClick = () => navigate("/");
  const handleLibraryClick = () => navigate("/library");
  const [story, setStory] = useState(null);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);

  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const subtitleColor = useColorModeValue("gray.600", "gray.300");

  const loadStory = async () => {
    try {
      setLoading(true);
  
      // Try to fetch the story from your backend
      const res = await fetch(`${API_BASE}/api/stories/${storyId}`, {
        headers: { "Content-Type": "application/json" },
        method: "GET",
      });
  
      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
      const data = await res.json();
  
      // --- Normalization ---
      // If your backend is already sending {id,title,originalPrompt,chapters:[{chapter,title,content,image_url}]}
      // we can use it directly. If it's simpler (e.g., imageUrl + paragraph), adapt it here.
      let normalizedStory = {
        id: data.id || storyId,
        title: data.title || "Generated Story",
        originalPrompt: data.originalPrompt || data.prompt || "",
        created_at: data.created_at || new Date().toISOString(),
        type: "original",
      };
  
      let normalizedChapters = Array.isArray(data.chapters) && data.chapters.length
        ? data.chapters
        : [
            {
              chapter: 0,
              title: data.chapterTitle || "Chapter 0",
              content: data.paragraph || data.content || "",
              image_url: data.imageUrl || data.image_url || "",
            },
          ];
  
      setStory(normalizedStory);
      setChapters(normalizedChapters);
      setCurrentChapter(0);
    } catch (error) {
      console.error("Error loading story:", error);
  
      // Optional: fallback if backend is down
      setStory({
        id: storyId,
        title: "Generated Story",
        originalPrompt: "",
        created_at: new Date().toISOString(),
        type: "original",
      });
      setChapters([
        {
          chapter: 0,
          title: "Chapter 0",
          content: "We couldn’t reach the server, but your page is working.",
          image_url:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&auto=format",
        },
      ]);
      setCurrentChapter(0);
    } finally {
      setLoading(false);
    }
  };  

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

      <Container maxW="7xl" py={8} px={4}>
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
                          Chapter {chapter.chapter}
                        </Text>
                        <Text fontSize="xs" opacity={0.8}>
                          {chapter.title || `Chapter ${chapter.chapter}`}
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
                    <Text color="blue.500" fontSize="lg" fontWeight="medium">
                      {currentChapterData.title}
                    </Text>
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
                    variant="outline"
                    size="lg"
                    flex={1}
                    maxW="200px"
                  >
                    Next Chapter
                  </Button>
                  <Button colorScheme="blue" size="lg" flex={1} maxW="200px">
                    Save
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
