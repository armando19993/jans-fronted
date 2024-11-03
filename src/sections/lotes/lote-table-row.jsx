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
import { instanceWithToken } from 'src/utils/instance';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

// ----------------------------------------------------------------------

export default function LoteTableRow({ lote }) {
  const [openMenu, setOpenMenu] = useState(null);
  const navigate = useNavigate();
  const handleOpenMenu = (event) => {
    setOpenMenu(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenu(null);
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox">
        <TableCell>{lote.id}</TableCell>
        <TableCell>{format(new Date(lote.createdAt), 'dd-MM-yyyy HH:mm')}</TableCell>
        <TableCell>{lote.company.name}</TableCell>
        <TableCell>{lote.user.name}</TableCell>
        <TableCell>{lote.ctda_registros}</TableCell>

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
        <MenuItem onClick={() => navigate('/dashboard/documents/' + lote.id)}>
          <Iconify icon="eva:eye-fill" sx={{ mr: 2 }} />
          Ver
        </MenuItem>
        <MenuItem onClick={() => alert('Hoal')} sx={{ color: '#008c00' }}>
          <Iconify icon="catppuccin:ms-excel" sx={{ mr: 2 }} />
          Exportar
        </MenuItem>
      </Popover>
    </>
  );
}

LoteTableRow.propTypes = {
  lote: PropTypes.any.isRequired,
};
