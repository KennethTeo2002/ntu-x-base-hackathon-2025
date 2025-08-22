import { Box, Text, Image, Flex, IconButton, Button } from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import "@fontsource/poppins";

const StoryDisplay = ({ 
  story, 
  onNextChapter, 
  onSave, 
  isLoadingNext = false, 
  isSaving = false 
}) => {
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
      {/* Story Header */}
      <Flex align="center" justify="space-between" mb="4">
        <Box>
          <Text
            fontSize="2xl"
            fontFamily="Poppins"
            fontWeight="bold"
            color="black"
          >
            {story.title}
          </Text>
          <Text
            fontSize="lg"
            fontFamily="Poppins"
            color="#477DFE"
            fontWeight="medium"
          >
            Chapter {story.chapter}
          </Text>
        </Box>
        <IconButton
          icon={<EditIcon />}
          variant="ghost"
          color="gray.500"
          size="lg"
        />
      </Flex>

      {/* Story Content */}
      <Text
        fontSize="md"
        fontFamily="Poppins"
        color="black"
        lineHeight="1.7"
        mb="6"
      >
        {story.content}
      </Text>

      {/* Story Image */}
      <Box
        width="100%"
        height="400px"
        bg="gray.800"
        borderRadius="15px"
        mb="6"
        overflow="hidden"
      >
        <Image
          src={story.image_url}
          alt="Story illustration"
          width="100%"
          height="100%"
          objectFit="cover"
        />
      </Box>

      {/* Action Buttons */}
      <Flex gap="4" justify="center">
        <Button
          variant="outline"
          color="#477DFE"
          borderColor="#477DFE"
          borderRadius="full"
          size="lg"
          fontWeight="medium"
          flex="1"
          onClick={onNextChapter}
          isLoading={isLoadingNext}
          loadingText="Generating..."
        >
          Next Chapter
        </Button>
        <Button
          bg="#477DFE"
          color="white"
          borderRadius="full"
          size="lg"
          fontWeight="medium"
          flex="1"
          onClick={onSave}
          isLoading={isSaving}
          loadingText="Saving..."
          _hover={{
            bg: "#3465d8",
          }}
        >
          Save
        </Button>
      </Flex>
    </Box>
  );
};

export default StoryDisplay;

