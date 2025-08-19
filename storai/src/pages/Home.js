import { Text, Flex, Button } from "@chakra-ui/react";
import "@fontsource/poppins"; // Defaults to weight 400
import "@fontsource/merriweather"; // Defaults to weight 400

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

      {/* Title */}
      <Flex align="start" paddingBottom="8vh" px="8vh" direction="column">
        <Text fontSize="8xl" fontFamily="Merriweather">
          Build new worlds.
        </Text>
        <Text fontSize="8xl" fontFamily="Merriweather">
          Write your own story.
        </Text>
      </Flex>
    </>
  );
};

export default Home;
