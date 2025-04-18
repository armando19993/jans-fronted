import React, { useState, useEffect } from "react";
import {
    Container,
    Stack,
    Typography,
    TextField,
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
    LinearProgress,
} from "@mui/material";
import Button from '@mui/material/Button';
import {
    DatePicker
} from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format, isAfter, isBefore, addMonths } from "date-fns";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CloudDownload, CloudDownloadIcon, CopyCheckIcon, HelpCircle, LucideListRestart } from "lucide-react";
import Cookies from "js-cookie"; // Importar Cookies para acceder al valor de service_download

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
    const [loading2, setLoading2] = useState(false);
    const [serviceDownloadActive, setServiceDownloadActive] = useState(false); // Estado para verificar si el servicio está activo
    const [showProcessAlert, setShowProcessAlert] = useState(false); // Estado para controlar la visibilidad de la alerta
    // Nuevos estados para el progreso detallado
    const [progressDetail, setProgressDetail] = useState("");
    const [progressPercentage, setProgressPercentage] = useState(0);
    const [currentDetail, setCurrentDetail] = useState("");

    // Verificar el servicio de descarga al cargar la vista
    useEffect(() => {
        const serviceDownload = Cookies.get("service_download") === "true"; // Obtener el valor de service_download
        setServiceDownloadActive(serviceDownload); // Actualizar el estado
    }, []);

    // Pasos del proceso
    const steps = ['Ingresar datos', 'Procesando', 'Descarga completada'];

    const isValidUrl = (url) => {
        return url && url.startsWith("https://catalogo-vpfe.dian.gov.co/User/AuthToken?");
    };

    const validateDates = () => {
        if (!startDate || !endDate) return false;

        // Verificar que la fecha final no sea anterior a la inicial
        if (isBefore(endDate, startDate)) {
            setError("La fecha final no puede ser anterior a la fecha inicial.");
            return false;
        }

        // Verificar que el rango no sea mayor a 3 meses
        if (isAfter(endDate, addMonths(startDate, 3))) {
            setError("El rango de fechas no puede ser mayor a 3 meses.");
            return false;
        }

        return true;
    };

    const tokenActive = async (url) => {
        try {
            const response = await axios.post('https://lector.jansprogramming.com.co/validar_token', {
                authUrl: url,
            });
            return response.status === 200; // Asumiendo que un código 200 significa que el token es válido
        } catch (error) {
            return false; // Si hay un error (como un 404), el token no es válido
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading2(true); // Activar el estado de carga del botón
        setShowProcessAlert(true); // Mostrar la alerta de proceso iniciado

        if (!serviceDownloadActive) {
            toast.error("No tienes acceso a esta función. Contacta al administrador.", {
                position: "top-center",
                autoClose: 5000,
            });
            setLoading2(false); // Desactivar el estado de carga del botón
            setShowProcessAlert(false); // Ocultar la alerta de proceso iniciado
            return;
        }

        if (!isValidUrl(url)) {
            setError("La URL debe comenzar con https://catalogo-vpfe.dian.gov.co/User/AuthToken?");
            setLoading2(false); // Desactivar el estado de carga del botón
            setShowProcessAlert(false); // Ocultar la alerta de proceso iniciado
            return;
        }

        const isTokenValid = await tokenActive(url);

        if (!isTokenValid) {
            setError("Este token está vencido o es inválido.");
            setLoading2(false); // Desactivar el estado de carga del botón
            setShowProcessAlert(false); // Ocultar la alerta de proceso iniciado
            return;
        }

        if (!validateDates()) {
            setLoading2(false); // Desactivar el estado de carga del botón
            setShowProcessAlert(false); // Ocultar la alerta de proceso iniciado
            return;
        }

        const formattedStartDate = format(startDate, "yyyy/MM/dd");
        const formattedEndDate = format(endDate, "yyyy/MM/dd");
        const formattedDateRange = `${formattedStartDate} - ${formattedEndDate}`;

        setError("");
        setSuccess(`URL y fechas válidas. Rango: ${formattedDateRange}`);
        let payload = {};
        if (url) {
            payload.auth_url = url;
        }
        if (formattedDateRange) {
            payload.date_range = formattedDateRange;
        }

        setActiveStep(1);
        setIsProcessing(true);

        try {
            const result = await axios.post('https://lector.jansprogramming.com.co/descargar', payload);
            setRequestId(result.data.request_id);
            toast.info("Se ha iniciado el proceso de descarga", {
                position: "top-right",
                autoClose: 3000
            });
        } catch (error) {
            setError("Error al iniciar el proceso de descarga. Por favor, intente nuevamente.");
            setIsProcessing(false);
            setActiveStep(0);
            setLoading2(false); // Desactivar el estado de carga del botón
            setShowProcessAlert(false); // Ocultar la alerta de proceso iniciado
            toast.error("Error al iniciar la descarga", {
                position: "top-right",
                autoClose: 5000
            });
        }
    };

    const resetForm = () => {
        setUrl("");
        setStartDate(null);
        setEndDate(null);
        setError("");
        setSuccess("");
        setRequestId(null);
        setStatus(null);
        setIsProcessing(false);
        setActiveStep(0);
        setDownloadComplete(false);
        setShowProcessAlert(false); // Ocultar la alerta de proceso iniciado
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(url).then(() => {
            toast.info("URL copiada al portapapeles", {
                position: "top-right",
                autoClose: 2000
            });
        });
    };

    useEffect(() => {
        if (!requestId) return;

        const statusInterval = setInterval(() => {
            axios
                .get(`https://lector.jansprogramming.com.co/estado/${requestId}`)
                .then((response) => {
                    const statusData = response.data;
                    setStatus(statusData.status);
                    setProgressDetail(statusData.progress_detail || "");
                    setProgressPercentage(parseInt(statusData.progress || "0"));
                    setCurrentDetail(statusData.detail || "");

                    if (statusData.error) {
                        setError(statusData.error);
                        clearInterval(statusInterval);
                        setIsProcessing(false);
                        setActiveStep(0);
                        setLoading2(false);
                        setShowProcessAlert(false);
                        toast.error("Error en el proceso: " + statusData.error, {
                            position: "top-right",
                            autoClose: 5000
                        });
                        return;
                    }

                    if (statusData.status === "completed") {
                        clearInterval(statusInterval);

                        axios.get(`https://lector.jansprogramming.com.co/obtener/${requestId}`, { responseType: 'blob' })
                            .then((response) => {
                                const url = window.URL.createObjectURL(new Blob([response.data]));
                                const link = document.createElement('a');
                                link.href = url;
                                link.setAttribute('download', `datos_facturacion_${format(new Date(), "yyyyMMdd")}.zip`);
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);

                                setIsProcessing(false);
                                setDownloadComplete(true);
                                setActiveStep(2);
                                setLoading2(false); // Desactivar el estado de carga del botón
                                setShowProcessAlert(false); // Ocultar la alerta de proceso iniciado

                                toast.success("¡Archivo descargado exitosamente!", {
                                    position: "top-center",
                                    autoClose: 5000,
                                });
                            })
                            .catch((error) => {
                                setError("Error al descargar el archivo. Intente nuevamente.");
                                setIsProcessing(false);
                                setActiveStep(0);
                                setLoading2(false); // Desactivar el estado de carga del botón
                                setShowProcessAlert(false); // Ocultar la alerta de proceso iniciado
                                toast.error("Error en la descarga del archivo", {
                                    position: "top-right",
                                    autoClose: 5000
                                });
                            });
                    }
                })
                .catch((error) => {
                    setError("Error al consultar el estado de la solicitud.");
                    clearInterval(statusInterval);
                    setIsProcessing(false);
                    setActiveStep(0);
                    setLoading2(false);
                    setShowProcessAlert(false);
                    toast.error("Error al verificar el estado de la descarga", {
                        position: "top-right",
                        autoClose: 5000
                    });
                });
        }, 2000); // Actualizar cada 2 segundos

        return () => {
            clearInterval(statusInterval);
        };
    }, [requestId]);

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
                <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 3 }}>
                    <Typography variant="h4" align="center" fontWeight="bold">
                        Descargar Documentos Electrónicos
                    </Typography>
                    <Typography variant="subtitle1" align="center">
                        Sistema de descarga de XMLs de la DIAN
                    </Typography>
                </Box>

                <Box sx={{ p: 4 }}>
                    {!serviceDownloadActive ? (
                        <Alert severity="error" sx={{ mb: 4 }}>
                            <Typography variant="body1" fontWeight="bold">
                                Función no disponible
                            </Typography>
                            <Typography variant="body2">
                                No tienes acceso a esta función. Por favor, contacta al administrador para obtener más información.
                            </Typography>
                        </Alert>
                    ) : null}

                    <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>

                    <Divider sx={{ my: 3 }} />

                    {activeStep === 0 && (
                        <Fade in={activeStep === 0}>
                            <Box component="form" onSubmit={handleSubmit}>
                                <Stack spacing={3}>
                                    {showProcessAlert && (
                                        <Alert severity="info" sx={{ mt: 2 }}>
                                            <Typography variant="body1">
                                                Se ha iniciado el proceso de validación. Por favor, espere...
                                            </Typography>
                                        </Alert>
                                    )}

                                    <Box sx={{ position: 'relative' }}>
                                        <TextField
                                            fullWidth
                                            label="URL de autenticación DIAN"
                                            placeholder="https://catalogo-vpfe.dian.gov.co/User/AuthToken?..."
                                            value={url}
                                            onChange={(e) => setUrl(e.target.value)}
                                            required
                                            error={!!error && !isValidUrl(url)}
                                            helperText={
                                                !!error && !isValidUrl(url)
                                                    ? "La URL debe comenzar con https://catalogo-vpfe.dian.gov.co/User/AuthToken?"
                                                    : "Copie y pegue la URL completa de autenticación de la DIAN"
                                            }
                                            InputProps={{
                                                endAdornment: (
                                                    <Tooltip title="Copiar URL">
                                                        <IconButton onClick={copyToClipboard} edge="end">
                                                            <CopyCheckIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                )
                                            }}
                                            disabled={!serviceDownloadActive} // Deshabilitar si el servicio no está activo
                                        />
                                        <Tooltip title="Para obtener la url, debes proceder a iniciar sesion en DIAN, ellos enviaran el token a su correo y usted lo coloca aca.">
                                            <IconButton
                                                sx={{ position: 'absolute', right: -40, top: 15 }}
                                                size="small"
                                            >
                                                <HelpCircle />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>

                                    <Typography variant="subtitle1" sx={{ mt: 2 }}>
                                        Seleccione el rango de fechas (máximo 3 meses)
                                    </Typography>

                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                            <DatePicker
                                                label="Fecha de inicio"
                                                value={startDate}
                                                onChange={(newValue) => setStartDate(newValue)}
                                                slotProps={{
                                                    textField: {
                                                        fullWidth: true,
                                                        required: true,
                                                        error: !!error && !startDate,
                                                        disabled: !serviceDownloadActive // Deshabilitar si el servicio no está activo
                                                    }
                                                }}
                                            />
                                            <DatePicker
                                                label="Fecha de fin"
                                                value={endDate}
                                                onChange={(newValue) => setEndDate(newValue)}
                                                slotProps={{
                                                    textField: {
                                                        fullWidth: true,
                                                        required: true,
                                                        error: !!error && !endDate,
                                                        disabled: !serviceDownloadActive // Deshabilitar si el servicio no está activo
                                                    }
                                                }}
                                            />
                                        </Stack>
                                    </LocalizationProvider>

                                    {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                                    {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}

                                    <Button
                                        type="submit"
                                        variant="contained"
                                        size="large"
                                        loading={loading2}
                                        fullWidth
                                        sx={{
                                            mt: 3,
                                            py: 1.5,
                                            borderRadius: 2,
                                            fontSize: '1.1rem'
                                        }}
                                        startIcon={loading2 ? <CircularProgress size={24} /> : <CloudDownload />}
                                        disabled={!serviceDownloadActive || loading2} // Deshabilitar si el servicio no está activo o si está cargando
                                    >
                                        {loading2 ? "Procesando..." : "Iniciar Descarga"}
                                    </Button>
                                </Stack>
                            </Box>
                        </Fade>
                    )}

                    {activeStep === 1 && (
                        <Fade in={activeStep === 1}>
                            <Box sx={{ textAlign: "center", p: 4 }}>
                                <CircularProgress
                                    size={80}
                                    thickness={4}
                                    sx={{ mb: 3 }}
                                />

                                <Typography variant="h5" sx={{ mb: 2, fontWeight: 'medium' }}>
                                    Procesando solicitud
                                </Typography>

                                <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
                                    Estado: {status === 'downloading' ? 'Descargando documentos...' : 'Preparando archivos...'}
                                </Typography>

                                <Alert severity="info" sx={{ mt: 4, textAlign: 'left' }}>
                                    <Typography variant="body2">
                                        Por favor, no cierre esta ventana hasta que la descarga haya finalizado.
                                        Este proceso puede tardar varios minutos dependiendo de la cantidad de documentos.
                                    </Typography>
                                </Alert>
                            </Box>
                        </Fade>
                    )}

                    {activeStep === 2 && (
                        <Fade in={activeStep === 2}>
                            <Box sx={{ textAlign: "center", p: 4 }}>
                                <Box
                                    sx={{
                                        width: 100,
                                        height: 100,
                                        borderRadius: '50%',
                                        bgcolor: 'success.light',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mx: 'auto',
                                        mb: 3
                                    }}
                                >
                                    <CloudDownloadIcon sx={{ fontSize: 60, color: 'white' }} />
                                </Box>

                                <Typography variant="h5" sx={{ mb: 2, fontWeight: 'medium', color: 'success.main' }}>
                                    ¡Descarga Completada con Éxito!
                                </Typography>

                                <Typography variant="body1" sx={{ mb: 4 }}>
                                    Su archivo ha sido descargado correctamente al directorio de descargas.
                                </Typography>

                                <Stack direction="row" spacing={2} justifyContent="center">
                                    <Button
                                        variant="outlined"
                                        onClick={resetForm}
                                        startIcon={<LucideListRestart />}
                                    >
                                        Realizar otra descarga
                                    </Button>
                                </Stack>

                                <Alert severity="success" sx={{ mt: 4, textAlign: 'left' }}>
                                    <Typography variant="body2">
                                        El archivo ZIP contiene todos los documentos electrónicos correspondientes al
                                        rango de fechas seleccionado.
                                    </Typography>
                                </Alert>
                            </Box>
                        </Fade>
                    )}
                    {isProcessing && (
                        <Box sx={{ mt: 3 }}>
                            <Alert severity="info" sx={{ mb: 2 }}>
                                <Typography variant="body1" gutterBottom>
                                    Estado actual: {currentDetail}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {progressDetail}
                                </Typography>
                                <Box sx={{ width: '100%', mt: 2 }}>
                                    <LinearProgress
                                        variant="determinate"
                                        value={progressPercentage}
                                        sx={{ height: 8, borderRadius: 2 }}
                                    />
                                    <Typography variant="body2" color="textSecondary" align="right" sx={{ mt: 1 }}>
                                        {progressPercentage}%
                                    </Typography>
                                </Box>
                            </Alert>
                        </Box>
                    )}
                </Box>
            </Paper>

            <Typography variant="caption" color="text.secondary" align="center" display="block" sx={{ mt: 4 }}>
                Sistema de Descarga de Documentos Electrónicos DIAN • {new Date().getFullYear()} • v2.0
            </Typography>
        </Container>
    );
}