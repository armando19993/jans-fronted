import { Helmet } from 'react-helmet-async';
import { LotesView } from 'src/sections/lotes/view';

export default function LopesPage() {
  return (
    <>
      <Helmet>
        <title> Empresas </title>
      </Helmet>

      <LotesView />
    </>
  );
}
