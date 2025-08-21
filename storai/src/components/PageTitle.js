import { Text } from "@chakra-ui/react";
import "@fontsource/poppins";

const PageTitle = ({ title, subtitle, textAlign = "center" }) => {
  return (
    <>
      <Text
        fontSize="6xl"
        fontFamily="Poppins"
        fontWeight="medium"
        color="black"
        mb={subtitle ? "4" : "8"}
        textAlign={textAlign}
      >
        {title}
      </Text>
      
      {subtitle && (
        <Text
          fontSize="xl"
          fontFamily="Poppins"
          color="gray.600"
          mb="8"
          textAlign={textAlign}
        >
          {subtitle}
        </Text>
      )}
    </>
  );
};

export default PageTitle;

