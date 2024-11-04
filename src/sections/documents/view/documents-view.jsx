import {
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Popover,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Iconify from 'src/components/iconify';
import { instanceWithToken } from 'src/utils/instance';

export default function DocumentsPage() {
  const { loteId } = useParams();
  const navigate = useNavigate();
  const [lote, setLote] = useState(null);
  const [loading, setLoading] = useState(true); // Estado de carga
  const [openMenu, setOpenMenu] = useState(null); // Estado del menú
  const [selectedDocument, setSelectedDocument] = useState({
    tipo: null,
    nro_factura: null,
    date_factura: null,
    legitimo_tenedor: null,
    nit_emisor: null,
    razon_social_emisor: null,
    nit_receptor: null,
    razon_social_receptor: null,
    iva: null,
    total: null,
    events: [],
  }); // Documento seleccionado
  const [openDialog, setOpenDialog] = useState(false); // Estado del modal

  const getDocuments = () => {
    setLoading(true);
    instanceWithToken
      .get('lotes/' + loteId)
      .then((result) => {
        setLote(result.data.data);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false); // Finaliza la carga
      });
  };

  useEffect(() => {
    getDocuments();
  }, []);

  // Cargando
  if (loading) {
    return (
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="center" sx={{ height: '100vh' }}>
          <CircularProgress />
        </Stack>
      </Container>
    );
  }

  // Si no hay información en lote, muestra un mensaje
  if (!lote) {
    return (
      <Container>
        <Typography variant="h6" align="center">
          No se encontró información para el Lote {loteId}.
        </Typography>
      </Container>
    );
  }

  const handleOpenMenu = (event, document) => {
    setOpenMenu(event.currentTarget);
    setSelectedDocument(document);
  };

  const handleCloseMenu = () => {
    setOpenMenu(null);
  };

  const handleExport = () => {
    instanceWithToken
      .get('lotes/export/documents/' + loteId, {
        responseType: 'blob',
      })
      .then((result) => {
        // Crear un enlace temporal
        const url = window.URL.createObjectURL(new Blob([result.data]));
        const a = document.createElement('a');
        a.href = url;
        a.download = 'documentos_lote_' + loteId + '.xlsx'; // Nombre del archivo a descargar
        document.body.appendChild(a);
        a.click(); // Simula el clic en el enlace
        a.remove(); // Elimina el enlace del DOM
        window.URL.revokeObjectURL(url); // Libera el objeto URL
      })
      .catch((error) => {
        console.error('Error al descargar el archivo:', error);
      });
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
    handleCloseMenu(); // Cerrar el menú al abrir el diálogo
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Listado de Documentos Lote {loteId}</Typography>
      </Stack>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ padding: 3 }}>
            <Typography variant="h6">Información del Lote</Typography>
            <Stack spacing={2} sx={{ mt: 2 }}>
              <Typography>
                <strong>Nombre de la Empresa:</strong> {lote.company.name}
              </Typography>
              <Typography>
                <strong>NIT:</strong> {lote.company.nit}
              </Typography>
              <Typography>
                <strong>Fecha de Creación:</strong> {new Date(lote.createdAt).toLocaleDateString()}
              </Typography>
              <Typography>
                <strong>Cantidad de Documentos:</strong> {lote.ctda_registros}
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
              <Button color="success" onClick={handleExport}>
                <Iconify icon="catppuccin:ms-excel" sx={{ mr: 2 }} /> Exportar a Excel
              </Button>
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ mt: 2 }}>
            <Typography variant="h6" sx={{ padding: 3 }}>
              Documentos del Lote
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Cufe</TableCell>
                    <TableCell>Tipo Documento</TableCell>
                    <TableCell>Número Documento</TableCell>
                    <TableCell>Fecha de Documento</TableCell>
                    <TableCell>Emisor</TableCell>
                    <TableCell>IVA</TableCell>
                    <TableCell>Valor Total</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {lote.documents.map((document, index) => (
                    <TableRow key={index}>
                      <TableCell>{document.cufe}</TableCell>
                      <TableCell>{document.tipo}</TableCell>
                      <TableCell>{document.nro_factura}</TableCell>
                      <TableCell>{new Date(document.date_factura).toLocaleDateString()}</TableCell>
                      <TableCell>{`${document.nit_emisor} - ${document.razon_social_emisor}`}</TableCell>
                      <TableCell>{document.iva}</TableCell>
                      <TableCell>{document.total}</TableCell>
                      <TableCell>
                        <Button
                          color="success"
                          onClick={(event) => {
                            handleOpenMenu(event, document);
                            handleOpenDialog();
                          }}
                        >
                          <Iconify icon="eva:eye-fill" sx={{ mr: 2 }} />
                          Ver
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Popover
              open={Boolean(openMenu)}
              anchorEl={openMenu}
              onClose={handleCloseMenu}
              anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              PaperProps={{ sx: { width: 140 } }}
            >
              <MenuItem
                onClick={() => navigate('/dashboard/documents/' + selectedDocument.id)}
                sx={{ color: '#008c00' }}
              >
                <Iconify icon="eva:eye-fill" sx={{ mr: 2 }} />
                Ver
              </MenuItem>
            </Popover>
          </Paper>
        </Grid>
      </Grid>

      {/* Modal para mostrar información de la factura */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="lg" // Establecer el ancho máximo en "lg" (grande)
        fullWidth // Permitir que el modal ocupe el ancho completo
        PaperProps={{
          sx: {
            width: { xs: '95%', sm: '70%' }, // 95% en móvil, 70% en escritorio
          },
        }}
      >
        <DialogTitle>Detalles del Documento</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6">Información del Documento</Typography>
                <Stack spacing={1}>
                  <Typography>
                    <strong>Tipo:</strong> {selectedDocument.tipo ? selectedDocument.tipo : null}
                  </Typography>
                  <Typography>
                    <strong>Número:</strong>{' '}
                    {selectedDocument.nro_factura ? selectedDocument.nro_factura : null}
                  </Typography>
                  <Typography>
                    <strong>Fecha:</strong>{' '}
                    {selectedDocument.date_factura ? selectedDocument.date_factura : null}
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6">Tenedor Actual</Typography>
                <Stack spacing={1}>
                  <Typography>
                    {selectedDocument.legitimo_tenedor ? selectedDocument.legitimo_tenedor : null}
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12} sm={4}>
                <Typography variant="h6">Información del Emisor</Typography>
                <Stack spacing={1}>
                  <Typography>
                    <strong>NIT:</strong>{' '}
                    {selectedDocument.nit_emisor ? selectedDocument.nit_emisor : null}
                  </Typography>
                  <Typography>
                    <strong>Nombre:</strong>{' '}
                    {selectedDocument.razon_social_emisor
                      ? selectedDocument.razon_social_emisor
                      : null}
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="h6">Información del Receptor</Typography>
                <Stack spacing={1}>
                  <Typography>
                    <strong>NIT:</strong>{' '}
                    {selectedDocument.nit_receptor ? selectedDocument.nit_receptor : null}
                  </Typography>
                  <Typography>
                    <strong>Nombre:</strong>{' '}
                    {selectedDocument.razon_social_receptor
                      ? selectedDocument.razon_social_receptor
                      : null}
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="h6">Totales</Typography>
                <Stack spacing={1}>
                  <Typography>
                    <strong>IVA:</strong> ${selectedDocument.iva ? selectedDocument.iva : null}
                  </Typography>
                  <Typography>
                    <strong>Total:</strong> $
                    {selectedDocument.total ? selectedDocument.total : null}
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              {selectedDocument.events && selectedDocument.events.length > 0 ? (
                <Grid item xs={12}>
                  <Typography variant="h6">Eventos de la Factura</Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Código</TableCell>
                          <TableCell>Descripción</TableCell>
                          <TableCell>Fecha</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedDocument.events.map((event, index) => (
                          <TableRow key={index}>
                            <TableCell>{event.code}</TableCell>
                            <TableCell>{event.description}</TableCell>
                            <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              ) : (
                <Grid item xs={12}>
                  <Typography variant="body1" color="textSecondary">
                    Este Documento no tiene eventos asociados.
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
