import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { bgGradient } from 'src/theme/css';

import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';
import { toast } from 'react-toastify';
import { instance } from 'src/utils/instance';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

// ----------------------------------------------------------------------

export default function LoginView() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const handleClick = () => {
    if (!user || !password) {
      toast.warning('Debes llenar todos los datos para poder iniciar sesion!');
      return;
    }

    const payload = { user, password };

    instance
      .post('auth/login', payload)
      .then((result) => {
        let user = result.data;

        if (user.user.status == 'SUSPENDIDO' || user.user.status == 'ELIMINADO') {
          toast.error(
            'Tu Usuario se encuentra suspendido, contacta con la administracion de la empresa'
          );
          return;
        }

        if (user.user.company) {
          if (user.user.company.status != 'ACTIVO') {
            toast.error(
              'No puedes acceder tu empresa se encuentra inactiva, conversa con administracion!'
            );
            return;
          }
        }

        Cookies.set('sesion', true);
        Cookies.set('user', user.user.username);
        Cookies.set('name', user.user.name);
        Cookies.set('role', user.user.role);
        Cookies.set('id', user.user.id);
        Cookies.set('token', user.token);
        Cookies.set('companyId', user.user.company ? user.user.company.id : null);
        Cookies.set('companyName', user.user.company ? user.user.company.name : null);

        navigate('/dashboard');
      })
      .catch((e) => {
        let message = e.response ? e.response.data.message : 'Error Desconocido';
        console.log(e);
        toast.error(message);
      });
  };

  const renderForm = (
    <>
      <Stack spacing={3}>
        <TextField
          value={user}
          onChangeCapture={(e) => setUser(e.target.value)}
          name="email"
          label="Usuario"
        />

        <TextField
          name="password"
          label="Clave"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="inherit"
        sx={{ mt: 3 }}
        onClick={handleClick}
      >
        Inicia Sesion
      </LoadingButton>
    </>
  );

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
          imgUrl: '/assets/background/overlay_4.jpg',
        }),
        height: 1,
      }}
    >
      <Logo
        sx={{
          position: 'fixed',
          top: { xs: 16, md: 24 },
          left: { xs: 16, md: 24 },
        }}
      />

      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420,
          }}
        >
          <Typography variant="h4" align="center">
            Lector de Eventos - Factura Electronica
          </Typography>
          <Typography variant="h6">Inicio de Sesion</Typography>

          {renderForm}
        </Card>
      </Stack>
    </Box>
  );
}
