import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';
import CompanyPage from 'src/pages/company';
import ComunicationPage from 'src/pages/comunications';
import DownloadPage from 'src/pages/download';
import PackagesPage from 'src/pages/packages';
import ReportesPage from 'src/pages/reportes';
import DocumentsPage from 'src/sections/documents/view/documents-view';
import LotePage from 'src/sections/lotes/view/lotes-view';

export const IndexPage = lazy(() => import('src/pages/app'));
export const UserPage = lazy(() => import('src/pages/user'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: '',
      element: <LoginPage />,
    },
    {
      path: 'dashboard',
      element: (
        <DashboardLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        { element: <IndexPage />, index: true },
        { path: 'user', element: <UserPage /> },
        { path: 'company', element: <CompanyPage /> },
        { path: 'lotes', element: <LotePage /> },
        { path: 'documents/:loteId', element: <DocumentsPage /> },
        { path: 'comunications/', element: <ComunicationPage /> },
        { path: 'download/', element: <DownloadPage /> },
        { path: 'reportes', element: <ReportesPage /> },
        { path: 'packages', element: <PackagesPage /> }
      ],
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
