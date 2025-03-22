import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';

// Componentes personalizados
import Nav from './nav';
import Main from './main';
import Header from './header';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function DashboardLayout({ children }) {
  const [openNav, setOpenNav] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const session = Cookies.get('sesion');
    if (!session) {
      navigate('/');
    }
  }, [navigate]);

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/+573336463507', '_blank');
  };

  const handleWebClick = () => {
    window.open('https://www.jansconsulting.com.co/', '_blank');
  };

  const handleYoutubeClick = () => {
    window.open('https://www.youtube.com/playlist?list=PL9awpmXQqEjlbOkDSg8rxu2cx6-JuSWGO', '_blank');
  };

  return (
    <>
      <Header onOpenNav={() => setOpenNav(true)} />

      <Box
        sx={{
          minHeight: 1,
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
          position: 'relative', // Asegúrate de que el contenedor sea relativo
        }}
      >
        <Nav openNav={openNav} onCloseNav={() => setOpenNav(false)} />

        <Main>{children}</Main>

        {/* Botones flotantes */}
        <Box
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <Fab color="success" onClick={handleWhatsAppClick}>
            <Iconify icon="simple-icons:whatsapp" />
          </Fab>
          <Fab color="error" onClick={handleYoutubeClick}>
            <Iconify icon="simple-icons:youtube" />
          </Fab>
          <Fab color="secondary" onClick={handleWebClick}>
            <Box
              component="img"
              src="/logo_dark.png"
              sx={{ width: 60, height: 60, cursor: 'pointer' }}
            />
          </Fab>
        </Box>
      </Box>
    </>
  );
}

DashboardLayout.propTypes = {
  children: PropTypes.node,
};
