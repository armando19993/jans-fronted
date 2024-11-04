import { useEffect, useState } from 'react';
import {
  Button,
  Container,
  Stack,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import Iconify from 'src/components/iconify';
import { instanceWithToken } from 'src/utils/instance';
import { toast } from 'react-toastify';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function ComunicationView() {
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [comunications, setComunications] = useState([]);
  const [selectedComunication, setSelectedComunication] = useState(null);

  const handleOpenModal = () => {
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setTitle('');
    setDescription('');
  };

  const handleViewOpen = () => {
    setViewOpen(true);
  };

  const handleViewClose = () => {
    setViewOpen(false);
    setSelectedComunication(null);
  };

  const handleSave = () => {
    instanceWithToken.post('comunications', { titulo: title, description }).then(() => {
      toast.success('Comunicacion creada con exito!');
      getComunications();
    });
    handleCloseModal();
  };

  const handleDelete = (id) => {
    instanceWithToken.delete(`comunications/${id}`).then(() => {
      toast.success('Comunicacion eliminada con exito!');
      getComunications();
    });
  };

  const handleViewComunication = (comunication) => {
    setSelectedComunication(comunication);
    handleViewOpen();
  };

  const getComunications = () => {
    instanceWithToken.get('comunications').then((result) => {
      setComunications(result.data.data);
    });
  };

  useEffect(() => {
    getComunications();
  }, []);

  const modules = {
    toolbar: [
      [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
      [{ 'size': [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image', 'video'],
      ['clean'],
    ],
  };

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Comunicados</Typography>
        <Button
          variant="contained"
          onClick={handleOpenModal}
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
        >
          Crear Nuevo Comunicado
        </Button>
      </Stack>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Comunicado</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {comunications.map((comunication) => (
                <TableRow key={comunication.id}>
                  <TableCell>{comunication.titulo}</TableCell>
                  <TableCell>
                    <Button color="success" onClick={() => handleViewComunication(comunication)}>
                      <Iconify icon="mdi:eye-outline" /> Ver
                    </Button>
                    <Button color="error" onClick={() => handleDelete(comunication.id)}>
                      <Iconify icon="eva:trash-fill" /> Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Dialog open={open} onClose={handleCloseModal} fullWidth maxWidth="xl">
        <DialogTitle>Crear Comunicado</DialogTitle>
        <DialogContent dividers sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
          <TextField
            autoFocus
            margin="dense"
            label="Título"
            type="text"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <ReactQuill
            value={description}
            onChange={setDescription}
            modules={modules}
            placeholder="Escribe el contenido del comunicado..."
            style={{ height: '400px', marginTop: '20px' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleSave} color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal para Ver Comunicado */}
      <Dialog open={viewOpen} onClose={handleViewClose} fullWidth maxWidth="lg" disableEnforceFocus>
        <DialogTitle>{selectedComunication?.titulo}</DialogTitle>
        <DialogContent>
          <div dangerouslySetInnerHTML={{ __html: selectedComunication?.description }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleViewClose} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
