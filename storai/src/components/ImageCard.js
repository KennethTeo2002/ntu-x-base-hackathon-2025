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
      height="36vh"
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
      <Box p="6">
        {/* Tags */}
        {tags.length > 0 && (
          <Flex gap="2" mb="2">
            {tags.map((tag) => (
              <Badge key={tag} colorScheme="purple">
                {tag}
              </Badge>
            ))}
          </Flex>
        )}

        {/* Title */}
        <Heading as="h3" size="md" mb="2">
          {title}
        </Heading>

        {/* Description */}
        <Text color="gray.600" mb="4" noOfLines={3}>
          {description}
        </Text>
      </Box>
    </Box>
  );
}

export default ImageCard;
