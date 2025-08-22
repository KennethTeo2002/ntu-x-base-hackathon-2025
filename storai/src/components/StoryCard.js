import { Box, Image, Text } from "@chakra-ui/react";
import "@fontsource/poppins";

const StoryCard = ({ story, onClick }) => {
  return (
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
      onClick={() => onClick && onClick(story)}
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
};

export default StoryCard;

