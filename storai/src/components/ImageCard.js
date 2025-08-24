import { Box, Image, Heading, Text, Flex, Badge } from "@chakra-ui/react";

function ImageCard({
  imageUrl,
  imageAlt = "Card Image",
  title,
  description,
  tags = [],
  variant = "elevated", // 'elevated' | 'outline' | 'filled'
  ...props
}) {
  return (
    <Box
      minW="30vw"
      height={{ base: "280px", md: "36vh" }}
      borderWidth={variant === "outline" ? "1px" : "0px"}
      borderRadius="30px"
      overflow="hidden"
      bg="#FFFBF9"
      _hover={{ shadow: "lg" }}
      transition="all 0.2s"
      {...props}
    >
      {/* Image Section */}
      <Image
        src={imageUrl}
        alt={imageAlt}
        width="100%"
        height="70%"
        objectFit="cover"
      />

      {/* Content Section */}
      <Box px="20px">
        {/* Tags */}
        {tags.length > 0 && (
          <Flex gap="2">
            {tags.map((tag) => (
              <Badge key={tag} colorScheme="purple">
                {tag}
              </Badge>
            ))}
          </Flex>
        )}
        <Flex
          flexDir="column"
          justifyContent="space-between"
          mt={{ base: "16px", md: "14px" }}
        >
          {/* Title */}
          <Heading as="h3" size="md">
            {title}
          </Heading>

          {/* Description */}
          <Text color="gray.600" noOfLines={3}>
            {description}
          </Text>
        </Flex>
      </Box>
    </Box>
  );
}

export default ImageCard;
