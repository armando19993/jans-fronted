import PropTypes from 'prop-types';
import {
  Modal,
  Box,
  Typography,
  Stack,
  Divider,
  Button,
  List,
  ListItem,
  ListItemText,
  Paper,
  Grid,
  Chip
} from '@mui/material';
import Iconify from 'src/components/iconify';

export default function PackageDetailModal({ open, onClose, packageData }) {
  if (!packageData) {
    return null;
  }

  // Format price safely, handling cases where it might not be a number
  const formatPrice = (value) => {
    const numPrice = Number(value);
    return !isNaN(numPrice) ? `$${numPrice.toFixed(2)}` : `$${value}`;
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
        <Stack spacing={3}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" fontWeight="bold">
              Detalles del Paquete
            </Typography>
            <Chip 
              label={formatPrice(packageData.price)} 
              color="primary" 
              sx={{ fontSize: '1.1rem', fontWeight: 'bold', py: 2, px: 1 }}
            />
          </Box>

          <Divider />

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6" fontWeight="bold">
                {packageData.title}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                {packageData.shortDescription}
              </Typography>
            </Grid>
          </Grid>

          <Divider />

          <Box>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Items del Paquete ({packageData.items?.length || 0})
            </Typography>
            
            {packageData.items && packageData.items.length > 0 ? (
              <Paper elevation={0} sx={{ p: 0, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                <List disablePadding>
                  {packageData.items.map((item, index) => (
                    <ListItem 
                      key={index}
                      divider={index < packageData.items.length - 1}
                      sx={{ 
                        py: 2,
                        px: 3,
                        '&:hover': { bgcolor: '#f9f9f9' }
                      }}
                    >
                      <ListItemText
                        primary={
                          <Typography variant="body1">
                            {item.description}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            ) : (
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 3, 
                  textAlign: 'center',
                  border: '1px dashed #ccc',
                  borderRadius: 2,
                  bgcolor: '#f9f9f9'
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  Este paquete no tiene items.
                </Typography>
              </Paper>
            )}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button 
              variant="contained" 
              onClick={onClose}
              startIcon={<Iconify icon="eva:close-fill" />}
            >
              Cerrar
            </Button>
          </Box>
        </Stack>
      </Box>
    </Modal>
  );
}

PackageDetailModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  packageData: PropTypes.object,
};
