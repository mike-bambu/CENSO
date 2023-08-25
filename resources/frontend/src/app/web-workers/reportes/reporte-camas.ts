import { LOGOS } from "../../logos";

export class ReporteCamas {

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
                    text: 'SECRETARÍA DE SALUD - Censo Hospitalario Electrónico de Pacientes (CHEP)\n'+reportData.config.title,
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

        datos.content.push({
          layout: 'noBorders',
          table: {
          widths: ['*'],
            margin: [0,0,0,0],
            body: [
              [
                { text: " \n\n", style: "tabla_datos"}
              ]
            ]
          }
        });

        const tabla_vacia = {

          table: {
            headerRows:1,
            dontBreakRows: true,
            keepWithHeaderRows: 1,
            widths: [ 30, '*', '*', '*', '*',],
            margin: [0,0,0,0],
            body: [
              //[{text: "["+empleado.clues+"] "+empleado.clues_descripcion, colSpan: 12, style: 'cabecera'},{},{},{},{},{},{},{},{},{},{},{}],
              [
                {text: "N°", style: 'cabecera'},
                {text: "#NUMERO DE CAMA", style: 'cabecera'},
                {text: "TIPO DE CAMA", style: 'cabecera'},
                {text: "SERVICIO", style: 'cabecera'},
                {text: "ESTATUS DE LA CAMA", style: 'cabecera'},
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

        let disponible = 0;
        let total_disponibles = 0;

        let espera = 0;
        let total_espera = 0;

        let asignadas = 0;
        let total_asignadas = 0;

        let ocupadas = 0;
        let total_ocupadas = 0;

        let en_transicion = 0;
        let total_en_transicion = 0;

        let inactiva = 0;
        let total_inactiva = 0;

        const camas = 0;

        let total_estatus_cama = 0;

        let pintar_estado_actual = {};
        //console.log('for(let i = 0; i < ; i++){');
        for(let i = 0; i < reportData.items.length; i++){
          //console.log("iiiii", reportData.items.length);
          let camas = reportData.items[i];
          //estatus_cama_id

        if(camas.estatus_cama != null){

          switch (camas.estatus_cama.nombre) {

            case 'Disponible':
                pintar_estado_actual = { text: (camas.estatus_cama != null ? camas.estatus_cama.nombre : "NO ASIGNADO"), style: "tabla_datos_estados_actuales", fillColor:"#32CD32", color: "black"};
                break;
            case 'En espera':
                pintar_estado_actual = { text: (camas.estatus_cama != null ? camas.estatus_cama.nombre : "NO ASIGNADO"), style: "tabla_datos_estados_actuales", color: "black",};
                break;
            case 'Asignada':
                pintar_estado_actual = { text: (camas.estatus_cama != null ? camas.estatus_cama.nombre : "NO ASIGNADO"), style: "tabla_datos_estados_actuales", color: "black",};
                break;
            case 'Ocupada':
                pintar_estado_actual = { text: (camas.estatus_cama != null ? camas.estatus_cama.nombre : "NO ASIGNADO"), style: "tabla_datos_estados_actuales", fillColor:"#FF0000", color: "black"};
                break;
            case 'En transición':
              pintar_estado_actual = { text:   (camas.estatus_cama != null ? camas.estatus_cama.nombre : "NO ASIGNADO"),  style: "tabla_datos_estados_actuales",  color: "black"};
              break;
            case 'Inactiva':
              pintar_estado_actual = { text:   (camas.estatus_cama != null ? camas.estatus_cama.nombre : "NO ASIGNADO"),  style: "tabla_datos_estados_actuales",  color: "black"};
              break;

            default:0

          }

        }else{


              pintar_estado_actual = { text:  (camas.estatus_cama != null ? camas.estatus_cama.nombre : "NO ASIGNADO"),  fontSize: 8, alignment:"center", color: "black"};

        }


          indice_actual = datos.content.length -1;

          datos.content[indice_actual].table.body.push([

            { text: i+1, style: 'tabla_datos' }, 
            { text: camas.numero, style: 'tabla_datos' },
            { text: camas.tipo_cama, style: 'tabla_datos' },
            { text: (camas.servicio_id != null ? camas.servicio.nombre : "N/A"), style: 'tabla_datos'},
            pintar_estado_actual,
            //{ text: (camas.estatus_cama_id != null ? camas.estatus_cama.nombre : "N/A"), style: 'tabla_datos'},
            
            //{ text: paciente.afiliacion_id , style: 'tabla_datos'}

          ]);
          
          pintar_estado_actual = {};

          if(camas.estatus_cama != null){

            switch (camas.estatus_cama.nombre) {

              case 'Disponible':
                disponible++;
                break;
              case 'En espera':
                espera++;
                break;
              case 'Asignada':
                asignadas++;
                break;
              case 'Ocupada':
                ocupadas++;
                break;
              case 'En transición':
                en_transicion++;
                break;
              case 'Inactiva':
                inactiva++;
                break;
              default:0
            }

            camas++;

          }

          

          total_disponibles     = disponible;
          total_espera          = espera;
          total_asignadas       = asignadas;
          total_ocupadas        = ocupadas;
          total_en_transicion   = en_transicion;
          total_inactiva        = inactiva;


          total_estatus_cama = total_disponibles+total_espera+total_asignadas+total_ocupadas+total_en_transicion+total_inactiva;

          console.log(total_estatus_cama);
        }

        datos.content.push({ text:'', pageBreak:'after' });


        datos.content.push({
          
          margin: [180,20,0,0],
          table: {
           widths: [ 250, 300, 80, 100 ],
            margin: [0,0,0,0],
            
            body: [
              [
                { text: "CENSO DE CAMAS HOSPITALARIO", style: "tabla_datos_estados_actuales", fillColor:"#DEDEDE", blod: true},
                { text: "TOTAL DE CAMAS POR ESTATUS", style: "tabla_datos_titulo", fillColor:"#DEDEDE", blod: true }
              ],
              [
                { text: "DISPONIBLES", style: "tabla_datos_estados_actuales", fillColor:"#32CD32", color: "black",},
                { text: total_disponibles, style: "tabla_datos_centrar", }
              ],
              [
                { text: "EN ESPERA", style: "tabla_datos_estados_actuales", color: "black",},
                { text: total_espera, style: "tabla_datos_centrar",}
              ],
              [
                { text: "ASIGNADAS", style: "tabla_datos_estados_actuales", color: "black"},
                { text: total_asignadas, style: "tabla_datos_centrar",}
              ],
              [
                { text: "OCUPADAS", style: "tabla_datos_estados_actuales", fillColor:"#FF0000", color: "black"},
                { text: total_ocupadas, style: "tabla_datos_centrar",}
              ],
              [
                { text: "EN TRANSICION", style: "tabla_datos_estados_actuales", color: "black"},
                { text: total_en_transicion, style: "tabla_datos_centrar",}
              ],
              [
                { text: "INACTIVAS", style: "tabla_datos_estados_actuales",  color: "black"},
                { text: total_inactiva, style: "tabla_datos_centrar",}
              ],
              [
                { text: "TOTAL DE CAMAS", style: "tabla_datos_estados_actuales", fillColor:"#DEDEDE"},
                { text: total_estatus_cama, style: "tabla_datos_centrar", fillColor:"#DEDEDE", }
              ]
            ]
          }
        });

        return datos;
    }
}