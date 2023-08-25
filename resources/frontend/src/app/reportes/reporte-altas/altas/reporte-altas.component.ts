import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedService } from '../../../shared/shared.service';
import { ReporteAltasService } from '../reporte-altas.service';
import { MatExpansionPanel } from '@angular/material/expansion';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTable } from '@angular/material/table';
import { trigger, transition, animate, style } from '@angular/animations';
import { debounceTime, tap, switchMap, finalize, map, startWith, } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';

import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MediaObserver } from '@angular/flex-layout';
import { Router } from '@angular/router';
import { ReportWorker } from '../../../web-workers/report-worker';
import * as moment from 'moment';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'reporte-altas-lista',
  templateUrl: './reporte-altas.component.html',
  styleUrls: ['./reporte-altas.component.css'],
  animations: [
    trigger('buttonInOut', [
      transition('void => *', [
        style({ opacity: '1' }),
        animate(200)
      ]),
      transition('* => void', [
        animate(200, style({ opacity: '0' }))
      ])
    ])
  ],




})
export class ReporteAltasComponent implements OnInit {

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatTable, { static: false }) usersTable: MatTable<any>;
  @ViewChild(MatExpansionPanel, { static: false }) advancedFilter: MatExpansionPanel;

  isLoading = false;
  searchQuery = '';
  datos_paciente: any;
  isLoadingPDF = false;
  isLoadingPDFArea = false;
  isLoadingAgent = false;
  mediaSize: string;

  puedeFinalizar = false;
  capturaFinalizada = false;
  countPersonalActivo = 0;
  countPersonalValidado = 0;
  percentPersonalValidado = 0;

  showMyStepper = false;
  showReportForm = false;
  stepperConfig: any = {};
  reportTitle: string;
  reportIncludeSigns = false;



  pageEvent: PageEvent;
  resultsLength = 0;
  currentPage = 0;
  pageSize = 20;
  selectedItemIndex = -1;


  displayedColumns: string[] = ['no_distrito', 'distrito', 'no_clues', 'clues', 'curp', 'paciente'];
  dataSource: any = [];
  dataSourceFilters: any = [];

  filterChips: any = []; //{id:'field_name',tag:'description',tooltip:'long_description'}
  filterCatalogs: any = {};
  filteredCatalogs: any = {};

  catalogos: any = {};
  filterForm: UntypedFormGroup;

  fechaActual:any = '';
  maxDate:Date;
  minDate:Date;



  constructor(
    private sharedService: SharedService,
    public dialog: MatDialog,
    public reporteAltasService: ReporteAltasService,
    public mediaObserver: MediaObserver,
    private fb: UntypedFormBuilder,
    private route: Router) { }


  ngOnInit() {

    this.filterForm = this.fb.group({
      'motivo_egreso_id'          : [undefined],
      'condicion_egreso_id'       : [undefined],
      'estado_actual_id'          : [undefined],
      'metodo_anticonceptivo_id'  : [undefined],
      'clues'                     :[undefined],
      'clues_id'                  :[undefined],
      'distrito_id'               :[undefined],
      'fecha_inicio'             :[undefined],
      'fecha_fin'                :[undefined]
    });


    const appStoredData = this.sharedService.getArrayDataFromCurrentApp(['searchQuery', 'paginator', 'filter']);
    console.log(appStoredData);

    if (appStoredData['searchQuery']) {
      this.searchQuery = appStoredData['searchQuery'];
    }

    let event = null
    if (appStoredData['paginator']) {
      this.currentPage = appStoredData['paginator'].pageIndex;
      this.pageSize = appStoredData['paginator'].pageSize;
      event = appStoredData['paginator'];

      if (event.selectedIndex >= 0) {
        console.log("siguiente", event);
        this.selectedItemIndex = event.selectedIndex;
      }
    } else {
      const dummyPaginator = {
        length: 0,
        pageIndex: this.currentPage,
        pageSize: this.pageSize,
        previousPageIndex: (this.currentPage > 0) ? this.currentPage - 1 : 0
      };
      this.sharedService.setDataToCurrentApp('paginator', dummyPaginator);
    }

    if (appStoredData['filter']) {
      this.filterForm.patchValue(appStoredData['filter']);
    }

    const fecha = new Date();
    this.fechaActual = moment(fecha).format('YYYY-MM-D');
    this.maxDate = fecha;

    const fecha_inicio = new Date(2020, 0, 1);
    this.minDate = fecha_inicio;

    this.cargarConcentrados(event);
    this.loadFilterCatalogs();
    

  }


  public loadFilterCatalogs() {

    

    const carga_catalogos = [

      {nombre:'distritos',orden:'id'},
      {nombre:'clues',orden:'id'},
      {nombre:'motivos_egresos',orden:'id'},
      {nombre:'condiciones_egresos',orden:'id'},
      {nombre:'estados_actuales',orden:'id'},
      {nombre:'metodos_anticonceptivos',orden:'id'},

    ];

    this.reporteAltasService.obtenerCatalogos(carga_catalogos).subscribe(
      response => {
        
        this.isLoading = true;
        this.catalogos = response.data;
        //this.actualizarValidacionesCatalogos('municipios');
        this.filteredCatalogs['distritos']                        = this.filterForm.controls['distrito_id'].valueChanges.pipe(startWith(''),map(value => this._filter(value,'distritos','id')));
        this.filteredCatalogs['clues']                            = this.filterForm.controls['clues_id'].valueChanges.pipe(startWith(''),map(value => this._filter(value,'clues','nombre')));
        this.filteredCatalogs['motivos_egresos']                  = this.filterForm.controls['motivo_egreso_id'].valueChanges.pipe(startWith(''),map(value => this._filter(value,'motivos_egresos','nombre')));
        this.filteredCatalogs['condiciones_egresos']              = this.filterForm.controls['condicion_egreso_id'].valueChanges.pipe(startWith(''),map(value => this._filter(value,'condiciones_egresos','nombre')));
        this.filteredCatalogs['estados_actuales']                 = this.filterForm.controls['estado_actual_id'].valueChanges.pipe(startWith(''),map(value => this._filter(value,'estados_actuales','nombre')));
        this.filteredCatalogs['metodos_anticonceptivos']          = this.filterForm.controls['metodo_anticonceptivo_id'].valueChanges.pipe(startWith(''),map(value => this._filter(value,'metodos_anticonceptivos','nombre')));

        this.isLoading = false;

      },
      errorResponse => {
        let errorMessage = "Ocurrió un error.";
        if (errorResponse.status == 409) {
          errorMessage = errorResponse.error.message;
        }
        this.sharedService.showSnackBar(errorMessage, null, 3000);
        this.isLoading = false;
      }
    );
  }

  private _filter(value: any, catalog: string, valueField: string): string[] {
    if(this.catalogos[catalog]){
      let filterValue = '';
      if(value){
        if(typeof(value) == 'object'){
          filterValue = value[valueField].toLowerCase();
        }else{
          filterValue = value.toLowerCase();
        }
      }
      return this.catalogos[catalog].filter(option => option[valueField].toLowerCase().includes(filterValue));
    }
  }

  getDisplayFn(label: string) {
    return (val) => this.displayFn(val, label);
  }

  displayFn(value: any, valueLabel: string) {
    return value ? value[valueLabel] : value;
  }

  numberOnly(event): boolean {

    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  removeFilterChip(item, index) {
    this.filterForm.get(item.id).reset();
    this.filterChips[index].active = false;
  }


  loadFilterChips(data) {
  
    this.filterChips = [];
    for (const i in data) {
      if (data[i]) {
        console.log(data[i]);
        const item = {
          id: i,
          tag: '',
          tooltip: i.toUpperCase() + ': ',
          active: true
        };

        if (i == 'distrito_id') {
          item.tag = "Distrito N° " + data[i];
          item.tooltip = "Distrito N°: " + data[i];
        } 
        else if (i == 'clues_id') {
          item.tag = "Unidad Medica: " + data[i].nombre;
          item.tooltip = "Clues: " + data[i].id;

        } else if (i == 'estado_actual_id') {
           item.tag = "Estado Actual: " + data[i].nombre;
           item.tooltip = "Estado Actual: " + data[i].nombre;

        } else if (i == 'motivo_egreso_id') {
           item.tag = "Motivos Egreso: " + data[i].nombre;
           item.tooltip = "Motivos Egreso: " + data[i].nombre;

        } else if (i == 'condicion_egreso_id') {
          item.tag = "Condiciones de Egresos: " + data[i].nombre;
          item.tooltip = "Condiciones de Egresos: " + data[i].nombre;
        
        } else if (i == 'metodo_anticonceptivo_id') {
          item.tag = "Metodos Anticonceptivos: " + data[i].nombre;
          item.tooltip = "Metodos Anticonceptivos: " + data[i].nombre;
        }

        else if (i == 'fecha_inicio') {
          const desde = moment(this.filterForm.value.fecha_inicio).format('DD/MM/YYYY'); 
          item.tag = desde;
          item.tooltip = "Fecha de Ingreso (Desde): " + desde;
        }
        else if (i == 'fecha_fin') {
          const hasta = moment(this.filterForm.value.fecha_fin).format('DD/MM/YYYY')
          item.tag = hasta;
          item.tooltip = "Fecha de Ingreso (Hasta): " + hasta;
        }
        // } else if (i == 'tipo_unidades') {
        //   item.tag = "Unidad: " + data[i].descripcion;
        // } else if (i == 'estatus_covid') {
        //   item.tag = "Estatus: " + data[i].descripcion;
        // } else if (i == 'no_caso') {
        //   item.tag = "N° Caso: " + this.filterForm.value.no_caso;
        // }

        this.filterChips.push(item);
      }
    }
  }

  public cargarConcentrados(event?: PageEvent) {

    this.isLoading = true;
    let params: any;
    if (!event) {
      params = { page: 1, per_page: this.pageSize }
    } else {
      params = {
        page: event.pageIndex + 1,
        per_page: event.pageSize
      };
    }

    if (event && !event.hasOwnProperty('selectedIndex')) {
      this.selectedItemIndex = -1;
    }

    params.query = this.searchQuery;

    const filterFormValues = this.filterForm.value;
    let countFilter = 0;

    this.loadFilterChips(filterFormValues);

    for (const i in filterFormValues) {

      if (filterFormValues[i]) {

        if (i == 'clues_id') {
          params[i] = filterFormValues[i].id;
        }
        else if (i == 'distrito_id') {
          params[i] = filterFormValues[i];
        }
        else if (i == 'estado_actual_id') {
           params[i] = filterFormValues[i].id;
        }
        else if (i == 'motivo_egreso_id') {          
          params[i] = filterFormValues[i].id;
        }
        else if (i == 'condicion_egreso_id') {          
          params[i] = filterFormValues[i].id;
        }
        else if (i == 'metodo_anticonceptivo_id') {
          params[i] = filterFormValues[i].id;
        }
        else if (i == 'fecha_inicio') {
          const desde = moment(this.filterForm.value.fecha_inicio).format('YYYY-MM-DD');
          params[i] = desde;
        }
        else if (i == 'fecha_fin') {
          const hasta = moment(this.filterForm.value.fecha_fin).format('YYYY-MM-DD');
          params[i] = hasta;
        }
        // else if (i == 'tipo_unidades') {
        //   params[i] = filterFormValues[i].id;
        // } else if (i == 'estatus_covid') {
        //   params[i] = filterFormValues[i].id;
        // } else if (i == 'no_caso') {
        //   params[i] = this.filterForm.value.no_caso;
        // }

        countFilter++;

      }
    }

    if (countFilter > 0) {
      params.active_filter = true;
    }

    if (event) {
      this.sharedService.setDataToCurrentApp('paginator', event);
    }

    this.sharedService.setDataToCurrentApp('searchQuery', this.searchQuery);
    this.sharedService.setDataToCurrentApp('filter', filterFormValues);

    this.reporteAltasService.getMonitoreo(params).subscribe(

      response => {
        console.log("RESPONSE", response.data);
        if (response.error) {
          const errorMessage = response.error.message;
          this.sharedService.showSnackBar(errorMessage, null, 3000);
        } else {
          if (response.data.total > 0) {
            this.dataSource = response.data.data;
            this.resultsLength = response.data.total;
          } else {
            this.dataSource = [];
            this.resultsLength = 0;
          }
        }
        this.isLoading = false;
      },
      errorResponse => {
        const errorMessage = "Ocurrió un error, (Verifique los Filtros de Busqueda).";
        if (errorResponse.status == 500) {
          this.sharedService.showSnackBar(errorResponse.error.error.message, 'Cerrar', 3000);
        }else{
          this.sharedService.showSnackBar(errorMessage, 'Cerrar', 3000);
        }
        //this.sharedService.showSnackBar(Message, 'Cerrar', 4000);
        this.isLoading = false;
      }
    );
    return event;
  }

  applyFilter() {

    console.log("aca", this.filterForm.value);

    this.selectedItemIndex = -1;
    this.paginator.pageIndex = 0;
    this.paginator.pageSize = this.pageSize;
    this.cargarConcentrados(null);

  }

  cleanFilter(filter) {
    filter.value = '';
    //filter.closePanel();
  }

  cleanSearch() {
    this.searchQuery = '';
    //this.paginator.pageIndex = 0;
    //this.loadEmpleadosData(null);
  }

  toggleAdvancedFilter(status) {

    if (status) {
      this.advancedFilter.open();
    } else {
      this.advancedFilter.close();
    }

  }

  reporteAltas() {
    //this.showMyStepper = true;
    this.isLoadingPDF = true;
    this.showMyStepper = true;
    this.showReportForm = false;

    const params: any = {};
    let countFilter = 0;

    const appStoredData = this.sharedService.getArrayDataFromCurrentApp(['searchQuery', 'filter']);
    console.log(appStoredData);

    params.reporte = 'altas';

    console.log("acaaaa",params.reporte);

    if (appStoredData['searchQuery']) {
      params.query = appStoredData['searchQuery'];
    }

    for (const i in appStoredData['filter']) {

      if (appStoredData['filter'][i]) {

        if (i == 'distrito_id') {
          params[i] = appStoredData['filter'][i]
        }
        else if (i == 'clues_id') {
           params[i] = appStoredData['filter'][i].id;
        }
        else if (i == 'estado_actual_id') {
          params[i] = appStoredData['filter'][i].id;
        }
        else if (i == 'motivo_egreso_id') {
          params[i] = appStoredData['filter'][i].id;
        }
        else if (i == 'condicion_egreso_id') {
          params[i] = appStoredData['filter'][i].id;
        }
        else if (i == 'metodo_anticonceptivo_id') {
          params[i] = appStoredData['filter'][i].id;
        }
        else if(i == 'fecha_inicio'){
          const desde = moment(this.filterForm.value.fecha_inicio).format('YYYY-MM-DD');
          params[i] = desde;
        }
        else if (i == 'fecha_fin') {
          const hasta = moment(this.filterForm.value.fecha_fin).format('YYYY-MM-DD');
          params[i] = hasta;
        }
        // } else if (i == 'responsables') {
        //   params[i] = appStoredData['filter'][i].id;
        // } else if (i == 'tipo_atencion') {
        //   params[i] = appStoredData['filter'][i].id;
        // } else if (i == 'tipo_unidades') {
        //   params[i] = appStoredData['filter'][i].id;
        // } else if (i == 'estatus_covid') {
        //   params[i] = appStoredData['filter'][i].id;
        // }
        countFilter++;
      }

    }

    if (countFilter > 0) {
      params.active_filter = true;
    }

    this.stepperConfig.steps[0].status = 2;

    this.reporteAltasService.getMonitoreo(params).subscribe(
      response => {
        console.log("zxczxc", response);
        if (response.error) {
          const errorMessage = response.error.message;
          this.stepperConfig.steps[this.stepperConfig.currentIndex].status = 0;
          this.stepperConfig.steps[this.stepperConfig.currentIndex].errorMessage = errorMessage;
          this.isLoading = false;
          //this.sharedService.showSnackBar(errorMessage, null, 3000);
        } else {
          this.stepperConfig.steps[0].status = 3;
          this.stepperConfig.steps[1].status = 2;
          this.stepperConfig.currentIndex = 1;

          const reportWorker = new ReportWorker();
          reportWorker.onmessage().subscribe(
            data => {
              this.stepperConfig.steps[1].status = 3;
              this.stepperConfig.steps[2].status = 2;
              this.stepperConfig.currentIndex = 2;

              console.log("deitaa", data);
              FileSaver.saveAs(data.data, 'Reporte-Altas');
              reportWorker.terminate();

              this.stepperConfig.steps[2].status = 3;
              this.isLoadingPDF = false;
              this.showMyStepper = false;
            });

          reportWorker.onerror().subscribe(
            (data) => {
              //this.sharedService.showSnackBar('Error: ' + data.message,null, 3000);
              this.stepperConfig.steps[this.stepperConfig.currentIndex].status = 0;
              this.stepperConfig.steps[this.stepperConfig.currentIndex].errorMessage = data.message;
              this.isLoadingPDF = false;
              //console.log(data);
              reportWorker.terminate();
            }
          );

          const config = {
            title: this.reportTitle,
            showSigns: this.reportIncludeSigns,
          };
          console.log("titulo", config);
          reportWorker.postMessage({ data: { items: response.data, config: config }, reporte: '/altas' });
        }
        this.isLoading = false;
      },
      errorResponse => {
        let errorMessage = "Ocurrió un error.";
        if (errorResponse.status == 409) {
          errorMessage = errorResponse.error.error.message;
        }
        this.stepperConfig.steps[this.stepperConfig.currentIndex].status = 0;
        this.stepperConfig.steps[this.stepperConfig.currentIndex].errorMessage = errorMessage;
        //this.sharedService.showSnackBar(errorMessage, null, 3000);
        this.isLoading = false;

      }
    );


  }

  toggleReportPanel() {
    this.reportIncludeSigns = false;
    this.reportTitle = 'EGRESO HOSPITALARIO.';

    this.stepperConfig = {
      steps: [
        {
          status: 1, //1:standBy, 2:active, 3:done, 0:error
          label: { standBy: 'Cargar Datos', active: 'Cargando Datos', done: 'Datos Cargados' },
          icon: 'settings_remote',
          errorMessage: '',
        },
        {
          status: 1, //1:standBy, 2:active, 3:done, 0:error
          label: { standBy: 'Generar PDF', active: 'Generando PDF', done: 'PDF Generado' },
          icon: 'settings_applications',
          errorMessage: '',
        },
        {
          status: 1, //1:standBy, 2:active, 3:done, 0:error
          label: { standBy: 'Descargar Archivo', active: 'Descargando Archivo', done: 'Archivo Descargado' },
          icon: 'save_alt',
          errorMessage: '',
        },
      ],
      currentIndex: 0
    }

    this.showReportForm = !this.showReportForm;
    if (this.showReportForm) {
      this.showMyStepper = false;
    }
    //this.showMyStepper = !this.showMyStepper;
  }


  cargarClues(event){
    console.log("acaaaa", event);
    const carga_catalogos = [
      {nombre:'clues',orden:'nombre',filtro_id:{campo:'jurisdicciones_id',valor:event}},
    ];
    this.catalogos['clues'] = false;
    this.filterForm.get('clues_id').reset();
    this.filterForm.get('clues').reset();

    this.reporteAltasService.obtenerCatalogos(carga_catalogos).subscribe(
      response => {
        console.log(response);
        if(response.data['clues'].length > 0){
          this.catalogos['clues'] = response.data['clues'];
          console.log(this.catalogos['clues']);
        }
        this.actualizarValidacionesCatalogos('clues');
      }
    );
  }

  checkAutocompleteValue(field_name) {
    setTimeout(() => {
      if (typeof(this.filterForm.get(field_name).value) != 'object') {
        this.filterForm.get(field_name).reset();
        if(field_name != 'localidad_id'){
          this.catalogos['localidades'] = false;
          this.actualizarValidacionesCatalogos('localidades');  
        }
      } 
    }, 300);
  }


  actualizarValidacionesCatalogos(catalogo){
    switch (catalogo) {
      case 'clues':
        if(this.catalogos['clues']){
          this.filterForm.get('clues').setValidators(null);
          this.filterForm.get('clues_id').setValue('');
        }else{
          this.filterForm.get('clues').setValue('');
          this.filterForm.get('clues_id').setValidators(null);
        }
        this.filterForm.get('clues').updateValueAndValidity();
        this.filterForm.get('clues_id').updateValueAndValidity();
        break;
      default:
        break;
    }
  }



}
