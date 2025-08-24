import { Text, Flex, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import "@fontsource/poppins";

const Header = ({ onLogout }) => {
  const navigate = useNavigate();
  return (
    <Flex
      dir="row"
      align="center"
      justify="space-between"
      px="10vw"
      py="20px"
      w="100%"
    >
      <Text
        fontFamily="Poppins"
        fontWeight="medium"
        fontSize="50"
        color="black"
        cursor="pointer"
        onClick={() => navigate("/")}
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
