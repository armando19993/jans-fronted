import PropTypes from 'prop-types';
import { useState } from 'react';
import { Modal, Box, Button, Typography, Stack } from '@mui/material';
import * as XLSX from 'xlsx';
import { instanceWithToken } from 'src/utils/instance';
import { toast } from 'react-toastify';

export default function LoteModal({ open, onClose }) {
  const [file, setFile] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [jsonData, setJsonData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async () => {
    if (!file) return;

    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    const numeroLote = file.name.split('.')[0]; // Suponiendo que el nombre del archivo es el número de lote
    const cantidadRegistros = jsonData.length;

    setResultado({
      numeroLote,
      cantidadRegistros,
      procesoIniciado: false,
    });

    setJsonData(jsonData); // Guardar los datos JSON
    setFile(null); // Limpiar el archivo después de cargar
    setIsProcessing(true); // Indicar que se ha iniciado el procesamiento
  };

  const iniciarProceso = async () => {
    if (!jsonData || jsonData.length === 0) return;

    // Skip the first record (header)
    const dataToSend = jsonData.slice(1);

    try {
      const result = await instanceWithToken.post('lotes', dataToSend);
      toast.success('El proceso de validacion y revision ha iniciado correctamente');
      onClose();
      await instanceWithToken.get('lotes/procesar/cufes')
    } catch (error) {
      console.error('Error sending data:', error);
    }
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
        <Typography variant="h6">Cargar Lote</Typography>
        <Stack spacing={2} mt={2}>
          {!isProcessing ? (
            <>
              <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
              <Button variant="contained" onClick={handleSubmit}>
                Procesar
              </Button>
            </>
          ) : (
            <>
              <Typography>
                Número de Lote: {resultado.numeroLote} <br />
                Cantidad de Registros: {resultado.cantidadRegistros} <br />
              </Typography>
              <Button variant="contained" onClick={iniciarProceso}>
                Enviar Datos
              </Button>
            </>
          )}
        </Stack>
      </Box>
    </Modal>
  );
}

LoteModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
