import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { 
  Modal, 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Stack, 
  IconButton,
  Divider,
  Grid,
  Paper
} from '@mui/material';
import Iconify from 'src/components/iconify';

export default function PackageModal({ open, onClose, onSubmit, isEdit, initialData }) {
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    price: '',
    items: []
  });

  const [newItem, setNewItem] = useState({
    description: ''
  });

  useEffect(() => {
    if (isEdit && initialData) {
      setFormData({
        ...initialData,
        price: initialData.price.toString(),
        items: initialData.items || []
      });
    } else {
      setFormData({
        title: '',
        shortDescription: '',
        price: '',
        items: []
      });
    }
  }, [isEdit, initialData, open]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleItemChange = (e) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  };

  const handleAddItem = () => {
    if (newItem.description.trim() !== '') {
      setFormData({
        ...formData,
        items: [...formData.items, { ...newItem }]
      });
      setNewItem({ description: '' });
    }
  };

  const handleRemoveItem = (index) => {
    const updatedItems = [...formData.items];
    updatedItems.splice(index, 1);
    setFormData({ ...formData, items: updatedItems });
  };

  const handleSubmit = () => {
    // Convert price to number
    const dataToSubmit = {
      ...formData,
      price: parseFloat(formData.price)
    };
    onSubmit(dataToSubmit);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          p: 4,
          backgroundColor: 'white',
          width: { xs: '90%', sm: '80%', md: '60%', lg: '50%' },
          maxHeight: '90vh',
          margin: 'auto',
          borderRadius: 2,
          overflow: 'auto',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          boxShadow: 24,
        }}
      >
        <Typography variant="h5" mb={3} fontWeight="bold">
          {isEdit ? 'Editar Paquete' : 'Agregar Paquete'}
        </Typography>
        
        <Stack spacing={3}>
          <TextField
            label="Título"
            name="title"
            value={formData.title}
            onChange={handleChange}
            fullWidth
            required
            variant="outlined"
          />
          
          <TextField
            label="Descripción Corta"
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
            required
            variant="outlined"
          />
          
          <TextField
            label="Precio"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            fullWidth
            required
            variant="outlined"
            InputProps={{
              startAdornment: '$'
            }}
          />
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="h6" fontWeight="bold" sx={{ mt: 2 }}>
            Items del Paquete
          </Typography>
          
          <Paper elevation={0} sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={9}>
                <TextField
                  label="Descripción del Item"
                  name="description"
                  value={newItem.description}
                  onChange={handleItemChange}
                  fullWidth
                  variant="outlined"
                  placeholder="Ingrese la descripción del item"
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Button 
                  variant="contained" 
                  onClick={handleAddItem}
                  sx={{ height: '56px' }}
                  fullWidth
                  startIcon={<Iconify icon="eva:plus-fill" />}
                >
                  Agregar
                </Button>
              </Grid>
            </Grid>
          </Paper>
          
          {formData.items.length > 0 ? (
            <Paper elevation={0} sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 2, mt: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                Items agregados ({formData.items.length}):
              </Typography>
              <Stack spacing={1}>
                {formData.items.map((item, index) => (
                  <Box 
                    key={index} 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      p: 2,
                      border: '1px solid #e0e0e0',
                      borderRadius: 1,
                      bgcolor: '#f9f9f9'
                    }}
                  >
                    <Typography variant="body1">{item.description}</Typography>
                    <IconButton 
                      size="small" 
                      color="error" 
                      onClick={() => handleRemoveItem(index)}
                      sx={{ 
                        '&:hover': { 
                          backgroundColor: 'rgba(211, 47, 47, 0.1)' 
                        } 
                      }}
                    >
                      <Iconify icon="eva:trash-2-outline" />
                    </IconButton>
                  </Box>
                ))}
              </Stack>
            </Paper>
          ) : (
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                mt: 2, 
                textAlign: 'center',
                border: '1px dashed #ccc',
                borderRadius: 2,
                bgcolor: '#f9f9f9'
              }}
            >
              <Typography variant="body1" color="text.secondary">
                No hay items agregados al paquete.
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Agregue al menos un item para completar el paquete.
              </Typography>
            </Paper>
          )}
          
          <Divider sx={{ my: 2 }} />
          
          <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
            <Button 
              variant="outlined" 
              onClick={onClose}
              size="large"
            >
              Cancelar
            </Button>
            <Button 
              variant="contained" 
              onClick={handleSubmit}
              size="large"
              startIcon={isEdit ? <Iconify icon="eva:edit-fill" /> : <Iconify icon="eva:save-fill" />}
            >
              {isEdit ? 'Guardar Cambios' : 'Crear Paquete'}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
}

PackageModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isEdit: PropTypes.bool,
  initialData: PropTypes.object,
};
