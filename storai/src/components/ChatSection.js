import { Box, Text, Flex, Spinner } from "@chakra-ui/react";
import "@fontsource/poppins";

const ChatSection = ({ originalPrompt }) => {
  return (
    <Box
      flex="1"
      bg="white"
      borderRadius="20px"
      padding="6"
      shadow="lg"
      border="1px"
      borderColor="gray.200"
    >
      <Text
        fontSize="lg"
        fontFamily="Poppins"
        fontWeight="semibold"
        color="black"
        mb="4"
      >
        {originalPrompt}
      </Text>
      
      <Text
        fontSize="md"
        fontFamily="Poppins"
        color="gray.600"
        lineHeight="1.6"
        mb="6"
      >
        Hmm, the user wants a story about a scientist discovering gravity, but historically it was Newton who formulated the law of universal gravitation. However, the user might be looking for a fictional twist or an alternate reality take.
      </Text>

      <Text
        fontSize="md"
        fontFamily="Poppins"
        color="gray.600"
        lineHeight="1.6"
        mb="8"
      >
        I could create a narrative where gravity isn't yet understood in a world, and a scientist rediscovers it through observation and experimentation. The story should feel grounded in scientific curiosity but also have
      </Text>

      {/* Chat Section */}
      <Box
        bg="gray.50"
        borderRadius="15px"
        padding="4"
        position="relative"
      >
        <Text
          fontSize="md"
          fontFamily="Poppins"
          color="gray.600"
          mb="2"
        >
          Chat with Stor.ai
        </Text>
        <Flex align="center" justify="center" height="60px">
          <Spinner
            thickness="3px"
            speed="0.65s"
            emptyColor="gray.200"
            color="#477DFE"
            size="lg"
          />
        </Flex>
      </Box>
    </Box>
  );
};

export default ChatSection;

