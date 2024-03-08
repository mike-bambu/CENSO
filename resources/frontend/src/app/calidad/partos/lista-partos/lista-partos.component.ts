import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { SharedService } from 'src/app/shared/shared.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { IngresosService } from 'src/app/ingresos/ingresos.service';
import { QuestionService } from '../../service/question.service';
import { MatTable } from '@angular/material/table';
import { MatExpansionPanel } from '@angular/material/expansion';
import { MatDialog } from '@angular/material/dialog';
import { UntypedFormBuilder } from '@angular/forms';
import { map, startWith,  } from 'rxjs/operators';
import { trigger, transition, animate, style } from '@angular/animations';
import { Router, ActivatedRoute  } from '@angular/router';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { AuthService } from 'src/app/auth/auth.service';
import { Clues } from 'src/app/auth/models/clues';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import * as moment from 'moment';
import { DetailsDialogComponent } from '../../details-dialog/details-dialog.component';



@Component({
  selector: 'lista-partos',
  templateUrl: 'lista-partos.component.html',
  styleUrls: ['lista-partos.component.css'],
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
export class ListaComponentPartos implements OnInit {

  authClues: Clues;

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
  toSendCurp = false;


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

  displayedColumns: string[] = ['type', 'date_start','month_measurement', 'is_active', 'options'];
  dataSource: any = [];
  dataSourceFilters: any = [];

  isLoadingEstadosActuales = false;
  estadosActuales:any[] = [];

  filterChips:any = []; //{id:'field_name',tag:'description',tooltip:'long_description'}
  
  filterCatalogs:any = {};
  filteredCatalogs:any = {};
  catalogos: any = {};

  filterForm = this.fb.group({

    'municipio_id'        : [undefined],
    'municipio'           : [undefined],
    'localidad_id'        : [undefined],
    'localidad'           : [undefined],
    'fecha_inicio'        : [undefined],
    'fecha_fin'           : [undefined],
    'filter_month_measurement'           : [undefined],
    'edad'                : [undefined],
    'sexo'                : [undefined],
    'atencion'            : [undefined],
    'nacionalidad'        : [undefined],
    'identidad'           : [undefined],
    'especialidad'        : [undefined],
    'especialidad_id'     : [undefined],
    'servicio_id'         : [undefined],
    'ambulatorios'        : [undefined]

  });

  fechaActual:any = '';
  maxDate:Date;
  minDate:Date;


  constructor(
    private sharedService: SharedService,
    private ingresosService: IngresosService,
    private calidadService: QuestionService,
    private authService: AuthService,
    private fb: UntypedFormBuilder,
    public dialog: MatDialog,
    public router: Router,
    public route: ActivatedRoute) { }

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatTable, {static:false}) usersTable: MatTable<any>;
  @ViewChild(MatExpansionPanel, {static:false}) advancedFilter: MatExpansionPanel;

  ngOnInit() {

    this.route.params.subscribe(params => {
      const data = params;
      console.log('wwwww', data);

      if( data['curp'] ){
        this.toSendCurp = true;
        this.searchQuery = data['curp'];
        console.log('la curp', data['curp']);
      }else{
        this.toSendCurp = false;
      }

    });

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

    this.authClues = this.authService.getCluesData();

    this.loadCalidadData(event);
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
    this.loadCalidadData(null);

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
    ];
    this.ingresosService.obtenerCatalogos(carga_catalogos).subscribe({
      next:(response) => {
        this.catalogos = response.data;

        this.filteredCatalogs['municipios']           = this.filterForm.controls['municipio_id'].valueChanges.pipe(startWith(''),map(value => this._filter(value,'municipios','nombre')));
        this.filteredCatalogs['localidades']          = this.filterForm.controls['localidad_id'].valueChanges.pipe(startWith(''),map(value => this._filter(value,'localidades','nombre')));
        this.filteredCatalogs['especialidades']       = this.filterForm.controls['especialidad_id'].valueChanges.pipe(startWith(''),map(value => this._filter(value,'especialidades','nombre')));
        this.filteredCatalogs['servicios']            = this.filterForm.controls['servicio_id'].valueChanges.pipe(startWith(''),map(value => this._filter(value,'servicios','nombre')));

      },
      error:(errorResponse: HttpErrorResponse) => {
        let errorMessage = "Ocurrió un error.";
        if(errorResponse.status == 409){
          errorMessage = errorResponse.error.message;
        }
        this.sharedService.showSnackBar(errorMessage, null, 3000);
      },
      complete:() =>{}
    })

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
        else if(i == 'sexo'){
          if(this.filterForm.value.sexo == 'Masculino'){
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
          if(this.filterForm.value.identidad == 1){
            item.tag = 'DESCONOCIDA';
           
          }else{
            item.tag = 'CONOCIDA';
          }
        }
        else if(i == 'nacionalidad'){
          if(this.filterForm.value.nacionalidad == 1){
            item.tag = 'EXTRANJERA';
          }else{
            item.tag = 'MEXICANA';
          }
        }
        else if(i == 'atencion'){
          if(this.filterForm.value.atencion == 1){
            item.tag = 'EN ATENCIÓN HOSPITALARIA';
          }else{
            item.tag = 'REGISTRADOS';
          }
        }
        else if(i == 'ambulatorios'){
          if(this.filterForm.value.ambulatorios == 1){
            item.tag = 'PACIENTES AMBULATORIOS';
          }else if(this.filterForm.value.ambulatorios == 0){
            item.tag = 'PACIENTES EN SERVICIOS';
          }else{
            item.tag = 'PACIENTES SIN SEGUIMIENTO ASIGNADO';
          }
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
        this.filterChips.push(item);
      }
    }
  }

  public loadCalidadData(event?:PageEvent){

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

    if(this.toSendCurp == true){

      params.curp = this.searchQuery;
      
    }else{

      params.query = this.searchQuery;

    }
    
   

    const filterFormValues = this.filterForm.value;
    let countFilter = 0;

    this.loadFilterChips(filterFormValues);

    for(const i in filterFormValues){

      if(filterFormValues[i]){

        if(i == 'municipio_id'){
          params[i] = filterFormValues[i].id;
        }else if(i == 'localidad_id'){
          params[i] = filterFormValues[i].id;
        }else if(i == 'municipios'){
          params[i] = filterFormValues[i].id;
        }else if(i == 'sexo'){
          params[i] = this.filterForm.value.sexo;
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
          params[i] = filterFormValues[i].id;
        }
        else if(i == 'servicio_id'){
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
    params.type='partos';
    this.calidadService.getCalidadList(params).subscribe({
      next:(response) => {
        if(response.error) {
          const errorMessage = response.error.message;
          this.sharedService.showSnackBar(errorMessage, null, 3000);
        } else {
          console.log(response)
           if(response.calidad.calidad >0){
            this.dataSource = response.calidad.calidad;
            this.resultsLength = response.data.total;
          }else if(response.calidad[0]){
            this.dataSource = response.calidad;
            this.resultsLength = 1;
          }
          else{
            this.dataSource = [];
            if(this.searchQuery != ''){
              
              this.sharedService.showSnackBar('¡El Paciente tiene una Atención abierta ó no esta Registrado!', 'Cerrar', 5000);

            }
            this.resultsLength = 0;
          }
        }
        this.isLoading = false;
      },
      error:(errorResponse: HttpErrorResponse) => {
        console.log(errorResponse);
        let errorMessage = "Ocurrió un error.";
        if(errorResponse.status == 409){
          errorMessage = errorResponse.error.error;
          this.sharedService.showSnackBar(errorMessage, 'Cerrar', 5000);
          this.router.navigate(['/calidad']);
        }

        this.isLoading = false;
      },
      complete:() =>{}

    });

    return event;
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  openDetailDialog(){

    let configDialog = {};
    if(this.mediaSize == 'xs'){
      configDialog = {
        maxWidth: '100vw',
        maxHeight: '100vh',
        height: '100%',
        width: '100%',
        data:{ scSize:this.mediaSize}
      };
    }else{
      configDialog = {
        width: '99%',
        maxHeight: '90vh',
        height: '643px',
        data:{}
      }
    }


    const dialogRef = this.dialog.open(DetailsDialogComponent, configDialog);

    dialogRef.afterClosed().subscribe(valid => {
      if(valid){
        console.log('Aceptar');
      }else{
        console.log('Cancelar mike');
      }
    });
  }
  
  removeFilterChip(item,index){
    this.filterForm.get(item.id).reset();
    this.filterChips[index].active = false;
  }
}

