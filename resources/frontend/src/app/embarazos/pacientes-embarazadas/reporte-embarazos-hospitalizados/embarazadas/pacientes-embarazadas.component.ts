import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SharedService } from '../../../../shared/shared.service';
import { PacientesEmbarazadasService } from '../pacientes-embarazadas.service';
import { DetailsComponentPaciente } from '../../../../atencion-pacientes/details-paciente/details-paciente.component'
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatExpansionPanel } from '@angular/material/expansion';
import { MatTable } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { trigger, transition, animate, style } from '@angular/animations';
import { debounceTime, tap, switchMap, finalize, map, startWith, } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MediaObserver } from '@angular/flex-layout';
import { Router } from '@angular/router';
import { ReportWorker } from '../../../../web-workers/report-worker';

import { AuthService } from '../../../../auth/auth.service';
import { Clues } from '../../../../auth/models/clues';
import { Servicios } from '../../../../auth/models/servicios';

import * as moment from 'moment';
import * as FileSaver from 'file-saver';

import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { MatChipInputEvent } from "@angular/material/chips"



@Component({
  selector: 'reporte-pacientes-embarazadas',
  templateUrl: './pacientes-embarazadas.component.html',
  styleUrls: ['./pacientes-embarazadas.component.css'],
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


export class PacientesEmbarazadasComponent implements OnInit {

  authClues: Clues;
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

  displayedColumns: string[] = ['nombre', 'edad', 'procedencia', 'details'];
  //'actions'
  dataSource: any = [];
  dataSourceFilters: any = [];

  isLoadingEstadosActuales = false;
  estadosActuales:any[] = [];

  filterChips:any = []; //{id:'field_name',tag:'description',tooltip:'long_description'}
  
  filterCatalogs:any = {};
  filteredCatalogs:any = {};
  catalogos: any = {};

  filterForm = this.formBuilder.group({

    'numero_expediente'         : [undefined],
    'fecha_inicio'              : [undefined],
    'fecha_fin'                 : [undefined],
    'servicio_id'               : [undefined],
    'numero_cama'               : [undefined],
    'estado_actual_id'          : [undefined]


  });

  fechaActual:any = '';
  maxDate:Date;
  minDate:Date;

  servicios: any[] = [];
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  @ViewChild("servicioInput") servicioInput: ElementRef;


  constructor(
    private sharedService: SharedService,
    private pacientesEmbarazadasService: PacientesEmbarazadasService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog) { }

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatTable, {static:false}) usersTable: MatTable<any>;
  @ViewChild(MatExpansionPanel, {static:false}) advancedFilter: MatExpansionPanel;

  ngOnInit() {

    const appStoredData = this.sharedService.getArrayDataFromCurrentApp(['searchQuery','paginator','filter']);
    console.log(appStoredData);

    if(appStoredData['searchQuery']){
      this.searchQuery = appStoredData['searchQuery'];
    }

    let event = null
    if(appStoredData['paginator']){
      this.currentPage = appStoredData['paginator'].pageIndex;
      this.pageSize = appStoredData['paginator'].pageSize;
      event = appStoredData['paginator'];

      if(event.selectedIndex >= 0){
        console.log("siguiente", event);
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

    this.authClues = this.authService.getCluesData();
    this.authServicios = this.authService.getServiciosData();

    this.loadPacientesData(event);
    this.loadFilterCatalogs();
    //console.log(this.filteredDiagnosticos);

  }

  addServicio(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our servicio
    if ((value || "").trim()) {
      this.servicios.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = "";
    }

    //this.fruitCtrl.setValue(null);
    console.log('WERT', event);
    this.filterForm.get('servicio_id').setValue(null);
  }

  removeServicio(servicio: any): void {
    const index = this.servicios.indexOf(servicio);

    if (index >= 0) {
      this.servicios.splice(index, 1);
    }
  }

  selectedServicio(event: MatAutocompleteSelectedEvent): void {

    this.servicios.push(event.option.value);
    this.servicioInput.nativeElement.value = "";
    this.filterForm.get('servicio_id').setValue(null);

  }
  clearServicios(){

    this.servicios = [];

  }

  getDisplayFn(label: string){
    return (val) => this.displayFn(val,label);
  }

  displayFn(value: any, valueLabel: string){
    return value ? value[valueLabel] : value;
  }

  applyFilter(){

    console.log("aca",this.filterForm.value);

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
      {nombre:'servicios',orden:'nombre', filtro_id:{campo:'clues_id',valor:this.authClues ? this.authClues.id : ''}, filtro_secundario_id:{campo:'es_ambulatorio',valor: 1}},
      {nombre:'estados_actuales',orden:'nombre'},

    ];

    this.pacientesEmbarazadasService.obtenerCatalogos(carga_catalogos).subscribe(
      response => {

        this.catalogos = response.data;

        const permiso =  JSON.parse( localStorage.getItem('permissions'));

        if(!permiso.OFqzXg3CmjTUVLQ8IFuy3QYriN3cNruc){

          this.catalogos['servicios']   = this.authServicios;
          
        }

        this.filteredCatalogs['servicios']            = this.filterForm.controls['servicio_id'].valueChanges.pipe(startWith(''),map(value => this._filter(value,'servicios','nombre')));
        this.filteredCatalogs['estados_actuales']     = this.filterForm.controls['estado_actual_id'].valueChanges.pipe(startWith(''),map(value => this._filter(value,'estados_actuales','nombre')));


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

    // for(let i in data){

    //   if(data[i]){
    //     let item = {
    //       id: i,
    //       tag: '',
    //       tooltip: i.toUpperCase() + ': ',
    //       active: true
    //     };
    //     if(i === 'numero_expediente'){
    //       if( this.filterForm.controls.value === 'numero_expediente'){
    //         item.tooltip =  'Número de Expediente',
    //         item.tag = 'Número de Expediente: '+this.filterForm.get('numero_expediente').value;
    //       }else{
    //         item.tooltip =  'Numero de Expediente',
    //         item.tag = 'Número de Expediente: '+this.filterForm.get('numero_expediente').value;
    //       }
    //     }
    //     else if(i === 'numero_cama'){
    //       if(this.filterForm.controls.value === 'numero_cama'){
    //         item.tooltip =  'Número/Descripción de Cama',
    //         item.tag = 'Número/Descripción de la Cama: '+this.filterForm.get('numero_cama').value;
    //       }else{
    //         item.tooltip =  'Número/Descripción de Cama',
    //         item.tag = 'Número/Descripción de la Cama: '+this.filterForm.get('numero_cama').value;
    //       }
    //     }
    //     else if(i === 'estado_actual_id'){
    //       item.tag = data[i].nombre;
    //       item.tooltip = "Estado Actual de Salud: "+data[i].nombre.toUpperCase();
    //     }
    //     else if (i === 'fecha_inicio') {
    //       var desde = moment(this.filterForm.controls.value.fecha_inicio).format('DD/MM/YYYY'); 
    //       item.tag = desde;
    //       item.tooltip = "Fecha de Ingreso (Desde): " + desde;
    //     }
    //     else if (i === 'fecha_fin') {
    //       var hasta = moment(this.filterForm.controls.value.fecha_fin).format('DD/MM/YYYY')
    //       item.tag = hasta;
    //       item.tooltip = "Fecha de Ingreso (Hasta): " + hasta;
    //     }

    //     this.filterChips.push(item);

    //   }
    // }
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

    params.servicios = [];

  
    if(event && !event.hasOwnProperty('selectedIndex')){
      this.selectedItemIndex = -1;
    }
    
    params.query = this.searchQuery;

    const filterFormValues = this.filterForm.value;
    let countFilter = 0;
    this.loadFilterChips(filterFormValues);

    if(this.servicios.length > 0){

      params.active_filter = true;
      params.servicios = this.servicios;

    }else{

        params.servicios = this.authServicios;
  
    }
    
    params.clues = this.authClues?.id;

    const permiso =  JSON.parse( localStorage.getItem('permissions'));

    if(permiso.OFqzXg3CmjTUVLQ8IFuy3QYriN3cNruc){

      params.ver_servicios_todos = true

    }

    for(const i in filterFormValues){

      if(filterFormValues[i]){

        if(i == 'numero_cama'){
          params[i] = this.filterForm.value.numero_cama;
        }
        if(i == 'numero_expediente'){
          params[i] = this.filterForm.value.numero_expediente;
        }
        // else if(i == 'servicios'){

        //     params[i] = this.filterForm.value.servicios;

        // }
        else if(i == 'estado_actual_id'){
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

    this.pacientesEmbarazadasService.getPacientesEmbarazadas(params).subscribe(
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


  toggleReportPanel(){
    this.reportIncludeSigns = false;
    this.reportTitle = 'Primer Contacto Adultos';

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

  reporteEmbarazadas(){
    //this.showMyStepper = true;
    this.isLoadingPDF = true;
    this.showMyStepper = true;
    this.showReportForm = false;

    const params:any = {};
    let countFilter = 0;

    const appStoredData = this.sharedService.getArrayDataFromCurrentApp(['searchQuery','filter']);
    console.log("onlyone",appStoredData);

    params.reporte = 'Pacientes Hospitalizados';

    params.servicios = [];

    if(appStoredData['searchQuery']){
      params.query = appStoredData['searchQuery'];
    }


    if(this.servicios.length > 0){

      params.active_filter = true;
      params.servicios = this.servicios;

    }else{

        params.servicios = this.authServicios;
  
    }
    
    params.clues = this.authClues?.id;

    const permiso =  JSON.parse( localStorage.getItem('permissions'));

    if(permiso.OFqzXg3CmjTUVLQ8IFuy3QYriN3cNruc){

      params.ver_servicios_todos = true

    }
    
    for(const i in appStoredData['filter']){

      if(appStoredData['filter'][i]){

        // if(i == 'servicio_id'){
        //   params[i] = appStoredData['filter'][i].id;
        // }
        if(i == 'estado_actual_id'){
          params[i] = appStoredData['filter'][i].id;
        }
        else if(i == 'numero_cama'){
          params[i] = this.filterForm.value.numero_cama;
        }else if(i == 'numero_expediente'){
          params[i] = this.filterForm.value.numero_expediente;
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

    if(countFilter > 0 || this.servicios.length > 0){
      params.active_filter = true;
    }
    
    this.stepperConfig.steps[0].status = 2;

    this.pacientesEmbarazadasService.getPacientesEmbarazadas(params).subscribe(
      response =>{
        console.log("zxczxc",response.data);
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

                console.log("deitaa",data);
                FileSaver.saveAs(data.data,'Pacientes-Embarazadas'+'('+moment(this.fechaActual).format('DD-MM-YYYY')+')' );
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
            reportWorker.postMessage({data:{items: response.data, fecha_actual: response.fecha_actual, config:config},reporte:'/reporte-embarazadas'});
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

  tarjetaInformativa (obj){

      console.log("DATOS AL WORKER",obj);
      //this.showMyStepper = true;
      this.isLoadingPDF = true;
      this.showMyStepper = true;
      this.showReportForm = false;

      const params:any = {};
      const countFilter = 0;
      const fecha_reporte = new Intl.DateTimeFormat('es-ES', {year: 'numeric', month: 'numeric', day: '2-digit'}).format(new Date());

      const appStoredData = this.sharedService.getArrayDataFromCurrentApp(['searchQuery','filter']);
      
      params.reporte = 'Pacientes Ambulatorios';
      
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
