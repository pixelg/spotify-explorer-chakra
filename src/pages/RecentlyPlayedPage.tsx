import { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Button,
  Flex,
  Spinner,
  Center,
  Input,
  Textarea,
  VStack,
  Image,
  Stack,
  Table,
} from '@chakra-ui/react';
import { toaster } from '@/components/ui/toaster';
import { useRecentlyPlayed, useUserProfile } from '@/hooks/useSpotifyData';
import { useAuth } from '@/hooks/useAuth';
import { createPlaylist, addTracksToPlaylist } from '@/services/spotifyApi';
import { SpotifyTrack, SpotifyUser } from '@/types/spotify';

const RecentlyPlayedPage = () => {
  const { authenticated } = useAuth();
  const { data: recentlyPlayed, isLoading } = useRecentlyPlayed(50);
  const { data: userProfile } = useUserProfile(authenticated) as { data: SpotifyUser | undefined };
  const [selectedTracks, setSelectedTracks] = useState<SpotifyTrack[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [playlistName, setPlaylistName] = useState('');
  const [playlistDescription, setPlaylistDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Handle track selection
  const handleTrackSelection = (track: SpotifyTrack, isChecked: boolean) => {
    if (isChecked) {
      setSelectedTracks([...selectedTracks, track]);
    } else {
      setSelectedTracks(selectedTracks.filter(t => t.id !== track.id));
    }
  };

  // Handle select all tracks
  const handleSelectAll = () => {
    if (recentlyPlayed?.items) {
      if (selectedTracks.length === recentlyPlayed.items.length) {
        setSelectedTracks([]);
      } else {
        setSelectedTracks(recentlyPlayed.items.map(item => item.track));
      }
    }
  };

  // Create new playlist
  const handleCreatePlaylist = async () => {
    if (!userProfile?.id || selectedTracks.length === 0) {
      toaster.error({
        title: 'Error',
        description: 'Unable to create playlist. Please select tracks and try again.',
      });
      return;
    }

    setIsCreating(true);
    try {
      // Create the playlist
      const playlist = await createPlaylist(
        userProfile.id,
        playlistName || 'My Recently Played Tracks',
        playlistDescription || 'Created with Spotify Explorer',
        isPublic
      );

      // Add tracks to the playlist
      await addTracksToPlaylist(
        playlist.id,
        selectedTracks.map(track => track.uri)
      );

      // Success message
      toaster.success({
        title: 'Success!',
        description: `Playlist "${playlist.name}" created with ${selectedTracks.length} tracks.`,
      });

      // Reset form
      setSelectedTracks([]);
      setPlaylistName('');
      setPlaylistDescription('');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error creating playlist:', error);
      toaster.error({
        title: 'Error',
        description: 'Failed to create playlist. Please try again.',
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Box>
      <Flex justify="space-between" align="center" style={{ marginBottom: '24px' }}>
        <Heading as="h1" size="xl">
          Recently Played
        </Heading>

        <Button
          style={{
            backgroundColor: 'spotify.green',
            color: 'white',
            cursor: 'pointer',
          }}
          disabled={selectedTracks.length === 0}
          onClick={() => setIsModalOpen(true)}
        >
          Create Playlist ({selectedTracks.length})
        </Button>
      </Flex>

      {isLoading ? (
        <Center style={{ paddingTop: '40px', paddingBottom: '40px' }}>
          <Spinner style={{ color: 'spotify.green' }} size="xl" />
        </Center>
      ) : recentlyPlayed?.items && recentlyPlayed.items.length > 0 ? (
        <Box style={{ overflowX: 'auto' }}>
          <Table.Root variant="outline">
            <Table.Header>
              <Table.Row>
                <Table.Cell style={{ width: '50px' }}>
                  <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <input
                      type="checkbox"
                      checked={
                        recentlyPlayed.items.length > 0 &&
                        selectedTracks.length === recentlyPlayed.items.length
                      }
                      onChange={handleSelectAll}
                      style={{
                        width: '18px',
                        height: '18px',
                        cursor: 'pointer',
                        accentColor: '#1DB954',
                      }}
                      aria-label="Select all tracks"
                    />
                  </Box>
                </Table.Cell>
                <Table.Cell style={{ width: '60px' }}></Table.Cell>
                <Table.Cell>Track</Table.Cell>
                <Table.Cell>Artist</Table.Cell>
                <Table.Cell>Album</Table.Cell>
                <Table.Cell>Played At</Table.Cell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {recentlyPlayed.items.map(item => (
                <Table.Row key={item.played_at} style={{ cursor: 'pointer' }}>
                  <Table.Cell>
                    <Box
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedTracks.some(track => track.id === item.track.id)}
                        onChange={e => handleTrackSelection(item.track, e.target.checked)}
                        style={{
                          width: '18px',
                          height: '18px',
                          cursor: 'pointer',
                          accentColor: '#1DB954',
                        }}
                        aria-label={`Select ${item.track.name}`}
                      />
                    </Box>
                  </Table.Cell>
                  <Table.Cell>
                    <Image
                      src={item.track.album.images[0].url}
                      alt={item.track.name}
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: 'md',
                      }}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <Text style={{ fontWeight: 'medium' }}>{item.track.name}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text style={{ color: 'gray.400' }}>
                      {item.track.artists.map(a => a.name).join(', ')}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text style={{ color: 'gray.400' }}>{item.track.album.name}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text style={{ fontSize: 'sm', color: 'gray.500' }}>
                      {formatDate(item.played_at)}
                    </Text>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>
      ) : (
        <Center style={{ paddingTop: '40px', paddingBottom: '40px' }}>
          <Text>No recently played tracks found</Text>
        </Center>
      )}

      {/* Create Playlist Modal */}
      {isModalOpen && (
        <Box
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => setIsModalOpen(false)}
        >
          <Box
            style={{
              backgroundColor: 'gray.800',
              borderRadius: 'md',
              width: '90%',
              maxWidth: '500px',
              padding: '24px',
              position: 'relative',
            }}
            onClick={e => e.stopPropagation()}
          >
            <Heading size="md" style={{ marginBottom: '16px' }}>
              Create New Playlist
            </Heading>
            <Button
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
              }}
              size="sm"
              variant="ghost"
              onClick={() => setIsModalOpen(false)}
            >
              ✕
            </Button>

            <VStack gap={4}>
              <Box style={{ width: '100%' }}>
                <Text fontWeight="medium" style={{ marginBottom: '8px' }}>
                  Playlist Name{' '}
                  <Text as="span" color="red.500">
                    *
                  </Text>
                </Text>
                <Input
                  id="playlist-name"
                  placeholder="My Playlist"
                  value={playlistName}
                  onChange={e => setPlaylistName(e.target.value)}
                  required
                />
              </Box>

              <Box style={{ width: '100%' }}>
                <Text fontWeight="medium" style={{ marginBottom: '8px' }}>
                  Description
                </Text>
                <Textarea
                  id="playlist-description"
                  placeholder="Add a description for your playlist"
                  value={playlistDescription}
                  onChange={e => setPlaylistDescription(e.target.value)}
                />
              </Box>

              <Flex style={{ width: '100%', alignItems: 'center' }}>
                <Flex align="center">
                  <Text fontWeight="medium" style={{ marginBottom: 0, marginRight: '12px' }}>
                    Make playlist public?
                  </Text>
                  <Box style={{ marginRight: '12px' }}>
                    <label htmlFor="is-public" style={{ display: 'flex', alignItems: 'center' }}>
                      <input
                        type="checkbox"
                        id="is-public"
                        checked={isPublic}
                        onChange={() => setIsPublic(!isPublic)}
                        style={{
                          width: '18px',
                          height: '18px',
                          cursor: 'pointer',
                          accentColor: '#1DB954',
                          marginRight: '8px',
                        }}
                      />
                      <Text>{isPublic ? 'Public' : 'Private'}</Text>
                    </label>
                  </Box>
                </Flex>
              </Flex>

              <Box style={{ width: '100%' }}>
                <Text style={{ fontWeight: 'medium' }}>
                  Selected Tracks: {selectedTracks.length}
                </Text>
              </Box>
            </VStack>

            <Stack direction="row" style={{ marginTop: '24px', justifyContent: 'flex-end' }}>
              <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button
                style={{
                  backgroundColor: 'spotify.green',
                  color: 'white',
                  cursor: 'pointer',
                }}
                onClick={handleCreatePlaylist}
                disabled={isCreating}
              >
                {isCreating ? 'Creating...' : 'Create Playlist'}
              </Button>
            </Stack>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default RecentlyPlayedPage;
