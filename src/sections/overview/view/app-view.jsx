import { faker } from '@faker-js/faker';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import AppNewsUpdate from '../app-news-update';
import AppWidgetSummary from '../app-widget-summary';
import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { instanceWithToken } from 'src/utils/instance';
import Cookies from 'js-cookie';

// ----------------------------------------------------------------------

export default function AppView() {
  const [estadisticas, setEstadisticas] = useState({
    empresas: 0,
    usuarios: 0,
    lotes: 0,
    documentos: 0,
  });

  const [comunicados, setComunicados] = useState([]);

  const getEstadisticas = () => {
    instanceWithToken.get('company/stadistics/home').then((result) => {
      setEstadisticas(result.data.data);
    });
  };

  const getComunicados = () => {
    instanceWithToken.get('user/comunicados/todos').then((result) => {
      setComunicados(result.data.data);
    });
  };

  useEffect(() => {
    getEstadisticas();
    getComunicados();
  }, []);
  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}>
        Hola, bienvenido de nuevo 👋
      </Typography>

      <Grid container spacing={3}>
        {Cookies.get('role') == 'SADMIN' && (
          <Grid xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Empresas"
              total={estadisticas.empresas}
              color="success"
              icon={
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="100%"
                    height="100%"
                    viewBox="0 0 24 24"
                  >
                    <defs>
                      <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#a8e6cf', stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: '#56ab2f', stopOpacity: 1 }} />
                      </linearGradient>
                    </defs>
                    <path
                      fill="url(#greenGradient)"
                      d="M18 15h-2v2h2m0-6h-2v2h2m2 6h-8v-2h2v-2h-2v-2h2v-2h-2V9h8M10 7H8V5h2m0 6H8V9h2m0 6H8v-2h2m0 6H8v-2h2M6 7H4V5h2m0 6H4V9h2m0 6H4v-2h2m0 6H4v-2h2m6-10V3H2v18h20V7z"
                    />
                  </svg>
                </Box>
              }
            />
          </Grid>
        )}

        {(Cookies.get('role') == 'SADMIN' || Cookies.get('role') == 'ADMIN') && (
          <Grid xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Usuarios"
              total={estadisticas.usuarios}
              color="info"
              icon={
                <Box
                  sx={{
                    width: 90,
                    height: 90,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="100%"
                    height="100%"
                    viewBox="0 0 24 24"
                  >
                    <defs>
                      <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#a0c4ff', stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: '#b3e5fc', stopOpacity: 1 }} />
                      </linearGradient>
                    </defs>
                    <path
                      fill="url(#blueGradient)"
                      d="M16 17v2H2v-2s0-4 7-4s7 4 7 4m-3.5-9.5A3.5 3.5 0 1 0 9 11a3.5 3.5 0 0 0 3.5-3.5m3.44 5.5A5.32 5.32 0 0 1 18 17v2h4v-2s0-3.63-6.06-4M15 4a3.4 3.4 0 0 0-1.93.59a5 5 0 0 1 0 5.82A3.4 3.4 0 0 0 15 11a3.5 3.5 0 0 0 0-7"
                    />
                  </svg>
                </Box>
              }
            />
          </Grid>
        )}

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Lotes Procesados"
            total={estadisticas.lotes}
            color="warning"
            icon={
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="100%"
                  height="100%"
                  viewBox="0 0 24 24"
                >
                  <defs>
                    <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#FF6F20', stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: '#FFA726', stopOpacity: 1 }} />
                    </linearGradient>
                  </defs>
                  <path
                    fill="url(#orangeGradient)"
                    d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zm1.8 18H14l-2-3.4l-2 3.4H8.2l2.9-4.5L8.2 11H10l2 3.4l2-3.4h1.8l-2.9 4.5zM13 9V3.5L18.5 9z"
                  />
                </svg>
              </Box>
            }
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Total de Documentos"
            total={estadisticas.documentos}
            color="warning"
            icon={
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="100%"
                  height="100%"
                  viewBox="0 0 24 24"
                >
                  <defs>
                    <linearGradient id="redGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#FF6F61', stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: '#FF9A9E', stopOpacity: 1 }} />
                    </linearGradient>
                  </defs>
                  <path
                    fill="url(#redGradient)"
                    d="m17 21l-2.75-3l1.16-1.16L17 18.43l3.59-3.59l1.16 1.41M12.8 21H5a2 2 0 0 1-2-2V5c0-1.11.89-2 2-2h14a2 2 0 0 1 2 2v7.8c-.88-.51-1.91-.8-3-.8l-1 .08V11H7v2h7.69A5.98 5.98 0 0 0 12 18c0 1.09.29 2.12.8 3m-.8-6H7v2h5m5-10H7v2h10"
                  />
                </svg>
              </Box>
            }
          />
        </Grid>

        <Grid xs={12} md={12} lg={12}>
          <AppNewsUpdate
            title="Comunicados"
            list={comunicados}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
