import { Box, Button, Container, Heading, Text, VStack, Image, Flex } from '@chakra-ui/react';
import { useAuth } from '@/hooks/useAuth';
import { useColorModeValue } from '@/components/ui/color-mode';
import { NavLink } from '@/components/ui/link';

const HomePage = () => {
  const { authenticated, login } = useAuth();
  const bgGradient = useColorModeValue(
    'linear(to-b, gray.100, white)',
    'linear(to-b, gray.900, gray.800)'
  );

  return (
    <Box as="section" py={20} bgGradient={bgGradient}>
      <Container maxW="container.xl">
        <Flex direction={{ base: 'column', lg: 'row' }} align="center" justify="space-between">
          <VStack align="flex-start" gap={6} maxW="600px" mb={{ base: 12, lg: 0 }}>
            <Heading as="h1" size="2xl" fontWeight="bold" lineHeight="shorter">
              Explore Your Spotify Universe
            </Heading>
            <Text fontSize="xl" color="gray.500">
              View your currently playing tracks, browse your listening history, create playlists
              from your recently played songs, and discover your top artists and tracks.
            </Text>

            {!authenticated ? (
              <Button
                onClick={login}
                size="lg"
                variant="solid"
                css={{
                  px: 8,
                  fontSize: 'md',
                  fontWeight: 'bold',
                  bg: 'spotify.green',
                  color: 'white',
                  _hover: {
                    bg: 'green.400',
                  },
                }}
              >
                Connect with Spotify
              </Button>
            ) : (
              <NavLink
                to="/dashboard"
                size="lg"
                variant="solid"
                css={{
                  px: 8,
                  fontSize: 'md',
                  fontWeight: 'bold',
                  bg: 'spotify.green',
                  color: 'white',
                  _hover: {
                    bg: 'green.400',
                  },
                }}
              >
                Go to Dashboard
              </NavLink>
            )}

            <Text fontSize="sm" color="gray.500" mt={4}>
              Powered by the Spotify Web API. You'll need a Spotify account to use this application.
            </Text>
          </VStack>

          <Box
            css={{
              width: { base: '300px', md: '400px', lg: '500px' },
              height: { base: '300px', md: '400px', lg: '500px' },
            }}
            position="relative"
          >
            <Image
              src="/hero-image.png"
              alt="Spotify Explorer"
              css={{
                borderRadius: 'xl',
                boxShadow: '2xl',
              }}
            />
          </Box>
        </Flex>
      </Container>
    </Box>
  );
};

export default HomePage;
