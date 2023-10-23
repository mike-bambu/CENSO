import { LOGOS } from "../../logos";


export class ReporteFichaInformativa{
    
    getDocumentDefinition(reportData:any) {
        //return reportData;
        const contadorLineasHorizontalesV = 0;
        const fecha_hoy =  new Intl.DateTimeFormat('es-ES', {year: 'numeric', month: 'long', day: '2-digit'}).format(new Date());
        const fecha_actual_server = reportData.fecha_actual;
        console.log(LOGOS);


        const datos = {
          pageOrientation: 'portrait',
          pageSize: 'LETTER',
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
                    // text: reportData.config.title,
                    text: 'SECRETARÍA DE SALUD\n'+'Censo Hospitalario Electrónico de Pacientes (CHEP)\n'+''+reportData.config.title,
                    bold: true,
                    fontSize: 10,
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
                    text:fecha_hoy.toString(),
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
              cabecera_saguimientos: {
                fontSize: 7,
                bold: true,
                fillColor:"#AB9451",
                color: "white",
                alignment:"center"
              },
              subcabecera:{
                fontSize: 9,
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
                fontSize: 7,
                alignment:"center"
              },
              tabla_datos_titulo:
              {
                fontSize: 7,
                alignment:"center"
              },
              tabla_datos_centrar:
              {
                fontSize: 7,
                alignment:"center",
                bold: true,
                color:"red",
              },
              tabla_datos_respuesta:
              {
                fontSize: 7,
                bold: true,
                color:"red",
              },
              campos_izquierda:
              {
                fontSize: 7,
                alignment:"left"
              },
              datos_personales_izquierda:
              {
                fontSize: 7,
                bold: true,
                color:"red",
                
              },
              tabla_datos_personales:
              {
                fontSize: 7,
                alignment:'left'
              },
              datos_contacto:
              {
                fontSize: 10,
                bold: true,
                alignment:"center"
              },
            }
        };

        const paciente        = reportData.items;
        let desconocido;
        let extranjero;
        desconocido = parseInt(paciente.esDesconocido);
        extranjero  = parseInt(paciente.esExtranjero);
        const no_expediente = paciente.numero_expediente != "" ? paciente.numero_expediente : "NO SE HA GENERADO";
        console.log("asawwwww", no_expediente);

        //let fecha_ingreso     =  new Intl.DateTimeFormat('es-ES', {year: 'numeric', month: 'long', day: '2-digit'}).format(new Date(paciente.fecha_ingreso));
        const fecha_nacimiento  =  new Intl.DateTimeFormat('es-ES', {year: 'numeric', month: '2-digit', day: '2-digit'}).format(new Date(paciente.fecha_nacimiento));

        if(desconocido == 1){

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

            datos.content.push({
              layout: 'noBorders',
              table: {
              widths: [50, 120, 20, 45, 60, 100, 50, 50, 20],
                margin: [0,0,0,0,0],
                body: [
                  [

                    {text: "Identidad: ", style: "tabla_datos_personales"},
                    {text: (desconocido == 1 ? "DESCONOCIDA": "N/A"), style: "datos_personales_izquierda"},
    
                    {text: "Alias: ", style: "tabla_datos_personales",},
                    {text: paciente.alias, style: "datos_personales_izquierda"},
    
                    {text: "Sexo: ", style: "tabla_datos_personales"},
                    {text: paciente.sexo, style: "datos_personales_izquierda"},

                  ],
                  [

                    {text: "N° Expediente: ", style: "tabla_datos_personales"},
                    {text: no_expediente, style: "datos_personales_izquierda", colSpan:2},{},

                    {text: "Folio: ", style: "tabla_datos_personales"},
                    {text: paciente.folio_paciente, style: "datos_personales_izquierda", colSpan:2},{},
                    //{text: datos_triage.calle+" "+datos_triage.colonia+" "+(datos_triage.no_exterior != null ? "No."+datos_triage.no_exterior : "S/N")+" "+(datos_triage.no_interior != null ?  'Int. '+datos_triage.no_interior : ""), colSpan:6, style: "tabla_datos_respuesta"  },{},{},{},{},{}
                  ],
                  [

                    {text: "¿Es Extrajero?: ", style: "tabla_datos_personales"},
                    {text: (extranjero == 1 ? "SI": "NO"), style: "datos_personales_izquierda", colSpan:2},{},

                    {text: "País: ", style: "tabla_datos_personales"},
                    {text: (paciente.pais_origen_id != null ? paciente.pais_origen.nombre : "N/A"), style: "datos_personales_izquierda", colSpan:2},{},

                  ]
                ]
              }
            });
          
        }else{

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

          datos.content.push({
            layout: 'noBorders',
            table: {
            widths: [50, 120, 20, 45, 60, 100, 50, 50, 20],
              margin: [0,0,0,0,0],
              body: [
                [
  
                  {text: "Nombre: ", style: "tabla_datos_personales",},
                  {text: paciente.nombre+" "+paciente.paterno+" "+paciente.materno, style: "datos_personales_izquierda"},
  
                  {text: "Edad: ", style: "tabla_datos_personales"},
                  {text:paciente.edad +" "+paciente?.tipo_edad, style: "datos_personales_izquierda"},
                  // {text: "Sexo: ", style: "tabla_datos"},
                  // {text: (datos_triage.sexo == 1 ? "M" : "F"), style: "tabla_datos_respuesta"},
                  {text: "N° Expediente: ", style: "tabla_datos_personales"},
                  {text: no_expediente, style: "datos_personales_izquierda", colSpan:3},{},{},{},
  
                  // {text: "Fecha Ingreso: ", style: "tabla_datos"},
                  // {text:datos_triage.datos_valoracion.created_at.substr(0, 10), style: "tabla_datos_respuesta"},
                  // {text: "Hora: ", style: "tabla_datos"},
                  // {text: datos_triage.datos_valoracion.created_at.substr(11, 5), style: "tabla_datos_respuesta"}
                ],
                [
                  {text: "Folio: ", style: "tabla_datos_personales"},
                  {text: paciente.folio_paciente, style: "datos_personales_izquierda", colSpan:2},{},
  
                  {text: "CURP: ", style: "tabla_datos_personales"},
                  {text:paciente.curp, style: "datos_personales_izquierda", colSpan:2},{},
  
                  {text: "Fecha de nacimiento: ", style: "tabla_datos_personales"},
                  {text: fecha_nacimiento, style: "datos_personales_izquierda", colSpan:2},{},
  
                  //{text: datos_triage.calle+" "+datos_triage.colonia+" "+(datos_triage.no_exterior != null ? "No."+datos_triage.no_exterior : "S/N")+" "+(datos_triage.no_interior != null ?  'Int. '+datos_triage.no_interior : ""), colSpan:6, style: "tabla_datos_respuesta"  },{},{},{},{},{}
                ],
                [
                  {text: "Estado de la Republica:", style: "tabla_datos_personales"},
                  {text: (paciente.estado_republica_id != null ? paciente.estado_republica.nombre : "N/A"), style: "datos_personales_izquierda",colSpan:1},{},

                  {text: "Municipio:", style: "tabla_datos_personales"},
                  {text: (paciente.municipio_id != null ? paciente.municipio.nombre : "N/A"), style: "datos_personales_izquierda",colSpan:1},{},
  
                  {text: "Localidad: ", style: "tabla_datos_personales"},
                  {text: (paciente.localidad_id != null ? paciente.localidad.nombre : "N/A"), style: "datos_personales_izquierda",colSpan:1},{},
  

                ],
                [

                  {text: "Teléfono: ", style: "tabla_datos_personales"},
                  {text: paciente.telefono_emergencia, style: "datos_personales_izquierda",colSpan:1},{},

                  {text: "Celular: ", style: "tabla_datos_personales"},
                  {text: paciente.telefono_celular, style: "datos_personales_izquierda",colSpan:1},{},
                  
                  {text:''},
                  {text:'',colSpan:2},{},

                ],
  
  
                // [
                //   {text: "Diagnostico: ", style: "tabla_datos"},
                //   {text: datos_triage.datos_valoracion.diagnostico, style: "tabla_datos_respuesta", colSpan:9},{},{},{},{},{},{},{},{},
                //   {text: "Subsecuente: ", style: "tabla_datos"},
                //   {text: (datos_triage.datos_valoracion.subsecuente == 1 ? "SI" : "NO"), style: "tabla_datos_respuesta"}
                // ],
                // [
                //   {text:''},{},{},{},{},{},{},{},{},{},{},{}
                // ],
                // [
                //   {text: "Fecha de Inicio del Padecimiento: ", style: "tabla_datos", colSpan: 3},{},{},
                //   {text: datos_triage.datos_valoracion.fecha_inicio_padecimiento, style: "tabla_datos_respuesta"},
                //   {text:"¿Tiene Menos de 7 Días? ", style: "tabla_datos", colSpan: 4},{},{},{},
                //   {text: (datos_triage.datos_valoracion.menosSieteDias == 1 ? "SI" : "NO"), style: "tabla_datos_respuesta", colSpan: 4},{},{},{}
                // ],
                // [
                //   {text: "Marque con un X la presencia o no de los siguientes síntomas", style: "tabla_datos", colSpan:12},{},{},{},{},{},{},{},{},{},{},{}
                // ]
              ]
            }
          });

        }

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

        function diferenciaDeDias(f1, f2) {

          console.log("f1",f1);
          console.log("f2",f2);

          // let dt1 = new Date(f1).getTime();
          // let dt2 = new Date(f2).getTime();

          // var total = (dt2 - dt1);
          // console.log("TOTAL",total);

          // var totalD =  Math.abs(Math.floor(total/1000));

          // var anios   = Math.floor(totalD / (365*60*60*24));
          // var meses  = Math.floor((totalD - anios*365*60*60*24) / (30*60*60*24));
          // var dias    = Math.floor((totalD - anios*365*60*60*24 - meses*30*60*60*24) / (60*60*24));

          
          // console.log("DIASAA",dias);

          const fecha1 = new Date(f1);
          const fecha2 = new Date(f2)

          const resta = fecha2.getTime() - fecha1.getTime()
          const fecha = Math.round(resta/ (1000*60*60*24));

          return fecha;     
      }

      function formatoFecha(string) {
        console.log("string", string);

        const formato_fecha = string.split('-').reverse().join('/');
        return formato_fecha;

      }

        if(paciente.atenciones.length > 0){

            let indice;

            for(let i = 0; i < paciente.atenciones.length; i++){

              indice = i+1;
              let esta_embarazada;
              let es_puerpera;
              const atencion                = paciente.atenciones[i];
              esta_embarazada             = parseInt(atencion.estaEmbarazada);
              let ha_estado_embarazada;
              ha_estado_embarazada        = parseInt(atencion.haEstadoEmbarazada);
              const fecha_inicio_atencion   = formatoFecha(atencion.fecha_inicio_atencion);
              let dias_hospitalizado      = 0;
              let cama                    = ( atencion.no_cama == null || atencion.no_cama == "" ? 'N/A' : atencion.no_cama );
              let servicio                = ( atencion.servicio_atencion  != null ? atencion.servicio_atencion.nombre : 'SIN SERVICIO');

              if( paciente?.embarazo?.puerperio === 1 ){

                es_puerpera = parseInt(paciente?.embarazo?.puerperio);

              }

              if(atencion.alta == null){
                
                dias_hospitalizado = diferenciaDeDias(atencion.fecha_inicio_atencion, fecha_actual_server);

              }else{
                console.log(atencion.fecha_inicio_atencion);
                console.log(atencion.alta.fecha_alta);

                dias_hospitalizado = diferenciaDeDias(atencion.fecha_inicio_atencion, atencion.alta.fecha_alta);

              }

      

              datos.content.push({
                layout: 'noBorders',
                table: {
                widths: [150,330 ],
                  margin: [0,0,0,0],
                  body: [
                    [
                      { text: "Atención y Seguimientos Hospitalarios: ", style: "tabla_datos" },
                      { text: " \n\n", style: "tabla_datos"}
      
                    ]
                  ]
                }
              });

              //datos.content.push(JSON.parse(JSON.stringify(tabla_vacia_atenciones)));

              datos.content.push({
                layout: 'noBorders',
                table: {
                  headerRows:1,
                  dontBreakRows: true,
                  keepWithHeaderRows: 1,
                  widths: [ 30, '*', '*', '*', '*', '*', '*'],
                  //widths: [30, 70, 80, 80, 70, 40, 50, 50, 60 , 55, 45, 55, 60, 60, 60 ],
                  margin: [0,0,0,0],
                  body: [
                    //[{text: "["+empleado.clues+"] "+empleado.clues_descripcion, colSpan: 12, style: 'cabecera'},{},{},{},{},{},{},{},{},{},{},{}],
                    [{text: "Atención N°"+' '+indice, colSpan: 3, style: 'subcabecera'},{},{},{text: "Días de Hospitalización:"+' '+dias_hospitalizado, colSpan: 4, style: 'subcabecera'},{},{},{}],
                    [
                      {text: "N°", style: 'cabecera'},
                      {text: "OBSERVACIONES", style: 'cabecera'},
                      {text: "FECHA DE LA ATENCIÓN", style: 'cabecera'},
                      {text: "HORA DE LA ATENCIÓN", style: 'cabecera'},
                      {text: "ESTADO DE SALUD ACTUAL", style: 'cabecera'},
                      {text: "N° CAMA/SERVICIO", style: 'cabecera'},
                      {text: "MOTIVO DE LA ATENCIÓN", style: 'cabecera'},
                    ]
                  ]
                }
              });

                  // indice_actual = datos.content.length -1;
              
              
                  datos.content.push({
                    layout: 'noBorders',
                    table: {
                    widths: [30, 100, '*', '*', '*', '*', 100],
                      margin: [0,0,0,0],
                      body: [
                        [
                          { text: i+1, style: 'tabla_datos' }, 
                          { text: atencion.indicaciones, style: 'tabla_datos'},
                          { text: fecha_inicio_atencion, style: 'tabla_datos'},
                          { text: atencion.hora, style: 'tabla_datos'},
                          { text: (atencion.estado_actual_id != null ? atencion.estado_actual.nombre : "N/A"), style: 'tabla_datos'},
                          { text: "N°: "+cama+" / "+servicio, style: 'tabla_datos'},
                          { text: atencion.motivo_atencion, style: 'tabla_datos'},
        
                        ]
                      ]
                    }
                  });

                  cama = "";
                  servicio = "";

                  if(atencion.seguimientos.length > 0){


                      datos.content.push({
                        layout: 'noBorders',
                        table: {
                          headerRows:1,
                          dontBreakRows: true,
                          keepWithHeaderRows: 1,
                          widths: [ 25, 40, 40, 40, 40, '*', '*', '*'],
                          //widths: [30, 70, 80, 80, 70, 40, 50, 50, 60 , 55, 45, 55, 60, 60, 60 ],
                          margin: [0,0,0,0],
                          body: [
                            //[{text: "["+empleado.clues+"] "+empleado.clues_descripcion, colSpan: 12, style: 'cabecera'},{},{},{},{},{},{},{},{},{},{},{}],
                            [{text: "Seguimientos de la Atención N°"+' '+indice, colSpan: 8, style: 'subcabecera'},{},{},{},{},{},{},{}],
                            [
                              {text: "N°", style: 'cabecera_saguimientos'},
                              {text: "ESTADO DE SALUD", style: 'cabecera_saguimientos'},
                              {text: "FECHA", style: 'cabecera_saguimientos'},
                              {text: "HORA", style: 'cabecera_saguimientos'},
                              {text: "CUADRO RESPIRATORIO (COVID-19)", style: 'cabecera_saguimientos'},
                              {text: "N° CAMA/SERVICIO", style: 'cabecera_saguimientos'},
                              {text: "DIAGNOSTICO(S)", style: 'cabecera_saguimientos'},
                              {text: "OBSERVACIONES", style: 'cabecera_saguimientos'},
                            ]
                          ]
                        }
                      });


                      for(let j = 0; j < atencion.seguimientos.length; j++){

                          // let diagnosticos_seguimiento = "";

  
                          // if(atencion.seguimientos[j].diagnosticos.length == 0){

                          //   diagnosticos_seguimiento = "NO SE REGISTRÓ NINGÚN DIAGNOSTICO";

                          // }else{
                          //     for (let indice in atencion.seguimientos[j].diagnosticos){
                
                          //       let index = parseInt(indice)+1;
                
                          //       if (diagnosticos_seguimiento!=="")
                          //       diagnosticos_seguimiento += ".\n";
                          //       diagnosticos_seguimiento += `${index}: ${atencion.seguimientos[j].diagnosticos[indice].nombre}`;
                
                          //     }
                          // }

                          

                          datos.content.push({
                            layout: 'noBorders',
                            table: {
                            widths: [25, 40, 40, 40, 40, '*', '*', '*'],
                              margin: [0,0,0,0],
                              body: [
                                [
                                  { text: j+1, style: 'tabla_datos' }, 
                                  { text: (atencion.seguimientos[j].estado_actual_id != null ? atencion.seguimientos[j].estado_actual.nombre : "N/A"), style: 'tabla_datos'},
                                  { text: (atencion.seguimientos[j].fecha_seguimiento != null ? formatoFecha(atencion.seguimientos[j].fecha_seguimiento) : "SIN REGISTRO"), style: 'tabla_datos'},
                                  { text: (atencion.seguimientos[j].hora_seguimiento != null ? atencion.seguimientos[j].hora_seguimiento : "SIN REGISTRO"), style: 'tabla_datos'},
                                  { text: (atencion.seguimientos[j].factor_covid_id  != null ? atencion.seguimientos[j].factor_covid.nombre : "N/A"), style: 'tabla_datos'},
                                  { text: (atencion.seguimientos[j].servicio_id  != null ? 'N° '+atencion.seguimientos[j].no_cama+' / '+atencion.seguimientos[j].servicio.nombre : "N/A"), style: 'tabla_datos'},
                                  { text: (atencion.seguimientos[j].observaciones_diagnosticos != null ? atencion.seguimientos[j].observaciones_diagnosticos : "SIN REGISTRO"), style: 'tabla_datos'},
                                  { text: atencion.seguimientos[j].observaciones, style: 'tabla_datos'},
                
                                ]
                              ]
                            }
                          });
                          //diagnosticos_seguimiento = "";

                      }


                      datos.content.push({
                        layout: 'noBorders',
                        table: {
                         widths: [150],
                          margin: [0,0,0,0],
                          body: [
                            [
                              { text: "\n", style: "tabla_datos"}
                            ]
                          ]
                        }
                      });

                  }else{

                    datos.content.push({
                      layout: 'noBorders',
                      table: {
                        widths: [30, '*', '*', '*', '*', '*'],
                        margin: [0,0,0,0],
                        body: [
                          [
                            { text: "Esta atención hospitalaria no cuenta con seguimientos:", colSpan: 6, style: 'subcabecera'},{},{},{},{},{}
                          ]
                        ]
                      }
                    });

                  }

                  if(atencion.alta != null){

                    const fecha_alta              = formatoFecha(atencion.alta.fecha_alta);
                    console.log("ALTA", fecha_alta);

                    datos.content.push({
                      layout: 'noBorders',
                      table: {
                        headerRows:1,
                        dontBreakRows: true,
                        keepWithHeaderRows: 1,
                        widths: [30, '*', '*', '*', 100, 100],
                        //widths: [30, 70, 80, 80, 70, 40, 50, 50, 60 , 55, 45, 55, 60, 60, 60 ],
                        margin: [0,0,0,0],
                        body: [
                          //[{text: "["+empleado.clues+"] "+empleado.clues_descripcion, colSpan: 12, style: 'cabecera'},{},{},{},{},{},{},{},{},{},{},{}],
                          [{text: "Alta ó Egreso de la Atención N°"+' '+indice, colSpan: 6, style: 'subcabecera'},{},{},{},{},{}],
                          [
                            {text: "N°", style: 'cabecera_saguimientos'},
                            {text: "ESTADO DE SALUD ACTUAL", style: 'cabecera_saguimientos'},
                            {text: "FECHA DEL ALTA Ó EGRESO", style: 'cabecera_saguimientos'},
                            {text: "MOTIVO DEL ALTA Ó EGRESO", style: 'cabecera_saguimientos'},
                            {text: "OBSERVACIONES", style: 'cabecera_saguimientos', colSpan: 2},{}

                          ]
                        ]
                      }
                    });

                    datos.content.push({
                      layout: 'noBorders',
                      table: {
                      widths: [30, '*', '*', '*', 100, 100],
                        margin: [0,0,0,0],
                        body: [
                          [
                            { text: "1", style: 'tabla_datos' }, 
                            { text: (atencion.alta.estado_actual_id != null ? atencion.alta.estado_actual.nombre : "N/A"), style: 'tabla_datos'},
                            { text: (fecha_alta != null ? fecha_alta : "N/A"), style: 'tabla_datos'},
                            { text: (atencion.alta.motivo_egreso_id  != null ? atencion.alta.motivo_egreso.nombre : "N/A"), style: 'tabla_datos'},
                            { text: (atencion.alta.observaciones  != null ? atencion.alta.observaciones : "N/A"), style: 'tabla_datos', colSpan: 2},{},
                          ]
                        ]
                      }
                    });


                  }else{

                    datos.content.push({
                      layout: 'noBorders',
                      table: {
                        widths: [30, '*', '*', '*', '*', '*'],
                        margin: [0,0,0,0],
                        body: [
                          [
                            { text: "Esta atención hospitalaria no cuenta con alta ó egreso:", colSpan: 6, style: 'subcabecera'},{},{},{},{},{}
                          ]
                        ]
                      }
                    });

                  }

                  dias_hospitalizado = 0;



                  if( paciente.sexo === "Femenino" && esta_embarazada === 1 ){

                    datos.content.push({
                      layout: 'noBorders',
                      table: {
                      widths: [150,330 ],
                        margin: [0,0,0,0],
                        body: [
                          [
                            { text: "Embarazo y Seguimiento obstétrico: ", style: "tabla_datos" },
                            { text: "\n\n", style: "tabla_datos"}
            
                          ]
                        ]
                      }
                    });
    
                    datos.content.push({
                    
                      margin: [70,0,0,0],
                      table: {
                       widths: [ 160, 50, 50, 100 ],
                        margin: [0,0,0,0],
                        
                        body: [
                          [
                            { text: "Embarazo", style: "tabla_datos" },
                            { text: "Si", style: "tabla_datos_titulo" },
                            { text: "No", style: "tabla_datos_titulo" },
                            { text: "¿Cuantos (as)?", style: "tabla_datos_titulo" }
                          ],
                          [
                            { text: "¿Esta embarazada?", style: "tabla_datos"},
                            { text: (esta_embarazada == 1 ? "X" : ""), style: "tabla_datos_centrar"},
                            { text: (esta_embarazada == 0 ? "X" : ""), style: "tabla_datos_centrar"},
                            { text: "N/A", style: "tabla_datos_titulo" }
                          ],
                          [
                            { text: "Fecha del Control de Embarazo", style: "tabla_datos"},
                            { text: "", style: "tabla_datos_centrar"},
                            { text: "", style: "tabla_datos_centrar"},
                            { text: formatoFecha(paciente?.embarazo?.fecha_control_embarazo), style: "tabla_datos_titulo" }
                          ],
                          [
                            { text: "Gestas", style: "tabla_datos"},
                            { text: (paciente?.embarazo?.gestas != 0 ? "X" : ""), style: "tabla_datos_centrar"},
                            { text: (paciente?.embarazo?.gestas == 0 ? "X" : ""), style: "tabla_datos_centrar"},
                            { text: paciente?.embarazo?.gestas, style: "tabla_datos_titulo" }
                          ],
                          [
                            { text: "Abortos", style: "tabla_datos"},
                            { text: (paciente?.embarazo?.abortos != 0 ? "X" : ""), style: "tabla_datos_centrar"},
                            { text: (paciente?.embarazo?.abortos == 0 ? "X" : ""), style: "tabla_datos_centrar"},
                            { text: paciente?.embarazo?.abortos, style: "tabla_datos_titulo" }
                          ],
                          [
                            { text: "Partos", style: "tabla_datos"},
                            { text: (paciente?.embarazo?.partos != 0 ? "X" : ""), style: "tabla_datos_centrar"},
                            { text: (paciente?.embarazo?.partos == 0 ? "X" : ""), style: "tabla_datos_centrar"},
                            { text: paciente?.embarazo?.partos, style: "tabla_datos_titulo" }
                          ],
                          [
                            { text: "Cesareas", style: "tabla_datos"},
                            { text: (paciente?.embarazo?.cesareas != 0 ? "X" : ""), style: "tabla_datos_centrar"},
                            { text: (paciente?.embarazo?.cesareas == 0 ? "X" : ""), style: "tabla_datos_centrar"},
                            { text: paciente?.embarazo?.cesareas, style: "tabla_datos_titulo" }
                          ]
                        ]
                      }
                    });
            
                    datos.content.push({
                      layout: 'noBorders',
                      table: {
                       widths: [150,330 ],
                        margin: [0,0,0,0],
                        body: [
                          [
                            { text: "\n", style: "tabla_datos"}
            
                          ]
                        ]
                      }
                    });
          
                  }else if( paciente.sexo === "Femenino" && ha_estado_embarazada === 1 ){

                    datos.content.push({
                      layout: 'noBorders',
                      table: {
                      widths: [150,330 ],
                        margin: [0,0,0,0],
                        body: [
                          [
                            { text: "Embarazo y Seguimiento obstétrico: ", style: "tabla_datos" },
                            { text: "\n\n", style: "tabla_datos"}
            
                          ]
                        ]
                      }
                    });

                    datos.content.push({
                    
                      margin: [70,0,0,0],
                      table: {
                       widths: [ 160, 50, 50, 100 ],
                        margin: [0,0,0,0],
                        
                        body: [
                          [
                            { text: "Datos", style: "tabla_datos" },
                            { text: "Si", style: "tabla_datos_titulo" },
                            { text: "No", style: "tabla_datos_titulo" },
                            { text: "¿Fecha del Ultimo Embarazo?", style: "tabla_datos_titulo" }
                          ],
                          [
                            { text: "¿Esta embarazada?", style: "tabla_datos"},
                            { text: (esta_embarazada == 1 ? "X" : ""), style: "tabla_datos_centrar"},
                            { text: (esta_embarazada == 0 ? "X" : ""), style: "tabla_datos_centrar"},
                            { text: "N/A", style: "tabla_datos_titulo" }
                          ],
                          [
                            { text: "¿Ha Estado Embarazada?", style: "tabla_datos"},
                            { text: (ha_estado_embarazada == 1 ? "X" : ""), style: "tabla_datos_centrar"},
                            { text: (ha_estado_embarazada == 0 ? "X" : ""), style: "tabla_datos_centrar"},
                            { text: "N/A", style: "tabla_datos_titulo" }
                          ],
                          [
                            { text: "Fecha del Ultimo Parto", style: "tabla_datos"},
                            { text: "", style: "tabla_datos_centrar"},
                            { text: "", style: "tabla_datos_centrar"},
                            { text: formatoFecha(paciente?.embarazo?.fecha_ultimo_parto), style: "tabla_datos_titulo" }
                          ]
                        ]
                      }
                    });



                  }
            }
            
        }
        else{

          datos.content.push({
            layout: 'noBorders',
            table: {
            widths: [150,330 ],
              margin: [0,0,0,0],
              body: [
                [
                  { text: "El paciente no tiene ningún registro de atenciones hospitalarias: ", style: "tabla_datos" },
                  { text: " \n\n", style: "tabla_datos"}

                ]
              ]
            }
          });

        }
        

        // if(atencion.seguimientos.length > 0){

        //   datos.content[indice_actual].table.body.push(
        //     [{text: "Seguimientos", colSpan: 6, style: 'subcabecera'},{},{},{},{},{}],
        //   );

        //   datos.content[indice_actual].table.body.push(
        //     [
        //       {text: "N°", style: 'cabecera'},
        //       {text: "ESTADO ACTUAL", style: 'cabecera'},
        //       {text: "CUADRO RESPIRATORIO (COVID-19)", style: 'cabecera'},
        //       {text: "N° CAMA/SERVICIO", style: 'cabecera'},
        //       {text: "DIAGNOSTICO(S)", style: 'cabecera'},
        //       {text: "OBSERVACIONES", style: 'cabecera'},
        //     ],
        //   );


        //   for(let j = 0; j < atencion.seguimientos.length; j++){

        //     let diagnosticos_seguimiento = "";

            
        //     if(atencion.seguimientos[j].diagnosticos.length == 0){

        //       diagnosticos_seguimiento = "NO SE REGISTRÓ NINGÚN DIAGNOSTICO";

        //     }else{
        //         for (let indice in atencion.seguimientos[j].diagnosticos){
  
        //           let index = parseInt(indice)+1;
  
        //           if (diagnosticos_seguimiento!=="")
        //           diagnosticos_seguimiento += ".\n";
        //           diagnosticos_seguimiento += `${index}: ${atencion.seguimientos[j].diagnosticos[indice].nombre}`;
  
        //         }
        //     }


        //     datos.content[indice_actual].table.body.push(
        //       [

        //         { text: j+1, style: 'tabla_datos' }, 
        //         { text: (atencion.seguimientos[j].estado_actual_id != null ? atencion.seguimientos[j].estado_actual.nombre : "N/A"), style: 'campos_izquierda'},
        //         { text: (atencion.seguimientos[j].factor_covid_id  != null ? atencion.seguimientos[j].factor_covid.nombre : "N/A"), style: 'tabla_datos'},
        //         { text: (atencion.seguimientos[j].servicio_id  != null ? atencion.seguimientos[j].servicio.nombre : "N/A"), style: 'tabla_datos'},
        //         { text: diagnosticos_seguimiento, style: 'campos_izquierda'},
        //         { text: atencion.seguimientos[j].observaciones, style: 'campos_izquierda'},

        //       ]
        //     );
        //     diagnosticos_seguimiento = "";

        //   }

        // }else{

        //   datos.content.push({
        //     layout: 'noBorders',
        //     table: {
        //     widths: [150,330 ],
        //       margin: [0,0,0,0],
        //       body: [
        //         [
        //           { text: "El paciente no tiene ningún registro de seguimientos: ", style: "tabla_datos" },
        //           { text: " \n\n", style: "tabla_datos"}

        //         ]
        //       ]
        //     }
        //   });

        // }


        return datos;

      }
}