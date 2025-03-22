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
  Alert,
  TextField,
  Modal,
  Box,
} from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
import Iconify from 'src/components/iconify';
import { instanceWithToken } from 'src/utils/instance';
import { toast } from 'react-toastify';

export default function DocumentsPage() {
  const { loteId } = useParams();
  const navigate = useNavigate();
  const [modalUrl, setModalUrl] = useState(false)
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
    factura_pdf: null,
  }); // Documento seleccionado
  const [isProcessing, setIsProcessing] = useState(false);
  const [openDialog, setOpenDialog] = useState(false); // Estado del modal
  const [openPdfDialog, setOpenPdfDialog] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState(null);
  const [pdfData, setPdfData] = useState(null);
  const [filterText, setFilterText] = useState(''); // Estado para el filtro de búsqueda
  const [token_dian, setTokenDian] = useState('');

  const getDocuments = () => {
    setLoading(true);
    instanceWithToken
      .get('lotes/' + loteId)
      .then((result) => {
        setLote(result.data.data);
        if (!result.data.data.procesado) {
          alert("Este lote no se ha procesado presiona el boton procesar y espera unos minutos antes de volver a consultar")
        }
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

  const handleFilterChange = (event) => {
    setFilterText(event.target.value); // Actualizar el texto del filtro
  };

  const filteredDocuments = lote?.documents?.filter(
    (document) =>
      (document.nit_emisor ?? '').toLowerCase().includes(filterText.toLowerCase()) ||
      (document.razon_social_emisor ?? '').toLowerCase().includes(filterText.toLowerCase()) ||
      (document.nro_factura ?? '').toLowerCase().includes(filterText.toLowerCase())
  );

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

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleOpenPdfDialog = async () => {
    setPdfLoading(true);
    setPdfError(null);

    try {
      const response = await axios.get(
        `https://api.jansprogramming.com.co/pdfs/${selectedDocument.cufe}.pdf`,
        {
          responseType: 'blob',
        }
      );

      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      setPdfData(pdfUrl);
      setOpenPdfDialog(true);
    } catch (error) {
      setPdfError('Error al cargar el PDF. Por favor, intente nuevamente.');
      console.error('Error loading PDF:', error);
    } finally {
      setPdfLoading(false);
    }
  };

  const handleClosePdfDialog = () => {
    setOpenPdfDialog(false);
  };

  const handleOpenMenu = (event, document) => {
    setOpenMenu(event.currentTarget);
    setSelectedDocument(document);
  };

  const handleCloseMenu = () => {
    setOpenMenu(null);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
    handleCloseMenu();
  };

  const handleCloseTokenModal = () => {
    if (!isProcessing) {
      setModalUrl(false);
    }
  };

  const handleSubmitProcess = () => {
    setIsProcessing(true)
    axios.post('https://lector.jansprogramming.com.co/validar_token', {
      authUrl: token_dian,
    }).then(() => {
      instanceWithToken.post('lotes/procesar/cufes', {
        authUrl: token_dian,
        partitionKey: "string",
        loteId: loteId
      })
        .then(() => {
          setModalUrl(false);
          getDocuments();
        })
        .catch((error) => {
          console.error('Error al procesar el lote:', error);
        });
    }).catch(() => {
      toast.error('El token esta vencido, intenta con otro.');
      setIsProcessing(false)
      setModalUrl(false)
    }).finally(() => {
      setModalUrl(false)
      setIsProcessing(false)
    })
  }

  if (loading) {
    return (
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="center" sx={{ height: '100vh' }}>
          <CircularProgress />
        </Stack>
      </Container>
    );
  }

  if (!lote) {
    return (
      <Container>
        <Typography variant="h6" align="center">
          No se encontró información para el Lote {loteId}.
        </Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Modal
        open={modalUrl}
        onClose={handleCloseTokenModal}
        closeAfterTransition
        slotProps={{
          backdrop: {
            onClick: handleCloseTokenModal  // Permitir cerrar al hacer clic fuera
          }
        }}
      >
        <Box
          sx={{
            p: 3,
            backgroundColor: 'white',
            maxWidth: 400,
            margin: 'auto',
            mt: 5,
            borderRadius: 2,
            outline: 'none',  // Eliminar el contorno al enfocar
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Ingrese su token Dian</Typography>
            {!isProcessing && (
              <IconButton onClick={handleCloseTokenModal} size="small">
                <Iconify icon="eva:close-fill" />
              </IconButton>
            )}
          </Stack>
          <Stack spacing={2} mt={2}>
            {!isProcessing && <TextField label="Token Dian" name="token_dian" value={token_dian} onChange={(event) => setTokenDian(event.target.value)} />}

            {isProcessing && <CircularProgress />}
            {isProcessing && <Typography variant="body1">Estamos procesando el lote, por favor, espere...</Typography>}

            <Button variant="contained" onClick={handleSubmitProcess} disabled={isProcessing}>
              {isProcessing ? 'Procesando...' : 'Procesar'}
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Helmet>
        <title> Documents </title>
      </Helmet>
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
              {!lote.procesado ? <Button color="error" onClick={() => setModalUrl(true)}>
                <Iconify icon="material-symbols:procedure-outline-rounded" sx={{ mr: 2 }} /> Procesar
              </Button> : 'Este lote ya se ha procesado'}

              <Button color="success" onClick={handleExport}>
                <Iconify icon="catppuccin:ms-excel" sx={{ mr: 2 }} /> Exportar a Excel
              </Button>
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ mt: 2, padding: 2 }}>
            <TextField
              label="Buscar por NIT Emisor, Razón Social Emisor o Número de Documento"
              variant="outlined"
              fullWidth
              value={filterText}
              onChange={handleFilterChange}
            />
          </Paper>
          <Paper elevation={3} sx={{ mt: 2 }}>
            <Typography variant="h6" sx={{ padding: 3 }}>
              Documentos del Lote
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Tipo Documento</TableCell>
                    <TableCell>Forma de Pago</TableCell>
                    <TableCell>Número Documento</TableCell>
                    <TableCell>Fecha de Documento</TableCell>
                    <TableCell>Emisor</TableCell>
                    <TableCell>IVA</TableCell>
                    <TableCell>Valor Total</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredDocuments.map((document, index) => (
                    <TableRow key={index}>
                      <TableCell>{document.tipo}</TableCell>
                      <TableCell>{document.forma_pago}</TableCell>
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
                  <Typography>
                    <strong>CUFE:</strong> {selectedDocument.cufe ? selectedDocument.cufe : null}
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
            <Stack direction="row" spacing={2}>
              {/* <Button color="primary" onClick={handleOpenPdfDialog}>
                Ver PDF
              </Button> */}
              <Button
                color="primary"
                onClick={() =>
                  window.open(
                    `https://catalogo-vpfe.dian.gov.co/document/searchqr?documentkey=${selectedDocument.cufe}`,
                    '_blank'
                  )
                }
                startIcon={<Iconify icon="mdi:open-in-new" />}
              >
                Ver DIAN
              </Button>
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openPdfDialog}
        onClose={handleClosePdfDialog}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            width: { xs: '95%', sm: '80%' },
            height: '90vh',
          },
        }}
      >
        <DialogTitle>
          Vista Previa de la Factura PDF
          <Button
            onClick={() => window.open(pdfData, '_blank')}
            startIcon={<Iconify icon="mdi:open-in-new" />}
            sx={{ float: 'right' }}
          >
            Abrir en nueva pestaña
          </Button>
        </DialogTitle>
        <DialogContent sx={{ p: 0, height: 'calc(90vh - 130px)' }}>
          {pdfLoading && (
            <Stack alignItems="center" justifyContent="center" sx={{ height: '100%' }}>
              <CircularProgress />
            </Stack>
          )}

          {pdfError && (
            <Alert severity="error" sx={{ m: 2 }}>
              {pdfError}
            </Alert>
          )}

          {!pdfLoading && !pdfError && pdfData && (
            <iframe
              src={pdfData}
              title="Factura PDF"
              width="100%"
              height="100%"
              style={{ border: 'none' }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePdfDialog} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}