import { useEffect, useState } from 'react';
import { Button, Card, Container, Stack, Typography } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import LoteModal from '../lote-modal';
import { instanceWithToken } from 'src/utils/instance';
import { toast } from 'react-toastify';
import Iconify from 'src/components/iconify';
import LoteTableRow from '../lote-table-row';
import CompanyTableHead from 'src/sections/company/company-table-head';

// ----------------------------------------------------------------------

export default function LotePage() {
  const [openModal, setOpenModal] = useState(false);
  const [selected, setSelected] = useState([]);
  const [lotes, setLotes] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');

  const getLotes = () => {
    instanceWithToken.get('lotes').then((result) => {
      setLotes(result.data.data);
    });
  };

  useEffect(() => {
    getLotes();
  }, []);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(id);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = lotes.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleSubmit = (loteData) => {
    instanceWithToken
      .post('lotes', loteData)
      .then((result) => {
        toast.success('Lote creado con éxito!');
        getLotes();
      })
      .catch((e) => {
        let message = e.response ? e.response.data.message : 'Error desconocido';
        toast.error(message);
      });
    handleCloseModal();
  };

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Lotes</Typography>
        <Button
          variant="contained"
          onClick={handleOpenModal}
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
        >
          Cargar Nuevo Lote
        </Button>
      </Stack>

      <Card>
        <TableContainer>
          <Table>
            <CompanyTableHead
              order={order}
              orderBy={orderBy}
              rowCount={lotes.length}
              numSelected={selected.length}
              onRequestSort={handleSort}
              onSelectAllClick={handleSelectAllClick}
              headLabel={[
                { id: 'id', label: 'ID' },
                { id: 'name', label: 'Fecha' },
                { id: 'ctda_users', label: 'Empresa' },
                { id: 'ctda_documents', label: 'Usuario' },
                { id: 'ctda_regss', label: 'Documentos' },
              ]}
            />
            <TableBody>
              {lotes
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((lote) => (
                  <LoteTableRow key={lote.id} lote={lote} />
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          page={page}
          component="div"
          count={lotes.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>

      <LoteModal open={openModal} onClose={handleCloseModal} onSubmit={handleSubmit} />
    </Container>
  );
}
