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

const Home = () => {
  return (
    <>
      {/* Header */}
      <Flex
        dir="row"
        align="center"
        justify="space-between"
        padding="10vh"
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
        <Flex align="start" px="10vh" direction="column">
          <Text fontSize="8xl" fontFamily="Merriweather">
            Build new worlds.
          </Text>
          <Text fontSize="8xl" fontFamily="Merriweather">
            Write your own story.
          </Text>
        </Flex>

        {/* Astronaut */}
        <Box zIndex="-1" position="absolute" top="2vh" right="36vh">
          <Image src={Astronaut} height="60vh"></Image>
        </Box>

        {/* Moon */}
        <Box zIndex="-2" position="absolute" top="20vh" right="10vh">
          <Image src={Moon} height="48vh" transform="rotate(45deg)"></Image>
        </Box>
      </Flex>

      {/* Story Section */}
      <Flex
        direction="column"
        alignItems="center"
        justifyContent="center"
        margin="12vh"
      >
        {/* Search Bar */}
        <InputGroup
          size="md"
          width="92vw"
          alignItems="center"
          justifyContent="center"
        >
          <Input
            placeholder="What stories do you want to explore today..."
            _placeholder={{ color: "#AD7DFE", opacity: 0.7, fontSize: "xl" }}
            height="8vh"
            shadow="lg"
            borderRadius="full"
            paddingX="2vw"
            variant="subtle"
            _hover={{
              border: "2px",
              borderColor: "#AD7DFE",
            }}
          />
          <InputRightElement height="100%" alignItems="center" paddingX="2.5vw">
            <Button
              _hover={{ color: "#7938e1ff" }}
              variant="link"
              color="#AD7DFE"
              fontSize="2xl"
            >
              <Icon as={SearchIcon} />
            </Button>
          </InputRightElement>
        </InputGroup>
      </Flex>

      {/* Navigation Tabs */}
      <Flex
        position="fixed"
        bottom="0px"
        height="10vh"
        width="100vw"
        shadow="inner"
        align="center"
        justify="space-between"
        direction="row"
        paddingX="10vh"
      >
        <IconButton variant="link" color="black" fontSize="4xl">
          <FaRobot />
        </IconButton>

        <IconButton variant="link" color="black" fontSize="4xl">
          <IoIosRocket />
        </IconButton>

        <IconButton variant="link" color="black" fontSize="4xl">
          <FaBookOpen />
        </IconButton>
      </Flex>
    </>
  );
};

export default Home;
