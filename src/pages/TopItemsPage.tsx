import { useState } from "react";
import {
    Box,
    Card,
    Center,
    Flex,
    Heading,
    HStack,
    Image,
    SimpleGrid,
    Spinner,
    Tabs,
    Text,
    VStack,
} from "@chakra-ui/react";
import { useTopArtists, useTopTracks } from "@/hooks/useSpotifyData";
import { TimeRange } from "@/types/spotify";
import {
    Bar,
    BarChart,
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    TooltipProps,
    XAxis,
    YAxis,
} from "recharts";

// Time range options for Spotify API
const timeRangeOptions = [
    { value: "short_term", label: "Last 4 Weeks" },
    { value: "medium_term", label: "Last 6 Months" },
    { value: "long_term", label: "All Time" },
];

// Colors for charts
const COLORS = [
    "#1DB954",
    "#1ED760",
    "#2EBD59",
    "#57B660",
    "#7ED957",
    "#A4C639",
    "#B6E388",
    "#ADFF2F",
    "#7CFC00",
    "#32CD32",
    "#00FA9A",
    "#00FF7F",
    "#3CB371",
    "#2E8B57",
    "#228B22",
    "#008000",
    "#006400",
    "#004D40",
    "#00796B",
    "#009688",
];

const TopItemsPage = () => {
    const [timeRange, setTimeRange] = useState<TimeRange>("medium_term");
    const { data: topArtists, isLoading: loadingArtists } = useTopArtists(timeRange);
    const { data: topTracks, isLoading: loadingTracks } = useTopTracks(timeRange);

    // Process genre data from top artists
    const genreData = topArtists?.items.reduce((acc: Record<string, number>, artist) => {
        if (artist.genres) {
            artist.genres.forEach((genre) => {
                acc[genre] = (acc[genre] || 0) + 1;
            });
        }
        return acc;
    }, {});

    // Convert genre data to chart format and sort by count
    const genreChartData = genreData
        ? Object.entries(genreData)
              .map(([name, value]) => ({ name, value }))
              .sort((a, b) => b.value - a.value)
              .slice(0, 20)
        : [];

    // Prepare artist data for chart
    const artistChartData = topArtists?.items.slice(0, 20).map((artist) => ({
        name: artist.name,
        value: artist.popularity || 50,
    }));

    // Prepare track data for chart
    const trackChartData = topTracks?.items.slice(0, 20).map((track) => ({
        name: track.name,
        value: track.popularity,
    }));

    // Define types for the CustomTooltip component
    interface ChartDataPoint {
        name: string;
        value: number;
    }

    type CustomTooltipProps = TooltipProps<number, string> & {
        active?: boolean;
        payload?: Array<{
            name: string;
            value: number;
            payload: ChartDataPoint;
        }>;
    };

    // Custom tooltip for charts
    const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
        if (active && payload && payload.length) {
            return (
                <Box bg="gray.800" p={2} borderRadius="md" boxShadow="md">
                    <Text fontWeight="bold">{payload[0].name}</Text>
                    <Text>Value: {payload[0].value}</Text>
                </Box>
            );
        }
        return null;
    };

    return (
        <Box>
            <Flex justify="space-between" align="center" mb={6}>
                <Heading as="h1" size="xl">
                    Your Top Charts
                </Heading>

                <Box width="200px">
                    <select
                        id="time-range-select"
                        aria-label="Select Time Range"
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value as TimeRange)}
                        style={{
                            width: "100%",
                            padding: "8px 12px",
                            borderRadius: "6px",
                            backgroundColor: "rgba(0, 0, 0, 0.1)",
                            border: "1px solid rgba(255, 255, 255, 0.16)",
                            color: "inherit",
                        }}
                    >
                        {timeRangeOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </Box>
            </Flex>

            <Tabs.Root colorScheme="green" variant="enclosed" defaultValue="artists">
                <Tabs.List>
                    <Tabs.Trigger value="artists">Top Artists</Tabs.Trigger>
                    <Tabs.Trigger value="tracks">Top Tracks</Tabs.Trigger>
                    <Tabs.Trigger value="genres">Top Genres</Tabs.Trigger>
                </Tabs.List>

                <Tabs.Content value="artists">
                    {/* Top Artists Panel */}
                    {loadingArtists ? (
                        <Center py={10}>
                            <Spinner size="xl" color="spotify.green" />
                        </Center>
                    ) : topArtists?.items && topArtists.items.length > 0 ? (
                        <Box>
                            {/* Artists Bar Chart */}
                            <Box height="400px" mb={8}>
                                <Heading size="md" mb={4}>
                                    Top 20 Artists by Popularity
                                </Heading>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={artistChartData}
                                        layout="vertical"
                                        margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                                    >
                                        <XAxis type="number" domain={[0, 100]} />
                                        <YAxis
                                            type="category"
                                            dataKey="name"
                                            tick={{ fill: "white" }}
                                            width={90}
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Bar dataKey="value" fill="#1DB954" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Box>

                            {/* Artists Grid */}
                            <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} gap={6}>
                                {topArtists.items.map((artist, index) => (
                                    <Card.Root key={artist.id} css={{ overflow: "hidden" }}>
                                        <Box position="relative">
                                            <Image
                                                src={
                                                    artist.images?.[0]?.url ||
                                                    "https://via.placeholder.com/300"
                                                }
                                                alt={artist.name}
                                                css={{ aspectRatio: 1, objectFit: "cover" }}
                                            />
                                            <Box
                                                position="absolute"
                                                top={2}
                                                left={2}
                                                bg="blackAlpha.700"
                                                borderRadius="full"
                                                w={8}
                                                h={8}
                                                display="flex"
                                                alignItems="center"
                                                justifyContent="center"
                                            >
                                                <Text fontWeight="bold">{index + 1}</Text>
                                            </Box>
                                        </Box>
                                        <Card.Body>
                                            <Text fontWeight="bold" lineClamp={1}>
                                                {artist.name}
                                            </Text>
                                            {artist.genres && (
                                                <Text fontSize="sm" color="gray.500" lineClamp={1}>
                                                    {artist.genres[0]}
                                                </Text>
                                            )}
                                        </Card.Body>
                                    </Card.Root>
                                ))}
                            </SimpleGrid>
                        </Box>
                    ) : (
                        <Center py={10}>
                            <Text>No top artists data available</Text>
                        </Center>
                    )}
                </Tabs.Content>

                <Tabs.Content value="tracks">
                    {/* Top Tracks Panel */}
                    {loadingTracks ? (
                        <Center py={10}>
                            <Spinner size="xl" color="spotify.green" />
                        </Center>
                    ) : topTracks?.items && topTracks.items.length > 0 ? (
                        <Box>
                            {/* Tracks Bar Chart */}
                            <Box height="400px" mb={8}>
                                <Heading size="md" mb={4}>
                                    Top 20 Tracks by Popularity
                                </Heading>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={trackChartData}
                                        layout="vertical"
                                        margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                                    >
                                        <XAxis type="number" domain={[0, 100]} />
                                        <YAxis
                                            type="category"
                                            dataKey="name"
                                            tick={{ fill: "white" }}
                                            width={90}
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Bar dataKey="value" fill="#1DB954" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Box>

                            {/* Tracks List */}
                            <VStack gap={2} align="stretch">
                                {topTracks.items.map((track, index) => (
                                    <Flex
                                        key={track.id}
                                        align="center"
                                        p={3}
                                        borderRadius="md"
                                        _hover={{ bg: "gray.800" }}
                                    >
                                        <Text fontWeight="bold" w={8}>
                                            {index + 1}
                                        </Text>
                                        <Image
                                            src={track.album.images[0].url}
                                            alt={track.name}
                                            boxSize="50px"
                                            borderRadius="md"
                                            mr={4}
                                        />
                                        <Box flex="1">
                                            <Text fontWeight="medium">{track.name}</Text>
                                            <Text fontSize="sm" color="gray.500">
                                                {track.artists.map((a) => a.name).join(", ")}
                                            </Text>
                                        </Box>
                                        <Text color="gray.500">{track.popularity}/100</Text>
                                    </Flex>
                                ))}
                            </VStack>
                        </Box>
                    ) : (
                        <Center py={10}>
                            <Text>No top tracks data available</Text>
                        </Center>
                    )}
                </Tabs.Content>

                <Tabs.Content value="genres">
                    {/* Top Genres Panel */}
                    {loadingArtists ? (
                        <Center py={10}>
                            <Spinner size="xl" color="spotify.green" />
                        </Center>
                    ) : genreChartData && genreChartData.length > 0 ? (
                        <Box>
                            {/* Genres Pie Chart */}
                            <HStack gap={8} align="flex-start">
                                <Box width="50%" height="400px">
                                    <Heading size="md" mb={4} textAlign="center">
                                        Genre Distribution
                                    </Heading>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={genreChartData.slice(0, 10)}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                outerRadius={150}
                                                fill="#8884d8"
                                                dataKey="value"
                                                label={({ name }) => name}
                                            >
                                                {genreChartData
                                                    .slice(0, 10)
                                                    .map((_entry, index) => (
                                                        <Cell
                                                            key={`cell-${index}`}
                                                            fill={COLORS[index % COLORS.length]}
                                                        />
                                                    ))}
                                            </Pie>
                                            <Tooltip content={<CustomTooltip />} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </Box>

                                {/* Genres List */}
                                <Box width="50%">
                                    <Heading size="md" mb={4}>
                                        Top 20 Genres
                                    </Heading>
                                    <VStack gap={2} align="stretch">
                                        {genreChartData.map((genre, index) => (
                                            <Flex
                                                key={genre.name}
                                                justify="space-between"
                                                p={2}
                                                borderRadius="md"
                                                _hover={{ bg: "gray.800" }}
                                            >
                                                <HStack>
                                                    <Text fontWeight="bold" w={8}>
                                                        {index + 1}
                                                    </Text>
                                                    <Box
                                                        w={3}
                                                        h={3}
                                                        borderRadius="full"
                                                        bg={COLORS[index % COLORS.length]}
                                                        mr={2}
                                                    />
                                                    <Text>{genre.name}</Text>
                                                </HStack>
                                                <Text>
                                                    {genre.value}{" "}
                                                    {genre.value === 1 ? "artist" : "artists"}
                                                </Text>
                                            </Flex>
                                        ))}
                                    </VStack>
                                </Box>
                            </HStack>
                        </Box>
                    ) : (
                        <Center py={10}>
                            <Text>No genre data available</Text>
                        </Center>
                    )}
                </Tabs.Content>
            </Tabs.Root>
        </Box>
    );
};

export default TopItemsPage;
