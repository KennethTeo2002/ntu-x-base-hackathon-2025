import { useState } from "react";
import {
  Box,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Text,
  VStack,
  Button,
} from "@chakra-ui/react";

import { FaArrowRight } from "react-icons/fa6";

export const Login = () => {
  const [selectedRole, setSelectedRole] = useState(null);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bg="#477DFE"
      p={4}
    >
      <Card
        maxW="2xl"
        h="60vh"
        width="100%"
        boxShadow="xl"
        borderRadius="35px"
        overflow="hidden"
        p="8vh"
        justifyContent="center"
        alignItems="center"
      >
        <CardHeader color="#477DFE" textAlign="center">
          <Heading size="2xl">Login</Heading>
        </CardHeader>

        <CardBody justifyContent="center" alignContent="center">
          <VStack spacing={8} align="stretch">
            <Text
              fontSize="lg"
              fontWeight="medium"
              textAlign="center"
              color="gray.700"
            >
              Are you a teacher or a student?
            </Text>

            <VStack spacing={4}>
              <Button
                width="120%"
                size="lg"
                variant="subtle"
                bg={selectedRole === "teacher" ? "#477DFE" : "white"}
                borderRadius="full"
                border="2px"
                borderColor="#477DFE"
                onClick={() => handleRoleSelect("teacher")}
              >
                <Text color={selectedRole === "teacher" ? "white" : "#477DFE"}>
                  I am a Teacher
                </Text>
              </Button>

              <Button
                width="120%"
                size="lg"
                variant="subtle"
                bg={selectedRole === "student" ? "#477DFE" : "white"}
                borderRadius="full"
                border="2px"
                borderColor="#477DFE"
                onClick={() => handleRoleSelect("student")}
              >
                <Text color={selectedRole === "student" ? "white" : "#477DFE"}>
                  I am a Student
                </Text>
              </Button>
            </VStack>

            <Button
              as="a"
              href="/dashboard"
              bg="#477DFE"
              size="lg"
              isDisabled={!selectedRole}
              mt={4}
              gap={2}
              color="white"
              width="120%"
              alignSelf="center"
            >
              Continue
              <FaArrowRight />
            </Button>
          </VStack>
        </CardBody>
      </Card>
    </Box>
  );
};

export default Login;
