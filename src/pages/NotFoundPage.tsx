import { Heading, Text, Button, VStack, Center } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <Center py={20}>
      <VStack gap={6} textAlign="center">
        <Heading as="h1" size="4xl">
          404
        </Heading>
        <Heading as="h2" size="xl">
          Page Not Found
        </Heading>
        <Text fontSize="lg" color="gray.500">
          The page you're looking for doesn't exist or has been moved.
        </Text>
        <RouterLink to="/" style={{ textDecoration: 'none' }}>
          <Button colorScheme="green" size="lg" mt={4}>
            Return to Home
          </Button>
        </RouterLink>
      </VStack>
    </Center>
  );
};

export default NotFoundPage;
