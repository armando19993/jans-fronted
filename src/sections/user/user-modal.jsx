import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  Stack,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { instanceWithToken } from 'src/utils/instance';
import Cookies from 'js-cookie';

export default function UserModal({ open, onClose, onSubmit, isEdit, initialData }) {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    role: '',
    company: null,
  });

  const [companies, setCompanies] = useState([]);
  const userRole = Cookies.get('role');
  const userCompanyId = Cookies.get('companyId');

  useEffect(() => {
    const getCompanies = async () => {
      try {
        const result = await instanceWithToken.get('company');
        setCompanies(result.data.data);
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };

    getCompanies();
  }, []);

  useEffect(() => {
    if (isEdit && initialData) {
      setFormData({
        name: initialData.name || '',
        username: initialData.username || '',
        password: '', // Normalmente no deberías prellenar la contraseña
        role: initialData.role || '',
        company: initialData.company || null,
      });
    } else if (userRole === 'ADMIN') {
      setFormData((prev) => ({
        ...prev,
        company: userCompanyId,
      }));
    }
  }, [isEdit, initialData, userRole, userCompanyId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSubmit(formData);
    setFormData({
      name: '',
      username: '',
      password: '',
      role: '',
      company: null,
    });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          p: 3,
          backgroundColor: 'white',
          maxWidth: 400,
          margin: 'auto',
          mt: 5,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6">{isEdit ? 'Editar Usuario' : 'Agregar Usuario'}</Typography>
        <Stack spacing={2} mt={2}>
          <TextField label="Nombre" name="name" value={formData.name} onChange={handleChange} />
          <TextField
            label="Nombre de Usuario"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
          <TextField
            label="Contraseña"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
          />
          <FormControl fullWidth>
            <InputLabel>Rol</InputLabel>
            <Select name="role" value={formData.role} onChange={handleChange} label="Rol">
              {userRole === 'SADMIN' && <MenuItem value="SADMIN">SUPER ADMIN</MenuItem>}
              <MenuItem value="ADMIN">ADMIN</MenuItem>
              <MenuItem value="OPERATOR">OPERADOR</MenuItem>
            </Select>
          </FormControl>
          {formData.role !== 'SADMIN' && Cookies.get('role') === 'SADMIN' && (
            <FormControl fullWidth>
              <InputLabel>Empresa</InputLabel>
              <Select
                name="company"
                value={formData.company}
                onChange={handleChange}
                label="Empresa"
              >
                {companies.map((company) => (
                  <MenuItem key={company.id} value={company.id}>
                    {company.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          <Button variant="contained" onClick={handleSubmit}>
            {isEdit ? 'Guardar Cambios' : 'Agregar Usuario'}
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}

UserModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isEdit: PropTypes.bool,
  initialData: PropTypes.shape({
    name: PropTypes.string,
    username: PropTypes.string,
    password: PropTypes.string,
    role: PropTypes.string,
    company: PropTypes.string,
  }),
};
