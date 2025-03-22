import React, { useState, useEffect } from "react";
import {
    Container,
    Stack,
    Typography,
    TextField,
    Button,
    Box,
    Alert,
    CircularProgress,
    Paper,
    Stepper,
    Step,
    StepLabel,
    Fade,
    Divider,
    IconButton,
    Tooltip,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format, isAfter, isBefore, addMonths } from "date-fns";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CloudDownload, CopyCheckIcon, HelpCircle, LucideListRestart } from "lucide-react";

export default function DownloadPage() {
    const [url, setUrl] = useState("");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [requestId, setRequestId] = useState(null);
    const [status, setStatus] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [downloadComplete, setDownloadComplete] = useState(false);
    const [isValidatingToken, setIsValidatingToken] = useState(false);

    const steps = ['Ingresar datos', 'Procesando', 'Descarga completada'];

    const isValidUrl = (url) => {
        return url && url.startsWith("https://catalogo-vpfe.dian.gov.co/User/AuthToken?");
    };

    const tokenActive = async (url) => {
        setIsValidatingToken(true);
        setError("");
        setSuccess("");

        try {
            // Show toast notification when validation starts
            toast.info("Validando token, por favor espere...", { autoClose: false, toastId: "validating-token" });

            const response = await axios.post('https://lector.jansprogramming.com.co/validar_token', { authUrl: url });

            // Dismiss the validating toast
            toast.dismiss("validating-token");

            return response.status === 200;
        } catch (error) {
            // Dismiss the validating toast
            toast.dismiss("validating-token");
            toast.error("Error al validar el token");

            return false;
        } finally {
            setIsValidatingToken(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isValidUrl(url)) {
            setError("La URL debe comenzar con https://catalogo-vpfe.dian.gov.co/User/AuthToken?");
            return;
        }

        const isTokenValid = await tokenActive(url);
        if (!isTokenValid) {
            setError("Este token está vencido o es inválido.");
            return;
        }

        setError("");
        setSuccess("Token validado correctamente.");
        // Optionally show a success toast
        toast.success("Token validado correctamente");
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
                <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 3 }}>
                    <Typography variant="h4" align="center" fontWeight="bold">
                        Descargar Documentos Electrónicos
                    </Typography>
                </Box>

                <Box sx={{ p: 4 }}>
                    <Stack spacing={3}>
                        <TextField
                            fullWidth
                            label="URL de autenticación DIAN"
                            placeholder="https://catalogo-vpfe.dian.gov.co/User/AuthToken?..."
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            required
                            error={!!error && !isValidUrl(url)}
                            helperText={error || "Ingrese la URL de autenticación de la DIAN."}
                            disabled={isValidatingToken}
                        />

                        {isValidatingToken && (
                            <Fade in={isValidatingToken}>
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    p: 2,
                                    borderRadius: 1,
                                    bgcolor: 'action.hover'
                                }}>
                                    <CircularProgress size={24} color="primary" />
                                    <Typography>Validando token, por favor espere...</Typography>
                                </Box>
                            </Fade>
                        )}

                        {error && <Alert severity="error">{error}</Alert>}
                        {success && <Alert severity="success">{success}</Alert>}

                        <Button
                            onClick={handleSubmit}
                            variant="contained"
                            size="large"
                            disabled={isValidatingToken}
                            startIcon={isValidatingToken ? <CircularProgress size={20} color="inherit" /> : null}
                        >
                            {isValidatingToken ? 'Validando...' : 'Validar Token'}
                        </Button>
                    </Stack>
                </Box>
            </Paper>
        </Container>
    );
}