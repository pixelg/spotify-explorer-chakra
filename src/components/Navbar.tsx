import { Box, Flex, Button, Stack, Image, Text } from '@chakra-ui/react';
import { useColorModeValue } from '@/components/ui/color-mode';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useSpotifyData';
import { useState, useEffect } from 'react';
import { NavLink } from '@/components/ui/link';
import spotifyLogo from '@/assets/spotify-logo.svg';

interface UserProfile {
  display_name: string;
  images?: Array<{ url: string }>;
}

const Navbar = () => {
  const { authenticated, logout } = useAuth();
  const navigate = useNavigate();
  const bgColor = useColorModeValue('black', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // Fix conditional hook call by using a state variable
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);

  // Fix conditional hook call
  const userProfileQuery = useUserProfile();
  const effectiveQuery = authenticated ? userProfileQuery : null;

  // Update state based on query results
  useEffect(() => {
    if (authenticated && effectiveQuery) {
      setProfile(effectiveQuery.data as UserProfile);
      setLoading(effectiveQuery.isLoading);
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [authenticated, effectiveQuery]);

  // Create a custom RouterLink component for the logo
  const LogoLink = () => (
    <RouterLink to="/" style={{ textDecoration: 'none' }}>
      <Stack direction="row" gap={4}>
        <Image src={spotifyLogo} alt="Spotify Explorer" h="40px" />
        <Text fontSize="xl" fontWeight="bold" color="spotify.green">
          Spotify Explorer
        </Text>
      </Stack>
    </RouterLink>
  );

  return (
    <Box
      as="nav"
      bg={bgColor}
      borderBottom="1px"
      borderColor={borderColor}
      py={3}
      position="sticky"
      top={0}
      zIndex={10}
    >
      <Flex maxW="container.xl" mx="auto" px={4} align="center" justify="space-between">
        <LogoLink />

        <Stack direction="row" gap={4}>
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
                <Stack direction="row" gap={2}>
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
              )}

              <Button onClick={logout} colorScheme="red" variant="outline" size="sm">
                Logout
              </Button>
            </>
          ) : (
            <Button variant="outline" colorScheme="green" onClick={() => navigate('/')}>
              Login with Spotify
            </Button>
          )}
        </Stack>
      </Flex>
    </Box>
  );
};

export default Navbar;
