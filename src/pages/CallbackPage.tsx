import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box, Center, Spinner, Text, VStack } from '@chakra-ui/react';
import { useAuth } from '@/hooks/useAuth';

const CallbackPage = () => {
  const [searchParams] = useSearchParams();
  const { handleCallback, loading } = useAuth();

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      console.error('Authentication error:', error);
      // Handle error case
    } else if (code) {
      handleCallback(code);
    }
  }, [searchParams, handleCallback]);

  return (
    <Box py={20}>
      <Center>
        <VStack gap={6}>
          <Spinner
            size="xl"
            color="spotify.green"
            css={{
              borderWidth: '4px',
              animationDuration: '0.65s',
            }}
          />
          <Text fontSize="xl">Authenticating with Spotify...</Text>
          {loading && <Text color="gray.500">This may take a moment</Text>}
        </VStack>
      </Center>
    </Box>
  );
};

export default CallbackPage;
