import { Box, Container, Text, Flex, Link, Stack } from '@chakra-ui/react';
import { useColorModeValue } from '@/components/ui/color-mode';

const Footer = () => {
  return (
    <Box
      as="footer"
      py={6}
      bg={useColorModeValue('white', 'gray.800')}
      color={useColorModeValue('gray.400', 'white')}
    >
      <Container maxW="container.xl">
        <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align="center">
          <Text fontSize="sm">
            &copy; {new Date().getFullYear()} Metric Minds ChakraUI. All rights reserved.
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
            <Link
              href="https://github.com/pixelg/spotify-explorer-chakra"
              target="_blank"
              rel="noopener noreferrer"
              fontSize="sm"
            >
              GitHub
            </Link>
          </Stack>
        </Flex>
      </Container>
    </Box>
  );
};

export default Footer;
