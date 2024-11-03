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
  },
  {
    title: 'usuarios',
    path: '/dashboard/user',
    icon: icon('ic_user'),
    roles: ['SADMIN', 'ADMIN'],
  },
  {
    title: 'empresas',
    path: '/dashboard/company',
    icon: icon('ic_company'),
    roles: ['SADMIN'],
  },
  {
    title: 'comunicados',
    path: '/dashboard/comunications',
    icon: icon('ic_company'),
    roles: ['SADMIN'],
  },
  {
    title: 'lotes',
    path: '/dashboard/lotes',
    icon: icon('ic_company'),
    roles: ['SADMIN', 'ADMIN', 'OPERATOR'],
  },
];

export default navConfig;
