import { Component, Inject, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { startWith, map } from 'rxjs/operators';
import { UntypedFormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { IngresosService } from '../ingresos.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedService } from '../../shared/shared.service';
import { Router, ActivatedRoute  } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { Clues } from '../../auth/models/clues';
import { User } from '../../auth/models/user';
import { DetailsComponentPaciente } from '../details-paciente/details-paciente.component';

import * as moment from 'moment';

//tamaño de pantalla
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

export interface FormDialogData {
  id: number;
}

@Component({
  selector: 'ingresos-atencion-dialog',
  templateUrl: './atencion-dialog.component.html',
  styleUrls: ['./atencion-dialog.component.css']
})
export class AtencionDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<AtencionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FormDialogData,
    private ingresosService: IngresosService,
    public dialog: MatDialog,
    private authService: AuthService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private sharedService: SharedService,
    private route: ActivatedRoute,
    public router: Router,
    private breakpointObserver: BreakpointObserver
  ) {}

  showSnackBar(message, action, duration){
    this.snackBar.open(message, action,{
      duration: duration
    });
  }

  authClues: Clues;
  authUser: User;

  localidadesIsLoading = false;
  isLoading = false;
  paciente:any = {};
  nombre_alias:any = "";
  num_expediente:any = "";

  provideID = false;

  fechaActual:any = '';
  fechaInicial:any = '';
  maxDate:Date;
  minDate:Date;

  pacienteForm:UntypedFormGroup;



  catalogos: any = {};
  filteredCatalogs:any = {};
  folio_atencion = 'ATN';
  hora:any = '';

  selectedItemIndex = -1;
  mediaSize: string;

  destroyed = new Subject<void>();
  currentScreenSize: string;
  displayNameMap = new Map([
    [Breakpoints.XSmall, 'xs'],
    [Breakpoints.Small, 'sm'],
    [Breakpoints.Medium, 'md'],
    [Breakpoints.Large, 'lg'],
    [Breakpoints.XLarge, 'xl'],
  ]);
  dialogMaxSize:boolean;




  ngOnInit() {

      this.renderSize();


      this.pacienteForm = this.fb.group ({
      
        paciente: this.fb.group({

          id:[''],
          folio_paciente:[''],
          numero_expediente:[''],
          tieneAtencion:[''],
          nombre:[''],
          paterno:[''],
          materno:[''],
          edad:[''],
          sexo:[''],
          fecha_nacimiento:[''],
          curp:[''],
          municipio_id:[''],
          municipio:[''],
          localidad:[''],
          localidad_id:[''],
          estado:[''],
          esDesconocido:[''],
          alias:[''],
          edad_aparente:[''],
          esExtranjero:[''],
          pais:[''],
          pais_origen_id:[''],
          telefono_emergencia:[''],
          telefono_celular:[''],
          calle:[''],
          colonia:[''],
          no_exterior:[''],
          no_interior:[''],
          entreCalles:[''],
          cp:[''],
          user_id:[''],

        }),

        atencion: this.fb.group({

          id:[''],
          folio_atencion:[''],
          esAmbulatoria:[''],
          tieneAtencion:[1],
          dadodeAlta:[0],
          esUrgenciaCalificada:[''],
          fecha_inicio_atencion:[''],
          hora:[''],
          estado_actual_id:[''],
          servicio_id:[''],
          cama_id:[''],
          camas:[''],
          no_cama:[''],
          motivo_atencion:['',  Validators.required],
          indicaciones:['',  Validators.required],
          estaEmbarazada:[''],
          haEstadoEmbarazada:[''],
          codigoMater:[''],
          clues_id:[''],
          paciente_id:[''],
  
          ultimo_servicio_id:[''],
          ultima_cama_id:[''],
          ultimo_no_cama:[''],
          ultimo_estado_actual_id:[''],
          ultima_especialidad_id:[''],
          ultimo_factor_covid_id:[''],
  
        }),
  
        embarazo: this.fb.group({
  
          id:[''],
          fueReferida:[0],
          gestas:[''],
          partos:[''],
          cesareas:[''],
          abortos:[''],
          fecha_ultima_mestruacion:[''],
          fecha_control_embarazo:[''],
          semanas_gestacionales:[''],
          fecha_ultimo_parto:[''],
          puerperio:[''],
          metodo_gestacional_id:[''],
          clues_referencia_id:[''],
          clue_atencion_embarazo_id:[''],
          fecha_ultima_atencion_embarazo:[''],
          clues_control_embarazo_id:[''],
          paciente_id:[''],
          
        }),

      
      });


      const id = this.data.id;
      if(id){
        this.isLoading = true;

        this.ingresosService.getPaciente(id).subscribe({
          next:(response) => {
            this.paciente = response.paciente;

            this.nombre_alias = (this.paciente.alias == null || this.paciente.alias == "") ? this.paciente.nombre+' '+ this.paciente.paterno +' '+ this.paciente.materno : this.paciente.alias;
            this.num_expediente = (this.paciente.numero_expediente == null || this.paciente.numero_expediente == "") ? 'NO HAN GENERADO O CAPTURADO EL NÚMERO DE EXPEDIENTE' : this.paciente.num_expediente;
            this.pacienteForm.controls['paciente'].patchValue(this.paciente);

            this.generar_folio(this.folio_atencion);

              this.pacienteForm.controls['atencion'].get('tieneAtencion').patchValue(1);
              this.pacienteForm.controls['atencion'].get('dadodeAlta').patchValue(0);
              this.pacienteForm.controls['atencion'].get('paciente_id').patchValue(this.paciente.id);
              this.pacienteForm.controls['atencion'].get('fecha_inicio_atencion').patchValue(this.maxDate);
              this.pacienteForm.controls['atencion'].get('hora').patchValue(this.hora);
              this.pacienteForm.controls['atencion'].get('clues_id').patchValue(this.authClues?.id);
              //this.pacienteForm.controls['atencion'].get('esAmbulatoria').patchValue(1);              

            this.isLoading = false;
          },
          error:(errorResponse: HttpErrorResponse) => {
            console.log(errorResponse);
            this.isLoading = false;
          },
          complete:() =>{}
        });
          
      }


      moment.locale('es');
      const fecha = new Date();
      fecha.setHours(0, 0, 0, 0);
      this.fechaActual = moment(fecha).format('YYYY-MM-D');
  
      const ahora = moment()
      this.hora = ahora.format("hh:mm a");
  
      this.minDate = new Date(2021, 0, 1);
      this.maxDate = fecha;


      this.authClues = this.authService.getCluesData();
      this.authUser = this.authService.getUserData();

      this.IniciarCatalogos(null);

  }

  public renderSize(){

    this.breakpointObserver
    .observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge,
    ])
    .pipe(takeUntil(this.destroyed))
    .subscribe(result => {
      for (const query of Object.keys(result.breakpoints)) {
        if (result.breakpoints[query]) {
          this.currentScreenSize = this.displayNameMap.get(query) ?? 'Unknown';
        }
      }
    });

  }

  ngAfterViewInit(){
    if(this.currentScreenSize == 'sm' || this.currentScreenSize == 'xs'){
      this.resizeDialog();
    }
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  resizeDialog(){
    if(!this.dialogMaxSize){
      this.dialogRef.updateSize('100%', '100%');
      this.dialogMaxSize = true;
    }else{
      this.dialogRef.updateSize('80%','80%');
      this.dialogMaxSize = false;
    }
  }



  public IniciarCatalogos(obj:any){
    this.isLoading = true;
    const carga_catalogos = [
      {nombre:'estados_actuales',orden:'nombre'},
      { nombre:'servicios',orden:'id', filtro_id:{campo:'clues_id',valor:this.authClues ? this.authClues.id : ''} },
      {nombre:'metodos_gestacionales', orden:'id'},
      {nombre:'clues', orden:'nombre'},
      //{nombre:'servicios',orden:'nombre', filtro_id:{campo:'clues_id',valor:this.authClues ? this.authClues.id : ''}, filtro_secundario_id:{campo:'es_ambulatorio',valor: 1}},
    ];

    this.ingresosService.obtenerCatalogos(carga_catalogos).subscribe(
      response => {

        this.catalogos = response.data;

        this.filteredCatalogs['estados_actuales']           = this.pacienteForm.controls['atencion'].get('estado_actual_id').valueChanges.pipe(startWith(''),map(value => this._filter(value,'estados_actuales','nombre')));

        this.filteredCatalogs['servicios']                  = this.pacienteForm.controls['atencion'].get('servicio_id').valueChanges.pipe(startWith(''),map(value => this._filter(value,'servicios','nombre')));
        this.filteredCatalogs['camas']                      = this.pacienteForm.controls['atencion'].get('no_cama').valueChanges.pipe(startWith(''),map(value => this._filter(value,'camas','descripcion')));

        this.filteredCatalogs['metodos_gestacionales']    = this.pacienteForm.controls['embarazo'].get('metodo_gestacional_id').valueChanges.pipe(startWith(''),map(value => this._filter(value,'metodos_gestacionales','nombre')));
        this.filteredCatalogs['clues_referencia']           = this.pacienteForm.controls['embarazo'].get('clues_referencia_id').valueChanges.pipe(startWith(''),map(value => this._filter(value,'clues','nombre')));
        
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

  tipoAtencion(e){
    const servicio = e.option.value;
    (servicio.es_ambulatorio == 1) ? this.pacienteForm.controls['atencion'].get('esAmbulatoria').patchValue(1) : this.pacienteForm.controls['atencion'].get('esAmbulatoria').patchValue(0);

    console.log(this.pacienteForm.value);
  }

  
  getDisplayFn(label: string){
    return (val) => this.displayFn(val,label);
  }

  displayFn(value: any, valueLabel: string){
    return value ? value[valueLabel] : value;
  }

  generar_folio(value) {

    const fecha: any = new Date();
    const mes: any = fecha.getMonth() + 1;
    const dia: any = fecha.getDate();
    const año: any = fecha.getFullYear();
    const hora: any = fecha.getHours();
    const minuto: any = fecha.getMinutes();
    const segundo: any = fecha.getSeconds();
    const milisegundos: any = fecha.getMilliseconds();

    const folio = dia + '' + mes + '' + año + '' + hora + '' + minuto + '' + segundo + '' + milisegundos;
    let cadena = "";

    cadena = folio;

    if(value == 'ATN'){

      this.pacienteForm.controls['atencion'].get('folio_atencion').patchValue(this.folio_atencion+'-'+this.authClues.id+'-'+this.authUser.id+'-'+cadena+'-'+'WEB');

    }

  }

  saveAtencion(){

    this.isLoading = true;


    const formData = JSON.parse(JSON.stringify(this.pacienteForm.value));

    if(formData.atencion.fecha_inicio_atencion){

      formData.atencion.fecha_inicio_atencion = moment(formData.atencion.fecha_inicio_atencion).format('YYYY-MM-D');

    }

    if(formData.atencion.estado_actual_id){

      formData.atencion.ultimo_estado_actual_id = formData.atencion.estado_actual_id.id;
      formData.atencion.estado_actual_id        = formData.atencion.estado_actual_id.id;
      
    }

    if(formData.atencion.no_cama){

      formData.atencion.ultima_cama_id  = formData.atencion.no_cama.id;
      formData.atencion.ultimo_no_cama  = formData.atencion.no_cama.numero;
      formData.atencion.cama_id         = formData.atencion.no_cama.id;
      formData.atencion.no_cama         = formData.atencion.no_cama.numero;      
    }

    if(formData.atencion.servicio_id){

      formData.atencion.ultimo_servicio_id  = formData.atencion.servicio_id.id;
      formData.atencion.servicio_id         = formData.atencion.servicio_id.id;      
    }


    //data embarazo

    if(formData.embarazo.metodo_gestacional_id){
      formData.embarazo.metodo_gestacional_id     = formData.embarazo.metodo_gestacional_id.id;      
    }

    if(formData.embarazo.clues_referencia_id){
      formData.embarazo.clues_referencia_id     = formData.embarazo.clues_referencia_id.id;      
    }

    if(formData.embarazo.clue_atencion_embarazo_id){
      formData.embarazo.clue_atencion_embarazo_id     = formData.embarazo.clue_atencion_embarazo_id.id;      
    }

    if(formData.embarazo.clues_control_embarazo_id){
      formData.embarazo.clues_control_embarazo_id     = formData.embarazo.clues_control_embarazo_id.id;      
    }

    if(formData.embarazo.fecha_ultima_mestruacion){

      formData.embarazo.fecha_ultima_mestruacion = moment(formData.embarazo.fecha_ultima_mestruacion).format('YYYY-MM-D');

    }

    if(formData.embarazo.fecha_control_embarazo){

      formData.embarazo.fecha_control_embarazo = moment(formData.embarazo.fecha_control_embarazo).format('YYYY-MM-D');

    }

    if(formData.embarazo.fecha_ultimo_parto){

      formData.embarazo.fecha_ultimo_parto = moment(formData.embarazo.fecha_ultimo_parto).format('YYYY-MM-D');

    }

    if(formData.embarazo.fecha_ultima_atencion_embarazo){

      formData.embarazo.fecha_ultima_atencion_embarazo = moment(formData.embarazo.fecha_ultima_atencion_embarazo).format('YYYY-MM-D');

    }


    

    const dataAtencion = formData.atencion;
    const dataEmbarazo = formData.embarazo;

    const datoGuardado = {
      atencion: dataAtencion,
      embarazo: dataEmbarazo
    };

    console.log(formData);

    this.ingresosService.createAtencion(datoGuardado).subscribe({
      next:(response) => {
        console.log(response.messages);
        this.isLoading = false;

        this.dialogRef.close();
        const Message = response.messages;
        //this.verPaciente(formData.paciente.id, null);
        this.sharedService.showSnackBar(Message, 'Cerrar', 3000);
        this.router.navigate(['/ingresos'])
        .then(() => {
          window.location.reload();
        });

      },
      error:(errorResponse: HttpErrorResponse) => {
        console.log(errorResponse);
        this.isLoading = false;
      },
      complete:() =>{}
    });
    
  }

  compareMunicipioSelect(op,value){
    return op.id == value.id;
  }

  numberOnly(event): boolean {

    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  
  }

  checkAutocompleteCamasValue(field_name) {
    setTimeout(() => {
      if (typeof(this.pacienteForm.controls['atencion'].get(field_name).value) != 'object') {
        this.pacienteForm.controls['atencion'].get(field_name).reset();
        if(field_name != 'no_cama'){
          this.catalogos['camas'] = false;
          this.actualizarValidacionesCatalogos('camas');  
        }
      } 
    }, 300);
  }

  actualizarValidacionesCatalogos(catalogo){
    switch (catalogo) {
      case 'servicios':
        if(this.catalogos['servicios']){
          this.pacienteForm.controls['atencion'].get('servicio').setValidators(null);
          this.pacienteForm.controls['atencion'].get('servicio_id').setValidators([Validators.required]);
          this.pacienteForm.controls['atencion'].get('esUrgenciaCalificada').reset();
        }else{
          this.pacienteForm.controls['atencion'].get('servicio').setValidators([Validators.required]);
          this.pacienteForm.controls['atencion'].get('servicio_id').setValidators(null);
        }
        this.pacienteForm.controls['atencion'].get('servicio').updateValueAndValidity();
        this.pacienteForm.controls['atencion'].get('servicio_id').updateValueAndValidity();
        break;
      case 'camas':
        if(this.catalogos['camas']){
          this.pacienteForm.controls['atencion'].get('camas').setValidators(null);
          this.pacienteForm.controls['atencion'].get('no_cama').setValidators([Validators.required]);
        }else{
          this.pacienteForm.controls['atencion'].get('camas').setValidators([Validators.required]);
          this.pacienteForm.controls['atencion'].get('no_cama').setValidators(null);
        }
        this.pacienteForm.controls['atencion'].get('camas').updateValueAndValidity();
        this.pacienteForm.controls['atencion'].get('no_cama').updateValueAndValidity();
        this.pacienteForm.controls['atencion'].get('no_cama').enable();
        this.pacienteForm.controls['atencion'].get('camas').enable();
        break;
      default:
        break;
    }
  }

  cargarCamas(event){

    const servicio = event.option.value;

    console.log("serv",servicio.id);

    const carga_catalogos = [
      {nombre:'camas',orden:'numero',filtro_id:{campo:'servicio_id',valor:servicio.id},filtro_secundario_id:{campo:'estatus_cama_id',valor: 1}},
    ];
    this.isLoading = true;

    this.catalogos['camas'] = false;
    this.pacienteForm.controls['atencion'].get('no_cama').reset();
    this.pacienteForm.controls['atencion'].get('camas').reset();
    this.pacienteForm.controls['atencion'].get('esUrgenciaCalificada').reset();

    this.ingresosService.obtenerCatalogos(carga_catalogos).subscribe(
      response => {
        if(response.data['camas'].length > 0){
          this.catalogos['camas'] = response.data['camas'];
          this.actualizarValidacionesCatalogos('camas');
        }else{
          this.pacienteForm.controls['atencion'].get('no_cama').disable();
          this.pacienteForm.controls['atencion'].get('camas').disable();
        }
        
        this.isLoading = false; 
        //this.actualizarValidacionesCatalogos('camas');
      }
    );

  }


  calculateAge() {

      const fecha1 = moment(this.fechaActual);
      const fecha2 = moment(this.pacienteForm.get('fecha_nacimiento').value).format('YYYY-MM-D');
  
      this.pacienteForm.controls['edad'].patchValue(fecha1.diff(fecha2, 'years'));
  
  
      console.log(this.pacienteForm.get('fecha_nacimiento').value);

      console.log("ingreso",this.pacienteForm.get('fecha_ingreso').value);

  }

  calcularGestas(){

    const abortos   = parseInt(this.pacienteForm.controls['embarazo'].get('abortos').value);
    const partos    = parseInt(this.pacienteForm.controls['embarazo'].get('partos').value);
    const cesareas  = parseInt(this.pacienteForm.controls['embarazo'].get('cesareas').value);

    const totalGestas = abortos + partos + cesareas;

    if( this.pacienteForm.controls['embarazo'].get('gestas').value == totalGestas || this.pacienteForm.controls['embarazo'].get('gestas').value == (totalGestas + 1) ){
      
      this.showSnackBar("la sumatoria de Partos, Cesarias y Abortos debe ser igual o mayor a maximo 1 Gestación", null, 3000);

    }else{

      this.pacienteForm.controls['embarazo'].get('gestas').patchValue(totalGestas);
      this.showSnackBar("la sumatoria de Partos, Cesarias y Abortos debe ser igual o mayor a maximo 1 Gestación", null, 3000);
      
    }


  }

  esta_embarazada(val){

    if(val === 1){

      this.pacienteForm.controls['atencion'].get('estaEmbarazada').patchValue(1);
      this.pacienteForm.controls['atencion'].get('haEstadoEmbarazada').reset();
      this.pacienteForm.controls['embarazo'].reset();

      console.log(this.pacienteForm.controls['embarazo'].value);

    }else{

      this.pacienteForm.controls['atencion'].get('estaEmbarazada').patchValue(0);
      this.pacienteForm.controls['embarazo'].reset();


      console.log(this.pacienteForm.controls['embarazo'].value);
      console.log(this.pacienteForm.controls['atencion'].value);

      

    }

  }

  puerperio(val){

    const año_comparacion = moment(this.maxDate).subtract(1, 'year');

    //if( moment(val).isSameOrBefore(this.maxDate) ){
      if( moment(val).isBetween(año_comparacion, this.maxDate) ) {

      this.pacienteForm.controls['embarazo'].get('puerperio').patchValue(1);

      var Message = "La Paciente es Puerpera";    
      this.sharedService.showSnackBar(Message, 'Cerrar', 4000);

      console.log(this.pacienteForm.controls['embarazo'].value);

    }else{

      this.pacienteForm.controls['embarazo'].get('puerperio').patchValue(0);

      var Message = "La Paciente No es Puerpera";
      this.sharedService.showSnackBar(Message, 'Cerrar', 4000);

      console.log(this.pacienteForm.controls['embarazo'].value);


    }


  }

  es_emergencia_calificada(val){

    if(val === 1){

      this.pacienteForm.controls['atencion'].get('esUrgenciaCalificada').patchValue(1);

    }else{

      this.pacienteForm.controls['atencion'].get('esUrgenciaCalificada').patchValue(0);

    }

  }

  fue_referida_embarazada(val){

    if(val === 1){

      this.pacienteForm.controls['embarazo'].get('fueReferida').patchValue(1);

    }else{

      this.pacienteForm.controls['embarazo'].get('fueReferida').patchValue(0);
      this.pacienteForm.controls['embarazo'].get('clues_referencia_id').reset();
      this.pacienteForm.controls['embarazo'].get('clues_referencia_id').patchValue(null);

    }
  }

  ha_estado_embarazada(val){

    if(val === 1){

      this.pacienteForm.controls['atencion'].get('haEstadoEmbarazada').patchValue(1);

      this.pacienteForm.controls['embarazo'].reset();
      

      console.log(this.pacienteForm);

      //this.pacienteForm.controls['atencion'].get('estaEmbarazada').patchValue(0);
      

      
    }else{

      this.pacienteForm.controls['atencion'].get('haEstadoEmbarazada').patchValue(0);

      this.pacienteForm.controls['embarazo'].reset();

      console.log(this.pacienteForm);

      // console.log(this.pacienteForm.controls['embarazo'].value);
      // console.log(this.pacienteForm.controls['atencion'].value);

    }

  }

  verPaciente(id: number, index: number){
    this.selectedItemIndex = index;
    
    const paginator = this.sharedService.getDataFromCurrentApp('paginator');
    paginator.selectedIndex = index;
    this.sharedService.setDataToCurrentApp('paginator',paginator);

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

    const dialogRef = this.dialog.open(DetailsComponentPaciente, configDialog);

    dialogRef.afterClosed().subscribe(valid => {
      if(valid){
        console.log('Aceptar');
      }else{
        console.log('Cancelar');
      }
    });
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

}