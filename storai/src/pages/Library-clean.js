import {
  Text,
  Flex,
  Button,
  Box,
  Image,
  IconButton,
  SimpleGrid,
} from "@chakra-ui/react";

import { FaRobot } from "react-icons/fa";
import { FaBookOpen } from "react-icons/fa6";
import { IoIosRocket } from "react-icons/io";
import { useNavigate } from "react-router-dom";


import "@fontsource/poppins"; // Defaults to weight 400

const Library = () => {
  const navigate = useNavigate();

  const handleRobotClick = () => {
    navigate('/prompt');
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  // Demo story data
  const originalStories = [
    {
      id: 1,
      title: "Lorem ipsum dolor sit amet, elonseur adipiscing elit, sed.",
      image: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=250&fit=crop"
    },
    {
      id: 2,
      title: "Lorem ipsum dolor sit amet, elonseur adipiscing elit, sed.",
      image: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=250&fit=crop"
    },
    {
      id: 3,
      title: "Lorem ipsum dolor",
      image: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=250&fit=crop"
    }
  ];

  const borrowedStories = [
    {
      id: 4,
      title: "Lorem ipsum dolor sit amet, elonseur adipiscing elit, sed.",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=250&fit=crop"
    },
    {
      id: 5,
      title: "Lorem ipsum dolor sit amet, elonseur adipiscing elit, sed.",
      image: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=250&fit=crop"
    },
    {
      id: 6,
      title: "Lorem ipsum dolor",
      image: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=250&fit=crop"
    }
  ];

  const StoryCard = ({ story }) => (
    <Box
      bg="white"
      borderRadius="15px"
      overflow="hidden"
      shadow="md"
      border="1px"
      borderColor="gray.200"
      _hover={{
        shadow: "lg",
        transform: "translateY(-2px)",
        transition: "all 0.2s",
      }}
      cursor="pointer"
    >
      <Box height="150px" overflow="hidden">
        <Image
          src={story.image}
          alt={story.title}
          width="100%"
          height="100%"
          objectFit="cover"
        />
      </Box>
      <Box padding="4">
        <Text
          fontSize="sm"
          fontFamily="Poppins"
          color="black"
          lineHeight="1.4"
          noOfLines={3}
        >
          {story.title}
        </Text>
      </Box>
    </Box>
  );

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
      <Box
        paddingX="8vh"
        paddingBottom="10vh"
        height="calc(100vh - 24vh)"
        overflowY="auto"
      >
        <Text
          fontSize="6xl"
          fontFamily="Poppins"
          fontWeight="medium"
          color="black"
          mb="2"
        >
          Library
        </Text>
        
        <Text
          fontSize="xl"
          fontFamily="Poppins"
          color="gray.600"
          mb="6"
        >
          Your collection of stories.
        </Text>

        {/* Filter Buttons */}
        <Flex gap="3" mb="8">
          <Button
            variant="outline"
            borderColor="#477DFE"
            color="black"
            bg="white"
            borderRadius="full"
            size="md"
            fontWeight="medium"
            leftIcon={<Box as="span" fontSize="lg">📖</Box>}
          >
            All
          </Button>
          <Button
            bg="#477DFE"
            color="white"
            borderRadius="full"
            size="md"
            fontWeight="medium"
            leftIcon={<Box as="span" fontSize="lg">🖼️</Box>}
            _hover={{
              bg: "#3465d8",
            }}
          >
            Visual
          </Button>
        </Flex>

        {/* Original Stories Section */}
        <Box mb="8">
          <Text
            fontSize="xl"
            fontFamily="Poppins"
            fontWeight="semibold"
            color="#477DFE"
            mb="4"
          >
            Original Stories
          </Text>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing="6">
            {originalStories.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </SimpleGrid>
        </Box>

        {/* Borrowed Stories Section */}
        <Box>
          <Text
            fontSize="xl"
            fontFamily="Poppins"
            fontWeight="semibold"
            color="#477DFE"
            mb="4"
          >
            Borrowed Stories
          </Text>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing="6">
            {borrowedStories.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </SimpleGrid>
        </Box>
      </Box>

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
        <IconButton 
          variant="link" 
          color="gray.400" 
          fontSize="3xl"
          onClick={handleRobotClick}
        >
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

        <IconButton variant="link" color="#477DFE" fontSize="3xl">
          <FaBookOpen />
        </IconButton>
      </Flex>
    </>
  );
};

export default Library;

