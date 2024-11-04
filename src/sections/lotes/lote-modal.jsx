import PropTypes from 'prop-types';
import { useState } from 'react';
import { Modal, Box, Button, Typography, Stack, Alert } from '@mui/material';
import * as XLSX from 'xlsx';
import { instanceWithToken } from 'src/utils/instance';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';

const VALID_DOCUMENT_TYPES = [
  'Factura Electrónica de Venta',
  'Factura electrónica de contingencia',
];

export default function LoteModal({ open, onClose }) {
  const [file, setFile] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [jsonData, setJsonData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationResults, setValidationResults] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const validateDocuments = (data) => {
    let validCount = 0;
    let invalidCount = 0;
    const invalidRecords = [];

    data.forEach((record, index) => {
      const documentType = record['Tipo de documento'];
      if (VALID_DOCUMENT_TYPES.includes(documentType)) {
        validCount++;
      } else {
        invalidCount++;
        invalidRecords.push({
          row: index + 2, // +2 porque Excel empieza en 1 y tenemos encabezado
          type: documentType,
        });
      }
    });

    return {
      validCount,
      invalidCount,
      invalidRecords,
      totalCount: data.length,
    };
  };

  const handleSubmit = async () => {
    if (!file) return;

    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    const numeroLote = file.name.split('.')[0];
    const validation = validateDocuments(jsonData);

    setResultado({
      numeroLote,
      cantidadRegistros: jsonData.length,
      procesoIniciado: false,
    });

    setValidationResults(validation);
    // Filtrar solo los documentos válidos para el envío
    setJsonData(
      jsonData.filter((record) => VALID_DOCUMENT_TYPES.includes(record['Tipo de documento']))
    );
    setFile(null);
    setIsProcessing(true);
  };

  const iniciarProceso = async () => {
    if (!jsonData || jsonData.length === 0) return;

    const result = await instanceWithToken.get('company/' + Cookies.get('companyId'));
    if (validationResults.totalCount > result.data.data.ctda_documents) {
      toast.error(
        `No puedes procesar esta cantidad de documentos, por que excede tu limite. \n Cantidad Disponible: ${result.data.data.ctda_documents}, \n contacta con Jans Programming`
      );
      return;
    }

    try {
      const result = await instanceWithToken.post('lotes', jsonData);
      toast.success('El proceso de validacion y revision ha iniciado correctamente');
      onClose();
      await instanceWithToken.get('lotes/procesar/cufes');
      let nuevaCtda = parseInt(result.data.data.ctda_documents) - parseInt(validationResults.validCount);
      await instanceWithToken.patch('company/' + Cookies.get('companyId'), {
        ctda_documents: parseInt(nuevaCtda),
      });
    } catch (error) {
      console.error('Error sending data:', error);
      toast.error('Error al procesar el lote');
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          p: 3,
          backgroundColor: 'white',
          maxWidth: 500,
          margin: 'auto',
          mt: 5,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" mb={2}>
          Cargar Lote
        </Typography>
        <Stack spacing={2}>
          {!isProcessing ? (
            <>
              <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
              <Button variant="contained" onClick={handleSubmit}>
                Procesar
              </Button>
            </>
          ) : (
            <>
              <Typography variant="body1">Número de Lote: {resultado.numeroLote}</Typography>

              {validationResults && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body1" fontWeight="bold" mb={1}>
                    Resultado de la validación:
                  </Typography>
                  <Typography>Total de registros: {validationResults.totalCount}</Typography>
                  <Typography color="success.main">
                    Documentos válidos: {validationResults.validCount}
                    <Typography variant="caption" component="div" color="text.secondary">
                      (Solo Factura Electrónica de Venta y Factura electrónica de contingencia)
                    </Typography>
                  </Typography>
                  <Typography color="error.main">
                    Documentos no válidos: {validationResults.invalidCount}
                  </Typography>

                  {validationResults.invalidCount > 0 && (
                    <Alert severity="warning" sx={{ mt: 1 }}>
                      <Typography variant="body2" fontWeight="bold" mb={1}>
                        Se encontraron documentos no válidos en las siguientes filas:
                      </Typography>
                      {validationResults.invalidRecords.map((record, index) => (
                        <Typography variant="body2" key={index}>
                          Fila {record.row}: {record.type}
                        </Typography>
                      ))}
                      <Typography variant="body2" mt={1} color="warning.dark">
                        Solo se procesarán las Facturas Electrónicas de Venta y Facturas
                        electrónicas de contingencia.
                      </Typography>
                    </Alert>
                  )}
                </Box>
              )}

              <Button
                variant="contained"
                onClick={iniciarProceso}
                disabled={validationResults?.validCount === 0}
              >
                Enviar Datos Válidos ({validationResults?.validCount} documentos)
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
