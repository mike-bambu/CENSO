import { LOGOS } from "../../logos";

export class ReporteEmbarazadas {

    getDocumentDefinition(reportData:any) {
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
                    text: 'SECRETARÍA DE SALUD\n'+'COORDINACIÓN DE LA ESTRATEGIA PARA LA CONTENCIÓN DE LA MORTALIDAD MATERNA - '+' '+reportData.config.title,
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
                      text:'http://chep.saludchiapas.gob.mx/',
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
                fontSize: 7,
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
                fontSize: 5
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
            widths: [ 15, 250, 40, 50, 50, 40, 40, 40, 45, 45, 70, 50, 70],
            margin: [0,0,0,0],
            body: [
              [
                {text: "N°", style: 'cabecera'},
                {text: "NOMBRE/ALIAS", style: 'cabecera'},
                {text: "TELÉFONO DE CONTACTO", style: 'cabecera'},
                {text: "MUNICIPIO", style: 'cabecera'},
                {text: "LOCALIDAD", style: 'cabecera'},
                {text: "EDAD", style: 'cabecera'},
                {text: "N° GESTAS", style: 'cabecera'},
                {text: "N° PARTOS", style: 'cabecera'},
                {text: "N° CESAREAS", style: 'cabecera'},
                {text: "N° ABORTOS", style: 'cabecera'},
                {text: "FECHA DE INGRESO", style: 'cabecera'},
                // {text: "DIAGNOSTICO(S) DE INGRESO", style: 'cabecera'},
                // {text: "DIAGNOSTICO(S) ACTUAL(ES)", style: 'cabecera'},
                {text: "ESTADO ACTUAL", style: 'cabecera'},
                {text: "N° CAMA/SERVICIO", style: 'cabecera'},
                // {text: "FECHA EGRESO", style: 'cabecera'},
                // {text: "MOTIVO DE EGRESO", style: 'cabecera'},
                // {text: "CONDICIONES DE EGRESO", style: 'cabecera'},
                // {text: "DIAGNOSTICO(S) DE EGRESO", style: 'cabecera'},
                // {text: "APEO", style: 'cabecera'},
                // {text: "OBSERVACIONES DE EGRESO", style: 'cabecera'},
              ],

            ]
          }
        };
        
        datos.content.push(JSON.parse(JSON.stringify(tabla_vacia)));
      

        let indice_actual;//(datos.content.length -1);
        let diagnosticos_ingreso = "";
        let diagnosticos_actual = "";
        const estado_actual = "";
        let cama = "";
        let servicio = "";
        let fecha_atencion = "";
        const alta = "";
        let diagnosticos_alta = "";
        //EDADES
        let menores_igual_19 = 0;
        let mayores_igual_20 = 0;
        let total_pacientes = 0;
        //ESTADO ACTUAL
        let muy_graves_embarazadas = 0;
        let muy_graves_puerperas = 0;
        let total_muy_graves = 0;

        let graves_embarazadas = 0;
        let graves_puerperas = 0;
        let total_graves = 0;

        let delicadas_embarazadas = 0;
        let delicadas_puerperas = 0;
        let total_delicadas = 0;

        let estables_embarazadas = 0;
        let estables_puerperas = 0;
        let total_estables = 0;

        let prealta_embarazadas = 0;
        let prealta_puerperas = 0;
        let total_prealtas = 0;


        let total_estados_actuales = 0;
        let total_embarazadas_estados_actuales = 0;
        let total_puerperas_estados_actuales = 0;

        let embarazadas = 0;
        let puerperas = 0;


        for(let i = 0; i < reportData.items.length; i++){
              const paciente = reportData.items[i];


              let nombre_paciente = "";

              if(paciente.alias == null || paciente.alias == ""){

                nombre_paciente = paciente.nombre + ' '+ paciente.paterno + ' '+ paciente.materno;

              }else{

                nombre_paciente = paciente.alias;

              }

              if( paciente.ultima_atencion?.fecha_inicio_atencion != null || paciente.ultima_atencion?.fecha_inicio_atencion != ""){

                fecha_atencion = new Intl.DateTimeFormat('es-ES', {year: 'numeric', month: '2-digit', day: '2-digit'}).format(new Date(paciente.ultima_atencion?.fecha_inicio_atencion));

              }

              let telefono_contacto = "";

              if(paciente.telefono_celular != null || paciente.telefono_celular != ""){
                telefono_contacto = paciente.telefono_celular;
              }else{
                telefono_contacto = paciente.telefono_emergencia;
              }

              let edad = "";

              if(paciente.edad == null){
                edad = paciente.edad_aparente+" "+paciente?.tipo_edad;
              }else{
                edad = paciente.edad +" "+paciente?.tipo_edad;
              }



              if(paciente.edad <= 19){
                menores_igual_19 ++;
              }

              if(paciente.edad >= 20){
                mayores_igual_20 ++;
              }

              total_pacientes = reportData.items.length;

              if(paciente.estaEmbarazada == 1){

                switch (paciente.ultima_atencion.ultimoEstadoActual) {

                  case 'Muy Grave':
                    muy_graves_embarazadas++;
                    break;
                  case 'Grave':
                    graves_embarazadas++;
                    break;
                  case 'Delicado':
                    delicadas_embarazadas++;
                    break;
                  case 'Estable':
                    estables_embarazadas++;
                    break;
                  case 'Prealta':
                    prealta_embarazadas++;  
                  default:0
                }

                embarazadas++;

              }else if(paciente.estaEmbarazada == 0){

                switch (paciente.ultimoEstadoActual) {

                  case 'Muy Grave':
                    muy_graves_puerperas++;
                    break;
                  case 'Grave':
                    graves_puerperas++;
                    break;
                  case 'Delicada':
                    delicadas_puerperas++;
                    break;
                  case 'Estable':
                    estables_puerperas++;
                    break;
                  case 'Prealta':
                    prealta_puerperas++;  
                  default:0
                }

                puerperas++;

              }

              total_muy_graves      = muy_graves_embarazadas+muy_graves_puerperas;
              total_graves          = graves_embarazadas+graves_puerperas;
              total_delicadas       = delicadas_embarazadas+delicadas_puerperas;
              total_estables        = estables_embarazadas+estables_puerperas;
              total_prealtas        = prealta_embarazadas+prealta_puerperas;


              total_embarazadas_estados_actuales    = muy_graves_embarazadas+graves_embarazadas+delicadas_embarazadas+estables_embarazadas;
              total_puerperas_estados_actuales      = muy_graves_puerperas+graves_puerperas+delicadas_puerperas+estables_puerperas;


              total_estados_actuales = total_muy_graves+total_graves+total_delicadas+total_estables+total_prealtas;

              // if(paciente.tieneAlta == 1 && paciente.estaEmbarazada == 1){

              //   total_altas_embarazadas++;

              // }else{

              //   total_altas_puerperas++;

              // }

              // total_altas = total_altas_embarazadas+total_altas_puerperas;



              if(paciente.municipio_id == null ){

                paciente.municipio_id = "NO ASIGNADO"; 

              }
              else{
                paciente.municipio_id = paciente.municipio.nombre;
              }

              if(paciente.localidad_id == null ){

                paciente.localidad_id = "NO ASIGNADO"; 

              }
              else{
                paciente.localidad_id = paciente.localidad.nombre;
              }

              if(paciente.telefono_contacto == null ){

                paciente.telefono_contacto = "NO FUE PROPORCIONADO"; 
      
              }
              else{
                paciente.telefono_contacto;
              }


              indice_actual = datos.content.length -1;

              if(paciente.primer_seguimiento != null){
                if(paciente.primer_seguimiento.diagnosticos.length == 0){
                  diagnosticos_ingreso = "NO SE REGISTRÓ NINGÚN DIAGNOSTICO";
                }else{
                  for (const indice in paciente.primer_seguimiento.diagnosticos){

                    const index = parseInt(indice)+1;

                    if (diagnosticos_ingreso!=="")
                    diagnosticos_ingreso += ".\n";
                    diagnosticos_ingreso += `${index}: ${paciente.primer_seguimiento.diagnosticos[indice].nombre}`;

                  }
                }
              }else{
                diagnosticos_ingreso = "NO SE HA REGISTRADO NINGÚN SEGUIMIENTO Y/O ATENCIÓN A LA PACIENTE";
              }

              if(paciente.ultimo_seguimiento != null){
                if(paciente.ultimo_seguimiento.diagnosticos.length == 0){
                  diagnosticos_actual = "NO SE REGISTRÓ NINGÚN DIAGNOSTICO";
                }else{
                  for (const indice in paciente.ultimo_seguimiento.diagnosticos){

                    const index = parseInt(indice)+1;

                    if (diagnosticos_actual!=="")
                    diagnosticos_actual += ".\n";
                    diagnosticos_actual += `${index}: ${paciente.ultimo_seguimiento.diagnosticos[indice].nombre}`;

                  }
                }
                cama = paciente.ultimo_seguimiento.no_cama;
                servicio = paciente.ultimo_seguimiento.servicio.nombre;
              }else{
                diagnosticos_actual = "NO SE HA REGISTRADO NINGÚN SEGUIMIENTO Y/O ATENCIÓN A LA PACIENTE";
                cama                = "NO SE REGISTRO";
                servicio            = "NO SE REGISTRO";
              }


          
                datos.content[indice_actual].table.body.push([
                  { text: i+1, style: 'tabla_datos' },
                  { text: nombre_paciente, style: 'tabla_datos'},
                  { text: telefono_contacto, style: 'tabla_datos' },
                  { text: paciente.municipio_id , style: 'tabla_datos'},
                  { text: paciente.localidad_id , style: 'tabla_datos'},
                  { text: edad, style: 'tabla_datos'},
                  { text: paciente.gestas, style: 'tabla_datos'},
                  { text: paciente.partos, style: 'tabla_datos'},
                  { text: paciente.cesareas, style: 'tabla_datos'},
                  { text: paciente.abortos, style: 'tabla_datos'},
                  { text: fecha_atencion, style: 'tabla_datos'},
                  { text: paciente.estado_actual_id+'. '+paciente.ultima_atencion?.ultimoEstadoActual, style: 'tabla_datos'},
                  { text: 'N° '+cama+' / '+servicio, style: 'tabla_datos'},
                ]);
                diagnosticos_ingreso = "";
                diagnosticos_actual = "";
                diagnosticos_alta = "";
                
              
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