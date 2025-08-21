import { Flex, IconButton, useNavigate } from "@chakra-ui/react";

// Icons
import { IoIosRocket } from "react-icons/io";
import { FaRobot } from "react-icons/fa";
import { FaBookOpen } from "react-icons/fa6";

function NavigationBar() {
  const navigate = useNavigate();

  const handleRobotClick = () => {
    navigate("/prompt");
  };

  const handleLibraryClick = () => {
    navigate("/library");
  };
  return (
    <Flex
      position="fixed"
      bottom="0px"
      height="8vh"
      width="100vw"
      shadow="inner"
      align="center"
      justify="space-between"
      direction="row"
      paddingX="8vh"
      bg="white"
    >
      <IconButton
        variant="link"
        color="black"
        fontSize="3xl"
        onClick={handleRobotClick}
      >
        <FaRobot />
      </IconButton>

      <IconButton variant="link" color="black" fontSize="3xl">
        <IoIosRocket />
      </IconButton>

      <IconButton
        variant="link"
        color="black"
        fontSize="3xl"
        onClick={handleLibraryClick}
      >
        <FaBookOpen />
      </IconButton>
    </Flex>
  );
}

export default NavigationBar;
