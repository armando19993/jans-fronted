import { Helmet } from 'react-helmet-async';
import { ReportesView } from 'src/sections/reportes/view';


// ----------------------------------------------------------------------

export default function ReportesPage() {
    return (
        <>
            <Helmet>
                <title> Reportes </title>
            </Helmet>

            <ReportesView />
        </>
    );
}
