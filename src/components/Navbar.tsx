import { Box, Flex, Button, Stack, Image, Icon, Text } from '@chakra-ui/react';
import { useColorModeValue, ColorModeButton } from '@/components/ui/color-mode';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useSpotifyData';
import { useState, useEffect } from 'react';
import { NavLink } from '@/components/ui/link';
import { Link as RouterLink } from 'react-router-dom';

interface UserProfile {
  display_name: string;
  images?: Array<{ url: string }>;
}

const MetricMindsLogo = () => {
  // SVG path data
  const pathData =
    'm140.27 75.433a64.835 64.835 0 0 1-64.835 64.835 64.835 64.835 0 0 1-64.835-64.835 64.835 64.835 0 0 1 64.835-64.835 64.835 64.835 0 0 1 64.835 64.835zm-101.57 46.364q0.26766-12.176 0.66906-24.085 0.4014-12.043 0.8028-23.684 0.53523-11.775 1.2043-23.015 0.66906-11.24 1.6057-21.944h5.0847q3.6128 8.5637 7.2256 17.395 3.7466 8.8313 7.2256 18.198 3.479 9.2327 6.6904 19.001 3.3452 9.6341 6.2889 19.937 3.0776-10.303 6.2889-19.937 3.2114-9.7679 6.6903-19.001 3.479-9.3665 7.0918-18.198 3.6128-8.8313 7.2256-17.395h5.0847q0.93666 10.705 1.6057 21.944 0.66906 11.24 1.0704 23.015 0.53522 11.641 0.93667 23.684 0.4014 11.909 0.66907 24.085h-4.5495q-0.26758-14.719-0.8028-29.571-0.4014-14.986-1.0705-29.438-0.53524-14.451-1.3381-27.832-3.0775 7.2256-6.0213 14.585-2.8099 7.2256-5.6199 14.451-2.6761 7.2256-5.2185 14.585-2.5423 7.3594-4.9509 14.719-2.2747 7.2256-4.4156 14.719h-5.3524q-2.1409-7.3594-4.5494-14.719-2.4085-7.3594-4.9509-14.585-2.5423-7.2256-5.3523-14.451-2.6761-7.2256-5.6199-14.451-2.8099-7.3594-5.8875-14.585-0.8029 13.381-1.4719 27.832-0.66906 14.451-1.0705 29.304-0.4014 14.719-0.66902 29.438z';

  // Create a styled component approach for SVG paths using Chakra UI's css prop
  const NormalPath = () => (
    <path
      d={pathData}
      style={{
        mixBlendMode: 'normal',
        paintOrder: 'fill',
      }}
      aria-hidden="true"
    />
  );

  const ColorBurnPath = () => (
    <path
      d={pathData}
      style={{
        mixBlendMode: 'color-burn',
        paintOrder: 'fill',
      }}
      aria-hidden="true"
    />
  );

  return (
    <Icon size="lg" color="none">
      <svg
        width="150.87"
        height="150.87"
        version="1.1"
        viewBox="0 0 150.87 150.87"
        xmlns="http://www.w3.org/2000/svg"
        aria-labelledby="metricMindsLogoTitle"
        role="img"
      >
        <title id="metricMindsLogoTitle">Metric Minds Logo</title>
        <g fill="currentColor">
          <NormalPath />
          <ColorBurnPath />
        </g>
      </svg>
    </Icon>
  );
};

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
        <MetricMindsLogo />
        <Text fontSize="xl" fontWeight="bold" color="spotify.green">
          Metric Minds ChakraUI
        </Text>
      </Stack>
    </RouterLink>
  </Box>
);

const Navbar = () => {
  const { authenticated, logout, login } = useAuth();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('black', 'white');

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);

  const userProfileQuery = useUserProfile();
  const effectiveQuery = authenticated ? userProfileQuery : null;

  useEffect(() => {
    if (authenticated && effectiveQuery) {
      setProfile(effectiveQuery.data as UserProfile);
      setLoading(effectiveQuery.isLoading);
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [authenticated, effectiveQuery]);

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
