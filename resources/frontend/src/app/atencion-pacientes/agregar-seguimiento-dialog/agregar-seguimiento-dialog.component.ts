import { Component, Inject, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { startWith, map } from 'rxjs/operators';
import { UntypedFormGroup, Validators, UntypedFormBuilder, UntypedFormArray } from '@angular/forms';
import { AtencionPacientesService } from '../atencion-pacientes.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedService } from '../../shared/shared.service';
import { Router, ActivatedRoute  } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { Clues } from '../../auth/models/clues';
import { User } from '../../auth/models/user';

import { MatDialog} from '@angular/material/dialog';
import { DetailsComponentPaciente } from '../details-paciente/details-paciente.component';


//tamaño de pantalla
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import * as moment from 'moment';

export interface FormDialogData {
  id: number;
}

@Component({
  selector: 'agregar-seguimiento-dialog',
  templateUrl: './agregar-seguimiento-dialog.component.html',
  styleUrls: ['./agregar-seguimiento-dialog.component.css']
})
export class AgregarSeguimientoDialogComponent implements OnInit {

  constructor(
    private AtencionPacientesService: AtencionPacientesService,
    private authService: AuthService,
    public dialogRef: MatDialogRef<AgregarSeguimientoDialogComponent>,
    public dialog: MatDialog,
    private fb: UntypedFormBuilder,
    private snackBar: MatSnackBar,
    private sharedService: SharedService,
    private route: ActivatedRoute,
    public router: Router,
    private breakpointObserver: BreakpointObserver,
    @Inject(MAT_DIALOG_DATA) public data: FormDialogData

  ) {}

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

  provideID = false;

  fechaActual:any = '';
  diasEstancia:any = '';
  fechaInicial:any = '';
  minDate:any = '';
  maxDate:any = '';
  mediaSize: string;
  selectedItemIndex = -1;

  pacienteForm:UntypedFormGroup;

  catalogos: any = {};
  filteredCatalogs:any = {};

  folio_seguimiento = 'SEG';
  folio_seguimiento_diagnostico = 'SEG-DIAG';
  folio_seg_diag = '';
  hora:any = '';


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

        ultima_atencion : this.fb.group({


          id:[''],
          folio_atencion:[''],
          esAmbulatoria:[''],
          dadodeAlta:[0],
          esUrgenciaCalificada:[''],
          fecha_inicio_atencion:[''],
          hora:[''],
          estado_actual_id:[''],
          servicio_id:[''],
          cama_id:[''],
          camas:[''],
          no_cama:[''],
          motivo_atencion:[''],
          indicaciones:[''],
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

        seguimientos : this.fb.group({
          id:[''],
          fecha_seguimiento:['', Validators.required],
          hora_seguimiento:['', Validators.required],
          folio_atencion:[''],
          folio_seguimiento:[''],
          observaciones:['', Validators.required],
          observaciones_diagnosticos:['', Validators.required],
          cama_id:[''],
          cama_actual_id:[''],
          no_actual_cama:[''],
          estatus_cama_actual_id:[''],
          servicio_actual_id:[''],          

          camas:[''],
          servicio:[''],

          cama_anterior_id:[''],
          no_anterior_cama:[''],
          estatus_cama_anterior_id:[''],
          servicio_anterior_id:[''],

          esAmbulatoria:[''],
          
          //codigoMatter:[''],
          estado_actual_id:['', Validators.required],
          especialidad_id:['', Validators.required],
          factor_covid_id:['', Validators.required],
          atencion_id:[''],
          // diagnostico_id:[''],
          // diagnosticos:this.fb.array([]),
        }),

        embarazo: this.fb.group({

          id:[''],
          fueReferida:[''],
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

        this.AtencionPacientesService.getPaciente(id).subscribe({
          next:(response) => {
            
              this.paciente = response.paciente;
              this.paciente.numero_expediente === null || this.paciente.numero_expediente === "" ? this.paciente.numero_expediente = 'NO SE HA REGISTRADO' : this.paciente.numero_expediente;
              this.paciente.curp === null || this.paciente.curp === "" ? this.paciente.curp = 'NO SE HA REGISTRADO' : this.paciente.curp;
              this.paciente.fecha_nacimiento === null || this.paciente.fecha_nacimiento === "" ? this.paciente.fecha_nacimiento = 'NO SE HA REGISTRADO' : this.paciente.fecha_nacimiento;
              this.paciente.telefono_emergencia === null || this.paciente.telefono_emergencia === "" ? this.paciente.telefono_emergencia = 'NO SE HA REGISTRADO' : this.paciente.telefono_emergencia;
              
              console.log("AACAAA",this.paciente);
  
                this.pacienteForm.controls['paciente'].patchValue(this.paciente);
                this.pacienteForm.controls['embarazo'].patchValue(this.paciente?.embarazo);
                this.pacienteForm.controls['seguimientos'].get('hora_seguimiento').patchValue(this.hora);
                this.pacienteForm.controls['seguimientos'].get('fecha_seguimiento').patchValue(this.maxDate);
  
                if(this.paciente.ultima_atencion != null || this.paciente.ultima_atencion != ""){
  
                  this.DiasEstanciaHospitalaria(this.paciente?.ultima_atencion?.fecha_inicio_atencion, this.fechaActual)
  
                  this.pacienteForm.controls['ultima_atencion'].patchValue(this.paciente.ultima_atencion);
  
                  this.pacienteForm.controls['seguimientos'].get('atencion_id').patchValue(this.paciente.ultima_atencion.id);
                  this.pacienteForm.controls['seguimientos'].get('folio_atencion').patchValue(this.paciente.ultima_atencion.folio_atencion);
                  
                  if(this.paciente.ultima_atencion?.ultimo_seguimiento != null){
  
                    this.pacienteForm.controls['seguimientos'].get('servicio_actual_id').patchValue(this.paciente.ultima_atencion?.ultimo_seguimiento?.servicio);
  
                    this.pacienteForm.controls['seguimientos'].get('especialidad_id').patchValue(this.paciente.ultima_atencion?.ultimo_seguimiento?.especialidad);
                    this.pacienteForm.controls['seguimientos'].get('estado_actual_id').patchValue(this.paciente.ultima_atencion?.ultimo_seguimiento?.estado_actual);
                    this.pacienteForm.controls['seguimientos'].get('factor_covid_id').patchValue(this.paciente.ultima_atencion?.ultimo_seguimiento?.factor_covid);
                    
                    this.pacienteForm.controls['seguimientos'].get('observaciones').patchValue(this.paciente.ultima_atencion?.ultimo_seguimiento?.observaciones);
                    this.pacienteForm.controls['seguimientos'].get('observaciones_diagnosticos').patchValue(this.paciente.ultima_atencion?.ultimo_seguimiento?.observaciones_diagnosticos);
  
                    if(this.paciente.ultima_atencion?.ultimo_seguimiento?.cama != null){
  
                      this.cargarCamaAtencion(this.paciente.ultima_atencion?.ultimo_seguimiento?.cama.id);
    
                    }else{
    
                      this.pacienteForm.controls['seguimientos'].get('camas').disable();
                      this.pacienteForm.controls['seguimientos'].get('no_actual_cama').disable();
                    }
  
  
                  }else{
  
                    this.pacienteForm.controls['seguimientos'].get('servicio_actual_id').patchValue(this.paciente.ultima_atencion?.servicio_actual);
                    this.pacienteForm.controls['seguimientos'].get('especialidad_id').patchValue(this.paciente.ultima_atencion?.ultima_especialidad);
                    this.pacienteForm.controls['seguimientos'].get('estado_actual_id').patchValue(this.paciente.ultima_atencion?.ultimo_estado_actual);
                    this.pacienteForm.controls['seguimientos'].get('factor_covid_id').patchValue(this.paciente.ultima_atencion?.factor_covid);
  
                    this.pacienteForm.controls['seguimientos'].get('observaciones').patchValue(this.paciente.ultima_atencion?.indicaciones);
                    this.pacienteForm.controls['seguimientos'].get('observaciones_diagnosticos').patchValue(this.paciente.ultima_atencion?.motivo_atencion);
  
  
                    if(this.paciente.ultima_atencion?.cama_actual != null){
  
                      this.cargarCamaAtencion(this.paciente.ultima_atencion?.cama_actual.id);
    
                    }else{
    
                      this.pacienteForm.controls['seguimientos'].get('camas').disable();
                      this.pacienteForm.controls['seguimientos'].get('no_actual_cama').disable();
                    }
                    
                  }
  
                  this.pacienteForm.controls['seguimientos'].get('esAmbulatoria').patchValue(this.paciente.ultima_atencion.esAmbulatoria);
  
                  //this.cargarCamaAtencion(this.paciente.ultima_atencion.cama_actual.id);
                  
  
                }
  
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
      this.fechaActual = moment(fecha).format('YYYY-MM-D');
      console.log("fecha actual", this.fechaActual);

      const ahora = moment()
      this.hora = ahora.format("hh:mm a");

      this.minDate = new Date(2020, 0, 1);
      this.maxDate = fecha;

      this.authClues = this.authService.getCluesData();
      this.authUser = this.authService.getUserData();
      this.generar_folio(this.folio_seguimiento);

      this.IniciarCatalogos(null);
      
      

  }

  DiasEstanciaHospitalaria(f1, f2) {

    console.log(f1);
    console.log(f2);

    const fecha1 = new Date(f1);
    const fecha2 = new Date(f2)

    const resta = fecha2.getTime() - fecha1.getTime()
    this.diasEstancia = Math.round(resta/ (1000*60*60*24));

    this.diasEstancia == 0 ? this.diasEstancia = 'HOY INGRESO' : this.diasEstancia;

    return this.diasEstancia;     
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
      this.dialogRef.updateSize('80%','100%');
      this.dialogMaxSize = false;
    }
  }


  public IniciarCatalogos(obj:any)
  {
    this.isLoading = true;
    const carga_catalogos = [
      {nombre:'estados_actuales',orden:'nombre'},
      {nombre:'especialidades',orden:'nombre', filtro_id:{campo:'clues_id',valor:this.authClues ? this.authClues.id : ''}},
      {nombre:'factor_covid',orden:'nombre'},
      //{nombre:'diagnosticos',orden:'nombre'},

      {nombre:'estados_actuales',orden:'nombre'},
      {nombre:'servicios',orden:'id', filtro_id:{campo:'clues_id',valor:this.authClues ? this.authClues.id : ''} },
    ];

    this.AtencionPacientesService.obtenerCatalogos(carga_catalogos).subscribe(
      response => {

        this.catalogos = response.data;

        this.filteredCatalogs['estados_actuales']         = this.pacienteForm.controls['seguimientos'].get('estado_actual_id').valueChanges.pipe(startWith(''),map(value => this._filter(value,'estados_actuales','nombre')));
        this.filteredCatalogs['especialidades']           = this.pacienteForm.controls['seguimientos'].get('especialidad_id').valueChanges.pipe(startWith(''),map(value => this._filter(value,'especialidades','nombre')));
        this.filteredCatalogs['factor_covid']             = this.pacienteForm.controls['seguimientos'].get('factor_covid_id').valueChanges.pipe(startWith(''),map(value => this._filter(value,'factor_covid','nombre')));
        // this.filteredCatalogs['diagnosticos']             = this.pacienteForm.controls['seguimientos'].get('diagnostico_id').valueChanges.pipe(startWith(''),map(value => this._filter(value,'diagnosticos','nombre')));

        this.filteredCatalogs['servicios']                = this.pacienteForm.controls['seguimientos'].get('servicio_actual_id').valueChanges.pipe(startWith(''),map(value => this._filter(value,'servicios','nombre')));
        this.filteredCatalogs['camas']                    = this.pacienteForm.controls['seguimientos'].get('no_actual_cama').valueChanges.pipe(startWith(''),map(value => this._filter(value,'camas','descripcion')));

        // if(this.paciente.ultima_atencion != null || this.paciente.ultima_atencion != ""){
        //   console.log("entro o que pedo");
        //   this.cargarCamaAtencion(this.paciente.ultima_atencion.cama_actual.id);
        // }
        // if(obj)
        // {
        //   if(obj.localidad && obj.municipio){
        //     this.pacienteForm.controls['pacientes'].get('municipio_id').setValue(obj.municipio);
        //     this.pacienteForm.controls['pacientes'].get('localidad').setValue(obj.localidad.nombre);
        //     this.pacienteForm.controls['pacientes'].get('localidad_id').setValue(obj.localidad);
        //   }
        //   if(obj.pais_origen){

        //     this.pacienteForm.controls['pacientes'].get('pais_origen_id').setValue(obj.pais_origen);

        //   }

        //   //this.valor_unidad = parseInt(obj.tipo_unidad_id);
        // }
        this.isLoading = false; 
      } 
    );
    console.log("alaglory", this.pacienteForm.value);
    

  }

  clearCamaServicioContoles(){

    this.pacienteForm.controls['seguimientos'].get('servicio_actual_id').clearValidators();
    this.pacienteForm.controls['seguimientos'].get('servicio').clearValidators();
  
    this.pacienteForm.controls['seguimientos'].get('servicio_actual_id').updateValueAndValidity();
    this.pacienteForm.controls['seguimientos'].get('servicio').updateValueAndValidity();
  
  
    this.pacienteForm.controls['seguimientos'].get('no_actual_cama').clearValidators();
    this.pacienteForm.controls['seguimientos'].get('camas').clearValidators();
    
    this.pacienteForm.controls['seguimientos'].get('no_actual_cama').updateValueAndValidity();
    this.pacienteForm.controls['seguimientos'].get('camas').updateValueAndValidity();

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

  cargarCamaAtencion(value){

    const cama_id = value;
    const carga_catalogos = [
      {nombre:'camas',orden:'numero',filtro_id:{campo:'id',valor:cama_id}},
    ];
    this.isLoading = true;

    this.catalogos['camas'] = false;
    // this.pacienteForm.controls['seguimientos'].get('no_actual_cama').reset();
    // this.pacienteForm.controls['seguimientos'].get('camas').reset();
    this.pacienteForm.controls['seguimientos'].get('camas').clearValidators();
    this.pacienteForm.controls['seguimientos'].get('camas').updateValueAndValidity();

    this.AtencionPacientesService.obtenerCatalogos(carga_catalogos).subscribe(
      response => {
        if(response.data['camas'].length > 0){

          this.catalogos['camas'] = response.data['camas'];
          //this.pacienteForm.controls['seguimientos'].get('no_actual_cama').setValue(response.data['camas'][0]);

          this.pacienteForm.controls['seguimientos'].get('cama_anterior_id').setValue(response.data['camas'][0].id);
          this.pacienteForm.controls['seguimientos'].get('no_anterior_cama').setValue(response.data['camas'][0].numero);
          this.pacienteForm.controls['seguimientos'].get('estatus_cama_anterior_id').setValue(response.data['camas'][0].estatus_cama_id);
          this.pacienteForm.controls['seguimientos'].get('servicio_anterior_id').setValue(response.data['camas'][0].servicio_id);


          this.pacienteForm.controls['seguimientos'].get('no_actual_cama').patchValue(response.data['camas'][0]);

          
        }
        this.isLoading = false; 
        
      }
    );

  }

  cargarServicioAtencion(value){

    const servicio_id = value;
    const carga_catalogos = [
      {nombre:'servicios',orden:'nombre',filtro_id:{campo:'id',valor:servicio_id}},
    ];
    this.isLoading = true;

    this.catalogos['servicios'] = false;
    this.pacienteForm.controls['seguimientos'].get('servicio_actual_id').reset();
    this.pacienteForm.controls['seguimientos'].get('servicio').reset();

    this.AtencionPacientesService.obtenerCatalogos(carga_catalogos).subscribe(
      response => {
        if(response.data['servicios'].length > 0){
          this.pacienteForm.controls['seguimientos'].get('servicio_actual_id').setValue(response.data['servicios'][0]);

          this.clearCamaServicioContoles();
          
        }

        this.isLoading = false;
        
      }
    );
    
    this.cargarCamaAtencion(this.paciente.ultima_atencion.cama_id);

    

  }


  cargarCamas(event){

    const servicio = event.option.value;

    const carga_catalogos = [
      {nombre:'camas',orden:'numero',filtro_id:{campo:'servicio_id',valor:servicio.id},filtro_secundario_id:{campo:'estatus_cama_id',valor: 1}},
    ];

    this.isLoading = true; 

    this.catalogos['camas'] = false;
    this.pacienteForm.controls['seguimientos'].get('no_actual_cama').reset();
    //this.pacienteForm.controls['seguimientos'].get('camas').reset();

    this.AtencionPacientesService.obtenerCatalogos(carga_catalogos).subscribe(
      response => {
        if(response.data['camas'].length > 0){
          this.catalogos['camas'] = response.data['camas'];
          console.log("con camas", this.pacienteForm.controls['seguimientos'].value);
          this.actualizarValidacionesCatalogos('camas');
        }else{
          
          this.pacienteForm.controls['seguimientos'].get('no_actual_cama').reset();
          this.pacienteForm.controls['seguimientos'].get('camas').disable();
          //this.pacienteForm.controls['seguimientos'].get('camas').disable();
          console.log("sin camas", this.pacienteForm.controls['seguimientos'].value);
        }
        this.isLoading = false; 
        //this.actualizarValidacionesCatalogos('camas');
      }
    );

  }

  

  actualizarValidacionesCatalogos(catalogo){
    switch (catalogo) {
      case 'servicios':
        if(this.catalogos['servicios']){
          this.pacienteForm.controls['seguimientos'].get('servicio').setValidators(null);
          this.pacienteForm.controls['seguimientos'].get('servicio_actual_id').setValidators([Validators.required]);
        }else{
          this.pacienteForm.controls['seguimientos'].get('servicio').setValidators([Validators.required]);
          this.pacienteForm.controls['seguimientos'].get('servicio_actual_id').setValidators(null);
        }
        this.pacienteForm.controls['seguimientos'].get('servicio').updateValueAndValidity();
        this.pacienteForm.controls['seguimientos'].get('servicio_actual_id').updateValueAndValidity();
        break;
      case 'camas':
        if(this.catalogos['camas']){
          this.pacienteForm.controls['seguimientos'].get('camas').clearValidators();
          this.pacienteForm.controls['seguimientos'].get('camas').updateValueAndValidity();
          this.pacienteForm.controls['seguimientos'].get('no_actual_cama').setValidators([Validators.required]);
        }else{
          this.pacienteForm.controls['seguimientos'].get('camas').setValidators([Validators.required]);
          this.pacienteForm.controls['seguimientos'].get('no_actual_cama').setValidators(null);
        }
        this.pacienteForm.controls['seguimientos'].get('camas').updateValueAndValidity();
        this.pacienteForm.controls['seguimientos'].get('no_actual_cama').updateValueAndValidity();
        this.pacienteForm.controls['seguimientos'].get('no_actual_cama').enable();
        this.pacienteForm.controls['seguimientos'].get('camas').enable();
        break;
      default:
        break;
    }
  }

  checkAutocompleteCamasValue(field_name) {
    setTimeout(() => {
      if (typeof(this.pacienteForm.controls['seguimientos'].get(field_name).value) != 'object') {
        this.pacienteForm.controls['seguimientos'].get(field_name).reset();
        if(field_name != 'no_actual_cama'){
          this.catalogos['camas'] = false;
          this.actualizarValidacionesCatalogos('camas');  
        }
      } 
    }, 300);
  }

  tipoAtencion(e){
    const servicio = e.option.value;
    (servicio.es_ambulatorio == 1) ? this.pacienteForm.controls['seguimientos'].get('esAmbulatoria').patchValue(1) : this.pacienteForm.controls['seguimientos'].get('esAmbulatoria').patchValue(0);

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

    if(value == 'SEG'){
          
      this.pacienteForm.controls['seguimientos'].get('folio_seguimiento').patchValue(this.folio_seguimiento+'-'+this.authClues.id+'-'+this.authUser.id+'-'+cadena+'-'+'WEB');

    }
    if(value == 'SEG-DIAG'){

      this.folio_seg_diag = this.folio_seguimiento_diagnostico+'-'+this.authClues.id+'-'+this.authUser.id+'-'+cadena+'-'+'WEB'+'-';

    }

  }



  asignarDiagnosticos(event){

    const dato = event.option.value;

    const control = <UntypedFormArray>this.pacienteForm.controls['seguimientos'].get('diagnosticos');
    control.push(this.fb.control(dato));

    this.pacienteForm.controls['seguimientos'].get('diagnostico_id').reset('');

  }

  removeGroup(i: number) {
    const control = <UntypedFormArray>this.pacienteForm.controls['seguimientos'].get('diagnosticos');
    control.removeAt(i);
  }

  savePaciente(){

    this.isLoading = true;

    const formData = JSON.parse(JSON.stringify(this.pacienteForm.value));

    console.log("agaa", formData);

    if(formData.seguimientos.especialidad_id){
      formData.seguimientos.especialidad_id = formData.seguimientos.especialidad_id.id;
    }

    if(formData.seguimientos.estado_actual_id){
      formData.seguimientos.estado_actual_id   = formData.seguimientos.estado_actual_id.id;
    }

    if(formData.seguimientos.factor_covid_id){
      formData.seguimientos.factor_covid_id = formData.seguimientos.factor_covid_id.id;
    }

    if(formData.seguimientos.no_actual_cama){
      
      formData.seguimientos.cama_id                    = formData.seguimientos.no_actual_cama.id;
      formData.seguimientos.estatus_cama_actual_id     = formData.seguimientos.no_actual_cama.estatus_cama_id;
      formData.seguimientos.cama_actual_id             = formData.seguimientos.no_actual_cama.id;
      formData.seguimientos.no_actual_cama             = formData.seguimientos.no_actual_cama.numero;

    }
    if(formData.seguimientos.servicio_actual_id){

      formData.seguimientos.servicio_actual_id   = formData.seguimientos.servicio_actual_id.id;

    }

    if(formData.seguimientos.fecha_seguimiento){

      formData.seguimientos.fecha_seguimiento = moment(formData.seguimientos.fecha_seguimiento).format('YYYY-MM-D');

    }

    // if(formData.seguimientos.diagnosticos.length > 0){

    //   formData.seguimientos.diagnosticos.forEach((element, index) => {
        
    //     this.generar_folio(this.folio_seguimiento_diagnostico);

    //     formData.seguimientos.diagnosticos[index] = {
    //       folio_seguimiento_diagnostico:    this.folio_seg_diag,
    //       diagnostico_id:                   element.id 
    //     };

    //   });

    // }

    const dataSeguimiento = formData.seguimientos;

    const datoGuardado = {
      seguimientos: dataSeguimiento
    };

    this.AtencionPacientesService.createSeguimiento(datoGuardado).subscribe({
      next:(response) => {
        this.isLoading = false;

        this.dialogRef.close();
        const Message = response.messages;
        //this.verPaciente(formData.paciente.id, null);
        this.sharedService.showSnackBar(Message, 'Cerrar', 5000);
        this.router.navigate(['/atencion-pacientes'])
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

  calculateAge() {

      const fecha1 = moment(this.fechaActual);
      const fecha2 = moment(this.pacienteForm.get('fecha_nacimiento').value).format('YYYY-MM-D');
  
      this.pacienteForm.controls['edad'].patchValue(fecha1.diff(fecha2, 'years'));

  }

  calcularGestas(){

    const abortos   = parseInt(this.pacienteForm.get('abortos').value);
    const partos    = parseInt(this.pacienteForm.get('partos').value);
    const cesareas  = parseInt(this.pacienteForm.get('cesareas').value);

    const totalGestas = abortos + partos + cesareas;

    if(this.pacienteForm.get('gestas').value == totalGestas || this.pacienteForm.get('gestas').value == (totalGestas + 1) ){
      
      this.showSnackBar("la sumatoria de abortos, patos y cesarias debe ser igual o mayor a maximo 1 gestación", null, 3000);

    }else{

      this.pacienteForm.get('gestas').patchValue(totalGestas);
      this.showSnackBar("la sumatoria de abortos, patos y cesarias debe ser igual o mayor a maximo 1 gestación", null, 3000);
      
    }

  }


  onNoClick(): void {
    this.dialogRef.close();
  }

}