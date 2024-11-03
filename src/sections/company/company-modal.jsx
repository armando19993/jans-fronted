import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, Typography, Stack } from '@mui/material';

export default function CompanyModal({ open, onClose, onSubmit, isEdit, initialData }) {
  const [formData, setFormData] = useState({
    nit: '',
    name: '',
    ctda_users: '',
    ctda_documents: '',
    date_start: '',
    date_end: '',
  });

  useEffect(() => {
    if (isEdit && initialData) {
      setFormData(initialData);
    }
  }, [isEdit, initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSubmit(formData);
    setFormData({
      nit: '',
      name: '',
      ctda_users: '',
      ctda_documents: '',
      date_start: '',
      date_end: '',
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
        <Typography variant="h6">{isEdit ? 'Editar Empresa' : 'Agregar Empresa'}</Typography>
        <Stack spacing={2} mt={2}>
          <TextField label="NIT" name="nit" value={formData.nit} onChange={handleChange} />
          <TextField
            label="Razón Social"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          <TextField label="Telefono" name="phone" value={formData.phone} onChange={handleChange} />
          <TextField
            type="email"
            label="Correo"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            type="number"
            label="Ctda. Usuarios"
            name="ctda_users"
            value={formData.ctda_users}
            onChange={handleChange}
          />
          <TextField
            type="number"
            label="Ctda. Docs"
            name="ctda_documents"
            value={formData.ctda_documents}
            onChange={handleChange}
          />
          <TextField
            label="Fecha Inicio"
            name="date_start"
            type="date"
            value={formData.date_start}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="Fecha Fin"
            name="date_end"
            type="date"
            value={formData.date_end}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <Button variant="contained" onClick={handleSubmit}>
            {isEdit ? 'Guardar Cambios' : 'Agregar Empresa'}
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}

CompanyModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isEdit: PropTypes.bool,
  initialData: PropTypes.object,
};
