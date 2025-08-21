import { Text, Flex, Button } from "@chakra-ui/react";
import "@fontsource/poppins";

const Header = ({ onLogout }) => {
  return (
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

