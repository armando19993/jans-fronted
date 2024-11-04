import { useState } from 'react';
import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import UserModal from './user-modal';
import { instanceWithToken } from 'src/utils/instance';
import { toast } from 'react-toastify';

// ----------------------------------------------------------------------

export default function UserTableRow({
  selected,
  name,
  user,
  company,
  companyId,
  role,
  status,
  id,
  handleClick,
}) {
  const [openMenu, setOpenMenu] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleOpenMenu = (event) => {
    setOpenMenu(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenu(null);
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setOpenModal(true);
    handleCloseMenu(); // Cerrar el menú al abrir el modal
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setSelectedUser(null);
  };

  const handleSubmit = (data) => {
    instanceWithToken
      .patch('user/' + id, data)
      .then((result) => {
        toast.success('Usuario actualizado con exito!');
        handleClick();
      })
      .catch((e) => {
        toast.error(
          'Error al intentar registrar al usuario intenta nuevamente, recuerda todos los datos deben estar llenos!'
        );
      });
    handleModalClose();
  };

  const setStatus = (status, id) => {
    instanceWithToken.patch('user/' + id, { status }).then((result) => {
      toast.success(`El usuario ${name} se le actualizo el estado correctamente`);
      handleClick();
    });

    handleCloseMenu();
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell>{name}</TableCell>
        <TableCell>{user}</TableCell>
        <TableCell>{company}</TableCell>
        <TableCell>
          {role === 'SADMIN' ? 'SUPER ADMIN' : role === 'ADMIN' ? 'ADMINISTRADOR' : 'OPERADOR'}
        </TableCell>

        <TableCell>
          <Label color={status === 'SUSPENDIDO' ? 'error' : 'success'}>{status}</Label>
        </TableCell>
        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={Boolean(openMenu)}
        anchorEl={openMenu}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{ sx: { width: 140 } }}
      >
        <MenuItem
          onClick={() => handleEditClick({ name, username: user, role, company: companyId })}
        >
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Editar
        </MenuItem>
        {status === 'ACTIVO' && (
          <MenuItem onClick={() => setStatus('SUSPENDIDO', id)} sx={{ color: 'error.main' }}>
            <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
            Suspender
          </MenuItem>
        )}
        {status === 'SUSPENDIDO' && (
          <MenuItem onClick={() => setStatus('ACTIVO', id)} sx={{ color: 'success.main' }}>
            <Iconify icon="mdi:account-check" sx={{ mr: 2 }} />
            Activar
          </MenuItem>
        )}
      </Popover>

      <UserModal
        open={openModal}
        onClose={handleModalClose}
        onSubmit={handleSubmit}
        isEdit={true}
        initialData={selectedUser || {}}
      />
    </>
  );
}

UserTableRow.propTypes = {
  company: PropTypes.string.isRequired,
  handleClick: PropTypes.func,
  name: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired,
  status: PropTypes.string.isRequired,
};
