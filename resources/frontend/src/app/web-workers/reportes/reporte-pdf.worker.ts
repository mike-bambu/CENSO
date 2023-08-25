/// <reference lib="webworker" />
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { ReporteFichaInformativa } from './reporte-tarjeta-informativa';
import { ReporteIngresoPacientes } from './reporte-atencion-pacientes';
import { ReporteCamas } from './reporte-camas';
import { ReporteMonitoreoPacientes } from './reporte-monitoreo-pacientes';
import { ReportePacientesAmbulatorios } from './reporte-pacientes-ambulatorios';
import { ReporteVisitasPuerperales } from './reporte-visitas-puerperales';
import { ReporteEmbarazadas }       from  './reporte-embarazadas';
import { ReporteEmbarazosAmbulatorios }   from  './reporte-embarazos-ambulatorios';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const reportes = {
  '/tarjeta-informativa'                    : new ReporteFichaInformativa(),
  '/atencion-pacientes'                     : new ReporteIngresoPacientes(),
  '/reporte-camas'                          : new ReporteCamas(),
  '/reporte-monitoreo-pacientes'            : new ReporteMonitoreoPacientes(),
  '/reporte-pacientes-ambulatorios'         : new ReportePacientesAmbulatorios(),
  '/reporte-visitas-puerperales'            : new ReporteVisitasPuerperales(),
  '/reporte-embarazadas'                    : new ReporteEmbarazadas(),
  '/reporte-embarazos-ambulatorios'         : new ReporteEmbarazosAmbulatorios()
  //'empleados/personal-activo-area': new ReportePersonalActivoArea()
};

addEventListener('message', ({ data }) => {
  console.log("plop", data.data);

  const documentDefinition = reportes[data.reporte].getDocumentDefinition(data.data);

  const pdfReporte = pdfMake.createPdf(documentDefinition);

  pdfReporte.getBase64(function(encodedString) {
      const base64data = encodedString;
      //console.log(base64data);
      const bytes = atob( base64data ), len = bytes.length;
      const buffer = new ArrayBuffer( len ), view = new Uint8Array( buffer );
      for ( let i=0 ; i < len ; i++ )
        view[i] = bytes.charCodeAt(i) & 0xff;
      const file = new Blob( [ buffer ], { type: 'application/pdf' } );
      postMessage(file);
  });
});