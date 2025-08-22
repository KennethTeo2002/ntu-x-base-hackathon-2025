import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Text,
  VStack,
  HStack,
  Button,
  Heading,
  SimpleGrid,
  Image,
  useColorModeValue,
  Badge,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { BsBookmark, BsGrid3X3Gap } from "react-icons/bs";
import Header from "../components/Header";
import BottomNavigation from "../components/BottomNavigation";
import ApiService from "../services/api";

import "@fontsource/poppins"; // Defaults to weight 400
import "@fontsource/merriweather"; // Defaults to weight 400

const StoryCard = ({ story, onClick }) => {
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const subtitleColor = useColorModeValue("gray.600", "gray.300");

  return (
    <Box
      bg={cardBg}
      rounded="xl"
      shadow="md"
      overflow="hidden"
      cursor="pointer"
      onClick={onClick}
      transition="all 0.2s"
      _hover={{ shadow: "lg", transform: "translateY(-2px)" }}
    >
      {/* Story Image */}
      <Box position="relative" w="100%" h="200px" overflow="hidden">
        <Image
          src={story.image}
          alt={story.title}
          w="100%"
          h="100%"
          objectFit="cover"
          fallbackSrc="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&auto=format"
        />

        {/* Story Type Badge */}
        <Badge
          position="absolute"
          top={3}
          right={3}
          colorScheme={story.type === "original" ? "blue" : "green"}
          variant="solid"
          fontSize="xs"
        >
          {story.type === "original" ? "Original" : "Borrowed"}
        </Badge>
      </Box>

      {/* Story Info */}
      <Box p={4}>
        <VStack align="start" spacing={2}>
          <Heading size="sm" color={textColor} noOfLines={2}>
            {story.title}
          </Heading>
          <Text fontSize="sm" color={subtitleColor} noOfLines={3}>
            {story.description}
          </Text>

          {/* Story Metadata */}
          <HStack justify="space-between" w="100%" pt={2}>
            {story.chapter !== undefined && (
              <Text fontSize="xs" color={subtitleColor}>
                Chapter {story.chapter}
              </Text>
            )}
            {story.savedAt && (
              <Text fontSize="xs" color={subtitleColor}>
                {new Date(story.savedAt).toLocaleDateString()}
              </Text>
            )}
          </HStack>
        </VStack>
      </Box>
    </Box>
  );
};

const Library = () => {
  const navigate = useNavigate();
  const handlePromptClick = () => navigate("/prompt");
  const handleHomeClick = () => navigate("/");

  const [activeFilter, setActiveFilter] = useState("all");
  const [stories, setStories] = useState({ original: [], borrowed: [] });
  const [loading, setLoading] = useState(true);

  const bgColor = useColorModeValue("gray.50", "gray.900");
  const textColor = useColorModeValue("gray.800", "white");
  const subtitleColor = useColorModeValue("gray.600", "gray.300");

  useEffect(() => {
    loadLibrary();
  }, []);

  const loadLibrary = async () => {
    try {
      setLoading(true);

      // Load from API
      const response = await ApiService.getLibrary();

      if (response.success) {
        // Separate original and borrowed stories
        const originalStories = response.stories.saved || [];
        const borrowedStories = response.stories.demo || [];

        setStories({
          original: originalStories,
          borrowed: borrowedStories,
        });
      }
    } catch (error) {
      console.error("Error loading library:", error);

      // Fallback to demo data
      setStories({
        original: [
          {
            id: "user1",
            title: "My Space Adventure",
            description:
              "A thrilling journey through the cosmos that I created yesterday.",
            image:
              "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=300&fit=crop&auto=format",
            type: "original",
            chapter: 2,
            savedAt: new Date(Date.now() - 86400000).toISOString(),
          },
          {
            id: "user2",
            title: "The Magical Forest",
            description:
              "An enchanting tale of mystical creatures and ancient magic.",
            image:
              "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop&auto=format",
            type: "original",
            chapter: 1,
            savedAt: new Date(Date.now() - 172800000).toISOString(),
          },
        ],
        borrowed: [
          {
            id: "demo1",
            title: "Elara's Equation",
            description:
              "A brilliant scientist discovers the fundamental force that governs our universe.",
            image:
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&auto=format",
            type: "borrowed",
          },
          {
            id: "demo2",
            title: "The Cosmic Discovery",
            description:
              "Deep space explorers encounter signals from an unknown civilization.",
            image:
              "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=300&fit=crop&auto=format",
            type: "borrowed",
          },
          {
            id: "demo3",
            title: "Ocean's Secret",
            description:
              "Ancient mysteries lie hidden in the deepest parts of our oceans.",
            image:
              "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=300&fit=crop&auto=format",
            type: "borrowed",
          },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStoryClick = (story) => {
    // Navigate to individual story page
    navigate(`/story/${story.id}`, { state: { story } });
  };

  const getFilteredStories = () => {
    switch (activeFilter) {
      case "original":
        return stories.original;
      case "borrowed":
        return stories.borrowed;
      default:
        return [...stories.original, ...stories.borrowed];
    }
  };

  const filteredStories = getFilteredStories();

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

  return (
    <Box minH="100vh" bg={bgColor}>
      <Header />

      <Container maxW="7xl" py={8} px={4}>
        <VStack align="stretch" spacing={8}>
          {/* Page Header */}
          <VStack align="start" spacing={4}>
            <Heading size="2xl" color={textColor}>
              Library
            </Heading>
            <Text color={subtitleColor} fontSize="lg">
              Your collection of stories.
            </Text>

            {/* Filter Buttons */}
            <HStack spacing={4}>
              <Button
                leftIcon={<BsGrid3X3Gap />}
                variant={activeFilter === "all" ? "solid" : "outline"}
                colorScheme="blue"
                size="sm"
                onClick={() => setActiveFilter("all")}
              >
                All Stories
              </Button>
              <Button
                leftIcon={<BsBookmark />}
                variant={activeFilter === "original" ? "solid" : "outline"}
                colorScheme="blue"
                size="sm"
                onClick={() => setActiveFilter("original")}
              >
                Original Stories ({stories.original.length})
              </Button>
              <Button
                leftIcon={<BsGrid3X3Gap />}
                variant={activeFilter === "borrowed" ? "solid" : "outline"}
                colorScheme="green"
                size="sm"
                onClick={() => setActiveFilter("borrowed")}
              >
                Borrowed Stories ({stories.borrowed.length})
              </Button>
            </HStack>
          </VStack>

          {/* Stories Grid */}
          {filteredStories.length > 0 ? (
            <>
              {/* Original Stories Section */}
              {(activeFilter === "all" || activeFilter === "original") &&
                stories.original.length > 0 && (
                  <VStack align="stretch" spacing={4}>
                    <Heading size="lg" color="blue.500">
                      Original Stories
                    </Heading>
                    <Text color={subtitleColor} fontSize="sm">
                      Stories you've created and saved to your personal
                      collection.
                    </Text>
                    <SimpleGrid
                      columns={{ base: 1, md: 2, lg: 3, xl: 4 }}
                      spacing={6}
                    >
                      {stories.original.map((story) => (
                        <StoryCard
                          key={story.id}
                          story={story}
                          onClick={() => handleStoryClick(story)}
                        />
                      ))}
                    </SimpleGrid>
                  </VStack>
                )}

              {/* Borrowed Stories Section */}
              {(activeFilter === "all" || activeFilter === "borrowed") &&
                stories.borrowed.length > 0 && (
                  <VStack align="stretch" spacing={4}>
                    <Heading size="lg" color="green.500">
                      Borrowed Stories
                    </Heading>
                    <Text color={subtitleColor} fontSize="sm">
                      Curated stories available for everyone to read and enjoy.
                    </Text>
                    <SimpleGrid
                      columns={{ base: 1, md: 2, lg: 3, xl: 4 }}
                      spacing={6}
                    >
                      {stories.borrowed.map((story) => (
                        <StoryCard
                          key={story.id}
                          story={story}
                          onClick={() => handleStoryClick(story)}
                        />
                      ))}
                    </SimpleGrid>
                  </VStack>
                )}
            </>
          ) : (
            <Center py={20}>
              <VStack spacing={4}>
                <Text fontSize="xl" color={subtitleColor}>
                  {activeFilter === "original"
                    ? "No original stories yet"
                    : activeFilter === "borrowed"
                    ? "No borrowed stories available"
                    : "No stories in your library yet"}
                </Text>
                <Text color={subtitleColor} textAlign="center">
                  {activeFilter === "original"
                    ? "Create your first story by using the AI Storyteller!"
                    : "Check back later for new borrowed stories."}
                </Text>
                {activeFilter === "original" && (
                  <Button
                    colorScheme="blue"
                    onClick={() => navigate("/prompt")}
                    mt={4}
                  >
                    Create Your First Story
                  </Button>
                )}
              </VStack>
            </Center>
          )}
        </VStack>
      </Container>

      <BottomNavigation
        activeTab="library"
        onRobotClick={handlePromptClick}
        onHomeClick={handleHomeClick}
        onLibraryClick={() => {}} // Already on library page
      />
    </Box>
  );
};

export default Library;
