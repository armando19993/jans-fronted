import React, { useState, useEffect } from 'react';
import {
    Button,
    Container,
    Stack,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    IconButton,
    Tooltip,
    CircularProgress,
    Grid
} from "@mui/material";
import { Helmet } from 'react-helmet-async';
import Iconify from 'src/components/iconify';
import { instanceWithToken } from 'src/utils/instance';
import { toast } from 'react-toastify';

export default function ReportesPage() {
    const [lotes, setLotes] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loading, setLoading] = useState(false);

    const getReport = () => {
        if (!startDate || !endDate) {
            toast.error("Debes seleccionar fecha de inicio y fecha final")
            return
        }
        setLoading(true)

        instanceWithToken.get(`lotes/get/admin/report?startDate=${startDate}&endDate=${endDate}`).then((result) => {
            setLotes(result.data)
        }).finally(() => {
            setLoading(false)
        })
    }

    const handleClearFilters = () => {
        setStartDate('');
        setEndDate('');
        setLotes(sampleData);
    };

    return (
        <Container>
            <Helmet>
                <title>Reporte Global</title>
            </Helmet>

            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
                <Typography variant="h4" sx={{ color: '#1976d2', fontWeight: 600 }}>Reporte Global</Typography>
            </Stack>

            {/* Sección de Filtros */}
            <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: '12px' }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>Filtros</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            label="Fecha Inicio"
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            label="Fecha Fin"
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={4} display="flex" justifyContent="center" alignItems="center">
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={getReport}
                            disabled={loading}
                            startIcon={loading ? <CircularProgress size={20} /> : <Iconify icon="mdi:filter" />}
                            sx={{ mr: 1 }}
                        >
                            Filtrar
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={handleClearFilters}
                            startIcon={<Iconify icon="mdi:filter-remove" />}
                        >
                            Limpiar
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* Tabla de Resultados */}
            <TableContainer component={Paper} elevation={3} sx={{ borderRadius: '12px', overflow: 'hidden' }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#1565c0' }}>
                            <TableCell sx={{ color: '#fff', fontWeight: 600 }}>ID Compañía</TableCell>
                            <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Nombre Compañía</TableCell>
                            <TableCell align="right" sx={{ color: '#fff', fontWeight: 600 }}>Total Lotes</TableCell>
                            <TableCell align="right" sx={{ color: '#fff', fontWeight: 600 }}>Total Documentos</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    <CircularProgress />
                                </TableCell>
                            </TableRow>
                        ) : lotes.length > 0 ? (
                            lotes.map((lote) => (
                                <TableRow key={lote.companyId} hover>
                                    <TableCell>{lote.companyId}</TableCell>
                                    <TableCell>{lote.companyName}</TableCell>
                                    <TableCell align="right">{lote.totalLotes}</TableCell>
                                    <TableCell align="right">{lote.totalDocuments}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} align="center">No se encontraron resultados.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
}