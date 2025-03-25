import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import system from './theme';

// Pages
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import CallbackPage from './pages/CallbackPage';
import DashboardPage from './pages/DashboardPage';
import CurrentlyPlayingPage from './pages/CurrentlyPlayingPage';
import RecentlyPlayedPage from './pages/RecentlyPlayedPage';
import TopItemsPage from './pages/TopItemsPage';
import NotFoundPage from './pages/NotFoundPage';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

// Create router
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'callback',
        element: <CallbackPage />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'currently-playing',
        element: <CurrentlyPlayingPage />,
      },
      {
        path: 'recently-played',
        element: <RecentlyPlayedPage />,
      },
      {
        path: 'top-items',
        element: <TopItemsPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider value={system}>
        <RouterProvider router={router} />
      </ChakraProvider>
    </QueryClientProvider>
  );
}

export default App;
