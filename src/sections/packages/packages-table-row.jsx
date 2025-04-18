import PropTypes from 'prop-types';
import { useState } from 'react';
import {
  Stack,
  TableRow,
  Checkbox,
  MenuItem,
  TableCell,
  IconButton,
  Typography,
  Chip,
  Tooltip,
  Popover,
} from '@mui/material';

import Iconify from 'src/components/iconify';
import PackageDetailModal from './package-detail-modal';

export default function PackagesTableRow({
  id,
  title,
  shortDescription,
  price,
  items,
  selected,
  handleClick,
  onEdit,
  onDelete,
}) {
  const [open, setOpen] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleEdit = () => {
    onEdit({
      id,
      title,
      shortDescription,
      price,
      items,
    });
    handleCloseMenu();
  };

  const handleDelete = () => {
    onDelete(id);
    handleCloseMenu();
  };

  const handleOpenDetailModal = () => {
    setDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setDetailModalOpen(false);
  };

  // Format price safely, handling cases where it might not be a number
  const formatPrice = (value) => {
    const numPrice = Number(value);
    return !isNaN(numPrice) ? `$${numPrice.toFixed(2)}` : `$${value}`;
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>

        <TableCell>
          <Typography variant="subtitle2" noWrap>
            {title}
          </Typography>
        </TableCell>

        <TableCell>
          <Typography variant="body2" noWrap sx={{ maxWidth: 250 }}>
            {shortDescription}
          </Typography>
        </TableCell>

        <TableCell>{formatPrice(price)}</TableCell>

        <TableCell>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {items && items.length > 0 ? (
              <Tooltip title="Ver detalles">
                <Chip 
                  label={`${items.length} items`} 
                  color="primary" 
                  size="small" 
                  onClick={handleOpenDetailModal}
                  clickable
                  sx={{ cursor: 'pointer' }}
                />
              </Tooltip>
            ) : (
              <Chip label="Sin items" color="default" size="small" />
            )}
          </Stack>
        </TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <PackageDetailModal
        open={detailModalOpen}
        onClose={handleCloseDetailModal}
        packageData={{ id, title, shortDescription, price, items }}
      />

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 140 },
        }}
      >
        <MenuItem onClick={handleEdit}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Editar
        </MenuItem>

        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Eliminar
        </MenuItem>
      </Popover>
    </>
  );
}

PackagesTableRow.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string,
  shortDescription: PropTypes.string,
  price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  items: PropTypes.array,
  selected: PropTypes.bool,
  handleClick: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};
