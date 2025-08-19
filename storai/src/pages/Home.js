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
          Log in
        </Button>
      </Flex>

      {/* Body */}
      <Flex align="center" h="36vh">
        {/* Title */}
        <Flex align="start" px="8vh" direction="column">
          <Text fontSize="7xl" fontFamily="Merriweather">
            Build new worlds.
          </Text>
          <Text fontSize="7xl" fontFamily="Merriweather">
            Write your own story.
          </Text>
        </Flex>

        {/* Astronaut */}
        <Box zIndex="-1" position="absolute" top="2vh" right="38vh">
          <Image
            src={Astronaut}
            height="70vh"
            transform="rotate(-10deg)"
          ></Image>
        </Box>

        {/* Moon */}
        <Box zIndex="-2" position="absolute" top="18vh" right="10vh">
          <Image src={Moon} height="44vh" transform="rotate(55deg)"></Image>
        </Box>
      </Flex>

      {/* Story Section */}
      <Flex
        direction="column"
        alignItems="center"
        justifyContent="center"
        marginTop="8vh"
        marginX="8vh"
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
            _placeholder={{ color: "#477DFE", opacity: 0.7, fontSize: "xl" }}
            height="8vh"
            shadow="lg"
            borderRadius="full"
            paddingX="2vw"
            variant="subtle"
            _hover={{
              border: "2px",
              borderColor: "#477DFE",
            }}
          />
          <InputRightElement height="100%" alignItems="center" paddingX="2.5vw">
            <Button
              _hover={{ color: "#3465d8ff" }}
              variant="link"
              color="#477DFE"
              fontSize="2xl"
            >
              <Icon as={SearchIcon} />
            </Button>
          </InputRightElement>
        </InputGroup>
      </Flex>

      {/* Card container */}
      <Flex
        justifySelf="center"
        marginTop="4vh"
        direction="row"
        gap={8}
        overflowX="auto"
        maxWidth="91vw"
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
        <ImageCard
          imageUrl="https://c4.wallpaperflare.com/wallpaper/101/380/61/cat-animals-bokeh-cute-wallpaper-preview.jpg"
          title="cat"
          description="meowmeowmeowmeowmeow"
        ></ImageCard>
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
        <IconButton variant="link" color="black" fontSize="3xl">
          <FaRobot />
        </IconButton>

        <IconButton variant="link" color="black" fontSize="3xl">
          <IoIosRocket />
        </IconButton>

        <IconButton variant="link" color="black" fontSize="3xl">
          <FaBookOpen />
        </IconButton>
      </Flex>
    </>
  );
};

export default Home;
