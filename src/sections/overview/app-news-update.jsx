import { useState } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import { fToNow } from 'src/utils/format-time';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

// ----------------------------------------------------------------------

export default function AppNewsUpdate({ title, subheader, list, ...other }) {
  const [open, setOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);

  const handleOpenModal = (news) => {
    setSelectedNews(news);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setSelectedNews(null);
  };

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Scrollbar>
        <Stack spacing={3} sx={{ p: 3, pr: 0 }}>
          {list.map((news) => (
            <NewsItem key={news.id} news={news} onClick={() => handleOpenModal(news)} />
          ))}
        </Stack>
      </Scrollbar>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <Box sx={{ p: 2, textAlign: 'right' }}>
        <Button
          size="small"
          color="inherit"
          endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
        >
          View all
        </Button>
      </Box>

      {/* Modal para ver comunicado */}
      <Dialog open={open} onClose={handleCloseModal} fullWidth maxWidth="md">
        <DialogTitle>{selectedNews?.comunication?.titulo}</DialogTitle>
        <DialogContent>
          <div dangerouslySetInnerHTML={{ __html: selectedNews?.comunication?.description }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}

AppNewsUpdate.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  list: PropTypes.array.isRequired,
};

// ----------------------------------------------------------------------

function NewsItem({ news, onClick }) {
  const { comunication, createdAt } = news;

  return (
    <Stack direction="row" alignItems="center" spacing={2} onClick={onClick} sx={{ cursor: 'pointer' }}>
      <Box sx={{ minWidth: 240, flexGrow: 1 }}>
        <Link color="inherit" variant="subtitle2" underline="hover" noWrap>
          {comunication.titulo}
        </Link>
      </Box>

      <Typography variant="caption" sx={{ pr: 3, flexShrink: 0, color: 'text.secondary' }}>
        {fToNow(createdAt)}
      </Typography>
    </Stack>
  );
}

NewsItem.propTypes = {
  news: PropTypes.shape({
    comunication: PropTypes.shape({
      titulo: PropTypes.string,
      description: PropTypes.string,
    }),
    createdAt: PropTypes.instanceOf(Date),
  }),
  onClick: PropTypes.func.isRequired,
};
