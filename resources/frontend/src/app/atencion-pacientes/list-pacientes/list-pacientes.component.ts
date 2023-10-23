import { Component,  OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute  } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { SharedService } from '../../shared/shared.service';
import { AtencionPacientesService } from '../atencion-pacientes.service';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { map, startWith,  } from 'rxjs/operators';
import { trigger, transition, animate, style } from '@angular/animations';

import { ConfirmActionDialogComponent } from '../../utils/confirm-action-dialog/confirm-action-dialog.component';
import { AgregarSeguimientoDialogComponent } from '../agregar-seguimiento-dialog/agregar-seguimiento-dialog.component';
import { AgregarAltaDialogComponent } from '../agregar-alta-dialog/agregar-alta-dialog.component';
import { DetailsComponentPaciente } from '../details-paciente/details-paciente.component';

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
import { Servicios } from '../../auth/models/servicios';


import { MatTable } from '@angular/material/table';
import { MatExpansionPanel } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';



@Component({
  selector: 'app-list-pacientes',
  templateUrl: './list-pacientes.component.html',
  styleUrls: ['./list-pacientes.component.css'],
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
export class ListComponentPacientes implements OnInit {
  
  @ViewChild(MatChipsModule) chips: MatChipsModule;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @ViewChild(MatTable, {static:false}) usersTable: MatTable<any>;
  @ViewChild(MatExpansionPanel, {static:false}) advancedFilter: MatExpansionPanel;

  constructor(
    private sharedService: SharedService,
    private AtencionPacientesService: AtencionPacientesService,
    private authService: AuthService,
    public dialog: MatDialog,
    public router: Router,
    public route: ActivatedRoute,
  ) { }

  authClues: Clues;
  authDistrito: Distritos;
  authServicios: Servicios;

  isLoading = false;
  isLoadingPDF = false;
  isLoadingPDFArea = false;
  isLoadingAgent = false;
  mediaSize: string;

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

  displayedColumns: string[] = ['nombre', 'procedencia', 'seguimiento', 'alta', 'opciones'];
  dataSource: any = [];
  dataSourceFilters: any = [];

  isLoadingEstadosActuales = false;
  estadosActuales:any[] = [];

  filterChips:any = []; //{id:'field_name',tag:'description',tooltip:'long_description'}
  
  filterCatalogs:any = {};
  filteredCatalogs:any = {};
  catalogos: any = {};
  subDialogRef: any;

  isLoadingResults:boolean;


  filterForm =  new FormGroup({

    atencion: new FormControl(null),
    municipio_id: new FormControl(null),
    municipio:  new FormControl(null),
    localidad_id: new FormControl(null),
    localidad:  new FormControl(null),
    fecha_inicio: new FormControl(null),
    fecha_fin:  new FormControl(null),
    tipo_edad:  new FormControl(null),
    edad: new FormControl(null),
    sexoatencion: new FormControl(null),
    nacionalidad: new FormControl(null),
    identidad:  new FormControl(null),
    especialidad: new FormControl(null),
    especialidad_id:  new FormControl(null),
    servicio_id:  new FormControl(null),
    ambulatorios: new FormControl(null),
    estado_actual_id: new FormControl(null)

  });

  fechaActual:any = '';
  maxDate:Date;
  minDate:Date;

  toSendNumExpediente = false;

  ngOnInit() {

    this.route.params.subscribe(params => {
      const data = params['numero_expediente'];

      if( data ){

        this.toSendNumExpediente = true;
        this.searchQuery = data;
        console.log('numero de expediente', data);

      }else{
        this.toSendNumExpediente = false;
      }

    });



    const appStoredData = this.sharedService.getArrayDataFromCurrentApp(['searchQuery','paginator','filter']);
    // console.log(appStoredData);

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

    this.authClues    = this.authService.getCluesData();
    this.authDistrito = this.authService.getDistritosData(); 
    this.authServicios = this.authService.getServiciosData();
    console.log(this.authServicios);

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
      {nombre:'paises',orden:'nombre'},
      {nombre:'especialidades',orden:'nombre'},
      {nombre:'servicios',orden:'nombre', filtro_id:{campo:'clues_id',valor:this.authClues ? this.authClues.id : ''}},
      {nombre:'estados_actuales',orden:'nombre'},
    ];

    this.AtencionPacientesService.obtenerCatalogos(carga_catalogos).subscribe({
      next:(response) => {
        this.catalogos = response.data;

        this.filteredCatalogs['municipios']           = this.filterForm.controls['municipio_id'].valueChanges.pipe(startWith(''),map(value => this._filter(value,'municipios','nombre')));
        this.filteredCatalogs['localidades']          = this.filterForm.controls['localidad_id'].valueChanges.pipe(startWith(''),map(value => this._filter(value,'localidades','nombre')));
        this.filteredCatalogs['especialidades']       = this.filterForm.controls['especialidad_id'].valueChanges.pipe(startWith(''),map(value => this._filter(value,'especialidades','nombre')));
        this.filteredCatalogs['servicios']            = this.filterForm.controls['servicio_id'].valueChanges.pipe(startWith(''),map(value => this._filter(value,'servicios','nombre')));
        this.filteredCatalogs['estados_actuales']     = this.filterForm.controls['estado_actual_id'].valueChanges.pipe(startWith(''),map(value => this._filter(value,'estados_actuales','nombre')));

      },
      error:(errorResponse: HttpErrorResponse) => {
        let errorMessage = "Ocurrió un error.";
        if(errorResponse.status == 409){
          errorMessage = errorResponse.error.message;
        }
        this.sharedService.showSnackBar(errorMessage, null, 3000);
      },
      complete:() =>{}
    });

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
        }else if(i == 'municipios'){
          item.tag = data[i].descripcion;
        }
        else if(i == 'especialidad_id'){
          item.tag = data[i].nombre;
          item.tooltip = "Especialidad: "+data[i].nombre.toUpperCase();
        }
        else if(i == 'servicio_id'){
          item.tag = data[i].nombre;
          item.tooltip = "Servicio: "+data[i].nombre.toUpperCase();
        }
        else if(i == 'estado_actual_id'){
          item.tag = data[i].nombre;
          item.tooltip = "Estado Actual de Salud: "+data[i].nombre.toUpperCase();
        }
        else if(i == 'sexo'){
          if( this.filterForm.get('sexo').value == 'Masculino'){
            item.tag = 'MASCULINO';
          }else{
            item.tag = 'FEMENINO';
          }
        }
        else if(i == 'edad'){
          item.tag = this.filterForm.value.edad;
          item.tooltip = "Edad en "+this.filterForm.value.tipo_edad.toUpperCase();
        }
        else if(i == 'tipo_edad'){
          item.tag = this.filterForm.value.tipo_edad;
          item.tooltip = "Tipo de Edad:";
        }
        else if(i == 'identidad'){
          if( parseInt(this.filterForm.get('identidad').value) == 1 ){
            item.tag = 'DESCONOCIDA';
           
          }else{
            item.tag = 'CONOCIDA';
          }
        }
        else if(i == 'nacionalidad'){
          if( parseInt(this.filterForm.get('nacionalidad').value) == 1){
            item.tag = 'EXTRANJERA';
          }else{
            item.tag = 'MEXICANA';
          }
        }
        else if(i == 'atencion'){
          if( parseInt(this.filterForm.get('atencion').value) == 1 ){
            item.tag = 'EN ATENCIÓN HOSPITALARIA';
          }else{
            item.tag = 'REGISTRADOS';
          }
        }
        else if(i == 'ambulatorios'){

          if( parseInt(this.filterForm.get('ambulatorios').value) == 1 ){
            item.tag = 'PACIENTES AMBULATORIOS';
          }
          else if( parseInt(this.filterForm.get('ambulatorios').value) == 0 ){    
              item.tag = 'PACIENTES EN SERVICIOS';
          }else{
            item.tag = 'PACIENTES SIN SEGUIMIENTO ASIGNADO';
          }
        }
        
        else if (i == 'fecha_inicio') {
          const desde = moment(this.filterForm.get('fecha_inicio').value).format('DD/MM/YYYY'); 
          item.tag = desde;
          item.tooltip = "Fecha de Ingreso (Desde): " + desde;
        }
        else if (i == 'fecha_fin') {
          const hasta = moment( this.filterForm.get('fecha_fin').value).format('DD/MM/YYYY')
          item.tag = hasta;
          item.tooltip = "Fecha de Ingreso (Hasta): " + hasta;
        }
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

    const filterFormValues = JSON.parse(JSON.stringify(this.filterForm.value));
    let countFilter = 0;

    this.loadFilterChips(filterFormValues);

    for(const i in filterFormValues){

      if(filterFormValues[i]){

        if(i == 'municipio_id'){
          params[i] =  filterFormValues[i].id;
        }else if(i == 'localidad_id'){
          params[i] = filterFormValues[i].id;
        }else if(i == 'municipios'){
          params[i] = filterFormValues[i].id;
        }else if(i == 'sexo'){
          params[i] = this.filterForm.get('sexo').value;
        }else if(i == 'edad'){
          params[i] = this.filterForm.value.edad;
        }else if(i == 'tipo_edad'){
          params[i] = this.filterForm.value.tipo_edad;
        }else if(i == 'identidad'){
          var identidad;
          identidad = this.filterForm.value.identidad;
          params[i] = identidad;
        }else if(i == 'nacionalidad'){
          var nacionalidad;
          nacionalidad = this.filterForm.value.nacionalidad;
          params[i] = nacionalidad;
        }else if(i == 'atencion'){
          var atencion;
          atencion = this.filterForm.value.atencion;
          params[i] = atencion;
        }else if(i == 'ambulatorios'){
          var ambulatorios;
          ambulatorios = this.filterForm.value.ambulatorios;
          params[i] = ambulatorios;
        }
        else if (i == 'fecha_inicio') {
          const desde = moment(this.filterForm.value.fecha_inicio).format('YYYY-MM-DD');
          params[i] = desde;
        }
        else if (i == 'fecha_fin') {
          const hasta = moment(this.filterForm.value.fecha_fin).format('YYYY-MM-DD');
          params[i] = hasta;
        }
        else if(i == 'especialidad_id'){
          params[i] = filterFormValues[i];
        }
        else if(i == 'servicio_id'){
          params[i] = filterFormValues[i];
        }
        else if(i == 'estado_actual_id'){
          params[i] = filterFormValues[i];
        }
        countFilter++;

      }
    }

    if(countFilter > 0){
      params.active_filter = true;
    }

    const permiso =  JSON.parse( localStorage.getItem('permissions'));
    params.clues    = this.authClues?.id;

    if(permiso.P5gCJH25AeIwy2IOmvCYtHKg5XL3hKd0){

      params.ver_pacientes_todos = true;
      //params.clues = null;

    }

    
    

    if(this.authDistrito?.id === undefined){
      params.distrito = '';
      params.ver_todo_distrito = false;
    } else {
      params.distrito = this.authDistrito?.id;
      params.ver_todo_distrito = true;
    }

    if(event){
      this.sharedService.setDataToCurrentApp('paginator',event);
    }

    if(this.authServicios){

      params.servicios = this.authServicios;

    }

    this.sharedService.setDataToCurrentApp('searchQuery',this.searchQuery);
    this.sharedService.setDataToCurrentApp('filter',filterFormValues);

    this.AtencionPacientesService.getPacientesList(params).subscribe({
      next:(response) => {
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
      error:(errorResponse: HttpErrorResponse) => {
        let errorMessage = "Ocurrió un error.";
        if(errorResponse.status == 409){
          errorMessage = errorResponse.error.message;
        }
        this.sharedService.showSnackBar(errorMessage, null, 3000);
        this.isLoading = false;
      },
      complete:() =>{}
    });
    
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
    this.catalogos['localidades'] = false;
    this.filterForm.get('localidad_id').reset();
    this.filterForm.get('localidad').reset();

    this.AtencionPacientesService.obtenerCatalogos(carga_catalogos).subscribe(
      response => {
        if(response.data['localidades'].length > 0){
          this.catalogos['localidades'] = response.data['localidades'];
        }
        
        this.actualizarValidacionesCatalogos('localidades');
      }
    );
  }

  openDialogFormSeguimiento(id = 0){
    let dialogConfig:any = {
      maxWidth: '100%',
      width: '95%',
      height: '80%',
      data:{}
    };

    if(id){
      dialogConfig.data.id = id;
    }

    const dialogRef = this.dialog.open(AgregarSeguimientoDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(valid => {
      if(valid){
        console.log('Aceptar');
      }else{
        console.log('Cancelar');
      }
    });


  }

  openDialogFormAlta(id = 0, index){

    let dialogConfig:any = {
      maxWidth: '100%',
      width: '95%',
      height: '80%',
      data:{}
    };

    if(id){
      dialogConfig.data.id = id;
    }

    const dialogRefSure = this.dialog.open(ConfirmActionDialogComponent, {
      width: '500px',
      data: {dialogTitle:'¡ADVERTENCIA!',dialogMessage:'ESTÁ DANDO DE ALTA A UN PACIENTE ¿CONFIRMA EL ALTA?',btnColor:'primary',btnText:'Si'}
    });

    dialogRefSure.afterClosed().subscribe(reponse => {

      if(reponse){

        const dialogRefAlta = this.dialog.open(AgregarAltaDialogComponent, dialogConfig);

        dialogRefAlta.afterClosed().subscribe(valid => {
          if(valid){
            console.log('Aceptar');
          }else{
            console.log('Cancelar');
          }
        });

      }
    });

  }

  verPaciente(id = 0, index){
    
    this.selectedItemIndex = index;

    let dialogConfig:any = {
      maxWidth: '100%',
      width: '95%',
      height: '80%',
      data:{ id:id }
    };


    const dialogRef = this.dialog.open(DetailsComponentPaciente, dialogConfig);

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
        this.AtencionPacientesService.deletePaciente(id).subscribe(
          response => {
            this.loadPacientesData(null);
          }
        );
      }
    });
  }

  toggleReportPanel(){
    this.reportIncludeSigns = false;
    this.reportTitle = 'Atenciones Activas.';

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

  reportePacientes(){
    //this.showMyStepper = true;
    this.isLoadingPDF = true;
    this.showMyStepper = true;
    this.showReportForm = false;

    const params:any = {};
    let countFilter = 0;

    const appStoredData = this.sharedService.getArrayDataFromCurrentApp(['searchQuery','filter']);
    console.log("onlyone",appStoredData);

    params.reporte = 'pacientes';

    if(appStoredData['searchQuery']){
      params.query = appStoredData['searchQuery'];
    }

    for(const i in appStoredData['filter']){

      if(appStoredData['filter'][i]){

        if(i == 'municipio_id'){
          params[i] = appStoredData['filter'][i].id;
        }else if(i == 'localidad_id'){
          params[i] = appStoredData['filter'][i].id;
        }else if(i == 'especialidad_id'){
          params[i] = appStoredData['filter'][i].id;
        }else if(i == 'servicio_id'){
          params[i] = appStoredData['filter'][i].id;
        }else if(i == 'estado_actual_id'){
          params[i] = appStoredData['filter'][i].id;
        }
        else if(i == 'sexo'){
          params[i] = this.filterForm.get('sexo').value;
        }else if(i == 'edad'){
          params[i] = this.filterForm.value.edad;
        }else if(i == 'tipo_edad'){
          params[i] = this.filterForm.value.tipo_edad;
        }else if(i == 'identidad'){
          params[i] = this.filterForm.value.identidad;
        }else if(i == 'nacionalidad'){
          params[i] = this.filterForm.value.nacionalidad;
        }else if(i == 'atencion'){
          params[i] =  this.filterForm.get('atencion').value;
        }else if(i == 'ambulatorios'){
          params[i] = this.filterForm.value.ambulatorios;
        }else if (i == 'fecha_inicio') {
          const desde = moment(this.filterForm.value.fecha_inicio).format('YYYY-MM-DD');
          params[i] = desde;
        }else if (i == 'fecha_fin') {
          const hasta = moment(this.filterForm.value.fecha_fin).format('YYYY-MM-DD');
          params[i] = hasta;
        }
        
        countFilter++;

      }

    }

    if(countFilter > 0){
      params.active_filter = true;
    }

    const permiso =  JSON.parse( localStorage.getItem('permissions'));

    if(permiso.P5gCJH25AeIwy2IOmvCYtHKg5XL3hKd0){

      params.ver_pacientes_todos = true

    }

    params.clues    = this.authClues?.id;
    

    if(this.authDistrito?.id === undefined){
      params.distrito = '';
      params.ver_todo_distrito = false;
    } else {
      params.distrito = this.authDistrito?.id;
      params.ver_todo_distrito = true;
    }

    if(!this.authServicios){

      params.servicios = this.authServicios;

    }
    
    this.stepperConfig.steps[0].status = 2;

    this.AtencionPacientesService.getPacientesList(params).subscribe({
      next:(response) => {
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

                FileSaver.saveAs(data.data,'Atenciones Activas'+' '+'('+this.fechaActual+')' );
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
            reportWorker.postMessage({data:{items: response.data, config:config},reporte:'/atencion-pacientes'});
        }
        this.isLoading = false;
      },
      error:(errorResponse: HttpErrorResponse) => {
        let errorMessage = "Ocurrió un error.";
        if(errorResponse.status == 409){
          errorMessage = errorResponse.error.error.message;
        }
        this.stepperConfig.steps[this.stepperConfig.currentIndex].status = 0;
        this.stepperConfig.steps[this.stepperConfig.currentIndex].errorMessage = errorMessage;
        //this.sharedService.showSnackBar(errorMessage, null, 3000);
        this.isLoading = false;
      },
      complete:() =>{
        this.sharedService.showSnackBar('¡Reporte Generado!', 'Cerrar', 5000);
      }
    });

  }

  generatePdf(data){

    const reportWorker = new ReportWorker();
    reportWorker.onmessage().subscribe(
      data => {

        console.log("deitaa",data);
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

      console.log("DATOS AL WORKER",obj);
      //this.showMyStepper = true;
      this.isLoadingPDF = true;
      this.showMyStepper = true;
      this.showReportForm = false;

      const params:any = {};
      const countFilter = 0;
      const fecha_reporte = new Intl.DateTimeFormat('es-ES', {year: 'numeric', month: 'numeric', day: '2-digit'}).format(new Date());

      const appStoredData = this.sharedService.getArrayDataFromCurrentApp(['searchQuery','filter']);
      
      params.reporte = 'tarjeta-informativa';
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
          console.log(data);
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
