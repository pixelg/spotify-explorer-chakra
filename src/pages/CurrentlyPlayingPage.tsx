import {
    Badge,
    Box,
    Card,
    Center,
    Flex,
    Heading,
    Image,
    Progress,
    SimpleGrid,
    Spinner,
    Text,
    VStack,
} from "@chakra-ui/react";
import { useCurrentlyPlaying, useQueue } from "@/hooks/useSpotifyData";
import { useEffect, useState } from "react";

// Helper function to format milliseconds to mm:ss
const formatDuration = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const CurrentlyPlayingPage = () => {
    const { data: currentlyPlaying, isLoading: loadingCurrent, refetch } = useCurrentlyPlaying();
    const { data: queue, isLoading: loadingQueue } = useQueue();
    const [progress, setProgress] = useState<number>(0);

    // Update progress bar based on currently playing track
    useEffect(() => {
        if (
            currentlyPlaying?.is_playing &&
            currentlyPlaying?.progress_ms &&
            currentlyPlaying?.item
        ) {
            // Set initial progress
            setProgress(currentlyPlaying.progress_ms);

            // Update progress every second
            const interval = setInterval(() => {
                setProgress((prev) => {
                    const newProgress = prev + 1000;
                    // If we've reached the end of the track, refetch data
                    if (newProgress >= currentlyPlaying.item.duration_ms) {
                        refetch();
                        return 0;
                    }
                    return newProgress;
                });
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [currentlyPlaying, refetch]);

    return (
        <Box>
            <Heading as="h1" size="xl" mb={6}>
                Now Playing
            </Heading>

            {/* Currently Playing Section */}
            <Box mb={10}>
                {loadingCurrent ? (
                    <Center py={10}>
                        <Spinner size="xl" color="spotify.green" />
                    </Center>
                ) : currentlyPlaying?.item ? (
                    <Flex
                        direction={{ base: "column", md: "row" }}
                        align={{ base: "center", md: "flex-start" }}
                    >
                        {/* Album Cover */}
                        <Box
                            minW={{ base: "250px", md: "300px" }}
                            maxW={{ base: "250px", md: "300px" }}
                            mb={{ base: 6, md: 0 }}
                            mr={{ base: 0, md: 8 }}
                        >
                            <Image
                                src={currentlyPlaying.item.album.images[0].url}
                                alt={currentlyPlaying.item.name}
                                borderRadius="md"
                                boxShadow="2xl"
                                w="100%"
                            />
                        </Box>

                        {/* Track Details */}
                        <VStack align="flex-start" gap={4} flex="1">
                            <Box>
                                <Heading size="lg">{currentlyPlaying.item.name}</Heading>
                                <Text fontSize="xl" color="gray.400">
                                    {currentlyPlaying.item.artists.map((a) => a.name).join(", ")}
                                </Text>
                                <Text color="gray.500" mt={1}>
                                    {currentlyPlaying.item.album.name} •{" "}
                                    {new Date(
                                        currentlyPlaying.item.album.release_date,
                                    ).getFullYear()}
                                </Text>
                            </Box>

                            {/* Progress Bar */}
                            <Box w="100%" mt={4}>
                                <Progress.Root
                                    value={(progress / currentlyPlaying.item.duration_ms) * 100}
                                    colorScheme="green"
                                    size="sm"
                                    borderRadius="full"
                                    mb={2}
                                />
                                <Flex justify="space-between" w="100%">
                                    <Text fontSize="sm" color="gray.500">
                                        {formatDuration(progress)}
                                    </Text>
                                    <Text fontSize="sm" color="gray.500">
                                        {formatDuration(currentlyPlaying.item.duration_ms)}
                                    </Text>
                                </Flex>
                            </Box>

                            {/* Additional Track Info */}
                            <SimpleGrid columns={{ base: 1, sm: 2 }} gap={4} w="100%" mt={4}>
                                <Card.Root variant="outline" size="sm">
                                    <Card.Body css={{ p: 3 }}>
                                        <Text fontWeight="bold" fontSize="sm">
                                            Popularity
                                        </Text>
                                        <Text>{currentlyPlaying.item.popularity}/100</Text>
                                    </Card.Body>
                                </Card.Root>
                                <Card.Root variant="outline" size="sm">
                                    <Card.Body css={{ p: 3 }}>
                                        <Text fontWeight="bold" fontSize="sm">
                                            Track URI
                                        </Text>
                                        <Text
                                            fontSize="xs"
                                            css={{
                                                textOverflow: "ellipsis",
                                                overflow: "hidden",
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            {currentlyPlaying.item.uri}
                                        </Text>
                                    </Card.Body>
                                </Card.Root>
                            </SimpleGrid>

                            {/* Playback Status */}
                            <Badge
                                colorScheme={currentlyPlaying.is_playing ? "green" : "gray"}
                                mt={2}
                            >
                                {currentlyPlaying.is_playing ? "Playing" : "Paused"}
                            </Badge>
                        </VStack>
                    </Flex>
                ) : (
                    <Center py={10}>
                        <VStack>
                            <Text fontSize="xl">No track currently playing</Text>
                            <Text color="gray.500">
                                Start playing a track on Spotify to see details here
                            </Text>
                        </VStack>
                    </Center>
                )}
            </Box>

            {/* Queue Section */}
            <Box mt={8}>
                <Heading as="h2" size="lg" mb={4}>
                    Up Next in Queue
                </Heading>
                <Box as="hr" borderColor="gray.600" mb={6} />

                {loadingQueue ? (
                    <Center py={6}>
                        <Spinner color="spotify.green" />
                    </Center>
                ) : queue?.queue && queue.queue.length > 0 ? (
                    <VStack gap={4} align="stretch">
                        {queue.queue.slice(0, 5).map((track, index) => (
                            <Flex
                                key={`${track.id}-${index}`}
                                align="center"
                                p={2}
                                borderRadius="md"
                                _hover={{ bg: "gray.800" }}
                            >
                                <Text color="gray.500" fontSize="sm" w="24px" textAlign="center">
                                    {index + 1}
                                </Text>
                                <Image
                                    src={track.album.images[0].url}
                                    alt={track.name}
                                    css={{ width: "50px", height: "50px" }}
                                    mx={3}
                                    borderRadius="md"
                                />
                                <Box flex="1">
                                    <Text fontWeight="medium">{track.name}</Text>
                                    <Text fontSize="sm" color="gray.500">
                                        {track.artists.map((a) => a.name).join(", ")}
                                    </Text>
                                </Box>
                                <Text color="gray.500" fontSize="sm">
                                    {formatDuration(track.duration_ms)}
                                </Text>
                            </Flex>
                        ))}
                    </VStack>
                ) : (
                    <Text color="gray.500">No tracks in queue</Text>
                )}
            </Box>
        </Box>
    );
};

export default CurrentlyPlayingPage;
