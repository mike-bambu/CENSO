import { LOGOS } from "../../logos";

export class ReporteVisitasPuerperales {

    getDocumentDefinition(reportData:any) {
        const contadorLineasHorizontalesV = 0;
        const fecha_actual_server = reportData.fecha_actual;
        //let fecha_hoy =  Date.now();
        console.log(reportData.items);
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
                    text: 'SECRETARÍA DE SALUD\n'+'Censo Hospitalario Electrónico de Pacientes (CHEP)\n'+''+reportData.config.title,
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
                      text:'http://saludchiapas.gob.mx/',
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
                fontSize: 5,
                bold: true,
                fillColor:"#890000",
                color: "white",
                alignment:"center"
              },
              subcabecera:{
                fontSize: 5,
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
                fontSize: 7,
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

                fontSize: 9,
                alignment:"center",
                bold:true,

              }
            }
        };

        const tabla_vacia = {
          table: {
            headerRows:1,
            dontBreakRows: true,
            keepWithHeaderRows: 1,
            widths: [ 15, 40, 70, 60, 40, 40, 50, 50, 50, 50, 70, 50, 50, 100, 60],
            margin: [0,0,0,0],
            body: [
              [

                {text: "N°", style: 'cabecera'},
                {text: "N° EXPEDIENTE", style: 'cabecera'},
                {text: "NOMBRE DEL PACIENTE", style: 'cabecera'},
                {text: "FECHA DE NACIMIENTO", style: 'cabecera'},
                {text: "EDAD", style: 'cabecera'},
                {text: "FECHA CONTROL DE EMBARAZO", style: 'cabecera'},
                {text: "FECHA DE EGRESO", style: 'cabecera'},
                {text: "MOTIVO DEL EGRESO", style: 'cabecera'},
                {text: "EMBARAZADA/PUERPERA", style: 'cabecera'},
                {text: "MÉTODO ANTICONCEPTIVO", style: 'cabecera'},
                {text: "MUNICIPIO/LOCALIDAD DE RECUPERACIÓN", style: 'cabecera'},
                {text: "DIRECCION DE RECUPERACIÓN", style: 'cabecera'},
                {text: "TELÉFONO DE CONTACTO", style: 'cabecera'},
                {text: "OBSERVACIONES DE EGRESO", style: 'cabecera'},
                {text: "ESTADO DE SALUD ACTUAL", style: 'cabecera'},


                // {text: "N°", style: 'cabecera'},
                // {text: "NOMBRE", style: 'cabecera'},
                // {text: "EDAD/EDAD APARENTE", style: 'cabecera'},
                // {text: "FECHA DE LA ATENCION", style: 'cabecera'},
                // {text: "DÍAS HOSPITALIZADO", style: 'cabecera'},
                // {text: "DIAGNOSTICO(S) ACTUAL(ES)", style: 'cabecera'},
                // {text: "ESTADO ACTUAL", style: 'cabecera'},
                // {text: "N° CAMA/SERVICIO", style: 'cabecera'},
                // {text: "FECHA EGRESO", style: 'cabecera'},
                // {text: "MOTIVO DE EGRESO", style: 'cabecera'},
                // {text: "CONDICIONES DE EGRESO", style: 'cabecera'},
                // {text: "DIAGNOSTICO(S) DE EGRESO", style: 'cabecera'},
                // {text: "OBSERVACIONES DE EGRESO", style: 'cabecera'},
              ],

            ]
          }
        };
        
        datos.content.push(JSON.parse(JSON.stringify(tabla_vacia)));
      

        let indice_actual;//(datos.content.length -1);
        let numero_expediente = "";
        let sexo = "";
        let fecha_nacimiento = "";
        let diagnosticos_actuales = "";
        let estado_actual = "";
        const cama = "";
        const servicio = "";
        const alta = "";
        let diagnosticos_alta = "";

        let fecha_alta = "";
        let motivo_egreso = "";
        let condicion_egreso = "";
        let metodo_anticonceptivo = "";
        let observaciones_altas = "";
        let fecha_control_embarazo = "";
        let municipio_recuperacion = "";
        let localidad_recuperacion = "";
        let direccion_recuperacion = "";
        let telefono_contacto      = "";
        // let dias_hospitalizado      = 0;
        // let fecha_inicio_atencion = ""
        // let folio_atencion = "";

          function diferenciaDeDias(f1, f2) {

            console.log("f1",f1);
            console.log("f2",f2);

            const fecha1 = new Date(f1);
            const fecha2 = new Date(f2)

            const resta = fecha2.getTime() - fecha1.getTime()
            const fecha = Math.round(resta/ (1000*60*60*24)+1);

            return fecha;     
          }

          function formatoFecha(string) {

            const formato_fecha = string.split('-').reverse().join('/');
            return formato_fecha;

          }


        for(let i = 0; i < reportData.items.length; i++){

              const paciente      = reportData.items[i];
              numero_expediente = paciente.numero_expediente   != null || paciente.numero_expediente != '' ? paciente.numero_expediente : 'NO SE A GENERADO';
              sexo              = paciente.sexo             != null ? paciente.sexo : 'NO ASIGNADO';
              fecha_nacimiento  = paciente.fecha_nacimiento != null ? formatoFecha(paciente.fecha_nacimiento) : 'NO ASIGNADO';


              indice_actual = datos.content.length -1;


              if(paciente.ultima_atencion_alta != null){
                
                if(paciente.ultima_atencion_alta.alta != null){


                  fecha_alta              =  formatoFecha(paciente.ultima_atencion_alta.alta.fecha_alta);
                  fecha_control_embarazo  =  formatoFecha(paciente.ultima_atencion_alta.fecha_control_embarazo);
                  motivo_egreso           =  paciente.ultima_atencion_alta.alta.motivo_egreso != null ? paciente.ultima_atencion_alta.alta.motivo_egreso.nombre : "SIN REGISTRO";
                  condicion_egreso        =  paciente.ultima_atencion_alta.alta.condicion_egreso != null ? paciente.ultima_atencion_alta.alta.condicion_egreso.nombre : "SIN REGISTRO";
                  metodo_anticonceptivo   =  paciente.ultima_atencion_alta.alta.metodo_anticonceptivo != null ? paciente.ultima_atencion_alta.alta.metodo_anticonceptivo.nombre : "SIN REGISTRO";
                  estado_actual           =  paciente.ultima_atencion_alta.alta.estado_actual_id != null || paciente.ultima_atencion_alta.alta.estado_actual.estado_actual_id != '' ? paciente.ultima_atencion_alta.alta.estado_actual.nombre : "SIN REGISTRO";
                  observaciones_altas     =  paciente.ultima_atencion_alta.alta.observaciones != null ? paciente.ultima_atencion_alta.alta.observaciones : "SIN REGISTRO";
                  municipio_recuperacion  =  paciente.ultima_atencion_alta.alta.municipio_id != null ? paciente.ultima_atencion_alta.alta.municipio.nombre : "SIN REGISTRO";
                  localidad_recuperacion  =  paciente.ultima_atencion_alta.alta.localidad_id != null ? paciente.ultima_atencion_alta.alta.localidad.nombre : "SIN REGISTRO";
                  direccion_recuperacion  =  paciente.ultima_atencion_alta.alta.direccion_completa != null ? paciente.ultima_atencion_alta.alta.direccion_completa : "SIN REGISTRO";
                  telefono_contacto       =  paciente.ultima_atencion_alta.alta.telefono != null ? paciente.ultima_atencion_alta.alta.telefono : "SIN REGISTRO";


                  // if(paciente.ultima_atencion_alta.alta.diagnosticos.length > 0){

                  //     for (let indice_alta in paciente.ultima_atencion_alta.alta.diagnosticos){

                  //       let indice_alta_consecutivo = parseInt(indice_alta)+1;

                  //       if (diagnosticos_alta!=="")
                  //       diagnosticos_alta += ".\n";
                  //       diagnosticos_alta += `${indice_alta_consecutivo}: ${paciente.ultima_atencion_alta.alta.diagnosticos[indice_alta].nombre}`;

                  //     }
                  // }else{
                  //   diagnosticos_alta = "SIN DIAGNOSTICOS DE EGRESO";
                  // }
                  
                }else{

                  fecha_alta            = "NO SE HA REGISTRADO EL EGRESO";
                  motivo_egreso         = "NO SE HA REGISTRADO EL EGRESO";
                  condicion_egreso      = "NO SE HA REGISTRADO EL EGRESO";
                  diagnosticos_alta     = "NO SE HA REGISTRADO EL EGRESO";
                  metodo_anticonceptivo = "NO SE HA REGISTRADO EL EGRESO";
                  observaciones_altas   = "NO SE HA REGISTRADO EL EGRESO";

                  //dias_hospitalizado = diferenciaDeDias(paciente.ultima_atencion_alta.fecha_inicio_atencion, fecha_actual_server);

                }

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






              // if(paciente.ultima_atencion_alta.alta != null){
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
                  { text: (numero_expediente == '' || numero_expediente == null ? 'NO SE GENERO' : numero_expediente), style: 'tabla_datos'},
                  { text: nombre_paciente, style: 'tabla_datos'},
                  { text: fecha_nacimiento, style: 'tabla_datos'},
                  { text: edad, style: 'tabla_datos'},
                  { text: fecha_control_embarazo, style: 'tabla_datos'},
                  { text: fecha_alta, style: 'tabla_datos'},
                  { text: motivo_egreso, style: 'tabla_datos'},
                  { text: condicion_egreso, style: 'tabla_datos'},
                  { text: metodo_anticonceptivo, style: 'tabla_datos'},
                  { text: municipio_recuperacion+'/'+localidad_recuperacion, style: 'tabla_datos'},
                  { text: direccion_recuperacion, style: 'tabla_datos'},
                  { text: telefono_contacto, style: 'tabla_datos'},
                  { text: observaciones_altas, style: {fontSize: 7,alignment:"left"}},
                  { text: (estado_actual == '' || estado_actual == null ? 'SIN REGISTRO' : estado_actual), style: 'tabla_datos'},
                  
                  // { text: new Intl.DateTimeFormat('es-ES').format(new Date(paciente.created_at)) , style: 'tabla_datos'},
                  // { text: fecha_alta, style: 'tabla_datos'},
                  // { text: motivo_egreso, style: 'tabla_datos'},
                  // { text: condicion_egreso, style: 'tabla_datos'},
                  // { text: diagnosticos_alta, style: {fontSize: 7,alignment:"left"}  },
                  // { text: observaciones_altas, style: 'tabla_datos'},
                  // { text: "NO SE HA REGISTRADO EL ALTA", style: {fontSize: 5,alignment:"left"}},
                ]);

                nombre_paciente = "";
                numero_expediente = "";
                edad = "";
                fecha_nacimiento = "";
                fecha_control_embarazo = "";

                diagnosticos_actuales = "";
                diagnosticos_alta = "";

                estado_actual = "";

                municipio_recuperacion = "";
                localidad_recuperacion = "";
                direccion_recuperacion = "";
                telefono_contacto = "";

                fecha_alta = "";
                motivo_egreso = "";
                condicion_egreso = "";
                diagnosticos_alta = "";
                observaciones_altas = "";
                

                
              
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