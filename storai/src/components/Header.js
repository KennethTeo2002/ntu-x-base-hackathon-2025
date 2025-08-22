import { Text, Flex, Button } from "@chakra-ui/react";
import "@fontsource/poppins";

const Header = ({ onLogout }) => {
  return (
    <Flex
      dir="row"
      align="center"
      justify="space-between"
      px="10vw"
      py="30px"
      w="100%"
      px="10vw"
      py="20px"
      w="100%"
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
        color="#477DFE"
        borderRadius="full"
        border="2px"
        size="lg"
        fontWeight="medium"
        onClick={onLogout}
      >
        Log out
      </Button>
    </Flex>
  );
};

export default Header;
