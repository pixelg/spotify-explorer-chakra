import { Box, Flex, Container } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Layout = () => {
  return (
    <Flex direction="column" minH="100vh">
      <Navbar />
      <Box as="main" flex="1" py={8}>
        <Container maxW="container.xl">
          <Outlet />
        </Container>
      </Box>
      <Footer />
    </Flex>
  );
};

export default Layout;
