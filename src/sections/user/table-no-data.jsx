import PropTypes from 'prop-types';

import Paper from '@mui/material/Paper';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

export default function TableNoData({ query }) {
  return (
    <TableRow>
      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
        <Paper
          sx={{
            textAlign: 'center',
          }}
        >
          <Typography variant="h6" paragraph>
            No existen registros!
          </Typography>

          <Typography variant="body2">
            No Hay resultados para &nbsp;
            <strong>&quot;{query}&quot;</strong>.
            <br /> Intenta usando otro termino
          </Typography>
        </Paper>
      </TableCell>
    </TableRow>
  );
}

TableNoData.propTypes = {
  query: PropTypes.string,
};
