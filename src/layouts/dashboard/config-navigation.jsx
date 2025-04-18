import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'inicio',
    path: '/dashboard',
    icon: icon('ic_analytics'),
    roles: ['SADMIN', 'ADMIN', 'OPERATOR'],
    requiredService: null,
  },
  {
    title: 'usuarios',
    path: '/dashboard/user',
    icon: icon('ic_user'),
    roles: ['SADMIN', 'ADMIN'],
    requiredService: null,
  },
  {
    title: 'empresas',
    path: '/dashboard/company',
    icon: icon('ic_company'),
    roles: ['SADMIN'],
    requiredService: null,
  },
  {
    title: 'paquetes',
    path: '/dashboard/packages',
    icon: icon('ic_company'),
    roles: ['SADMIN'],
    requiredService: null,
  },
  {
    title: 'comunicados',
    path: '/dashboard/comunications',
    icon: icon('ic_company'),
    roles: ['SADMIN'],
    requiredService: null,
  },
  {
    title: 'lotes',
    path: '/dashboard/lotes',
    icon: icon('ic_company'),
    roles: ['SADMIN', 'ADMIN', 'OPERATOR'],
    requiredService: 'service_radian',
  },
  {
    title: 'descargar xml',
    path: '/dashboard/download',
    icon: icon('ic_company'),
    roles: ['SADMIN', 'ADMIN', 'OPERATOR'],
    requiredService: null,
  },
  {
    title: 'reportes',
    path: '/dashboard/reportes',
    icon: icon('ic_company'),
    roles: ['SADMIN'],
    requiredService: null
  },
];

export default navConfig;
