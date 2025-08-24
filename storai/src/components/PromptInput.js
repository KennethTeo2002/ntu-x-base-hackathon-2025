import { Box, Textarea, IconButton } from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import "@fontsource/poppins";

const PromptInput = ({ 
  value, 
  onChange, 
  onSubmit, 
  isLoading = false,
  placeholder = "Once upon a time..." 
}) => {
  return (
    <Box
      position="relative"
      width="100%"
      maxWidth="800px"
      mb="8"
    >
      <Textarea
        placeholder={placeholder}
        _placeholder={{ color: "gray.400", fontSize: "lg" }}
        height="300px"
        shadow="lg"
        borderRadius="20px"
        padding="6"
        fontSize="lg"
        fontFamily="Poppins"
        resize="none"
        border="1px"
        borderColor="gray.200"
        value={value}
        onChange={onChange}
        _hover={{
          borderColor: "#477DFE",
        }}
        _focus={{
          borderColor: "#477DFE",
          boxShadow: "0 0 0 1px #477DFE",
        }}
      />
      
      {/* Submit Button */}
      <IconButton
        position="absolute"
        z-index="1"
        bottom="4"
        right="4"
        icon={<ChevronRightIcon />}
        colorScheme="blue"
        bg="#477DFE"
        color="white"
        size="lg"
        borderRadius="full"
        onClick={onSubmit}
        isLoading={isLoading}
        _hover={{
          bg: "#3465d8",
        }}
      />
    </Box>
  );
};

export default PromptInput;

