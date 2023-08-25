import { LOGOS } from "../../logos";

export class ReporteIngresoPacientes {

    getDocumentDefinition(reportData:any) {
        //console.log("shiiit",reportData.items);
        const contadorLineasHorizontalesV = 0;
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
                fontSize: 8,
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
                fontSize: 10
              },
              tabla_datos:
              {
                fontSize: 8,
                alignment:"center"
              },
              tabla_datos_centrar:
              {
                fontSize: 9,
                alignment:"center",
                bold: true,

              },
              tabla_datos_estados_actuales:
              {

                fontSize: 9,
                alignment:"center",
                bold:true,

              },
              tabla_datos_titulo:
              {
                fontSize: 9,
                alignment:"center"
              },
            }
        };

        const tabla_vacia = {

          table: {
            headerRows:1,
            dontBreakRows: true,
            keepWithHeaderRows: 1,
            widths: [ 30, 80, 90, 90, 100, 70, 60, 60, 60, 60 , 60, 60 ],
            margin: [0,0,0,0],
            body: [
              //[{text: "["+empleado.clues+"] "+empleado.clues_descripcion, colSpan: 12, style: 'cabecera'},{},{},{},{},{},{},{},{},{},{},{}],
              [
                {text: "N°", style: 'cabecera'},
                {text: "NOMBRE Ó ALIAS", style: 'cabecera'},
                {text: "N° EXPEDIENTE", style: 'cabecera'},
                {text: "SERVICIO/CAMA", style: 'cabecera'},
                {text: "CURP", style: 'cabecera'},
                {text: "TELÉFONO DE EMERGENCIA", style: 'cabecera'},
                // {text: "TELEFONO LOCAL", style: 'cabecera'},
                {text: "EDAD", style: 'cabecera'},
                // {text: "FECHA DE NACIMIENTO", style: 'cabecera'},
                {text: "ESTADO ACTUAL", style: 'cabecera'},
                {text: "EXTRANJERO", style: 'cabecera'},
                {text: "ESTADO DE LA REPUBLICA", style: 'cabecera'},
                {text: "MUNICIPIO", style: 'cabecera'},
                {text: "LOCALIDAD", style: 'cabecera'}
                //{text: "AFILIACIÓN", style: 'cabecera'}
              ]
            ]
          }

        };

        datos.content.push(JSON.parse(JSON.stringify(tabla_vacia)));
      
        let indice_actual;//(datos.content.length -1);

        // //EDADES
        // let menores_igual_19 = 0;
        // let mayores_igual_20 = 0;
        // let total_pacientes = 0;

        let estables = 0;
        let total_estables = 0;

        let graves = 0;
        let total_graves = 0;

        let muy_grave = 0;
        let total_muy_graves = 0;

        let prealtas = 0;
        let total_prealtas = 0;

        let delicado = 0;
        let total_delicado = 0;

        let pacientes = 0;
        let total_estados_actuales = 0;
        let pintar_estado_actual = {};

        let cama = "";
        let servicio = ""
        //console.log('for(let i = 0; i < ; i++){');
        for(let i = 0; i < reportData.items.length; i++){
          //console.log("iiiii", reportData.items.length);
          const paciente = reportData.items[i];
          const fecha_nacimiento     =  new Intl.DateTimeFormat('es-ES', {year: 'numeric', month: 'numeric', day: '2-digit'}).format(new Date(paciente.fecha_nacimiento));

          let extranjero;
          extranjero = parseInt(paciente.esExtranjero);

          let tieneAtencion;
          tieneAtencion = parseInt(paciente.tieneAtencion);

          if( paciente?.ultima_atencion != null){

            cama        = (paciente?.ultima_atencion?.ultimo_no_cama  === null || paciente?.ultima_atencion?.ultimo_no_cama  === "")  ? 'N/A' : paciente?.ultima_atencion?.ultimo_no_cama;
            servicio    = (paciente?.ultima_atencion?.servicio_actual != null || paciente?.ultima_atencion?.servicio_actual != '')  ? paciente?.ultima_atencion?.servicio_actual?.nombre : 'SIN REGISTRO';
            
          }

        //   if(paciente.edad <= 19){
        //     menores_igual_19 ++;
        //   }

        //   if(paciente.edad >= 20){
        //     mayores_igual_20 ++;
        //   }

        //   total_pacientes = reportData.items.length;
        //if(paciente.ultima_atencion != null && paciente.ultima_atencion.dadodeAlta == 0 && paciente.ultima_atencion.estado_actual.nombre != null){

          switch (paciente?.ultima_atencion?.ultimo_estado_actual?.nombre) {

            case 'Muy Grave':
                pintar_estado_actual = { text: (paciente?.ultima_atencion?.ultimo_estado_actual != null ? paciente?.ultima_atencion?.ultimo_estado_actual?.nombre : "SIN ATENCIONES"), style: "tabla_datos_estados_actuales", fillColor:"#FF0000", color: "black"};
                break;
            case 'Grave':
                pintar_estado_actual = { text: (paciente?.ultima_atencion?.ultimo_estado_actual != null ? paciente?.ultima_atencion?.ultimo_estado_actual?.nombre : "SIN ATENCIONES"), style: "tabla_datos_estados_actuales", fillColor:"#FFA500", color: "black",};
                break;
            case 'Delicado':
                pintar_estado_actual = { text: (paciente?.ultima_atencion?.ultimo_estado_actual != null ? paciente?.ultima_atencion?.ultimo_estado_actual?.nombre : "SIN ATENCIONES"), style: "tabla_datos_estados_actuales", fillColor:"#FFFF00", color: "black",};
                break;
            case 'Estable':
                pintar_estado_actual = { text: (paciente?.ultima_atencion?.ultimo_estado_actual != null ? paciente?.ultima_atencion?.ultimo_estado_actual?.nombre : "SIN ATENCIONES"), style: "tabla_datos_estados_actuales", fillColor:"#32CD32", color: "black"};
                break;
            case 'Prealta':
              pintar_estado_actual = { text:  (paciente?.ultima_atencion?.ultimo_estado_actual != null ?  paciente?.ultima_atencion?.ultimo_estado_actual?.nombre : "SIN ATENCIONES"),  style: "tabla_datos_estados_actuales", fillColor:"#FFFFFF", color: "black"};
              break;

            default:0

          }

        //}else{

        //     if(tieneAtencion == 1 && paciente.ultima_atencion.dadodeAlta == 0){

        //         pintar_estado_actual = { text:  (paciente.ultima_atencion != null && paciente?.ultima_atencion?.ultimo_estado_actual  != null ?  paciente?.ultima_atencion?.ultimo_estado_actual.nombre : "N/A"),  fontSize: 8, alignment:"center", color: "black"};

        //     }else{
                
        //         pintar_estado_actual = { text:  (paciente.ultima_atencion != null && paciente?.ultima_atencion?.ultimo_estado_actual  != null ?  paciente?.ultima_atencion?.ultimo_estado_actual.nombre : "NO CUENTA CON ATENCION Ó ESTA DADO DE ALTA"),  fontSize: 8, alignment:"center", color: "black"};
        //     }
        // }

              // if(tieneAtencion == 1 && paciente.ultima_atencion.dadodeAlta == 0 && paciente?.ultima_atencion?.ultimo_estado_actual != null){

                switch ( paciente?.ultima_atencion?.ultimo_estado_actual?.nombre ) {

                  case 'Estable':
                    estables++;
                    break;
                  case 'Grave':
                    graves++;
                    break;
                  case 'Muy Grave':
                    muy_grave++;
                    break;
                  case 'Delicado':
                    delicado++;
                    break;
                  case 'Prealta':
                    prealtas++;
                    break;
                  default:0
                }

                pacientes++;

              //}

              total_estables        = estables;
              total_graves          = graves;
              total_muy_graves      = muy_grave;
              total_delicado        = delicado;
              total_prealtas        = prealtas;


              total_estados_actuales = estables+graves+muy_grave+delicado+prealtas;

          // if(paciente.afiliacion_id == null){

          //   paciente.afiliacion_id = "NO REGISTRADO"; 

          // }
          // else{
          //   paciente.afiliacion_id = paciente.afiliacion.nombre;
          // }


          indice_actual = datos.content.length -1;

          datos.content[indice_actual].table.body.push([

            { text: i+1, style: 'tabla_datos' }, 
            { text: (paciente.alias == null || paciente.alias == ""  ? paciente.nombre + ' '+ paciente.paterno + ' '+ paciente.materno : paciente.alias), style: 'tabla_datos' },
            { text: paciente.numero_expediente, style: 'tabla_datos' },
            { text: "Cama: "+cama+" / "+"\n" + servicio, style: 'tabla_datos'},
            { text: (paciente.curp != null ? paciente.curp : "DESCONOCIDO"), style: 'tabla_datos'},
            // { text: (paciente.telefono_celular != null ? paciente.telefono_celular : "NO REGISTRADO"), style: 'tabla_datos'},
            { text: (paciente.telefono_emergencia != null    ? paciente.telefono_emergencia : "NO REGISTRADO"), style: 'tabla_datos'},
            { text: (paciente.edad != null ? paciente.edad+' '+paciente?.tipo_edad : "DESCONOCIDO"), style: 'tabla_datos'},
            // { text: (paciente.fecha_nacimiento != null ? fecha_nacimiento : "DESCONOCIDO"), fecha_nacimiento , style: 'tabla_datos'},
            pintar_estado_actual,
            { text: (extranjero == 1 ? 'EXTRANJERO' : "MEXICANO"), style: 'tabla_datos'},
            { text: (paciente.estado_republica_id != null ? paciente.estado_republica.nombre : "N/A"), style: 'tabla_datos'},
            { text: (paciente.municipio_id != null ? paciente.municipio.nombre : "N/A"), style: 'tabla_datos'},
            { text: (paciente.localidad_id != null ? paciente.localidad.nombre : "N/A"), style: 'tabla_datos'}
            //{ text: paciente.afiliacion_id , style: 'tabla_datos'}

          ]);
          
          pintar_estado_actual = {};
          cama = "";
          servicio = "";
        }

        datos.content.push({ text:'', pageBreak:'after' });


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

        datos.content.push({
          
          margin: [180,20,0,0],
          table: {
           widths: [ 250, 300, 80, 100 ],
            margin: [0,0,0,0],
            
            body: [
              [
                { text: "ESTADOS DE SALUD ACTUAL", style: "tabla_datos_estados_actuales", fillColor:"#DEDEDE", blod: true},
                { text: "TOTAL DE PACIENTES POR ESTADO DE SALUD ACTUAL", style: "tabla_datos_titulo", fillColor:"#DEDEDE", blod: true }
              ],
              [
                { text: "ESTABLES", style: "tabla_datos_estados_actuales", fillColor:"#32CD32", color: "black",},
                { text: total_estables, style: "tabla_datos_centrar", }
              ],
              [
                { text: "DELICADOS", style: "tabla_datos_estados_actuales", fillColor:"#FFFF00", color: "black"},
                { text: total_delicado, style: "tabla_datos_centrar",}
              ],
              [
                { text: "GRAVES", style: "tabla_datos_estados_actuales", fillColor:"#FFA500", color: "black",},
                { text: total_graves, style: "tabla_datos_centrar",}
              ],
              [
                { text: "MUY GRAVES", style: "tabla_datos_estados_actuales", fillColor:"#FF0000", color: "black"},
                { text: total_muy_graves, style: "tabla_datos_centrar",}
              ],
              [
                { text: "PREALTAS", style: "tabla_datos_estados_actuales", fillColor:"#FFFFFF", color: "black"},
                { text: total_prealtas, style: "tabla_datos_centrar",}
              ],
              [
                { text: "TOTAL DE PACIENTES", style: "tabla_datos_estados_actuales", fillColor:"#DEDEDE"},
                { text: total_estados_actuales, style: "tabla_datos_centrar", fillColor:"#DEDEDE", }
              ]
            ]
          }
        });

        return datos;
    }
}