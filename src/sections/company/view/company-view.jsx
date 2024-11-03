import { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Stack,
  Container,
  Typography,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
} from '@mui/material';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { emptyRows, applyFilter, getComparator } from '../utils';
import TableNoData from 'src/sections/user/table-no-data';
import CompanyTableRow from '../company-table-row';
import CompanyTableHead from '../company-table-head';
import CompanyTableToolbar from '../company-table-toolbar';
import TableEmptyRows from 'src/sections/user/table-empty-rows';
import CompanyModal from '../company-modal';
import { instanceWithToken } from 'src/utils/instance';
import { toast } from 'react-toastify';

export default function CompanyPage() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openModal, setOpenModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const [companies, setCompanies] = useState([]);

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(id);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = companies.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const dataFiltered = applyFilter({
    inputData: companies,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => {
    setOpenModal(false);
    setEditData(null);
  };

  const handleAddCompany = (data) => {
    instanceWithToken
      .post('company', data)
      .then((result) => {
        toast.success('Empresa creada con exito!');
        getCompanies();
      })
      .catch((e) => {
        toast.error(
          'Error al intentar registrar la empresa intenta nuevamente, recuerda todos los datos deben estar llenos!'
        );
      });
  };

  const update = (data, id) => {
    instanceWithToken
      .patch('company/' + id, data)
      .then((result) => {
        toast.success('Empresa actualizada con exito!');
        getCompanies();
      })
      .catch((e) => {
        toast.error(
          'Error al intentar actualizar la empresa intenta nuevamente, recuerda todos los datos deben estar llenos!'
        );
      });
  };

  const getCompanies = () => {
    instanceWithToken.get('company').then((result) => {
      setCompanies(result.data.data);
    });
  };

  const deleteAction = (id) => {
    instanceWithToken
      .delete('company/' + id)
      .then((result) => {
        toast.success('Empresa suspendida con exito!');
        getCompanies();
      })
      .catch((e) => {
        toast.error(
          'Error al intentar suspender la empresa intenta nuevamente, recuerda todos los datos deben estar llenos!'
        );
      });
  };

  const activate = (id) => {
    instanceWithToken
      .patch('company/' + id, { status: 'ACTIVO' })
      .then((result) => {
        toast.success('Empresa activada con exito!');
        getCompanies();
      })
      .catch((e) => {
        toast.error(
          'Error al intentar suspender la empresa intenta nuevamente, recuerda todos los datos deben estar llenos!'
        );
      });
  };

  useEffect(() => {
    getCompanies();
  }, []);

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Empresas</Typography>

        <Button
          variant="contained"
          color="inherit"
          onClick={handleOpenModal}
          startIcon={<Iconify icon="eva:plus-fill" />}
        >
          Agregar Empresa
        </Button>
      </Stack>

      <Card>
        <CompanyTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <CompanyTableHead
                order={order}
                orderBy={orderBy}
                rowCount={companies.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'nit', label: 'NIT' },
                  { id: 'name', label: 'Razón Social' },
                  { id: 'ctda_users', label: 'Ctda. Usuarios' },
                  { id: 'ctda_documents', label: 'Ctda. Docs' },
                  { id: 'date_start', label: 'F. Inicio' },
                  { id: 'date_end', label: 'F. Fin' },
                  { ida: 'estado', label: 'Estado' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <CompanyTableRow
                      key={row.id}
                      nit={row.nit}
                      name={row.name}
                      ctda_users={row.ctda_users}
                      ctda_documents={row.ctda_documents}
                      date_start={row.date_start}
                      date_end={row.date_end}
                      selected={selected.indexOf(row.name) !== -1}
                      handleClick={(event) => handleClick(event, row.name)}
                      onEdit={update}
                      onDelete={deleteAction}
                      onActivate={activate}
                      email={row.email}
                      phone={row.phone}
                      status={row.status}
                      id={row.id}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, companies.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={companies.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>

      <CompanyModal
        open={openModal}
        onClose={handleCloseModal}
        onSubmit={handleAddCompany}
        isEdit={false}
      />
    </Container>
  );
}
