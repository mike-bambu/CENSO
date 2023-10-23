import { LOGOS } from "../../logos";

export class ReporteMonitoreoPacientes {

    getDocumentDefinition(reportData:any) {
        const contadorLineasHorizontalesV = 0;
        const fecha_actual_server = reportData.fecha_actual;
        const hora_reporte = formatoHoraAmPm(new Date());
        const fecha_reporte = new Intl.DateTimeFormat('es-ES', {year: 'numeric', month: 'long', day: '2-digit'}).format(new Date())+", "+hora_reporte+".";
        //let fecha_hoy =  Date.now();
      //console.log(LOGOS);
        const datos = {
          pageOrientation: 'landscape',
          pageSize: 'LEGAL',
          /*pageSize: {
            width: 612,
            height: 396
          },*/
          pageMargins: [ 40, 60, 40, 60 ],
          header: {
            margin: [30, 20, 30, 0],
            columns: [
                {
                    image: LOGOS[0].LOGO_FEDERAL,
                    width: 80
                },
                {
                    margin: [10, 0, 0, 0],
                    text: 'SECRETARÍA DE SALUD\n'+'Censo Hospitalario Electrónico de Pacientes (CHEP)'+' - '+reportData.config.title,
                    bold: true,
                    fontSize: 12,
                    alignment: 'center'
                },
                {
                  image: LOGOS[1].LOGO_ESTATAL,
                  width: 60
              }
            ]
          },
          footer: function(currentPage, pageCount) { 
            //return 'Página ' + currentPage.toString() + ' de ' + pageCount; 
            return {
              margin: [30, 20, 30, 0],
              columns: [
                  {
                      text:'https://chep.saludchiapas.gob.mx',
                      alignment:'left',
                      fontSize: 8,
                  },
                  {
                      margin: [10, 0, 0, 0],
                      text: 'Página ' + currentPage.toString() + ' de ' + pageCount,
                      fontSize: 8,
                      alignment: 'center'
                  },
                  {
                    text:new Intl.DateTimeFormat('es-ES', {year: 'numeric', month: 'long', day: '2-digit'}).format(new Date()),
                    alignment:'right',
                    fontSize: 8,
                }
              ]
            }
          },
          content: [],
            styles: {
              cabecera: {
                fontSize: 6,
                bold: true,
                fillColor:"#890000",
                color: "white",
                alignment:"center"
              },
              cabecera_principal: {
                fontSize: 9,
                bold: true,
                fillColor:"#890000",
                color: "white",
                alignment:"center"
              },
              subcabecera:{
                fontSize: 6,
                bold:true,
                fillColor:"#DEDEDE",
                alignment:"center"
              },
              datos:
              {
                fontSize: 7
              },
              tabla_datos:
              {
                fontSize: 6,
                alignment:"center"
              },
              tabla_datos_centrar:
              {
                fontSize: 9,
                alignment:"center",
                bold: true,

              },
              tabla_datos_titulo:
              {
                fontSize: 9,
                alignment:"center"
              },
              tabla_datos_estados_actuales:
              {

                fontSize: 7,
                alignment:"center",
                bold:true,

              }
            }
        };

        const tabla_vacia = {
          table: {
            headerRows:2,
            dontBreakRows: true,
            keepWithHeaderRows: 1,
            widths: [ 15, 40, 45, 50, 80, 80, 15, 40, 35, 15, 150, 150, 40, 60 ],
            margin: [0,0,0,0],
            body: [
              [{text: "Pacientes Hospitalizados: "+fecha_reporte, colSpan: 14, style: 'cabecera_principal'},{},{},{},{},{},{},{},{},{},{},{},{},{}],
              [

                {text: "N°", style: 'cabecera'},
                {text: "NOMBRE DEL SERVICIO", style: 'cabecera'},
                {text: "N° CAMA/DESCIPCIÓN", style: 'cabecera'},
                {text: "N° EXPEDIENTE", style: 'cabecera'},
                {text: "NOMBRE DEL PACIENTE/ALIAS", style: 'cabecera'},
                {text: "CURP", style: 'cabecera'},
                {text: "SEXO", style: 'cabecera'},
                {text: "EDAD/EDAD APARENTE", style: 'cabecera'},
                {text: "FECHA DE INGRESO", style: 'cabecera'},
                {text: "DEH", style: 'cabecera'},
                {text: "DIAGNOSTICO(S) ACTUAL(ES)", style: 'cabecera'},
                {text: "OBSERVACIONES DE SEGUIMIENTO", style: 'cabecera'},
                {text: "ESTADO DE SALUD ACTUAL", style: 'cabecera'},
                {text: "FECHA/HORA DEL SEGUIMIENTO", style: 'cabecera'},
              ],

            ]
          }
        };
        
        datos.content.push(JSON.parse(JSON.stringify(tabla_vacia)));
      

        let indice_actual;//(datos.content.length -1);
        let numero_expediente = "";
        let sexo = "";
        let fecha_nacimiento = "";
        const diagnosticos_ingreso = "";
        let diagnosticos_actuales = "";
        let observaciones_seguimiento = "";
        let estado_actual = "";
        let cama = "";
        let servicio = "";
        const alta = "";
        let diagnosticos_alta = "";

        let fecha_alta = "";
        let motivo_egreso = "";
        let condicion_egreso = "";
        let observaciones_altas = "";
        let dias_hospitalizado      = 0;
        let fecha_inicio_atencion = "";
        let hora_inicio_atencion = ""
        let folio_atencion = "";

        let fecha_seguimiento = "";
        let hora_seguimiento = "";
        //let esta_embarazada;
        // //EDADES
        // let menores_igual_19 = 0;
        // let mayores_igual_20 = 0;
        // let total_pacientes = 0;
        // //ESTADO ACTUAL
        // let muy_graves_embarazadas = 0;
        // let muy_graves_puerperas = 0;
        // let total_muy_graves = 0;

        // let graves_embarazadas = 0;
        // let graves_puerperas = 0;
        // let total_graves = 0;

        // let delicadas_embarazadas = 0;
        // let delicadas_puerperas = 0;
        // let total_delicadas = 0;

        // let estables_embarazadas = 0;
        // let estables_puerperas = 0;
        // let total_estables = 0;

        // let total_estados_actuales = 0;
        // let total_embarazadas_estados_actuales = 0;
        // let total_puerperas_estados_actuales = 0;

        // let embarazadas = 0;
        // let puerperas = 0;
        let pintar_estado_actual = {};

          function formatoHoraAmPm(date) {

            let hours = date.getHours();
            let minutes = date.getMinutes();
            const ampm = hours >= 12 ? 'pm' : 'am';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            minutes = minutes < 10 ? '0'+minutes : minutes;
            const strTime = hours + ':' + minutes + ' ' + ampm;

            return strTime;

          }
        

          function diferenciaDeDias(f1, f2) {

            const fecha1 = new Date(f1);
            const fecha2 = new Date(f2)

            const resta = fecha2.getTime() - fecha1.getTime()
            const fecha = Math.round(resta/ (1000*60*60*24));

            return fecha;     
          }

          function formatoFecha(string) {

            const formato_fecha = string.split('-').reverse().join('/');
            return formato_fecha;

          }

          let resultado = reportData.items.sort((a, b) => a.ultima_atencion.ultimo_no_cama - b.ultima_atencion.ultimo_no_cama);

        for(let i = 0; i < reportData.items.length; i++){

              const paciente      = reportData.items[i];
              numero_expediente = (paciente.numero_expediente === null || paciente.numero_expediente === "") ? 'NO SE A GENERADO' : paciente.numero_expediente;
              sexo              = (paciente.sexo === 'Masculino') ? 'M' : (paciente.sexo === 'Femenino') ? 'F' : 'N/A';
              let tieneAtencion;
              tieneAtencion = parseInt(paciente.tieneAtencion);
              //fecha_nacimiento  = paciente.fecha_nacimiento != null ? formatoFecha(paciente.fecha_nacimiento) : 'NO ASIGNADO';
              
              indice_actual = datos.content.length -1;


              if(paciente.ultima_atencion != null){

                //esta_embarazada = parseInt(paciente?.ultima_atencion?.estaEmbarazada);

                folio_atencion = paciente.ultima_atencion.folio_atencion != null ? paciente.ultima_atencion.folio_atencion : 'NO SE HA GENERADO';
                fecha_inicio_atencion = formatoFecha(paciente.ultima_atencion.fecha_inicio_atencion);

                hora_inicio_atencion = paciente.ultima_atencion.hora != null || paciente.ultima_atencion.hora != '' ? paciente.ultima_atencion.hora : 'NO SE GENERO';

                
                
                


                  // if( paciente.ultima_atencion.dadodeAlta == 0 && tieneAtencion == 1 ){

                  //   switch (paciente.ultima_atencion.ultimo_seguimiento.estado_actual.nombre) {
  
                  //     case 'Muy Grave':
                  //         pintar_estado_actual = { text: (paciente.ultima_atencion.ultimo_estado_actual != null ? paciente.ultima_atencion.ultimo_estado_actual.nombre : "SIN ATENCIONES"), style: "tabla_datos_estados_actuales", fillColor:"#FF0000", color: "black"};
                  //         break;
                  //     case 'Grave':
                  //         pintar_estado_actual = { text: (paciente.ultima_atencion.ultimo_estado_actual != null ? paciente.ultima_atencion.ultimo_estado_actual.nombre : "SIN ATENCIONES"), style: "tabla_datos_estados_actuales", fillColor:"#FFA500", color: "black",};
                  //         break;
                  //     case 'Delicado':
                  //         pintar_estado_actual = { text: (paciente.ultima_atencion.ultimo_estado_actual != null ? paciente.ultima_atencion.ultimo_estado_actual.nombre : "SIN ATENCIONES"), style: "tabla_datos_estados_actuales", fillColor:"#FFFF00", color: "black",};
                  //         break;
                  //     case 'Estable':
                  //         pintar_estado_actual = { text: (paciente.ultima_atencion.ultimo_estado_actual != null ? paciente.ultima_atencion.ultimo_estado_actual.nombre : "SIN ATENCIONES"), style: "tabla_datos_estados_actuales", fillColor:"#32CD32", color: "black"};
                  //         break;
                  //     case 'Prealta':
                  //       pintar_estado_actual = { text:  (paciente.ultima_atencion.ultimo_estado_actual != null ?  paciente.ultima_atencionultimo_.estado_actual.nombre : "SIN ATENCIONES"),  style: "tabla_datos_estados_actuales", fillColor:"#FFFFFF", color: "black"};
                  //       break;
          
                  //     default:0
          
                  //   }

                  // }
                  
                  //estado_actual     = paciente.ultima_atencion.ultimo_seguimiento.estado_actual != null || paciente.ultima_atencion.ultimo_seguimiento.estado_actual != '' ? paciente.ultima_atencion.ultimo_seguimiento.estado_actual.nombre : 'NO SE HA GENERADO';
                  // diagnosticos_actuales = (paciente.ultima_atencion.ultimo_seguimiento.observaciones_diagnosticos != null) ? paciente.ultima_atencion.ultimo_seguimiento.observaciones_diagnosticos : 'SIN REGISTRO';
                  // cama     = paciente.ultima_atencion.ultimo_seguimiento.no_cama != "" ? paciente.ultima_atencion.ultimo_seguimiento.no_cama : paciente.ultima_atencion.ultimo_seguimiento.no_cama == null ? 'PACIENTE AMBULATORIO' : 'SIN REGISTRO';
                  // servicio = (paciente.ultima_atencion.ultimo_seguimiento.servicio != null || paciente.ultima_atencion.ultimo_seguimiento.servicio != '') ? paciente.ultima_atencion.ultimo_seguimiento.servicio.nombre : 'SIN REGISTRO';


                  // if(paciente.ultima_atencion.ultimo_seguimiento.diagnosticos.length > 0){

                  //   for (let indice_seguimiento in paciente.ultima_atencion.ultimo_seguimiento.diagnosticos){

                  //     let indice_seguimiento_consecutivo = parseInt(indice_seguimiento)+1;

                  //     if (diagnosticos_actuales !== "")
                  //     diagnosticos_actuales += ".\n";
                  //     diagnosticos_actuales += `${indice_seguimiento_consecutivo}: ${paciente.ultima_atencion.ultimo_seguimiento.diagnosticos[indice_seguimiento].nombre}`;

                  //   }

                  // }else{
                  //   diagnosticos_actuales = "SIN DIAGNOSTICOS";
                  // }

                  if( paciente.ultima_atencion?.ultimo_seguimiento != null ){

                    if( tieneAtencion == 1 && paciente.ultima_atencion.dadodeAlta == 0 ){


                      switch (paciente.ultima_atencion?.ultimo_seguimiento?.estado_actual?.nombre) {
    
                        case 'Muy Grave':
                            pintar_estado_actual = { text: (paciente.ultima_atencion?.ultimo_seguimiento?.estado_actual != null ? paciente.ultima_atencion?.ultimo_seguimiento?.estado_actual?.nombre : "SIN ATENCIONES"), style: "tabla_datos_estados_actuales", fillColor:"#FF0000", color: "black"};
                            break;
                        case 'Grave':
                            pintar_estado_actual = { text: (paciente.ultima_atencion?.ultimo_seguimiento?.estado_actual != null ? paciente.ultima_atencion?.ultimo_seguimiento?.estado_actual?.nombre : "SIN ATENCIONES"), style: "tabla_datos_estados_actuales", fillColor:"#FFA500", color: "black",};
                            break;
                        case 'Delicado':
                            pintar_estado_actual = { text: (paciente.ultima_atencion?.ultimo_seguimiento?.estado_actual != null ? paciente.ultima_atencion?.ultimo_seguimiento?.estado_actual?.nombre : "SIN ATENCIONES"), style: "tabla_datos_estados_actuales", fillColor:"#FFFF00", color: "black",};
                            break;
                        case 'Estable':
                            pintar_estado_actual = { text: (paciente.ultima_atencion?.ultimo_seguimiento?.estado_actual != null ? paciente.ultima_atencion?.ultimo_seguimiento?.estado_actual?.nombre : "SIN ATENCIONES"), style: "tabla_datos_estados_actuales", fillColor:"#32CD32", color: "black"};
                            break;
                        case 'Prealta':
                          pintar_estado_actual = { text:  (paciente.ultima_atencion?.ultimo_seguimiento?.estado_actual != null ? paciente.ultima_atencion?.ultimo_seguimiento?.estado_actual?.nombre : "SIN ATENCIONES"),  style: "tabla_datos_estados_actuales", fillColor:"#FFFFFF", color: "black"};
                          break;
            
                        default:0
            
                      }
  
                    }

                      //estado_actual           = paciente.ultima_atencion?.ultimo_seguimiento?.estado_actual != null || paciente.ultima_atencion?.ultimo_seguimiento?.estado_actual != "" ? paciente.ultima_atencion?.ultimo_seguimiento?.estado_actual.nombre : 'NO SE HA GENERADO';
                      observaciones_seguimiento   = (paciente.ultima_atencion?.ultimo_seguimiento?.observaciones != null) ? paciente.ultima_atencion?.ultimo_seguimiento?.observaciones : 'SIN REGISTRO';
                      diagnosticos_actuales       = (paciente.ultima_atencion?.ultimo_seguimiento?.observaciones_diagnosticos != null) ? paciente.ultima_atencion?.ultimo_seguimiento?.observaciones_diagnosticos : 'SIN REGISTRO';
                      cama                        = paciente.ultima_atencion?.ultimo_seguimiento?.no_cama != "" ?  'N° '+paciente.ultima_atencion?.ultimo_seguimiento?.no_cama : paciente.ultima_atencion?.ultimo_seguimiento?.no_cama == null ? 'SERVICIO\n'+'AMBULATORIO' : 'SIN REGISTRO';
                      servicio                    = (paciente.ultima_atencion?.ultimo_seguimiento?.servicio != null || paciente.ultima_atencion?.ultimo_seguimiento?.servicio != '') ? paciente.ultima_atencion?.ultimo_seguimiento?.servicio.nombre : 'SIN REGISTRO';
                      fecha_seguimiento           = (paciente.ultima_atencion?.ultimo_seguimiento?.fecha_seguimiento != null) ? formatoFecha(paciente.ultima_atencion?.ultimo_seguimiento?.fecha_seguimiento) : 'SIN SEGUIMIENTO';
                      hora_seguimiento            = (paciente.ultima_atencion?.ultimo_seguimiento?.hora_seguimiento != null) ? formatoFecha(paciente.ultima_atencion?.ultimo_seguimiento?.hora_seguimiento) : 'SIN SEGUIMIENTO';

                  }else{

                    if( tieneAtencion == 1 && paciente.ultima_atencion.dadodeAlta == 0 ){

                      switch (paciente?.ultima_atencion?.ultimo_estado_actual?.nombre) {
    
                        case 'Muy Grave':
                            pintar_estado_actual = { text: (paciente.ultima_atencion?.ultimo_estado_actual != null ? paciente.ultima_atencion?.ultimo_estado_actual.nombre : "SIN ATENCIONES"), style: "tabla_datos_estados_actuales", fillColor:"#FF0000", color: "black"};
                            break;
                        case 'Grave':
                            pintar_estado_actual = { text: (paciente.ultima_atencion?.ultimo_estado_actual != null ? paciente.ultima_atencion?.ultimo_estado_actual.nombre : "SIN ATENCIONES"), style: "tabla_datos_estados_actuales", fillColor:"#FFA500", color: "black",};
                            break;
                        case 'Delicado':
                            pintar_estado_actual = { text: (paciente.ultima_atencion?.ultimo_estado_actual != null ? paciente.ultima_atencion?.ultimo_estado_actual.nombre : "SIN ATENCIONES"), style: "tabla_datos_estados_actuales", fillColor:"#FFFF00", color: "black",};
                            break;
                        case 'Estable':
                            pintar_estado_actual = { text: (paciente.ultima_atencion?.ultimo_estado_actual != null ? paciente.ultima_atencion?.ultimo_estado_actual.nombre : "SIN ATENCIONES"), style: "tabla_datos_estados_actuales", fillColor:"#32CD32", color: "black"};
                            break;
                        case 'Prealta':
                          pintar_estado_actual = { text:  (paciente.ultima_atencion?.ultimo_estado_actual != null ?  paciente.ultima_atencio?.ultimo_estado_actual.nombre : "SIN ATENCIONES"),  style: "tabla_datos_estados_actuales", fillColor:"#FFFFFF", color: "black"};
                          break;
            
                        default:0
            
                      }
  
                    }

                      //estado_actual           = paciente.ultima_atencion?.ultimo_estado_actual != null || paciente.ultima_atencion?.ultimo_estado_actual != "" ? paciente.ultima_atencion?.ultimo_estado_actual?.nombre : 'NO SE HA GENERADO';
                      diagnosticos_actuales       = (paciente.ultima_atencion?.motivo_atencion != null) ? paciente.ultima_atencion?.motivo_atencion : 'SIN REGISTRO';
                      observaciones_seguimiento   = (paciente.ultima_atencion?.indicaciones != null) ? paciente.ultima_atencion?.indicaciones : 'SIN REGISTRO';
                      cama                        =  paciente.ultima_atencion?.no_cama === null ? 'SERVICIO\n'+'AMBULATORIO' : paciente.ultima_atencion?.no_cama != "" ?  'N° '+paciente.ultima_atencion?.no_cama : 'SIN REGISTRO';
                      servicio                    = (paciente.ultima_atencion?.servicio_atencion != null || paciente.ultima_atencion?.servicio_atencion != "") ? paciente.ultima_atencion?.servicio_atencion?.nombre : 'SIN REGISTRO';
                      fecha_seguimiento           = (paciente.ultima_atencion?.fecha_inicio_atencion != null) ? formatoFecha(paciente.ultima_atencion?.fecha_inicio_atencion) : 'SIN REGISTRO';
                      hora_seguimiento            = (paciente.ultima_atencion?.hora != null) ? formatoFecha(paciente.ultima_atencion?.hora) : 'SIN REGISTRO';

                  }




                  
                

                
                if(paciente.ultima_atencion.alta != null){


                  fecha_alta              =  formatoFecha(paciente.ultima_atencion.alta.fecha_alta);
                  dias_hospitalizado      =  diferenciaDeDias(paciente.ultima_atencion.fecha_inicio_atencion, paciente.ultima_atencion.alta.fecha_alta);
                  motivo_egreso           =  paciente.ultima_atencion.alta.motivo_egreso != null ? paciente.ultima_atencion.alta.motivo_egreso.nombre : "NO SE HA REGISTRADO EL ALTA";
                  condicion_egreso        =  paciente.ultima_atencion.alta.condicion_egreso != null ? paciente.ultima_atencion.alta.condicion_egreso.nombre : "NO SE HA REGISTRADO EL ALTA";
                  //metodo_anticonceptivo    =  paciente.ultima_atencion.alta.metodo_anticonceptivo != null ? paciente.ultima_atencion.alta.metodo_anticonceptivo.nombre : "NO SE HA REGISTRADO EL ALTA";
                  observaciones_altas     =  paciente.ultima_atencion.alta.observaciones != null ? paciente.ultima_atencion.alta.observaciones : "NO SE HA REGISTRADO EL ALTA";


                  if(paciente.ultima_atencion.alta.diagnosticos.length > 0){

                      for (const indice_alta in paciente.ultima_atencion.alta.diagnosticos){

                        const indice_alta_consecutivo = parseInt(indice_alta)+1;

                        if (diagnosticos_alta!=="")
                        diagnosticos_alta += ".\n";
                        diagnosticos_alta += `${indice_alta_consecutivo}: ${paciente.ultima_atencion.alta.diagnosticos[indice_alta].nombre}`;

                      }
                  }else{
                    diagnosticos_alta = "SIN DIAGNOSTICOS DE EGRESO";
                  }
                  
                }else{

                  fecha_alta          = "NO SE HA REGISTRADO EL EGRESO";
                  motivo_egreso       = "NO SE HA REGISTRADO EL EGRESO";
                  condicion_egreso    = "NO SE HA REGISTRADO EL EGRESO";
                  diagnosticos_alta   = "NO SE HA REGISTRADO EL EGRESO";
                  observaciones_altas = "NO SE HA REGISTRADO EL EGRESO";

                  dias_hospitalizado = diferenciaDeDias(paciente.ultima_atencion.fecha_inicio_atencion, fecha_actual_server);

                }

              }else{
                diagnosticos_actuales = "SIN REGISTRO";
                observaciones_seguimiento = "SIN REGISTRO";

                // fecha_alta          = "NO SE HA REGISTRADO EL EGRESO";
                // motivo_egreso       = "NO SE HA REGISTRADO EL EGRESO";
                // condicion_egreso    = "NO SE HA REGISTRADO EL EGRESO";
                // diagnosticos_alta   = "NO SE HA REGISTRADO EL EGRESO";
                // observaciones_altas = "NO SE HA REGISTRADO EL EGRESO";
              }

              let nombre_paciente = "";

              if(paciente.alias == null || paciente.alias == ""){

                nombre_paciente = paciente.nombre + ' '+ paciente.paterno + ' '+ paciente.materno;

              }else{

                nombre_paciente = paciente.alias;

              }

              let edad = "";

              // if(paciente.edad == null){

              //   edad = paciente.edad_aparente+' Años';

              // }else{

              //   edad = paciente.edad +' Años';

              // }

              if(paciente.edad == null){

                edad = paciente.edad_aparente+" "+paciente?.tipo_edad;

              }else{

                //edad = paciente.edad +' Años';

                edad = paciente.edad +" "+paciente?.tipo_edad;

              }

              let curp = "";

              //curp = paciente.curp != null ? paciente.curp : "S/R";
              curp = paciente.curp != null || paciente.curp != "" ? paciente.curp : "SIN REGISTRO";





              // if(paciente.ultima_atencion.alta != null){
              //   if(paciente.alta.diagnosticos.length == 0){
              //     diagnosticos_alta = "NO SE REGISTRÓ NINGÚN DIAGNOSTICO DE EGRESO";
              //   }else{
              //     for (let indice in paciente.alta.diagnosticos){

              //       let index = parseInt(indice)+1;

              //       if (diagnosticos_alta!=="")
              //       diagnosticos_alta += ".\n";
              //       diagnosticos_alta += `${index}: ${paciente.alta.diagnosticos[indice].nombre}`;

              //     }
              //   }
              // }else{
              //   alta = "NO SE HA REGISTRADO EL EGRESO DE LA PACIENTE";
              // }
          
                datos.content[indice_actual].table.body.push([

                  { text: i+1, style: 'tabla_datos' },
                  { text: (servicio != '' ? servicio : "SIN REGISTRO"), style: 'tabla_datos'},
                  { text: (cama     != '' ? cama   : "SIN REGISTRO"), style: 'tabla_datos'},
                  { text: (numero_expediente == '' || numero_expediente == null ? 'NO SE HA GENERADO' : numero_expediente), style: 'tabla_datos'},
                  { text: nombre_paciente, style: 'tabla_datos'},
                  { text: curp, style: 'tabla_datos'},
                  { text: sexo, style: 'tabla_datos'},
                  { text: edad, style: 'tabla_datos'},
                  { text: fecha_inicio_atencion, style: 'tabla_datos'},
                  { text: (dias_hospitalizado == 0 ? 'HOY INGRESÓ' : dias_hospitalizado), style: 'tabla_datos'},
                  { text: diagnosticos_actuales, style: {fontSize: 7,alignment:"left"}},
                  { text: observaciones_seguimiento, style: {fontSize: 7,alignment:"left"}},
                  pintar_estado_actual,
                  { text: fecha_seguimiento+"\n"+hora_seguimiento, style: 'tabla_datos'},
                  //{ text: hora_seguimiento, style: 'tabla_datos'},
                ]);

                nombre_paciente = "";
                curp = "";
                numero_expediente = "";
                folio_atencion = "";
                sexo = "";
                edad = "";
                fecha_nacimiento = "";
                fecha_inicio_atencion = "";
                dias_hospitalizado = 0;

                diagnosticos_actuales = "";
                observaciones_seguimiento = "";
                diagnosticos_alta = "";

                estado_actual = "";

                cama = "";
                servicio = "";

                fecha_alta = "";
                motivo_egreso = "";
                condicion_egreso = "";
                diagnosticos_alta = "";
                observaciones_altas = "";
                fecha_inicio_atencion = "";
                

                
              
        }

        //datos.content.push({ text:'', pageBreak:'after' });

        // datos.content.push({
          
        //   margin: [350,100,0,0],
        //   table: {
        //    widths: [ 160, 50,],
        //     margin: [0,0,0,0],
            
        //     body: [
        //       [
        //         {text: "GRUPO DE EDAD", style: "tabla_datos_titulo",fillColor:"#DEDEDE", colSpan:2},{}
        //       ],
        //       [
        //         { text: "(≤19)", style: "tabla_datos_titulo" },
        //         { text: new Intl.NumberFormat('es-MX').format(menores_igual_19), style: "tabla_datos_centrar"},

        //       ],
        //       [
        //         { text: "(≥20)", style: "tabla_datos_titulo" },
        //         { text: new Intl.NumberFormat('es-MX').format(mayores_igual_20), style: "tabla_datos_centrar"},


        //       ],
        //       [
        //         { text: "TOTAL", style: "tabla_datos_titulo", fillColor:"#DEDEDE" },
        //         { text: new Intl.NumberFormat('es-MX').format(total_pacientes), style: "tabla_datos_centrar", fillColor:"#DEDEDE"},

        //       ]
        //     ]
        //   },
          

        // });

        // datos.content.push({
          
        //   margin: [250,10,0,0],
        //   table: {
        //    widths: [ 160, 80, 80, 100 ],
        //     margin: [0,0,0,0],
            
        //     body: [
        //       [
        //         { text: "PACIENTES EN ESTADO ACTUAL", style: "tabla_datos_estados_actuales", fillColor:"#DEDEDE", },
        //         { text: "EMBARAZADAS", style: "tabla_datos_titulo", fillColor:"#DEDEDE", },
        //         { text: "PUERPERAS", style: "tabla_datos_titulo", fillColor:"#DEDEDE", },
        //         { text: "TOTAL", style: "tabla_datos_titulo", fillColor:"#DEDEDE", blod: true }
        //       ],
        //       [
        //         { text: "MUY GRAVES", style: "tabla_datos_estados_actuales", fillColor:"#FF0000", color: "black",},
        //         { text: muy_graves_embarazadas, style: "tabla_datos_titulo"},
        //         { text: muy_graves_puerperas, style: "tabla_datos_titulo"},
        //         { text: total_muy_graves, style: "tabla_datos_centrar",fillColor:"#DEDEDE", }
        //       ],
        //       [
        //         { text: "GRAVES", style: "tabla_datos_estados_actuales", fillColor:"#FFA500", color: "black",},
        //         { text: graves_embarazadas, style: "tabla_datos_titulo"},
        //         { text: graves_puerperas, style: "tabla_datos_titulo"},
        //         { text: total_graves, style: "tabla_datos_centrar", fillColor:"#DEDEDE", }
        //       ],
        //       [
        //         { text: "DELICADAS", style: "tabla_datos_estados_actuales", fillColor:"#FFFF00", color: "black"},
        //         { text: delicadas_embarazadas, style: "tabla_datos_titulo"},
        //         { text: delicadas_puerperas, style: "tabla_datos_titulo"},
        //         { text: total_delicadas, style: "tabla_datos_centrar", fillColor:"#DEDEDE", }
        //       ],
        //       [
        //         { text: "ESTABLES", style: "tabla_datos_estados_actuales", fillColor:"#32CD32", color: "black"},
        //         { text: estables_embarazadas, style: "tabla_datos_titulo"},
        //         { text: estables_puerperas, style: "tabla_datos_titulo"},
        //         { text: total_estables, style: "tabla_datos_centrar", fillColor:"#DEDEDE", }
        //       ],
        //       [
        //         { text: "SUBTOTAL", style: "tabla_datos_estados_actuales", fillColor:"#DEDEDE"},
        //         { text: total_embarazadas_estados_actuales, style: "tabla_datos_centrar", fillColor:"#DEDEDE",},
        //         { text: total_puerperas_estados_actuales, style: "tabla_datos_centrar", fillColor:"#DEDEDE",},
        //         { text: total_estados_actuales, style: "tabla_datos_centrar", fillColor:"#DEDEDE", }
        //       ]
        //     ]
        //   }
        // });

        return datos;
    }
}