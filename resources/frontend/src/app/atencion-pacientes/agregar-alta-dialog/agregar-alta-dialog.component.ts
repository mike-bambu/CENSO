import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { startWith, map } from 'rxjs/operators';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { AtencionPacientesService } from '../atencion-pacientes.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedService } from '../../shared/shared.service';
import { Router, ActivatedRoute  } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { Clues } from '../../auth/models/clues';
import { User } from '../../auth/models/user';

import { MatDialog} from '@angular/material/dialog';
import { DetailsComponentPaciente } from '../details-paciente/details-paciente.component';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';


//tamaño de pantalla
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import * as moment from 'moment';

export interface FormDialogData {
  id: number;
}

@Component({
  selector: 'agregar-alta-dialog',
  templateUrl: './agregar-alta-dialog.component.html',
  styleUrls: ['./agregar-alta-dialog.component.css']
})
export class AgregarAltaDialogComponent implements OnInit {

  constructor(
    private AtencionPacientesService: AtencionPacientesService,
    private authService: AuthService,
    public dialogRef: MatDialogRef<AgregarAltaDialogComponent>,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private sharedService: SharedService,
    private route: ActivatedRoute,
    public router: Router,
    private breakpointObserver: BreakpointObserver,
    @Inject(MAT_DIALOG_DATA) public data: FormDialogData
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

  provideID = false;

  fechaActual:any = '';
  diasEstancia:any = '';
  fechaInicial:any = '';
  maxDate:Date;
  minDate:Date;

  pacienteForm:FormGroup;



  catalogos: any = {};
  filteredCatalogs:any = {};

  folio_alta = 'ALT';
  folio_alta_diagnostico = 'SEG-ALT';
  folio_alt_diag = '';

  selectedItemIndex = -1;
  mediaSize: string;
  hora:any = '';

  PuerperaEmbarazada = false;


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
          tieneAtencion:[0],
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
        

        // seguimientos : this.fb.group({
        //   id:[''],
        //   folio_atencion:[''],
        //   folio_seguimiento:[''],
        //   observaciones:['', Validators.required],
        //   no_cama:[''],
        //   codigoMatter:[''],
        //   servicio_id:[''],
        //   atencion_id:[''],
        //   estado_actual_id:['', Validators.required],
        //   especialidad_id:['', Validators.required],
        //   factor_covid_id:['', Validators.required],
        //   diagnostico_id:[''],
        //   diagnosticos:this.fb.array([]),
        // }),

        alta : this.fb.group({

          id:[''],
          folio_atencion:[''],
          folio_alta:[''],
          fecha_alta:['', Validators.required],
          hora_alta:['', Validators.required],
          observaciones:['', Validators.required],
          observaciones_diagnosticos:['', Validators.required],
          esPuerperaEmbarazada:[0],
          dadodeAlta:[1],
          tieneAtencion:[0],
          telefono:[''],
          direccion_completa:[''],
          motivo_egreso_id:[''],
          condicion_egreso_id:[''],
          estado_actual_id:[''],
          metodo_anticonceptivo_id:[''],
          municipio_id:[''],
          municipio:[''],
          localidad_id:[''],
          localidad:[''],
          atencion_id:[''],
          paciente_id:[''],
          
          cama_id:[''],
          servicio_id:[''],
          no_cama:[''],
        
          // diagnostico_id:[''],
          // diagnosticos:this.fb.array([]),
        }),
      
      });


      const id = this.data.id;
      if(id){
        this.isLoading = true;
        this.AtencionPacientesService.getPaciente(id).subscribe(
          response => {
              this.paciente = response.paciente;
              this.paciente.numero_expediente === null || this.paciente.numero_expediente === "" ? this.paciente.numero_expediente = 'NO SE HA REGISTRADO' : this.paciente.numero_expediente;
              this.paciente.curp === null || this.paciente.curp === "" ? this.paciente.curp = 'NO SE HA REGISTRADO' : this.paciente.curp;
              this.paciente.fecha_nacimiento === null || this.paciente.fecha_nacimiento === "" ? this.paciente.fecha_nacimiento = 'NO SE HA REGISTRADO' : this.paciente.fecha_nacimiento;
              this.paciente.telefono_emergencia === null || this.paciente.telefono_emergencia === "" ? this.paciente.telefono_emergencia = 'NO SE HA REGISTRADO' : this.paciente.telefono_emergencia;


              this.pacienteForm.controls['paciente'].patchValue(this.paciente);

              if( this.paciente?.embarazo?.puerperio === 1 || this.paciente?.ultima_atencion?.estaEmbarazada === 1 ){

                this.PuerperaEmbarazada = true;
                this.pacienteForm.controls['alta'].get('esPuerperaEmbarazada').patchValue(1);

              }else{
                this.PuerperaEmbarazada = false;
                this.pacienteForm.controls['alta'].get('esPuerperaEmbarazada').patchValue(0);
              }
              
              this.pacienteForm.controls['alta'].get('hora_alta').patchValue(this.hora);
              this.pacienteForm.controls['alta'].get('fecha_alta').patchValue(this.maxDate);

              if(this.paciente.ultima_atencion != null){

                this.DiasEstanciaHospitalaria(this.paciente?.ultima_atencion?.fecha_inicio_atencion, this.fechaActual)

                this.pacienteForm.controls['ultima_atencion'].patchValue(this.paciente.ultima_atencion);
                this.pacienteForm.controls['alta'].get('atencion_id').patchValue(this.paciente.ultima_atencion.id);
                this.pacienteForm.controls['alta'].get('folio_atencion').patchValue(this.paciente.ultima_atencion.folio_atencion);

                this.pacienteForm.controls['alta'].get('atencion_id').patchValue(this.paciente.ultima_atencion.id);

                this.pacienteForm.controls['alta'].get('paciente_id').patchValue(this.paciente.id);


                if(this.paciente.ultima_atencion?.ultimo_seguimiento != null){

                  this.pacienteForm.controls['alta'].get('cama_id').patchValue(this.paciente.ultima_atencion?.ultimo_seguimiento?.cama_id);
                  this.pacienteForm.controls['alta'].get('servicio_id').patchValue(this.paciente.ultima_atencion?.ultimo_seguimiento?.servicio_id);
                  this.pacienteForm.controls['alta'].get('no_cama').patchValue(this.paciente.ultima_atencion?.ultimo_seguimiento?.no_cama);

                  this.pacienteForm.controls['alta'].get('estado_actual_id').patchValue(this.paciente.ultima_atencion?.ultimo_seguimiento?.estado_actual);
                  this.pacienteForm.controls['alta'].get('observaciones').patchValue(this.paciente?.ultima_atencion?.ultimo_seguimiento?.observaciones);
                  this.pacienteForm.controls['alta'].get('observaciones_diagnosticos').patchValue(this.paciente?.ultima_atencion?.ultimo_seguimiento.observaciones_diagnosticos);


                }else{

                  this.pacienteForm.controls['alta'].get('cama_id').patchValue(this.paciente.ultima_atencion.cama_id);
                  this.pacienteForm.controls['alta'].get('servicio_id').patchValue(this.paciente.ultima_atencion.servicio_id);
                  this.pacienteForm.controls['alta'].get('no_cama').patchValue(this.paciente.ultima_atencion.no_cama);

                  this.pacienteForm.controls['alta'].get('estado_actual_id').patchValue(this.paciente.ultima_atencion?.ultimo_estado_actual);
                  this.pacienteForm.controls['alta'].get('observaciones').patchValue(this.paciente?.ultima_atencion?.indicaciones);
                  this.pacienteForm.controls['alta'].get('observaciones_diagnosticos').patchValue(this.paciente?.ultima_atencion?.motivo_atencion);
                }
                
              }

              this.isLoading = false;
          },
          errorResponse => {
            console.log(errorResponse);
            this.isLoading = false;
          });

          console.log(this.pacienteForm);
          
          
      }


      moment.locale('es');
      const fecha = new Date();
      this.fechaActual = moment(fecha).format('YYYY-MM-D');

      const ahora = moment()
      this.hora = ahora.format("hh:mm a");

      this.minDate = new Date(2021, 0, 1);
      this.maxDate = fecha;


      this.authClues = this.authService.getCluesData();
      this.authUser = this.authService.getUserData();
      this.generar_folio(this.folio_alta);

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
      this.dialogRef.updateSize('80%','80%');
      this.dialogMaxSize = false;
    }
  }


  public IniciarCatalogos(obj:any)
  {
    this.isLoading = true;
    const carga_catalogos = [
      {nombre:'motivos_egresos',orden:'nombre'},
      {nombre:'condiciones_egreso',orden:'nombre'},
      {nombre:'metodos_anticonceptivos',orden:'nombre'},
      {nombre:'estados_actuales',orden:'nombre'},
      {nombre:'municipios',orden:'nombre',filtro_id:{campo:'entidades_id',valor:7}},
      //{nombre:'diagnosticos',orden:'nombre'},
    ];

    this.AtencionPacientesService.obtenerCatalogos(carga_catalogos).subscribe(
      response => {

        this.catalogos = response.data;

        this.filteredCatalogs['motivos_egresos']         = this.pacienteForm.controls['alta'].get('motivo_egreso_id').valueChanges.pipe(startWith(''),map(value => this._filter(value,'motivos_egresos','nombre')));
        this.filteredCatalogs['estados_actuales']        = this.pacienteForm.controls['alta'].get('estado_actual_id').valueChanges.pipe(startWith(''),map(value => this._filter(value,'estados_actuales','nombre')));
        this.filteredCatalogs['condiciones_egreso']      = this.pacienteForm.controls['alta'].get('condicion_egreso_id').valueChanges.pipe(startWith(''),map(value => this._filter(value,'condiciones_egreso','nombre')));
        this.filteredCatalogs['metodos_anticonceptivos'] = this.pacienteForm.controls['alta'].get('metodo_anticonceptivo_id').valueChanges.pipe(startWith(''),map(value => this._filter(value,'metodos_anticonceptivos','nombre')));
        this.filteredCatalogs['municipios']              = this.pacienteForm.controls['alta'].get('municipio_id').valueChanges.pipe(startWith(''),map(value => this._filter(value,'municipios','nombre')));
        this.filteredCatalogs['localidades']             = this.pacienteForm.controls['alta'].get('localidad_id').valueChanges.pipe(startWith(''),map(value => this._filter(value,'localidades','nombre')));

        //this.filteredCatalogs['diagnosticos']            = this.pacienteForm.controls['alta'].get('diagnostico_id').valueChanges.pipe(startWith(''),map(value => this._filter(value,'diagnosticos','nombre')));


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

    if(value == 'ALT'){
          
      this.pacienteForm.controls['alta'].get('folio_alta').patchValue(this.folio_alta+'-'+this.authClues.id+'-'+this.authUser.id+'-'+cadena+'-'+'WEB');

    }

    // if(value == 'SEG-ALT'){

    //   this.folio_alt_diag = this.folio_alta_diagnostico+'-'+this.authClues.id+'-'+this.authUser.id+'-'+cadena+'-'+'WEB'+'-';

    // }

  }

  datosPuerperio(event: MatSlideToggleChange){

    if(event.checked){

      this.PuerperaEmbarazada = true;
      //this.pacienteForm.controls['atencion'].reset();

      this.pacienteForm.controls['alta'].get('esPuerperaEmbarazada').patchValue(1);

      this.pacienteForm.controls['alta'].get('telefono').patchValue('');
      this.pacienteForm.controls['alta'].get('telefono').setValidators([Validators.required]);
      this.pacienteForm.controls['alta'].get('telefono').updateValueAndValidity();

      this.pacienteForm.controls['alta'].get('direccion_completa').patchValue('');
      this.pacienteForm.controls['alta'].get('direccion_completa').setValidators([Validators.required]);
      this.pacienteForm.controls['alta'].get('direccion_completa').updateValueAndValidity();

      this.pacienteForm.controls['alta'].get('condicion_egreso_id').patchValue('');
      this.pacienteForm.controls['alta'].get('condicion_egreso_id').setValidators([Validators.required]);
      this.pacienteForm.controls['alta'].get('condicion_egreso_id').updateValueAndValidity();

      this.pacienteForm.controls['alta'].get('metodo_anticonceptivo_id').patchValue('');
      this.pacienteForm.controls['alta'].get('metodo_anticonceptivo_id').setValidators([Validators.required]);
      this.pacienteForm.controls['alta'].get('metodo_anticonceptivo_id').updateValueAndValidity();

      this.pacienteForm.controls['alta'].get('municipio').patchValue('');
      this.pacienteForm.controls['alta'].get('municipio').setValidators([Validators.required]);
      this.pacienteForm.controls['alta'].get('municipio').updateValueAndValidity();

      this.pacienteForm.controls['alta'].get('municipio_id').patchValue('');
      this.pacienteForm.controls['alta'].get('municipio_id').setValidators([Validators.required]);
      this.pacienteForm.controls['alta'].get('municipio_id').updateValueAndValidity();
      
      this.pacienteForm.controls['alta'].get('localidad').patchValue('');
      this.pacienteForm.controls['alta'].get('localidad').setValidators([Validators.required]);
      this.pacienteForm.controls['alta'].get('localidad').updateValueAndValidity();

      this.pacienteForm.controls['alta'].get('localidad_id').patchValue('');
      this.pacienteForm.controls['alta'].get('localidad_id').setValidators([Validators.required]);
      this.pacienteForm.controls['alta'].get('localidad_id').updateValueAndValidity();

      

    }else{

      this.PuerperaEmbarazada = false;

      this.pacienteForm.controls['alta'].get('esPuerperaEmbarazada').patchValue(0);

      this.pacienteForm.controls['alta'].get('telefono').patchValue('');
      this.pacienteForm.controls['alta'].get('telefono').clearValidators();
      this.pacienteForm.controls['alta'].get('telefono').updateValueAndValidity();

      this.pacienteForm.controls['alta'].get('direccion_completa').patchValue('');
      this.pacienteForm.controls['alta'].get('direccion_completa').clearValidators();
      this.pacienteForm.controls['alta'].get('direccion_completa').updateValueAndValidity();

      this.pacienteForm.controls['alta'].get('condicion_egreso_id').patchValue('');
      this.pacienteForm.controls['alta'].get('condicion_egreso_id').clearValidators();
      this.pacienteForm.controls['alta'].get('condicion_egreso_id').updateValueAndValidity();

      this.pacienteForm.controls['alta'].get('metodo_anticonceptivo_id').patchValue('');
      this.pacienteForm.controls['alta'].get('metodo_anticonceptivo_id').clearValidators();
      this.pacienteForm.controls['alta'].get('metodo_anticonceptivo_id').updateValueAndValidity();

      this.pacienteForm.controls['alta'].get('municipio').patchValue('');
      this.pacienteForm.controls['alta'].get('municipio').clearValidators();
      this.pacienteForm.controls['alta'].get('municipio').updateValueAndValidity();

      this.pacienteForm.controls['alta'].get('municipio_id').patchValue('');
      this.pacienteForm.controls['alta'].get('municipio_id').clearValidators();
      this.pacienteForm.controls['alta'].get('municipio_id').updateValueAndValidity();

      this.pacienteForm.controls['alta'].get('localidad').patchValue('');
      this.pacienteForm.controls['alta'].get('localidad').clearValidators();
      this.pacienteForm.controls['alta'].get('localidad').updateValueAndValidity();

      this.pacienteForm.controls['alta'].get('localidad_id').patchValue('');
      this.pacienteForm.controls['alta'].get('localidad_id').clearValidators();
      this.pacienteForm.controls['alta'].get('localidad_id').updateValueAndValidity();

    }

  }

  checkAutocompleteValue(field_name) {
    setTimeout(() => {
      if (typeof(this.pacienteForm.controls['alta'].get(field_name).value) != 'object') {
        this.pacienteForm.controls['alta'].get(field_name).reset();
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
          this.pacienteForm.controls['alta'].get('municipio').setValidators(null);
          this.pacienteForm.controls['alta'].get('municipio_id').setValidators([Validators.required]);
        }else{
          this.pacienteForm.controls['alta'].get('municipio').setValidators([Validators.required]);
          this.pacienteForm.controls['alta'].get('municipio_id').setValidators(null);
        }
        this.pacienteForm.controls['alta'].get('municipio').updateValueAndValidity();
        this.pacienteForm.controls['alta'].get('municipio_id').updateValueAndValidity();
        break;
      case 'localidades':
        if(this.catalogos['localidades']){
          this.pacienteForm.controls['alta'].get('localidad').setValidators(null);
          this.pacienteForm.controls['alta'].get('localidad_id').setValidators([Validators.required]);
        }else{
          this.pacienteForm.controls['alta'].get('localidad').setValidators([Validators.required]);
          this.pacienteForm.controls['alta'].get('localidad_id').setValidators(null);
        }    
        this.pacienteForm.controls['alta'].get('localidad').updateValueAndValidity();
        this.pacienteForm.controls['alta'].get('localidad_id').updateValueAndValidity();
        break;
      default:
        break;
    }
  }

  cargarLocalidades(event){
    
    this.isLoading = true;
    const municipio = event.option.value;

    const carga_catalogos = [
      {nombre:'localidades',orden:'nombre',filtro_id:{campo:'municipios_id',valor:municipio.id}},
    ];
    this.catalogos['localidades'] = false;
    this.pacienteForm.controls['alta'].get('localidad_id').reset();
    this.pacienteForm.controls['alta'].get('localidad').reset();

    this.AtencionPacientesService.obtenerCatalogos(carga_catalogos).subscribe(
      response => {
        if(response.data['localidades'].length > 0){
          this.catalogos['localidades'] = response.data['localidades'];
        }
        
        this.actualizarValidacionesCatalogos('localidades');
        this.isLoading = false;
      }
    );
  }

  savePaciente(){

    this.isLoading = true;

    const formData = JSON.parse(JSON.stringify(this.pacienteForm.value));

    formData.alta.paciente_id = this.pacienteForm.controls['paciente'].value.id;

    if(formData.alta.motivo_egreso_id){
      formData.alta.motivo_egreso_id = formData.alta.motivo_egreso_id.id;
    }

    if(formData.alta.no_cama){
      formData.alta.no_cama = formData.alta.no_cama.numero;
    }

    if(formData.alta.estado_actual_id){
      formData.alta.estado_actual_id = formData.alta.estado_actual_id.id;
    }

    if(formData.alta.condicion_egreso_id){
      formData.alta.condicion_egreso_id = formData.alta.condicion_egreso_id.id;
    }

    if(formData.alta.metodo_anticonceptivo_id){
      formData.alta.metodo_anticonceptivo_id = formData.alta.metodo_anticonceptivo_id.id;
    }

    if(formData.alta.municipio_id){
      formData.alta.municipio_id = formData.alta.municipio_id.id;
    }

    if(formData.alta.localidad_id){
      formData.alta.localidad_id = formData.alta.localidad_id.id;
    }

    if(formData.alta.fecha_alta){
      formData.alta.fecha_alta = moment(formData.alta.fecha_alta).format('YYYY-MM-D');

    }

    // console.log(formData);

    // if(formData.alta.diagnosticos.length > 0){

    //   formData.alta.diagnosticos.forEach((element, index) => {
        
    //     this.generar_folio(this.folio_alta_diagnostico);

    //     formData.alta.diagnosticos[index] = {
    //       folio_alta_diagnostico:    formData.alta.folio_alta,
    //       diagnostico_id:            element.id 
    //     };

    //   });

    // }



    const dataAlta = formData.alta;

    const datoGuardado = {
      alta: dataAlta
    };


    this.AtencionPacientesService.createAlta(datoGuardado).subscribe(
      response =>{

        this.isLoading = false;

        this.dialogRef.close();
        const Message = response.messages;
        //this.verPaciente(formData.paciente.id, null);
        this.sharedService.showSnackBar(Message, 'Cerrar', 3000);
        this.router.navigate(['/atencion-pacientes'])
        .then(() => {
          window.location.reload();
        });
    },
      errorResponse => {
        console.log(errorResponse);
        this.isLoading = false;
    });

    
  }

  asignarDiagnosticos(event){

    const dato = event.option.value;

    const control = <FormArray>this.pacienteForm.controls['alta'].get('diagnosticos');
    control.push(this.fb.control(dato));

    this.pacienteForm.controls['alta'].get('diagnostico_id').reset('');

  }

  removeGroup(i: number) {
    const control = <FormArray>this.pacienteForm.controls['alta'].get('diagnosticos');
    control.removeAt(i);
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