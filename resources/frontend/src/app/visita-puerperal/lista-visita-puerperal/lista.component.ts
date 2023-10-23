import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedService } from '../../shared/shared.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { VisitaPuerperalService } from '../visita-puerperal.service';
// import { AtencionDialogComponent } from '../atencion-dialog/atencion-dialog.component';
import { VisitaPuerperalDialogComponent } from '../visita-domiciliar-dialog/visita-domiciliar-dialog.component';
// import { AltaDialogComponent } from '../alta-dialog/alta-dialog.component';
import { DetailsComponentPacienteEgreso } from '../details-alta/details-alta.component';
import { MatTable } from '@angular/material/table';
import { MatExpansionPanel } from '@angular/material/expansion';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormControl } from '@angular/forms';
import { debounceTime, tap, switchMap, finalize, map, startWith,  } from 'rxjs/operators';
import { trigger, transition, animate, style } from '@angular/animations';
import { MediaObserver } from '@angular/flex-layout';
import { ConfirmActionDialogComponent } from '../../utils/confirm-action-dialog/confirm-action-dialog.component';

import { ReportWorker } from '../../web-workers/report-worker';
import * as FileSaver from 'file-saver';
import * as moment from 'moment';


import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';

import { AuthService } from '../../auth/auth.service';
import { Clues } from '../../auth/models/clues';
import { Distritos } from '../../auth/models/distritos';



@Component({
  selector: 'lista-visitas',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css'],
  animations: [
    trigger('buttonInOut', [
        transition('void => *', [
            style({opacity: '1'}),
            animate(200)
        ]),
        transition('* => void', [
            animate(200, style({opacity: '0'}))
        ])
    ])
  ],
  providers:[
    { provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false, showError: true } }
  ]
})
export class ListaComponentPacientes implements OnInit {

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatTable, {static:false}) usersTable: MatTable<any>;
  @ViewChild(MatExpansionPanel, {static:false}) advancedFilter: MatExpansionPanel;


  authClues: Clues;

  authDistrito: Distritos;

  isLoading = false;
  isLoadingPDF = false;
  isLoadingExcel = false;
  isLoadingPDFArea = false;
  isLoadingAgent = false;
  mediaSize: string;

  errorMessage:string;

  showMyStepper = false;
  showReportForm = false;
  stepperConfig:any = {};
  reportTitle:string;
  reportIncludeSigns = false;
 
  searchQuery = '';

  pageEvent: PageEvent;
  resultsLength = 0;
  currentPage = 0;
  pageSize = 20;
  selectedItemIndex = -1;

  statusIcon:any = {
    '1-0':'help', //activo
    '1-1':'verified_user', //activo verificado 
    '2':'remove_circle', //baja
    '3':'warning', // No identificado
    '4':'swap_horizontal_circle' //en transferencia
  };

  displayedColumns: string[] = ['nombre', 'lugar_recuperacion', 'puerpera_embarazada', 'opciones'];
  dataSource: any = [];
  dataSourceFilters: any = [];

  isLoadingEstadosActuales = false;
  estadosActuales:any[] = [];

  filterChips:any = []; //{id:'field_name',tag:'description',tooltip:'long_description'}
  
  filterCatalogs:any = {};
  filteredCatalogs:any = {};
  catalogos: any = {};

  filterForm = this.formBuilder.group({

    'municipio_id'        : [undefined],
    'municipio'           : [undefined],
    'localidad_id'        : [undefined],
    'localidad'           : [undefined],
    'condicion_egreso_id' : [undefined],
    'condicion_egreso'    : [undefined]
  });

  fechaActual:any = '';
  maxDate:Date;
  minDate:Date;


  constructor(
    private sharedService: SharedService,
    private visitaPuerperalService: VisitaPuerperalService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    public mediaObserver: MediaObserver) { }

  ngOnInit() {


    const appStoredData = this.sharedService.getArrayDataFromCurrentApp(['searchQuery','paginator','filter']);

    if(appStoredData['searchQuery']){
      this.searchQuery = appStoredData['searchQuery'];
    }

    let event = null
    if(appStoredData['paginator']){
      this.currentPage = appStoredData['paginator'].pageIndex;
      this.pageSize = appStoredData['paginator'].pageSize;
      event = appStoredData['paginator'];

      if(event.selectedIndex >= 0){
        // console.log("siguiente", event);
        this.selectedItemIndex = event.selectedIndex;
      }
    }else{
      const dummyPaginator = {
        length: 0,
        pageIndex: this.currentPage,
        pageSize: this.pageSize,
        previousPageIndex: (this.currentPage > 0)?this.currentPage-1:0
       };
      this.sharedService.setDataToCurrentApp('paginator', dummyPaginator);
    }

    if(appStoredData['filter']){
      this.filterForm.patchValue(appStoredData['filter']);
    }

    const fecha = new Date();
    this.fechaActual = moment(fecha).format('YYYY-MM-D');
    this.maxDate = fecha;

    const fecha_inicio = new Date(2020, 0, 1);
    this.minDate = fecha_inicio;

    this.authClues  = this.authService.getCluesData();
    this.authDistrito = this.authService.getDistritosData();

    this.loadPacientesData(event);
    this.loadFilterCatalogs();
    //console.log(this.filteredDiagnosticos);

  }

  getDisplayFn(label: string){
    return (val) => this.displayFn(val,label);
  }

  displayFn(value: any, valueLabel: string){
    return value ? value[valueLabel] : value;
  }

  applyFilter(){

    this.selectedItemIndex = -1;
    this.paginator.pageIndex = 0;
    this.paginator.pageSize = this.pageSize;
    this.loadPacientesData(null);

  }

  cleanFilter(filter){
    filter.value = '';
    //filter.closePanel();
  }

  cleanSearch(){
    this.searchQuery = '';
    //this.paginator.pageIndex = 0;
    //this.loadEmpleadosData(null);
  }

  toggleAdvancedFilter(status){

    if(status){
      this.advancedFilter.open();
    }else{
      this.advancedFilter.close();
    }

  }

  public loadFilterCatalogs(){

    this.isLoading = true;
    const carga_catalogos = [
      {nombre:'municipios',orden:'nombre'},
      {nombre:'condiciones_egreso',orden:'id'},
    ];

    this.visitaPuerperalService.obtenerCatalogos(carga_catalogos).subscribe(
      response => {

        this.catalogos = response.data;

        this.filteredCatalogs['municipios']           = this.filterForm.controls['municipio_id'].valueChanges.pipe(startWith(''),map(value => this._filter(value,'municipios','nombre')));
        this.filteredCatalogs['localidades']          = this.filterForm.controls['localidad_id'].valueChanges.pipe(startWith(''),map(value => this._filter(value,'localidades','nombre')));
        this.filteredCatalogs['condiciones_egreso']   = this.filterForm.controls['condicion_egreso_id'].valueChanges.pipe(startWith(''),map(value => this._filter(value,'condiciones_egreso','nombre')));


      },
      errorResponse =>{
        let errorMessage = "Ocurrió un error.";
        if(errorResponse.status == 409){
          errorMessage = errorResponse.error.message;
        }
        this.sharedService.showSnackBar(errorMessage, null, 3000);
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

  loadFilterChips(data){
    this.filterChips = [];
    for(const i in data){
      if(data[i]){
        const item = {
          id: i,
          tag: '',
          tooltip: i.toUpperCase() + ': ',
          active: true
        };
        if(i == 'municipio_id'){
          item.tag = data[i].nombre;
          item.tooltip += data[i].id;
          if(item.tooltip.length > 20){
            item.tag.slice(0,10) + '...';
            item.tooltip;
          }else{
            item.tag = data[i].nombre;
            item.tooltip = "Clave: "+data[i].clave+', '+data[i].nombre.toUpperCase();
          }
        }else if(i == 'localidad_id'){
          item.tag = data[i].nombre;
          item.tooltip = "Clave: "+data[i].clave+', '+data[i].nombre.toUpperCase();
        }
        else if(i == 'condicion_egreso_id'){
          item.tag = data[i].nombre;
          item.tooltip = data[i].nombre.toUpperCase();
        }
        // else if (i == 'fecha_inicio') {
        //   var desde = moment(this.filterForm.value.fecha_inicio).format('DD/MM/YYYY'); 
        //   item.tag = desde;
        //   item.tooltip = "Fecha de Ingreso (Desde): " + desde;
        // }
        // else if (i == 'fecha_fin') {
        //   var hasta = moment(this.filterForm.value.fecha_fin).format('DD/MM/YYYY')
        //   item.tag = hasta;
        //   item.tooltip = "Fecha de Ingreso (Hasta): " + hasta;
        // }
        this.filterChips.push(item);
      }
    }
  }

  public loadPacientesData(event?:PageEvent){

    this.isLoading = true;
    let params:any;
    if(!event){
      params = { page: 1, per_page: this.pageSize }
    }else{
      params = {
        page: event.pageIndex+1,
        per_page: event.pageSize
      };
    }

    if(event && !event.hasOwnProperty('selectedIndex')){
      this.selectedItemIndex = -1;
    }
    
    params.query = this.searchQuery;
    params.distrito_id = this.authDistrito.id;

    const filterFormValues = this.filterForm.value;
    let countFilter = 0;

    this.loadFilterChips(filterFormValues);

    for(const i in filterFormValues){

      if(filterFormValues[i]){

        if(i == 'municipio_id'){
          params[i] = filterFormValues[i].id;
        }else if(i == 'localidad_id'){
          params[i] = filterFormValues[i].id;
        }
        // else if (i == 'fecha_inicio') {
        //   var desde = moment(this.filterForm.value.fecha_inicio).format('YYYY-MM-DD');
        //   params[i] = desde;
        // }
        // else if (i == 'fecha_fin') {
        //   var hasta = moment(this.filterForm.value.fecha_fin).format('YYYY-MM-DD');
        //   params[i] = hasta;
        // }
        else if(i == 'condicion_egreso_id'){
          params[i] = filterFormValues[i].id;
        }
        countFilter++;

      }
    }

    if(countFilter > 0){
      params.active_filter = true;
    }

    if(event){
      this.sharedService.setDataToCurrentApp('paginator',event);
    }

    this.sharedService.setDataToCurrentApp('searchQuery',this.searchQuery);
    this.sharedService.setDataToCurrentApp('filter',filterFormValues);

    const permiso =  JSON.parse( localStorage.getItem('permissions'));

    if(permiso.mYHK9vbvVKead1QmTR5LBoP0IoBiyVu0){

      params.ver_todos = true

    }

    this.visitaPuerperalService.getPuerperasEmbarazadasList(params).subscribe(
      response =>{
        if(response.error) {
          const errorMessage = response.error.message;
          this.sharedService.showSnackBar(errorMessage, null, 3000);
        } else {
          if(response.data.total > 0){
            this.dataSource = response.data.data;
            this.fechaActual = response.fecha_actual;
            this.resultsLength = response.data.total;
          }else{
            this.dataSource = [];
            this.resultsLength = 0;
          }
        }
        this.isLoading = false;
      },
      errorResponse =>{
        let errorMessage = "Ocurrió un error.";
        if(errorResponse.status == 409){
          errorMessage = errorResponse.error.message;
        }
        this.sharedService.showSnackBar(errorMessage, null, 3000);
        this.isLoading = false;
      }
    );
    return event;
  }


  compareHorarioSelect(op,value){
    return op.id == value.id;
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

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
      case 'municipios':
        if(this.catalogos['municipios']){
          this.filterForm.controls['municipio'].setValidators(null);
          this.filterForm.controls['municipio_id'].setValidators(null);
        }else{
          this.filterForm.controls['municipio'].setValidators(null);
          this.filterForm.controls['municipio_id'].setValidators(null);
        }
        this.filterForm.controls['municipio'].updateValueAndValidity();
        this.filterForm.controls['municipio_id'].updateValueAndValidity();
        break;
      case 'localidades':
        if(this.catalogos['localidades']){
          this.filterForm.controls['localidad'].setValidators(null);
          this.filterForm.controls['localidad_id'].setValidators(null);
        }else{
          this.filterForm.controls['localidad'].setValidators(null);
          this.filterForm.controls['localidad_id'].setValidators(null);
        }
        this.filterForm.controls['localidad_id'].setValidators(null);

        this.filterForm.controls['localidad'].updateValueAndValidity();
        this.filterForm.controls['localidad_id'].updateValueAndValidity();
        break;
      default:
        break;
    }
  }

  cargarLocalidades(event){

    const municipio = event.option.value;

    const carga_catalogos = [
      {nombre:'localidades',orden:'nombre',filtro_id:{campo:'municipios_id',valor:municipio.id}},
    ];
    
    this.isLoading = true;

    this.catalogos['localidades'] = false;
    this.filterForm.get('localidad_id').reset();
    this.filterForm.get('localidad').reset();

    this.visitaPuerperalService.obtenerCatalogos(carga_catalogos).subscribe(
      response => {
        if(response.data['localidades'].length > 0){
          this.catalogos['localidades'] = response.data['localidades'];
        }
        
        this.actualizarValidacionesCatalogos('localidades');
        this.isLoading = false;
      }
    );
  }


  FormVisitaPuerperal(id = 0){


    let configDialog = {};
    if(this.mediaSize == 'xs'){
      configDialog = {
        maxWidth: '100vw',
        maxHeight: '100vh',
        height: '100%',
        width: '100%',
        data:{id: id, scSize:this.mediaSize}
      };
    }else{
      configDialog = {
        width: '99%',
        maxHeight: '90vh',
        height: '643px',
        data:{id: id}
      }
    }


    const dialogRef = this.dialog.open(VisitaPuerperalDialogComponent, configDialog);

    dialogRef.afterClosed().subscribe(valid => {
      if(valid){
        console.log('Aceptar');
      }else{
        console.log('Cancelar');
      }
    });
  }



  verEgreso(id = 0, index){
    
    this.selectedItemIndex = index;

    let dialogConfig:any = {
      maxWidth: '100%',
      width: '95%',
      height: '80%',
      data:{ id:id }
    };


    const dialogRef = this.dialog.open(DetailsComponentPacienteEgreso, dialogConfig);

    dialogRef.afterClosed().subscribe(valid => {
      if(valid){
        console.log('Aceptar');
      }else{
        console.log('Cancelar');
      }
    });


  }

  removeFilterChip(item,index){
    this.filterForm.get(item.id).reset();
    this.filterChips[index].active = false;
  }


  confirmDeletePaciente(id = ''){
    const dialogRef = this.dialog.open(ConfirmActionDialogComponent, {
      width: '500px',
      data: {dialogTitle:'Eliminar Persona',dialogMessage:'¿Esta seguro de eliminar a la Persona?',btnColor:'warn',btnText:'Eliminar'}
    });

    dialogRef.afterClosed().subscribe(reponse => {
      if(reponse){
        this.visitaPuerperalService.deletePaciente(id).subscribe(
          response => {
            this.loadPacientesData(null);
          }
        );
      }
    });
  }

  toggleReportPanel(){
    this.reportIncludeSigns = false;
    this.reportTitle = 'Relación de Ingreso de Pacientes';

    this.stepperConfig = {
      steps:[
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
    if(this.showReportForm){
      this.showMyStepper = false;
    }
    //this.showMyStepper = !this.showMyStepper;
  }

  reporteEmbarazadasPuerperasPDF(){
    //this.showMyStepper = true;
    this.isLoadingPDF = true;
    this.showMyStepper = true;
    this.showReportForm = false;

    const params:any = {};
    let countFilter = 0;

    const appStoredData = this.sharedService.getArrayDataFromCurrentApp(['searchQuery','filter']);
    params.distrito_id = (this.authDistrito != undefined) ? this.authDistrito.id : '';
    params.nombre_reporte = 'reporte_embarazadas-puerperas';

    if(appStoredData['searchQuery']){
      params.query = appStoredData['searchQuery'];
    }

    for(const i in appStoredData['filter']){

      if(appStoredData['filter'][i]){

        if(i == 'municipio_id'){
          params[i] = appStoredData['filter'][i].id;
        }else if(i == 'localidad_id'){
          params[i] = appStoredData['filter'][i].id;
        }else if(i == 'condicion_egreso_id'){
          params[i] = appStoredData['filter'][i].id;
        }
        // else if (i == 'fecha_inicio') {
        //   var desde = moment(this.filterForm.value.fecha_inicio).format('YYYY-MM-DD');
        //   params[i] = desde;
        // }else if (i == 'fecha_fin') {
        //   var hasta = moment(this.filterForm.value.fecha_fin).format('YYYY-MM-DD');
        //   params[i] = hasta;
        // }
        
        countFilter++;

      }

    }

    if(countFilter > 0){
      params.active_filter = true;
    }
    
    
    this.stepperConfig.steps[0].status = 2;

    this.visitaPuerperalService.getPuerperasEmbarazadasList(params).subscribe(
      response =>{
        if(response.error) {
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

                // console.log("deitaa",data);
                FileSaver.saveAs(data.data,'embarazadas-puerperas'+' '+'('+this.fechaActual+')' );
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
            reportWorker.postMessage({data:{items: response.data, config:config, fecha_actual: this.fechaActual},reporte:'/reporte-visitas-puerperales'});
        }
        this.isLoading = false;
      },
      errorResponse =>{
        let errorMessage = "Ocurrió un error.";
        if(errorResponse.status == 409){
          errorMessage = errorResponse.error.error.message;
        }
        this.stepperConfig.steps[this.stepperConfig.currentIndex].status = 0;
        this.stepperConfig.steps[this.stepperConfig.currentIndex].errorMessage = errorMessage;
        //this.sharedService.showSnackBar(errorMessage, null, 3000);
        this.isLoading = false;
        
      }
    );
  }

  reporteEmabrazadasPuerperasExcel(){
    this.isLoadingExcel = true;
    const params:any = {};
    let countFilter = 0;

    const appStoredData = this.sharedService.getArrayDataFromCurrentApp(['searchQuery','filter']);

    params.distrito_id = this.authDistrito.id;
    params.reporte = 'embarazadas-puerperas';
    params.export_excel = true;

    if(appStoredData['searchQuery']){
      params.query = appStoredData['searchQuery'];
    }

    for(const i in appStoredData['filter']){
      if(appStoredData['filter'][i]){
        if(i == 'municipio_id'){
          params[i] = appStoredData['filter'][i].id;
        }else if(i == 'localidad_id'){
          params[i] = appStoredData['filter'][i].id;
        }else if(i == 'condicion_egreso_id'){
          params[i] = appStoredData['filter'][i].id;
        }
        countFilter++;
      }
    }

    if(countFilter > 0){
      params.active_filter = true;
    }

    this.visitaPuerperalService.getPuerperasEmbarazadasList(params).subscribe(
      response => {
        FileSaver.saveAs(response,'reporte-embarazadas-puerperas');
        this.isLoadingExcel = false;
      },
      errorResponse =>{
        console.log(errorResponse);

        let errorMessage = "Ocurrió un error.";
        if(errorResponse.status == 409){
          errorMessage = errorResponse.error.error.message;
        }
        this.sharedService.showSnackBar(errorMessage, null, 3000);
        this.isLoadingExcel = false;
      }
    );
  }

  generatePdf(data){

    const reportWorker = new ReportWorker();
    reportWorker.onmessage().subscribe(
      data => {
        FileSaver.saveAs(data.data,'Filtro Sanitario'+'/'+this.fechaActual);
        reportWorker.terminate();

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

    reportWorker.postMessage({data:{items: data, config:config},reporte:'/paciente-valoracion'});

    this.isLoading = false;

  }

  tarjetaInformativa (obj, index){

    this.selectedItemIndex = index;

      //this.showMyStepper = true;
      this.isLoadingPDF = true;
      this.showMyStepper = true;
      this.showReportForm = false;

      const params:any = {};
      const countFilter = 0;
      const fecha_reporte = new Intl.DateTimeFormat('es-ES', {year: 'numeric', month: 'numeric', day: '2-digit'}).format(new Date());

      const appStoredData = this.sharedService.getArrayDataFromCurrentApp(['searchQuery','filter']);
      
      params.reporte = 'personal-activo';
      if(appStoredData['searchQuery']){
        params.query = appStoredData['searchQuery'];
      }
      this.stepperConfig = {
        steps:[
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


      this.stepperConfig.steps[0].status = 2;

      this.stepperConfig.steps[0].status = 3;
      this.stepperConfig.steps[1].status = 2;
      this.stepperConfig.currentIndex = 1;

      const reportWorker = new ReportWorker();
      reportWorker.onmessage().subscribe(
        data => {
          this.stepperConfig.steps[1].status = 3;
          this.stepperConfig.steps[2].status = 2;
          this.stepperConfig.currentIndex = 2;

          FileSaver.saveAs(data.data,'Tarjeta-Informativa '+'('+fecha_reporte+')');
          reportWorker.terminate();

          this.stepperConfig.steps[2].status = 3;
          this.isLoadingPDF = false;
          this.showMyStepper = false;
      });

      reportWorker.onerror().subscribe(
        (data) => {
          this.stepperConfig.steps[this.stepperConfig.currentIndex].status = 0;
          this.stepperConfig.steps[this.stepperConfig.currentIndex].errorMessage = data.message;
          this.isLoadingPDF = false;
          reportWorker.terminate();
        }
      );
      
      const config = {
        title: "TARJETA INFORMATIVA",
        showSigns: this.reportIncludeSigns, 
      };
      reportWorker.postMessage({data:{items: obj, config:config, fecha_actual: this.fechaActual},reporte:'/tarjeta-informativa'});
      this.isLoading = false;
  }

}
