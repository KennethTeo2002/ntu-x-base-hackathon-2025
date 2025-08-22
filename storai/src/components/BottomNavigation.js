import { Flex, IconButton } from "@chakra-ui/react";
import { FaRobot } from "react-icons/fa";
import { FaBookOpen } from "react-icons/fa6";
import { IoIosRocket } from "react-icons/io";

const BottomNavigation = ({ 
  activeTab = "home", 
  onRobotClick, 
  onHomeClick, 
  onLibraryClick 
}) => {
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
        color={activeTab === "prompt" ? "#477DFE" : "gray.400"}
        fontSize="3xl"
        onClick={onRobotClick}
      >
        <FaRobot />
      </IconButton>

      <IconButton 
        variant="link" 
        color={activeTab === "home" ? "#477DFE" : "gray.400"}
        fontSize="3xl"
        onClick={onHomeClick}
      >
        <IoIosRocket />
      </IconButton>

      <IconButton 
        variant="link" 
        color={activeTab === "library" ? "#477DFE" : "gray.400"}
        fontSize="3xl"
        onClick={onLibraryClick}
      >
        <FaBookOpen />
      </IconButton>
    </Flex>
  );
};

export default BottomNavigation;