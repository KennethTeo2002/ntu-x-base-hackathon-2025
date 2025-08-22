import {
  Text,
  Flex,
  Button,
  Image,
  Box,
  Input,
  InputRightElement,
  Icon,
  IconButton,
  InputGroup,
} from "@chakra-ui/react";

import { useNavigate } from "react-router-dom";
import { IoIosRocket } from "react-icons/io";
import { SearchIcon } from "@chakra-ui/icons";
import { FaRobot } from "react-icons/fa";
import { FaBookOpen } from "react-icons/fa6";

import "@fontsource/poppins"; // Defaults to weight 400
import "@fontsource/merriweather"; // Defaults to weight 400

// Assets
import Astronaut from "../assets/Astronaut.png";
import Moon from "../assets/Moon.png";

// Components
import ImageCard from "../components/ImageCard";

const Home = () => {
  const navigate = useNavigate();

  const handleSearchClick = () => {
    // filter library for pre-generated story
    navigate("/");
  };

  const handleRobotClick = () => {
    navigate("/prompt");
  };

  const handleLibraryClick = () => {
    navigate("/library");
  };
  return (
    <Flex flexDir="column" maxWidth="100vw">
      {/* Header */}
      <Flex
        dir="row"
        align="center"
        justify="space-between"
        padding="30px 10vw"
        w="100%"
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

      {/* Body */}
      <Flex
        flexDir={{ base: "col", md: "row" }}
        align="center"
        h="54vh"
        px="4vw"
      >
        {/* Title */}
        <Flex
          align="start"
          px="8vh"
          direction="column"
          mb={{ base: "180px", md: "0" }}
        >
          <Text fontSize={{ base: "4xl", md: "6xl" }} fontFamily="Merriweather">
            Build new worlds.
          </Text>
          <Text fontSize={{ base: "4xl", md: "6xl" }} fontFamily="Merriweather">
            Write your own story.
          </Text>
        </Flex>

        {/* Astronaut */}
        <Box
          zIndex="-1"
          position="absolute"
          top={{ base: "230px", md: "50px" }}
          right={{ base: "30vw", md: "20vw" }}
        >
          <Image
            src={Astronaut}
            height={{ base: "240px", md: "420px" }}
            transform="rotate(-10deg)"
          ></Image>
        </Box>

        {/* Moon */}
        <Box zIndex="-2" position="absolute" top="320px" right="14vw">
          <Image
            src={Moon}
            height={{ base: "120px", md: "200px" }}
            transform="rotate(55deg)"
          ></Image>
        </Box>
      </Flex>

      {/* Story Section */}
      <Flex
        direction="column"
        alignItems="center"
        justifyContent="center"
        marginTop="8vh"
        marginX="8vw"
      >
        {/* Search Bar */}
        <InputGroup
          size="md"
          width="100%"
          alignItems="center"
          justifyContent="center"
        >
          <Input
            placeholder="What stories do you want to explore today..."
            _placeholder={{ color: "white", opacity: 0.7 }}
            fontSize={{ base: "md", md: "lg" }}
            color="white"
            height="8vh"
            shadow="md"
            borderRadius="full"
            padding="20px 30px"
            variant="subtle"
            bgColor="black"
            _hover={{
              border: "2px",
              borderColor: "#477DFE",
            }}
          />
          <InputRightElement height="100%" alignItems="center" paddingX="2.5vw">
            <Button
              _hover={{ color: "#3465d8ff" }}
              variant="link"
              color="white"
              fontSize="2xl"
              onClick={handleSearchClick}
            >
              <Icon as={SearchIcon} />
            </Button>
          </InputRightElement>
        </InputGroup>
      </Flex>

      {/* Featured Stories */}
      <Flex
        flexDir="column"
        alignItems="center"
        marginTop="6vh"
        marginBottom="14vh"
      >
        <Text
          fontWeight="semibold"
          mb="20px"
          fontSize={{ base: "xl", md: "3xl" }}
        >
          Featured Stories
        </Text>
        {/* Card container */}
        <Flex
          flexDir={{ base: "column", md: "row" }}
          gap={8}
          justifyContent="center"
          width="100%"
          p="20px"
        >
          <ImageCard
            imageUrl="https://c4.wallpaperflare.com/wallpaper/101/380/61/cat-animals-bokeh-cute-wallpaper-preview.jpg"
            title="cat"
            description="meowmeowmeowmeowmeow"
          ></ImageCard>
          <ImageCard
            imageUrl="https://c4.wallpaperflare.com/wallpaper/101/380/61/cat-animals-bokeh-cute-wallpaper-preview.jpg"
            title="cat"
            description="meowmeowmeowmeowmeow"
          ></ImageCard>
          <ImageCard
            imageUrl="https://c4.wallpaperflare.com/wallpaper/101/380/61/cat-animals-bokeh-cute-wallpaper-preview.jpg"
            title="cat"
            description="meowmeowmeowmeowmeow"
          ></ImageCard>
        </Flex>
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
        <IconButton
          variant="link"
          color="black"
          fontSize="3xl"
          onClick={handleRobotClick}
        >
          <FaRobot />
        </IconButton>

        <IconButton variant="link" color="black" fontSize="3xl">
          <IoIosRocket />
        </IconButton>

        <IconButton
          variant="link"
          color="black"
          fontSize="3xl"
          onClick={handleLibraryClick}
        >
          <FaBookOpen />
        </IconButton>
      </Flex>
    </Flex>
  );
};

export default Home;
