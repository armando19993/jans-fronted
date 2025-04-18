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
import PackagesTableRow from '../packages-table-row';
import PackagesTableHead from '../packages-table-head';
import PackagesTableToolbar from '../packages-table-toolbar';
import TableEmptyRows from 'src/sections/user/table-empty-rows';
import PackageModal from '../package-modal';
import { instanceWithToken } from 'src/utils/instance';
import { toast } from 'react-toastify';

export default function PackagesView() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('title');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openModal, setOpenModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const [packages, setPackages] = useState([]);

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(id);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = packages.map((n) => n.title);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, title) => {
    const selectedIndex = selected.indexOf(title);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, title);
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
    inputData: packages,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => {
    setOpenModal(false);
    setEditData(null);
  };

  const handleAddPackage = (data) => {
    instanceWithToken
      .post('packages', data)
      .then((result) => {
        toast.success('Paquete creado con éxito!');
        getPackages();
        handleCloseModal();
      })
      .catch((e) => {
        toast.error(
          'Error al intentar registrar el paquete. Intenta nuevamente, recuerda todos los datos deben estar llenos!'
        );
      });
  };

  const handleEditPackage = (data) => {
    setEditData(data);
    setOpenModal(true);
  };

  const update = (data, id) => {
    instanceWithToken
      .patch(`packages/${id}`, data)
      .then((result) => {
        toast.success('Paquete actualizado con éxito!');
        getPackages();
        handleCloseModal();
      })
      .catch((e) => {
        toast.error(
          'Error al intentar actualizar el paquete. Intenta nuevamente, recuerda todos los datos deben estar llenos!'
        );
      });
  };

  const getPackages = () => {
    instanceWithToken.get('packages').then((result) => {
      setPackages(result.data);
    });
  };

  const deleteAction = (id) => {
    instanceWithToken
      .delete(`packages/${id}`)
      .then((result) => {
        toast.success('Paquete eliminado con éxito!');
        getPackages();
      })
      .catch((e) => {
        toast.error(
          'Error al intentar eliminar el paquete. Intenta nuevamente!'
        );
      });
  };

  useEffect(() => {
    getPackages();
  }, []);

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Paquetes</Typography>

        <Button
          variant="contained"
          color="inherit"
          onClick={handleOpenModal}
          startIcon={<Iconify icon="eva:plus-fill" />}
        >
          Agregar Paquete
        </Button>
      </Stack>

      <Card>
        <PackagesTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <PackagesTableHead
                order={order}
                orderBy={orderBy}
                rowCount={packages.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'title', label: 'Título' },
                  { id: 'shortDescription', label: 'Descripción' },
                  { id: 'price', label: 'Precio' },
                  { id: 'items', label: 'Items' },
                  { id: '', label: 'Acciones' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <PackagesTableRow
                      key={row.id}
                      id={row.id}
                      title={row.title}
                      shortDescription={row.shortDescription}
                      price={row.price}
                      items={row.items}
                      selected={selected.indexOf(row.title) !== -1}
                      handleClick={(event) => handleClick(event, row.title)}
                      onEdit={handleEditPackage}
                      onDelete={deleteAction}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, packages.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={packages.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>

      <PackageModal
        open={openModal}
        onClose={handleCloseModal}
        onSubmit={editData ? (data) => update(data, editData.id) : handleAddPackage}
        isEdit={!!editData}
        initialData={editData}
      />
    </Container>
  );
}
