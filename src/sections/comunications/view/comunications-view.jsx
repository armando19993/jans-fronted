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
import { Editor } from '@tinymce/tinymce-react';
import { instanceWithToken } from 'src/utils/instance';
import { toast } from 'react-toastify';

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
          <Editor
            apiKey="zwhehdkpnkyjhng0r8mdxozlbt2ygyib6ooyxyo8xk4nq2tv"
            initialValue=""
            init={{
              height: '100%',
              menubar: false,
              plugins: ['link', 'lists', 'table', 'autosave', 'paste'],
              toolbar:
                'undo redo | styleselect | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | link | table',
              content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
              setup: (editor) => {
                editor.on('NodeChange', () => {
                  editor.focus();
                });
              },
            }}
            onEditorChange={(content) => setDescription(content)}
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
      <Dialog open={viewOpen} onClose={handleViewClose} fullWidth maxWidth="lg">
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
