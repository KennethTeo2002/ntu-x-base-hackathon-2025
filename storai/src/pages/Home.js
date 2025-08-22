import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Text,
  VStack,
  HStack,
  Button,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  useColorModeValue,
  Image,
  SimpleGrid,
  Card,
  CardBody,
  Badge,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { FaRobot, FaBook } from "react-icons/fa";
import Header from "../components/Header";
import BottomNavigation from "../components/BottomNavigation";

import "@fontsource/poppins"; // Defaults to weight 400
import "@fontsource/merriweather"; // Defaults to weight 400

const StoryPreviewCard = ({ story, onClick }) => {
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const subtitleColor = useColorModeValue("gray.600", "gray.300");

  return (
    <Card
      bg={"cardBg"}
      shadow="md"
      cursor="pointer"
      onClick={onClick}
      transition="all 0.2s"
      _hover={{ shadow: "lg", transform: "translateY(-2px)" }}
      overflow="hidden"
    >
      <Box position="relative" h="200px">
        <Image
          src={story.image}
          alt={story.title}
          w="100%"
          h="100%"
          objectFit="cover"
        />
        <Badge
          position="absolute"
          top={2}
          right={2}
          colorScheme="blue"
          variant="solid"
        >
          {story.type}
        </Badge>
      </Box>
      <CardBody p={4}>
        <VStack align="start" spacing={2}>
          <Heading size="sm" color={textColor} noOfLines={1}>
            {story.title}
          </Heading>
          <Text fontSize="sm" color={subtitleColor} noOfLines={2}>
            {story.description}
          </Text>
        </VStack>
      </CardBody>
    </Card>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const bgColor = useColorModeValue("gray.50", "gray.900");
  const textColor = useColorModeValue("gray.800", "white");
  const subtitleColor = useColorModeValue("gray.600", "gray.300");
  const cardBg = useColorModeValue("white", "gray.800");

  // Featured stories for the homepage
  const featuredStories = [
    {
      id: "cat1",
      title: "The Curious Cat",
      description:
        "A tale of a cat who discovers magical powers in an ordinary house.",
      image:
        "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop&auto=format",
      type: "Featured",
    },
    {
      id: "cat2",
      title: "Whiskers in Wonderland",
      description:
        "Follow a brave cat through a mystical adventure beyond imagination.",
      image:
        "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=400&h=300&fit=crop&auto=format",
      type: "Popular",
    },
    {
      id: "cat3",
      title: "The Space Cat Chronicles",
      description:
        "An intergalactic journey with the most adventurous feline in the universe.",
      image:
        "https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=400&h=300&fit=crop&auto=format",
      type: "New",
    },
  ];

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Navigate to prompt page with the search query
      navigate("/prompt", { state: { initialPrompt: searchQuery } });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleStoryClick = (story) => {
    // Navigate to the individual story page
    navigate(`/story/${story.id}`, { state: { story } });
  };

  const handlePromptNavigation = () => {
    navigate("/prompt");
  };

  const handleLibraryNavigation = () => {
    navigate("/library");
  };

  return (
    <Box minH="100vh" bg={bgColor}>
      <Header />

      <Container maxW="7xl" py={8} px={4} mb="8vh">
        <VStack spacing={12} align="stretch">
          {/* Hero Section */}
          <VStack spacing={6} textAlign="center" py={8} paddingY="18vh">
            <Box position="relative">
              <Heading
                size={{ base: "2xl", md: "3xl" }}
                color={textColor}
                fontWeight="bold"
                lineHeight="1.2"
              >
                Build new worlds.
              </Heading>
              <Heading
                size={{ base: "2xl", md: "3xl" }}
                color={textColor}
                fontWeight="bold"
                lineHeight="1.2"
              >
                Write your own story.
              </Heading>

              {/* Decorative robot illustration */}
              <Box
                position="absolute"
                right={{ base: -4, md: -20 }}
                top={{ base: -4, md: -8 }}
                fontSize={{ base: "4xl", md: "6xl" }}
                opacity={0.1}
              >
                🤖🚀
              </Box>
            </Box>

            {/* Search Bar */}
            <Box w="100%" maxW={{ base: "76vw", md: "2xl" }} mt="2vw">
              <InputGroup size="lg">
                <Input
                  placeholder="What stories do you want to explore today..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  bg={cardBg}
                  border="2px"
                  borderColor="blue.200"
                  _focus={{
                    borderColor: "blue.500",
                    boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)",
                  }}
                  rounded="full"
                  fontSize={{ base: "sm", md: "md" }}
                />
                <InputRightElement>
                  <IconButton
                    icon={<SearchIcon />}
                    colorScheme="blue"
                    variant="ghost"
                    onClick={handleSearch}
                    aria-label="Search stories"
                    rounded="full"
                  />
                </InputRightElement>
              </InputGroup>
            </Box>
          </VStack>

          {/* Featured Stories Section */}
          <VStack align="stretch" spacing={6}>
            <Heading size="lg" color={textColor} textAlign="center">
              Featured Stories
            </Heading>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {featuredStories.map((story) => (
                <StoryPreviewCard
                  key={story.id}
                  story={story}
                  onClick={() => handleStoryClick(story)}
                />
              ))}
            </SimpleGrid>
          </VStack>

          {/* Quick Actions */}
          <Box bg={cardBg} rounded="2xl" shadow="lg" p={8}>
            <VStack spacing={6}>
              <Heading size="lg" color={textColor} textAlign="center">
                What would you like to do?
              </Heading>

              <HStack spacing={6} wrap="wrap" justify="center">
                <Button
                  leftIcon={<FaRobot />}
                  colorScheme="blue"
                  size="lg"
                  onClick={handlePromptNavigation}
                  rounded="full"
                  px={8}
                >
                  Create New Story
                </Button>

                <Button
                  leftIcon={<FaBook />}
                  colorScheme="green"
                  variant="outline"
                  size="lg"
                  onClick={handleLibraryNavigation}
                  rounded="full"
                  px={8}
                >
                  Browse Library
                </Button>
              </HStack>
            </VStack>
          </Box>

          {/* Stats Section */}
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6}>
            <Box textAlign="center" p={6} bg={cardBg} rounded="xl" shadow="md">
              <Text fontSize="3xl" fontWeight="bold" color="blue.500">
                1000+
              </Text>
              <Text color={subtitleColor} fontSize="sm">
                Stories Created
              </Text>
            </Box>

            <Box textAlign="center" p={6} bg={cardBg} rounded="xl" shadow="md">
              <Text fontSize="3xl" fontWeight="bold" color="green.500">
                500+
              </Text>
              <Text color={subtitleColor} fontSize="sm">
                Active Writers
              </Text>
            </Box>

            <Box textAlign="center" p={6} bg={cardBg} rounded="xl" shadow="md">
              <Text fontSize="3xl" fontWeight="bold" color="purple.500">
                50+
              </Text>
              <Text color={subtitleColor} fontSize="sm">
                Story Genres
              </Text>
            </Box>

            <Box textAlign="center" p={6} bg={cardBg} rounded="xl" shadow="md">
              <Text fontSize="3xl" fontWeight="bold" color="orange.500">
                24/7
              </Text>
              <Text color={subtitleColor} fontSize="sm">
                AI Available
              </Text>
            </Box>
          </SimpleGrid>
        </VStack>
      </Container>

      <BottomNavigation
        activeTab="home"
        onRobotClick={handlePromptNavigation}
        onHomeClick={() => {}} // Already on home page
        onLibraryClick={handleLibraryNavigation}
      />
    </Box>
  );
};

export default Home;
