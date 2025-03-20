import { useState } from 'react';
import PropTypes from 'prop-types';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import CompanyModal from './company-modal';

export default function CompanyTableRow({
  selected,
  nit,
  name,
  ctda_users,
  ctda_documents,
  date_start,
  date_end,
  handleClick,
  onEdit,
  onDelete,
  onActivate,
  id,
  email,
  phone,
  status,
  service_radian,
  service_download
}) {
  const [openMenu, setOpenMenu] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  // Controla el menú desplegable
  const handleOpenMenu = (event) => {
    setOpenMenu(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenu(null);
  };

  // Controla la apertura del modal
  const handleOpenModal = () => {
    setOpenModal(true);
    handleCloseMenu();
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleEditSubmit = (formData) => {
    onEdit(formData, id);
  };

  // Función para obtener el color del badge según el estado
  const getStatusColor = (status) => {
    switch (status) {
      case 'activo':
        return 'success';
      case 'suspendido':
        return 'warning';
      case 'eliminado':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell>{nit}</TableCell>
        <TableCell>{name}</TableCell>
        <TableCell>{ctda_users}</TableCell>
        <TableCell>{ctda_documents}</TableCell>
        <TableCell>{date_start}</TableCell>
        <TableCell>{date_end}</TableCell>

        {/* Columna de Estado con Badges */}
        <TableCell>
          <Label color={getStatusColor(status)}>{status}</Label>
        </TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      {/* Menú desplegable */}
      <Popover
        open={!!openMenu}
        anchorEl={openMenu}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 140 },
        }}
      >
        <MenuItem onClick={handleOpenModal}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Editar
        </MenuItem>

        {status != 'SUSPENDIDO' && (
          <MenuItem
            onClick={() => {
              onDelete(id);
              handleCloseMenu();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
            Desactivar
          </MenuItem>
        )}

        {status == 'SUSPENDIDO' && (
          <MenuItem
            onClick={() => {
              onActivate(id);
              handleCloseMenu();
            }}
            sx={{ color: 'success.main' }}
          >
            <Iconify icon="eva:checkmark-square-2-fill" sx={{ mr: 2 }} />
            Activar
          </MenuItem>
        )}
      </Popover>

      {/* Modal para editar */}
      <CompanyModal
        open={openModal}
        onClose={handleCloseModal}
        onSubmit={handleEditSubmit}
        isEdit={true}
        initialData={{ nit, name, ctda_users, ctda_documents, date_start, date_end, phone, email, service_download, service_radian }}
      />
    </>
  );
}

CompanyTableRow.propTypes = {
  selected: PropTypes.bool,
  nit: PropTypes.string,
  name: PropTypes.string,
  ctda_users: PropTypes.number,
  ctda_documents: PropTypes.number,
  date_start: PropTypes.string,
  date_end: PropTypes.string,
  handleClick: PropTypes.func,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  id: PropTypes.string,
  email: PropTypes.string,
  phone: PropTypes.string,
  status: PropTypes.oneOf(['activo', 'suspendido', 'eliminado']).isRequired,
};
