import {
  Box,
  SimpleGrid,
  Heading,
  Text,
  Card,
  Flex,
  Spinner,
  Center,
  VStack,
  Image,
} from '@chakra-ui/react';
import {
  useCurrentlyPlaying,
  useRecentlyPlayed,
  useTopArtists,
  useTopTracks,
} from '@/hooks/useSpotifyData';
import { NavLink } from '@/components/ui/link';

const DashboardPage = () => {
  const { data: currentlyPlaying, isLoading: loadingCurrent } = useCurrentlyPlaying();
  const { data: recentlyPlayed, isLoading: loadingRecent } = useRecentlyPlayed(5);
  const { data: topArtists, isLoading: loadingArtists } = useTopArtists('short_term', 5);
  const { data: topTracks, isLoading: loadingTracks } = useTopTracks('short_term', 5);

  return (
    <Box>
      <Heading as="h1" size="xl" mb={6}>
        Dashboard
      </Heading>

      <SimpleGrid columns={{ base: 1, md: 2 }} gap={6} mb={8}>
        {/* Currently Playing */}
        <Card.Root>
          <Card.Header>
            <Heading size="md">Currently Playing</Heading>
          </Card.Header>
          <Card.Body>
            {loadingCurrent ? (
              <Center py={6}>
                <Spinner color="spotify.green" css={{ borderWidth: '2px' }} />
              </Center>
            ) : currentlyPlaying?.item ? (
              <Flex align="center">
                <Image
                  src={currentlyPlaying.item.album.images[0].url}
                  alt={currentlyPlaying.item.name}
                  css={{ width: '80px', height: '80px' }}
                  mr={4}
                  borderRadius="md"
                />
                <Box>
                  <Text fontWeight="bold">{currentlyPlaying.item.name}</Text>
                  <Text color="gray.500">
                    {currentlyPlaying.item.artists.map(a => a.name).join(', ')}
                  </Text>
                  <Text fontSize="sm" color="gray.400">
                    {currentlyPlaying.item.album.name}
                  </Text>
                </Box>
              </Flex>
            ) : (
              <Text>No track currently playing</Text>
            )}
            <NavLink to="/currently-playing" size="sm" mt={4} colorScheme="blue" variant="outline">
              View Details
            </NavLink>
          </Card.Body>
        </Card.Root>

        {/* Recently Played */}
        <Card.Root>
          <Card.Header>
            <Heading size="md">Recently Played</Heading>
          </Card.Header>
          <Card.Body>
            {loadingRecent ? (
              <Center py={6}>
                <Spinner color="spotify.green" css={{ borderWidth: '2px' }} />
              </Center>
            ) : recentlyPlayed?.items && recentlyPlayed.items.length > 0 ? (
              <VStack align="stretch" gap={2}>
                {recentlyPlayed.items.slice(0, 3).map(item => (
                  <Flex key={item.played_at} align="center">
                    <Image
                      src={item.track.album.images[0].url}
                      alt={item.track.name}
                      css={{ width: '40px', height: '40px' }}
                      mr={3}
                      borderRadius="md"
                    />
                    <Box>
                      <Text fontWeight="medium" fontSize="sm">
                        {item.track.name}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        {item.track.artists.map(a => a.name).join(', ')}
                      </Text>
                    </Box>
                  </Flex>
                ))}
              </VStack>
            ) : (
              <Text>No recently played tracks</Text>
            )}
            <NavLink to="/recently-played" size="sm" mt={4} colorScheme="blue" variant="outline">
              View All
            </NavLink>
          </Card.Body>
        </Card.Root>
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
        {/* Top Artists */}
        <Card.Root>
          <Card.Header>
            <Heading size="md">Top Artists</Heading>
          </Card.Header>
          <Card.Body>
            {loadingArtists ? (
              <Center py={6}>
                <Spinner color="spotify.green" css={{ borderWidth: '2px' }} />
              </Center>
            ) : topArtists?.items && topArtists.items.length > 0 ? (
              <VStack align="stretch" gap={2}>
                {topArtists.items.slice(0, 3).map(artist => (
                  <Flex key={artist.id} align="center">
                    <Image
                      src={artist.images?.[0]?.url || 'https://via.placeholder.com/40'}
                      alt={artist.name}
                      css={{ width: '40px', height: '40px' }}
                      mr={3}
                      borderRadius="full"
                    />
                    <Box>
                      <Text fontWeight="medium" fontSize="sm">
                        {artist.name}
                      </Text>
                      {artist.genres && (
                        <Text fontSize="xs" color="gray.500">
                          {artist.genres.slice(0, 2).join(', ')}
                        </Text>
                      )}
                    </Box>
                  </Flex>
                ))}
              </VStack>
            ) : (
              <Text>No top artists data available</Text>
            )}
            <NavLink to="/top-items" size="sm" mt={4} colorScheme="blue" variant="outline">
              View All
            </NavLink>
          </Card.Body>
        </Card.Root>

        {/* Top Tracks */}
        <Card.Root>
          <Card.Header>
            <Heading size="md">Top Tracks</Heading>
          </Card.Header>
          <Card.Body>
            {loadingTracks ? (
              <Center py={6}>
                <Spinner color="spotify.green" css={{ borderWidth: '2px' }} />
              </Center>
            ) : topTracks?.items && topTracks.items.length > 0 ? (
              <VStack align="stretch" gap={2}>
                {topTracks.items.slice(0, 3).map(track => (
                  <Flex key={track.id} align="center">
                    <Image
                      src={track.album.images[0].url}
                      alt={track.name}
                      css={{ width: '40px', height: '40px' }}
                      mr={3}
                      borderRadius="md"
                    />
                    <Box>
                      <Text fontWeight="medium" fontSize="sm">
                        {track.name}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        {track.artists.map(a => a.name).join(', ')}
                      </Text>
                    </Box>
                  </Flex>
                ))}
              </VStack>
            ) : (
              <Text>No top tracks data available</Text>
            )}
            <NavLink to="/top-items" size="sm" mt={4} colorScheme="blue" variant="outline">
              View All
            </NavLink>
          </Card.Body>
        </Card.Root>
      </SimpleGrid>
    </Box>
  );
};

export default DashboardPage;
