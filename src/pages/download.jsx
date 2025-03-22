import { Helmet } from 'react-helmet-async';
import { DownloadView } from 'src/sections/download/view';
// import { LotesView } from 'src/sections/lotes/view';

export default function DownloadPage() {
    return (
        <>
            <Helmet>
                <title> Descargar XML </title>
            </Helmet>

            <DownloadView />
        </>
    );
}
