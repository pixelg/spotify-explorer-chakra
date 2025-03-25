import { Box, Container, Text, Flex, Link, Stack } from '@chakra-ui/react';

const Footer = () => {
  return (
    <Box as="footer" py={6} bg="gray.900" color="gray.400">
      <Container maxW="container.xl">
        <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align="center">
          <Text fontSize="sm">
            &copy; {new Date().getFullYear()} Spotify Explorer. All rights reserved.
          </Text>
          <Stack direction="row" gap={4} mt={{ base: 4, md: 0 }}>
            <Link
              href="https://developer.spotify.com/documentation/web-api/"
              target="_blank"
              rel="noopener noreferrer"
              fontSize="sm"
            >
              Spotify API
            </Link>
            <Link href="https://github.com" target="_blank" rel="noopener noreferrer" fontSize="sm">
              GitHub
            </Link>
            <Text fontSize="xs">Not affiliated with Spotify AB</Text>
          </Stack>
        </Flex>
      </Container>
    </Box>
  );
};

export default Footer;
