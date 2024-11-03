import { Helmet } from 'react-helmet-async';
import { ComunicationView } from 'src/sections/comunications/view';

export default function ComunicationPage() {
  return (
    <>
      <Helmet>
        <title> Comunicados </title>
      </Helmet>

      <ComunicationView />
    </>
  );
}
