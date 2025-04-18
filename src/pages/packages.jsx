import { Helmet } from 'react-helmet-async';
import PackagesView from 'src/sections/packages/view/packages-view';

export default function PackagesPage() {
  return (
    <>
      <Helmet>
        <title> Paquetes </title>
      </Helmet>

      <PackagesView />
    </>
  );
}
