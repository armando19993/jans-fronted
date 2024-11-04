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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  TextField,
} from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Iconify from 'src/components/iconify';
import { instanceWithToken } from 'src/utils/instance';

export default function DocumentsPage() {
  const { loteId } = useParams();
  const navigate = useNavigate();
  const [lote, setLote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDocuments, setFilteredDocuments] = useState([]);

  const getDocuments = () => {
    setLoading(true);
    instanceWithToken
      .get('lotes/' + loteId)
      .then((result) => {
        setLote(result.data.data);
        setFilteredDocuments(result.data.data.documents); // Inicializar los documentos filtrados
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getDocuments();
  }, []);

  // Filtrar documentos
  useEffect(() => {
    if (lote && lote.documents) {
      const filtered = lote.documents.filter(
        (doc) =>
          doc.nro_factura?.toString().includes(searchTerm) ||
          doc.nit_emisor?.toString().includes(searchTerm) ||
          doc.razon_social_emisor?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDocuments(filtered);
    }
  }, [searchTerm, lote]);

  // Manejar el cambio en el campo de búsqueda
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

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
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Listado de Documentos Lote {loteId}</Typography>
      </Stack>

      {/* Campo de búsqueda para filtrar documentos */}
      <TextField
        label="Buscar por Número de Documento, NIT Emisor o Razón Social Emisor"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={handleSearchChange}
      />

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
                <strong>Cantidad de Documentos:</strong> {filteredDocuments.length}
              </Typography>
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
                  {filteredDocuments.map((document, index) => (
                    <TableRow key={index}>
                      <TableCell>{document.tipo}</TableCell>
                      <TableCell>{document.nro_factura}</TableCell>
                      <TableCell>{new Date(document.date_factura).toLocaleDateString()}</TableCell>
                      <TableCell>{`${document.nit_emisor} - ${document.razon_social_emisor}`}</TableCell>
                      <TableCell>{document.iva}</TableCell>
                      <TableCell>{document.total}</TableCell>
                      <TableCell>
                        <Button
                          color="success"
                          onClick={() => navigate(`/dashboard/documents/${document.id}`)}
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
    </Container>
  );
}
