import { Box, Flex, Button, Stack, Image, Text } from '@chakra-ui/react';
import { useColorModeValue, ColorModeButton } from '@/components/ui/color-mode';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useSpotifyData';
import type { SpotifyUser } from '@/types/spotify';
import { NavLink } from '@/components/ui/link';
import { Link as RouterLink } from 'react-router-dom';
import MetricMindsLogo from '@/assets/metric-minds-logo.svg';

const LogoLink = () => (
  <Box display="flex" alignItems="center">
    <RouterLink to="/">
      <Stack direction="row" gap={4} alignItems="center">
        <Image
          width={40}
          height={8}
          src={useColorModeValue('/spotify-logo-light.svg', '/spotify-logo-dark.svg')}
          alt="Spotify Logo"
        />
        <Box width="1px" height="30px" bg="gray.300" />
        <Image src={MetricMindsLogo} width={10} height={10} alt="Metric Minds Logo" />
        <Text fontSize="xl" fontWeight="bold" color="spotify.green">
          Metric Minds [ChakraUI]
        </Text>
      </Stack>
    </RouterLink>
  </Box>
);

const Navbar = () => {
  const { authenticated, logout, login } = useAuth();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('black', 'white');

  const { data: profile, isLoading: loading } = useUserProfile(authenticated) as {
    data: SpotifyUser | undefined;
    isLoading: boolean;
  };

  return (
    <Box
      as="nav"
      bg={bgColor}
      color={useColorModeValue('gray.400', 'white')}
      borderBottom="1px"
      borderColor={borderColor}
      py={3}
      position="sticky"
      top={0}
      zIndex={10}
    >
      <Flex maxW="container.xl" mx="auto" px={4} align="center" justify="space-between">
        <LogoLink />

        <Stack direction="row" gap={4} align="center">
          {authenticated ? (
            <>
              <NavLink to="/dashboard" variant="ghost">
                Dashboard
              </NavLink>
              <NavLink to="/currently-playing" variant="ghost">
                Now Playing
              </NavLink>
              <NavLink to="/recently-played" variant="ghost">
                History
              </NavLink>
              <NavLink to="/top-items" variant="ghost">
                Top Charts
              </NavLink>

              {!loading && profile && (
                <>
                  <Box width="1px" height="30px" bg="gray.300" />
                  <Stack direction="row" gap={2} justifyContent="center" alignItems="center">
                    <Text fontSize="sm">{profile.display_name}</Text>
                    {profile.images && profile.images.length > 0 && (
                      <Image
                        src={profile.images[0].url}
                        alt={profile.display_name}
                        borderRadius="full"
                        boxSize="30px"
                      />
                    )}
                  </Stack>
                </>
              )}

              <Button onClick={logout} colorScheme="red" variant="outline" size="sm">
                Logout
              </Button>
              <ColorModeButton />
            </>
          ) : (
            <>
              <Button variant="outline" colorScheme="green" onClick={login}>
                Login with Spotify
              </Button>
              <ColorModeButton />
            </>
          )}
        </Stack>
      </Flex>
    </Box>
  );
};

export default Navbar;
