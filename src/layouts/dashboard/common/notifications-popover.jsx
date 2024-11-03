import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { instanceWithToken } from 'src/utils/instance'; // Asegúrate de tener tu instancia configurada

import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Scrollbar from 'src/components/scrollbar';
import Iconify from 'src/components/iconify';
import { fToNow } from 'src/utils/format-time';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

export default function NotificationsPopover() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const fetchComunications = async () => {
    try {
      const response = await instanceWithToken.get('user/comunicados/notificaciones');
      const notificationsData = response.data.data.map((comunication) => ({
        id: comunication.id,
        title: comunication.comunication.titulo,
        description: comunication.comunication.description,
        createdAt: new Date(comunication.createdAt),
        isUnRead: true,
        type: 'comunication',
      }));
      setNotifications(notificationsData);
    } catch (error) {
      console.error('Error fetching communications:', error);
    }
  };

  useEffect(() => {
    fetchComunications();
  }, []);

  const totalUnRead = notifications.filter((item) => item.isUnRead).length;

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, isUnRead: false })));
  };

  const handleNotificationClick = async (notification) => {
    setSelectedNotification(notification);
    await instanceWithToken.patch(`comunications-client/${notification.id}`, { view: true });
    await fetchComunications(); // Actualiza las notificaciones después de cambiar el estado
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedNotification(null);
  };

  return (
    <>
      <IconButton color={open ? 'primary' : 'default'} onClick={handleOpen}>
        <Badge badgeContent={totalUnRead} color="error">
          <Iconify width={24} icon="solar:bell-bing-bold-duotone" />
        </Badge>
      </IconButton>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            mt: 1.5,
            ml: 0.75,
            width: 360,
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Notificaciones</Typography>
          </Box>
          {totalUnRead > 0 && (
            <Tooltip title="Marcar todas como leídas">
              <IconButton color="primary" onClick={handleMarkAllAsRead}>
                <Iconify icon="eva:done-all-fill" />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Scrollbar sx={{ height: { xs: 340, sm: 'auto' } }}>
          <List
            disablePadding
            subheader={
              <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                Todas
              </ListSubheader>
            }
          >
            {notifications.slice(0, 2).map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onClick={() => handleNotificationClick(notification)}
              />
            ))}
          </List>
        </Scrollbar>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Box sx={{ p: 1 }}>
          <Button fullWidth disableRipple>
            Ver Todas
          </Button>
        </Box>
      </Popover>

      {/* Modal para mostrar detalles de la notificación */}
      <Dialog open={modalOpen} onClose={handleModalClose} fullWidth maxWidth="lg">
        <DialogTitle>{selectedNotification?.title}</DialogTitle>
        <DialogContent>
          <Box
            component="div"
            dangerouslySetInnerHTML={{ __html: selectedNotification?.description }} // Mostrar HTML
          />
          <Typography variant="caption" color="text.secondary">
            {fToNow(selectedNotification?.createdAt)} {/* Fecha en español */}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

// ----------------------------------------------------------------------

NotificationItem.propTypes = {
  notification: PropTypes.shape({
    createdAt: PropTypes.instanceOf(Date),
    id: PropTypes.string,
    isUnRead: PropTypes.bool,
    title: PropTypes.string,
    description: PropTypes.string,
    type: PropTypes.string,
  }),
  onClick: PropTypes.func,
};

function NotificationItem({ notification, onClick }) {
  return (
    <ListItemButton
      sx={{
        py: 1.5,
        px: 2.5,
        mt: '1px',
        ...(notification.isUnRead && {
          bgcolor: 'action.selected',
        }),
      }}
      onClick={onClick}
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: 'background.neutral' }}>
          <Iconify icon="eva:bell-fill" />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          <Typography variant="subtitle2" noWrap>
            {notification.title}
          </Typography>
        }
        secondary={
          <Typography variant="caption" color="text.secondary">
            {fToNow(notification.createdAt)}
          </Typography>
        }
      />
    </ListItemButton>
  );
}
