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
          <Button
            color="success"
            onClick={(event) => {
              () => navigate('/dashboard/documents/' + lote.id);
            }}
          >
            <Iconify icon="eva:eye-fill" sx={{ mr: 2 }} />
            Ver
          </Button>
        </TableCell>
      </TableRow>
    </>
  );
}

LoteTableRow.propTypes = {
  lote: PropTypes.any.isRequired,
};
