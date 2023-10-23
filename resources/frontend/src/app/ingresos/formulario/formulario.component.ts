import { Component, ElementRef, OnInit, ViewChild, } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { UntypedFormGroup, Validators, FormBuilder} from '@angular/forms';
import { IngresosService } from '../ingresos.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatDialog } from '@angular/material/dialog';
import { SharedService } from '../../shared/shared.service';
import { Router, ActivatedRoute  } from '@angular/router';
import { startWith, map } from 'rxjs/operators';
import { AuthService } from '../../auth/auth.service';
import { Clues } from '../../auth/models/clues';
import { User } from '../../auth/models/user';

import { ConfirmActionDialogComponent } from '../confirm-action-dialog/confirm-action-dialog.component';

import * as moment from 'moment';


// export interface FormDialogData {
//   id: number;
// }

@Component({
  selector: 'formulario-ingresos',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class FormularioComponentPacientes implements OnInit {

  constructor(
    private ingresosService: IngresosService,
    private authService: AuthService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private sharedService: SharedService,
    public router: Router,
    private el: ElementRef
  ) {}

  showSnackBar(message, action, duration){
    this.snackBar.open(message, action,{
      duration: duration
    });
  }

  @ViewChild('nombre') nombre;
  @ViewChild('showFormAtencion') showFormAtencion;

  pacienteForm:UntypedFormGroup;

  authClues: Clues;
  authUser: User;

  desconocido = false;
  extranjero = false;

  localidadesIsLoading = false;
  isLoading = false;

  provideID = false;
  persona:any = {};
  fechaActual:any = '';
  hora:any = '';
  fechaInicial:any = '';
  minDate:any = '';
  maxDate:any = '';

  checkedEx = false;
  checkedEm = false;
  checkedRef = false;

  cluesIsLoading = false;

  actualizarFolio = true;

  catalogos: any = {};
  filteredCatalogs:any = {};
  catalogo_horarios:any = [];

  persona_id = 0;
  pageSize = 20;

  mediaSize: string;

  folio_paciente = 'PAC';
  folio_atencion = 'ATN';

  es_ingreso = false;

  mostrar_municipio_localidad = false;

  genero:any = [
    { id:1, tipo: "Femenino"},
    { id:2, tipo: "Masculino"},
  ];

              

  
  ngOnInit() {

    this.pacienteForm = this.fb.group ({
    
      pacientes: this.fb.group({

        id:[''],
        folio_paciente:[''],
        numero_expediente:[''],
        tieneAtencion:[0],
        nombre:['',Validators.required],
        paterno:['',Validators.required],
        materno:[''],
        tipo_edad:[''],
        edad:['',Validators.required],
        sexo:['',Validators.required],
        fecha_nacimiento:[''],
        //curp:['', Validators.pattern(/^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/)],
        curp:['', [Validators.minLength(18), Validators.required]],
        
        estado_republica_id:['', Validators.required],
        estado_republica:[''],
        municipio_id:['',Validators.required],
        municipio:[''],
        localidad:[''],
        localidad_id:['',Validators.required],
        esDesconocido:[0],
        alias:[''],
        edad_aparente:[''],
        esExtranjero:[0],
        pais:[''],
        pais_origen_id:[''],
        telefono_emergencia:['', Validators.required],
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



    this.route.params.subscribe(params => {
      
        this.persona_id = params['id'];
        if(this.persona_id){
          this.es_ingreso = false;
          this.actualizarFolio = false;
          this.obtenerPersona();
        }

    });

    this.authClues = this.authService.getCluesData();
    this.authUser = this.authService.getUserData();
    this.pacienteForm.controls['pacientes'].get('user_id').patchValue(this.authUser.id);
    
    this.generar_folio(this.folio_paciente);

    //this.getLugares();

    

    moment.locale('es');
    const fecha = new Date();
    fecha.setHours(0, 0, 0, 0);
    this.fechaActual = moment(fecha).format('YYYY-MM-D');

    const ahora = moment()
    this.hora = ahora.format("hh:mm a");

    this.minDate = new Date(2021, 0, 1);
    this.maxDate = fecha;

    this.IniciarCatalogos(null);

    console.log("valido", this.pacienteForm);


  }

  public IniciarCatalogos(obj:any)
  {
    this.isLoading = true;
    const carga_catalogos = [
      {nombre:'paises',orden:'nombre'},
      {nombre:'municipios',orden:'nombre',filtro_id:{campo:'entidades_id',valor:7}},
      {nombre:'estados_republica',orden:'id'},
      {nombre:'estados_actuales',orden:'nombre'},
      {nombre:'metodos_gestacionales',orden:'id'},
      //{nombre:'metodos_anticonceptivos', orden:'id'},
      {nombre:'clues', orden:'nombre'},
      //{nombre:'servicios',orden:'nombre', filtro_id:{campo:'clues_id',valor:this.authClues ? this.authClues.id : ''}, filtro_secundario_id:{campo:'es_ambulatorio',valor: 1}},
      { nombre:'servicios',orden:'id', filtro_id:{campo:'clues_id',valor:this.authClues ? this.authClues.id : ''} },
    ];

    this.ingresosService.obtenerCatalogos(carga_catalogos).subscribe(
      response => {

        this.catalogos = response.data;

        this.filteredCatalogs['paises']                  = this.pacienteForm.controls['pacientes'].get('municipio_id').valueChanges.pipe(startWith(''),map(value => this._filter(value,'paises','nombre')));
        this.filteredCatalogs['estados_republica']       = this.pacienteForm.controls['pacientes'].get('estado_republica_id').valueChanges.pipe(startWith(''),map(value => this._filter(value,'estados_republica','nombre')));
        this.filteredCatalogs['municipios']              = this.pacienteForm.controls['pacientes'].get('municipio_id').valueChanges.pipe(startWith(''),map(value => this._filter(value,'municipios','nombre')));
        this.filteredCatalogs['localidades']             = this.pacienteForm.controls['pacientes'].get('localidad_id').valueChanges.pipe(startWith(''),map(value => this._filter(value,'localidades','nombre')));

        this.filteredCatalogs['estados_actuales']        = this.pacienteForm.controls['atencion'].get('estado_actual_id').valueChanges.pipe(startWith(''),map(value => this._filter(value,'estados_actuales','nombre')));
        this.filteredCatalogs['servicios']               = this.pacienteForm.controls['atencion'].get('servicio_id').valueChanges.pipe(startWith(''),map(value => this._filter(value,'servicios','nombre')));
        this.filteredCatalogs['camas']                   = this.pacienteForm.controls['atencion'].get('no_cama').valueChanges.pipe(startWith(''),map(value => this._filter(value,'camas','descripcion')));

        this.filteredCatalogs['metodos_gestacionales']   = this.pacienteForm.controls['embarazo'].get('metodo_gestacional_id').valueChanges.pipe(startWith(''),map(value => this._filter(value,'metodos_gestacionales','nombre')));
        this.filteredCatalogs['clues_referencia']        = this.pacienteForm.controls['embarazo'].get('clues_referencia_id').valueChanges.pipe(startWith(''),map(value => this._filter(value,'clues','nombre')));


        if(obj)
        {
          if(obj.localidad && obj.municipio){
            console.log("asdasd", obj);
            this.pacienteForm.controls['pacientes'].get('municipio_id').setValue(obj.municipio);
            this.pacienteForm.controls['pacientes'].get('localidad').setValue(obj.localidad.nombre);
            this.pacienteForm.controls['pacientes'].get('localidad_id').setValue(obj.localidad);
          }
          if(obj.pais_origen){

            this.pacienteForm.controls['pacientes'].get('pais_origen_id').setValue(obj.pais_origen);
            this.desactivarValidacionesMunicipioLocalidad();

          }
          if(obj.estado_republica){

            this.pacienteForm.controls['pacientes'].get('estado_republica_id').setValue(obj.estado_republica);
            this.desactivarValidacionesMunicipioLocalidad();

          }
          if(obj.ultima_atencion != null){

            this.pacienteForm.controls['atencion'].get('estado_actual_id').patchValue(obj.ultima_atencion.estado_actual);

          }

          //this.valor_unidad = parseInt(obj.tipo_unidad_id);
        }
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
  


  obtenerPersona():void{
    this.isLoading = true;

    this.ingresosService.getPaciente(this.persona_id).subscribe({
      next:(response) => {
        this.persona = response.paciente;

        if(this.persona.esDesconocido == 1){
          this.desconocido = true;
          
          this.asignarAlias(1);
        }else{
          this.desconocido = false;
          this.asignarAlias(0);
        }

        if(this.persona.esExtranjero == 1){
          this.extranjero = true;
          this.es_extranjero(1);
        }else{
          this.extranjero = false;
          this.mostrar_municipio_localidad = true;
          this.es_extranjero(0);
        }

        

        this.pacienteForm.controls['pacientes'].patchValue(response.paciente);
        this.pacienteForm.controls['atencion'].reset();

        //if(response.paciente.ultima_atencion != null){

          //this.Ambulatorio = true;
        //   this.pacienteForm.controls['atencion'].patchValue(response.paciente.ultima_atencion);

        // }
        


        this.calculateAge();
        this.IniciarCatalogos(response.paciente);

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
      complete:() =>{
        this.isLoading = true;
        this.sharedService.showSnackBar('¡Edición de Datos del Paciente!', 'Cerrar', 3000);
        this.isLoading = false;
      }
    });

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

    if(value == 'PAC'){
      this.pacienteForm.controls['pacientes'].get('folio_paciente').patchValue(this.folio_paciente+'-'+this.authClues.id+'-'+this.authUser.id+'-'+cadena+'-'+'WEB');
    }
    if(value == 'ATN'){

      this.pacienteForm.controls['atencion'].get('folio_atencion').patchValue(this.folio_atencion+'-'+this.authClues.id+'-'+this.authUser.id+'-'+cadena+'-'+'WEB');

    }

}


  numberOnly(event): boolean {

    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  EsIngreso(event: MatSlideToggleChange){

    if(event.checked){

      this.es_ingreso = true;
      this.pacienteForm.controls['atencion'].enable();
      this.pacienteForm.controls['atencion'].reset();
      //this.showAtencion.open();
      this.generar_folio(this.folio_atencion);
      this.pacienteForm.controls['pacientes'].get('tieneAtencion').patchValue(1);
      //this.pacienteForm.controls['atencion'].get('esAmbulatoria').patchValue(1);
      this.pacienteForm.controls['atencion'].get('dadodeAlta').patchValue(0);
      this.pacienteForm.controls['atencion'].get('clues_id').patchValue(this.authClues.id);
      this.pacienteForm.controls['atencion'].get('fecha_inicio_atencion').patchValue(this.maxDate);
      this.pacienteForm.controls['atencion'].get('hora').patchValue(this.hora);
      this.pacienteForm.controls['atencion'].get('motivo_atencion').setValidators([Validators.required]);
      this.pacienteForm.controls['atencion'].get('indicaciones').setValidators([Validators.required]);

      

    }else{

      this.es_ingreso = false;   
      
      this.pacienteForm.controls['pacientes'].get('tieneAtencion').patchValue(0);
      //this.showAtencion.close();
      this.pacienteForm.controls['atencion'].get('esAmbulatoria').patchValue('');
      this.pacienteForm.controls['atencion'].get('folio_atencion').patchValue('');
      this.pacienteForm.controls['atencion'].get('clues_id').patchValue('');
      this.pacienteForm.controls['atencion'].get('fecha_inicio_atencion').patchValue('');
      this.pacienteForm.controls['atencion'].get('hora').patchValue('');
      this.pacienteForm.controls['atencion'].get('motivo_atencion').patchValue('');
      this.pacienteForm.controls['atencion'].get('indicaciones').patchValue('');
      this.pacienteForm.controls['atencion'].get('estado_actual_id').patchValue('');
      this.pacienteForm.controls['atencion'].get('estado_actual_id').clearValidators();
      this.pacienteForm.controls['atencion'].get('estado_actual_id').updateValueAndValidity();
      this.pacienteForm.controls['atencion'].get('motivo_atencion').clearValidators();
      this.pacienteForm.controls['atencion'].get('motivo_atencion').updateValueAndValidity();
      this.pacienteForm.controls['atencion'].get('indicaciones').clearValidators();
      this.pacienteForm.controls['atencion'].get('indicaciones').updateValueAndValidity();
      this.pacienteForm.controls['atencion'].get('no_cama').clearValidators();
      this.pacienteForm.controls['atencion'].get('servicio_id').clearValidators();
      this.pacienteForm.controls['atencion'].updateValueAndValidity();
      this.pacienteForm.controls['atencion'].clearValidators();
      this.pacienteForm.controls['atencion'].reset();


    }

  }

  checkAutocompleteValue(field_name) {
    setTimeout(() => {
      if (typeof(this.pacienteForm.controls['pacientes'].get(field_name).value) != 'object') {
        this.pacienteForm.controls['pacientes'].get(field_name).reset();
        if(field_name != 'localidad_id'){
          this.catalogos['localidades'] = false;
          this.actualizarValidacionesCatalogos('localidades');  
        }
      } 
    }, 300);
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

  tipoAtencion(e){
    const servicio = e.option.value;
    (servicio.es_ambulatorio == 1) ? this.pacienteForm.controls['atencion'].get('esAmbulatoria').patchValue(1) : this.pacienteForm.controls['atencion'].get('esAmbulatoria').patchValue(0);
  }

  actualizarValidacionesCatalogos(catalogo){
    switch (catalogo) {
      case 'municipios':
        if(this.catalogos['municipios']){
          this.pacienteForm.controls['pacientes'].get('municipio').setValidators(null);
          this.pacienteForm.controls['pacientes'].get('municipio_id').setValidators([Validators.required]);
        }else{
          this.pacienteForm.controls['pacientes'].get('municipio').setValidators([Validators.required]);
          this.pacienteForm.controls['pacientes'].get('municipio_id').setValidators(null);
        }
        this.pacienteForm.controls['pacientes'].get('municipio').updateValueAndValidity();
        this.pacienteForm.controls['pacientes'].get('municipio_id').updateValueAndValidity();
        break;
      case 'localidades':
        if(this.catalogos['localidades']){
          this.pacienteForm.controls['pacientes'].get('localidad').setValidators(null);
          this.pacienteForm.controls['pacientes'].get('localidad_id').setValidators([Validators.required]);
        }else{
          this.pacienteForm.controls['pacientes'].get('localidad').setValidators([Validators.required]);
          this.pacienteForm.controls['pacientes'].get('localidad_id').setValidators(null);
        }    
        this.pacienteForm.controls['pacientes'].get('localidad').updateValueAndValidity();
        this.pacienteForm.controls['pacientes'].get('localidad_id').updateValueAndValidity();
        break;
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

  cargarMunicipios(event){

    this.isLoading = true;
    const municipio = event.option.value;

    const carga_catalogos = [
      {nombre:'municipios',orden:'nombre',filtro_id:{campo:'entidades_id',valor:municipio}},
    ];
    this.catalogos['municipios'] = false;
    this.catalogos['localidades'] = false;

     this.pacienteForm.controls['pacientes'].get('municipio_id').reset();
     this.pacienteForm.controls['pacientes'].get('municipio').reset();
     this.pacienteForm.controls['pacientes'].get('localidad_id').reset();
     this.pacienteForm.controls['pacientes'].get('localidad').reset();

    this.ingresosService.obtenerCatalogos(carga_catalogos).subscribe(
      response => {
        if(response.data['municipios'].length > 0){
          this.catalogos['municipios'] = response.data['municipios'];
          
          this.mostrar_municipio_localidad = true;

          this.actualizarValidacionesCatalogos('municipios');
          this.actualizarValidacionesCatalogos('localidades');

        }else{

          this.desactivarValidacionesMunicipioLocalidad();

        }
        this.isLoading = false;
      }
    );
  }

  desactivarValidacionesMunicipioLocalidad(){

    this.mostrar_municipio_localidad = false;

    
    this.pacienteForm.controls['pacientes'].get('municipio_id').reset();
    this.pacienteForm.controls['pacientes'].get('municipio_id').clearValidators();
    this.pacienteForm.controls['pacientes'].get('municipio_id').updateValueAndValidity();

    this.pacienteForm.controls['pacientes'].get('municipio').reset();
    this.pacienteForm.controls['pacientes'].get('municipio').clearValidators();
    this.pacienteForm.controls['pacientes'].get('municipio').updateValueAndValidity();

    this.pacienteForm.controls['pacientes'].get('localidad_id').reset();
    this.pacienteForm.controls['pacientes'].get('localidad_id').clearValidators();
    this.pacienteForm.controls['pacientes'].get('localidad_id').updateValueAndValidity();

    this.pacienteForm.controls['pacientes'].get('localidad').reset();
    this.pacienteForm.controls['pacientes'].get('localidad').clearValidators();
    this.pacienteForm.controls['pacientes'].get('localidad').updateValueAndValidity();

  }

  cargarLocalidades(event){
    
    this.isLoading = true;
    const municipio = event.option.value;

    const carga_catalogos = [
      {nombre:'localidades',orden:'nombre',filtro_id:{campo:'municipios_id',valor:municipio.id}},
    ];
    this.catalogos['localidades'] = false;
    this.pacienteForm.controls['pacientes'].get('localidad_id').reset();
    this.pacienteForm.controls['pacientes'].get('localidad').reset();

    this.ingresosService.obtenerCatalogos(carga_catalogos).subscribe(
      response => {
        if(response.data['localidades'].length > 0){
          this.catalogos['localidades'] = response.data['localidades'];
        }
        
        this.actualizarValidacionesCatalogos('localidades');
        this.isLoading = false;
      }
    );
  }

  cargarCamas(event){

    this.isLoading = true;
    const servicio = event.option.value;

    const carga_catalogos = [
      {nombre:'camas',orden:'numero',filtro_id:{campo:'servicio_id',valor:servicio.id},filtro_secundario_id:{campo:'estatus_cama_id',valor: 1}},
    ];

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
      }
    );

  }

  asignarAlias(value){

    if(value == 1){

      this.desconocido = true;

      this.pacienteForm.controls['pacientes'].get('esDesconocido').patchValue(value);

      this.pacienteForm.controls['pacientes'].get('nombre').patchValue('');
      this.pacienteForm.controls['pacientes'].get('nombre').clearValidators();
      this.pacienteForm.controls['pacientes'].get('nombre').updateValueAndValidity();
    
      this.pacienteForm.controls['pacientes'].get('paterno').patchValue('');
      this.pacienteForm.controls['pacientes'].get('paterno').clearValidators();
      this.pacienteForm.controls['pacientes'].get('paterno').updateValueAndValidity();
      

      this.pacienteForm.controls['pacientes'].get('materno').patchValue('');
      this.pacienteForm.controls['pacientes'].get('materno').clearValidators();
      this.pacienteForm.controls['pacientes'].get('materno').updateValueAndValidity();

      this.pacienteForm.controls['pacientes'].get('edad').patchValue('');
      this.pacienteForm.controls['pacientes'].get('edad').clearValidators();
      this.pacienteForm.controls['pacientes'].get('edad').updateValueAndValidity();

      this.pacienteForm.controls['pacientes'].get('telefono_emergencia').patchValue('');
      this.pacienteForm.controls['pacientes'].get('telefono_emergencia').clearValidators();
      this.pacienteForm.controls['pacientes'].get('telefono_emergencia').updateValueAndValidity();

      this.pacienteForm.controls['pacientes'].get('sexo').patchValue('');
      this.pacienteForm.controls['pacientes'].get('sexo').setValidators([Validators.required]);
      this.pacienteForm.controls['pacientes'].get('sexo').updateValueAndValidity();

      this.pacienteForm.controls['pacientes'].get('fecha_nacimiento').patchValue('');
      this.pacienteForm.controls['pacientes'].get('fecha_nacimiento').clearValidators();
      this.pacienteForm.controls['pacientes'].get('fecha_nacimiento').updateValueAndValidity();

      this.pacienteForm.controls['pacientes'].get('municipio').patchValue('');
      this.pacienteForm.controls['pacientes'].get('municipio').clearValidators();
      this.pacienteForm.controls['pacientes'].get('municipio').updateValueAndValidity();

      this.pacienteForm.controls['pacientes'].get('municipio_id').patchValue('');
      this.pacienteForm.controls['pacientes'].get('municipio_id').clearValidators();
      this.pacienteForm.controls['pacientes'].get('municipio_id').updateValueAndValidity();

      this.pacienteForm.controls['pacientes'].get('localidad').patchValue('');
      this.pacienteForm.controls['pacientes'].get('localidad').clearValidators();
      this.pacienteForm.controls['pacientes'].get('localidad').updateValueAndValidity();

      this.pacienteForm.controls['pacientes'].get('localidad_id').patchValue('');
      this.pacienteForm.controls['pacientes'].get('localidad_id').clearValidators();
      this.pacienteForm.controls['pacientes'].get('localidad_id').updateValueAndValidity();

      this.pacienteForm.controls['pacientes'].get('estado_republica_id').patchValue('');
      this.pacienteForm.controls['pacientes'].get('estado_republica_id').clearValidators();
      this.pacienteForm.controls['pacientes'].get('estado_republica_id').updateValueAndValidity();

      this.pacienteForm.controls['pacientes'].get('curp').patchValue('');
      this.pacienteForm.controls['pacientes'].get('curp').clearValidators();
      this.pacienteForm.controls['pacientes'].get('curp').updateValueAndValidity();


      this.pacienteForm.controls['pacientes'].get('alias').setValidators([Validators.required]);
      this.pacienteForm.controls['pacientes'].get('alias').updateValueAndValidity();

      this.pacienteForm.controls['pacientes'].get('tipo_edad').patchValue('');
      this.pacienteForm.controls['pacientes'].get('tipo_edad').patchValue('Años');      

      this.pacienteForm.controls['pacientes'].get('edad_aparente').setValidators([Validators.required]);
      this.pacienteForm.controls['pacientes'].get('edad_aparente').updateValueAndValidity();

      //console.log("asd", this.pacienteForm.controls['pacientes'].value);


    }else{

      this.desconocido = false;

      this.pacienteForm.controls['pacientes'].get('esDesconocido').patchValue(value);

      this.pacienteForm.controls['pacientes'].get('nombre').patchValue('');
      this.pacienteForm.controls['pacientes'].get('nombre').setValidators([Validators.required]);
      this.pacienteForm.controls['pacientes'].get('nombre').updateValueAndValidity();

      this.pacienteForm.controls['pacientes'].get('paterno').patchValue('');
      this.pacienteForm.controls['pacientes'].get('paterno').setValidators([Validators.required]);
      this.pacienteForm.controls['pacientes'].get('paterno').updateValueAndValidity();

      this.pacienteForm.controls['pacientes'].get('materno').patchValue('');
      // this.pacienteForm.controls['pacientes'].get('materno').setValidators([Validators.required]);
      this.pacienteForm.controls['pacientes'].get('materno').updateValueAndValidity();

      this.pacienteForm.controls['pacientes'].get('telefono_emergencia').patchValue('');
      this.pacienteForm.controls['pacientes'].get('telefono_emergencia').setValidators([Validators.required]);
      this.pacienteForm.controls['pacientes'].get('telefono_emergencia').updateValueAndValidity();

      this.pacienteForm.controls['pacientes'].get('curp').patchValue('');
      this.pacienteForm.controls['pacientes'].get('curp').setValidators([Validators.required]);
      this.pacienteForm.controls['pacientes'].get('curp').updateValueAndValidity();

      this.pacienteForm.controls['pacientes'].get('edad').patchValue('');
      this.pacienteForm.controls['pacientes'].get('edad').setValidators([Validators.required]);
      this.pacienteForm.controls['pacientes'].get('edad').updateValueAndValidity();

      this.pacienteForm.controls['pacientes'].get('sexo').patchValue('');
      this.pacienteForm.controls['pacientes'].get('sexo').setValidators([Validators.required]);
      this.pacienteForm.controls['pacientes'].get('sexo').updateValueAndValidity();

      this.pacienteForm.controls['pacientes'].get('fecha_nacimiento').patchValue('');
      this.pacienteForm.controls['pacientes'].get('fecha_nacimiento').setValidators([Validators.required]);
      this.pacienteForm.controls['pacientes'].get('fecha_nacimiento').updateValueAndValidity();

      this.pacienteForm.controls['pacientes'].get('municipio_id').patchValue('');
      this.pacienteForm.controls['pacientes'].get('municipio_id').setValidators([Validators.required]);
      this.pacienteForm.controls['pacientes'].get('municipio_id').updateValueAndValidity();

      this.pacienteForm.controls['pacientes'].get('localidad_id').patchValue('');
      this.pacienteForm.controls['pacientes'].get('localidad_id').setValidators([Validators.required]);
      this.pacienteForm.controls['pacientes'].get('localidad_id').updateValueAndValidity();

      this.pacienteForm.controls['pacientes'].get('alias').patchValue('');
      this.pacienteForm.controls['pacientes'].get('alias').clearValidators();
      this.pacienteForm.controls['pacientes'].get('alias').updateValueAndValidity();

      this.pacienteForm.controls['pacientes'].get('tipo_edad').patchValue('');
      this.pacienteForm.controls['pacientes'].get('tipo_edad').clearValidators();
      this.pacienteForm.controls['pacientes'].get('tipo_edad').updateValueAndValidity();

      this.pacienteForm.controls['pacientes'].get('edad_aparente').patchValue('');
      this.pacienteForm.controls['pacientes'].get('edad_aparente').clearValidators();
      this.pacienteForm.controls['pacientes'].get('edad_aparente').updateValueAndValidity();

      this.pacienteForm.controls['pacientes'].get('pais_origen_id').patchValue('');
      this.pacienteForm.controls['pacientes'].get('pais_origen_id').clearValidators();
      this.pacienteForm.controls['pacientes'].get('pais_origen_id').updateValueAndValidity();

            if(this.extranjero == true){

              this.pacienteForm.controls['pacientes'].get('municipio_id').patchValue('');
              this.pacienteForm.controls['pacientes'].get('municipio_id').clearValidators();
              this.pacienteForm.controls['pacientes'].get('municipio_id').updateValueAndValidity();
        
              this.pacienteForm.controls['pacientes'].get('municipio').disable();
              this.pacienteForm.controls['pacientes'].get('localidad').disable();
        
              this.pacienteForm.controls['pacientes'].get('localidad_id').patchValue('');
              this.pacienteForm.controls['pacientes'].get('localidad_id').clearValidators();
              this.pacienteForm.controls['pacientes'].get('localidad_id').updateValueAndValidity();
        
        
              this.pacienteForm.controls['pacientes'].get('estado_republica_id').patchValue('');
              this.pacienteForm.controls['pacientes'].get('estado_republica_id').clearValidators();
              this.pacienteForm.controls['pacientes'].get('estado_republica_id').updateValueAndValidity();
        
              this.pacienteForm.controls['pacientes'].get('curp').patchValue('');
              this.pacienteForm.controls['pacientes'].get('curp').clearValidators();
              this.pacienteForm.controls['pacientes'].get('curp').updateValueAndValidity();
              

              this.pacienteForm.controls['pacientes'].get('pais_origen_id').patchValue('');
              this.pacienteForm.controls['pacientes'].get('pais_origen_id').setValidators([Validators.required]);
              this.pacienteForm.controls['pacientes'].get('pais_origen_id').updateValueAndValidity();

            }else{

              this.pacienteForm.controls['pacientes'].get('municipio_id').patchValue('');
              this.pacienteForm.controls['pacientes'].get('municipio_id').setValidators([Validators.required]);
              this.pacienteForm.controls['pacientes'].get('municipio_id').updateValueAndValidity();

              this.pacienteForm.controls['pacientes'].get('municipio').enable();
              this.pacienteForm.controls['pacientes'].get('localidad').enable();

              this.pacienteForm.controls['pacientes'].get('localidad_id').patchValue('');
              this.pacienteForm.controls['pacientes'].get('localidad_id').setValidators([Validators.required]);
              this.pacienteForm.controls['pacientes'].get('localidad_id').updateValueAndValidity();

              
              this.pacienteForm.controls['pacientes'].get('estado_republica_id').patchValue('');
              //this.pacienteForm.controls['pacientes'].get('estado').setValidators([Validators.required]);
              this.pacienteForm.controls['pacientes'].get('estado_republica_id').updateValueAndValidity();

              this.pacienteForm.controls['pacientes'].get('curp').patchValue('');
              this.pacienteForm.controls['pacientes'].get('curp').clearValidators();
              this.pacienteForm.controls['pacientes'].get('curp').updateValueAndValidity();

              this.pacienteForm.controls['pacientes'].get('pais_origen_id').patchValue('');
              this.pacienteForm.controls['pacientes'].get('pais_origen_id').clearValidators();
              this.pacienteForm.controls['pacientes'].get('pais_origen_id').updateValueAndValidity();

              
            }

    }
    
  }

  es_extranjero(val){

    if(val == 1){

      this.extranjero = true;

      this.pacienteForm.controls['pacientes'].get('esExtranjero').patchValue(val);

      this.pacienteForm.controls['pacientes'].get('municipio_id').patchValue('');
      this.pacienteForm.controls['pacientes'].get('municipio_id').clearValidators();
      this.pacienteForm.controls['pacientes'].get('municipio_id').updateValueAndValidity();

      this.pacienteForm.controls['pacientes'].get('municipio').disable();
      this.pacienteForm.controls['pacientes'].get('localidad').disable();

      this.pacienteForm.controls['pacientes'].get('localidad_id').patchValue('');
      this.pacienteForm.controls['pacientes'].get('localidad_id').clearValidators();
      this.pacienteForm.controls['pacientes'].get('localidad_id').updateValueAndValidity();


      this.pacienteForm.controls['pacientes'].get('estado_republica_id').patchValue('');
      this.pacienteForm.controls['pacientes'].get('estado_republica_id').clearValidators();
      this.pacienteForm.controls['pacientes'].get('estado_republica_id').updateValueAndValidity();

      this.pacienteForm.controls['pacientes'].get('curp').patchValue('');
      this.pacienteForm.controls['pacientes'].get('curp').clearValidators();
      this.pacienteForm.controls['pacientes'].get('curp').updateValueAndValidity();

      this.pacienteForm.controls['pacientes'].get('pais_origen_id').patchValue('');
      this.pacienteForm.controls['pacientes'].get('pais_origen_id').setValidators([Validators.required]);
      this.pacienteForm.controls['pacientes'].get('pais_origen_id').updateValueAndValidity();

    }else{


      this.extranjero = false;

      this.pacienteForm.controls['pacientes'].get('esExtranjero').patchValue(val);

      this.pacienteForm.controls['pacientes'].get('municipio_id').patchValue('');
      this.pacienteForm.controls['pacientes'].get('municipio_id').setValidators([Validators.required]);
      this.pacienteForm.controls['pacientes'].get('municipio_id').updateValueAndValidity();

      this.pacienteForm.controls['pacientes'].get('localidad_id').patchValue('');
      this.pacienteForm.controls['pacientes'].get('localidad_id').setValidators([Validators.required]);
      this.pacienteForm.controls['pacientes'].get('localidad_id').updateValueAndValidity();

      this.pacienteForm.controls['pacientes'].get('estado_republica_id').patchValue('');
      //this.pacienteForm.controls['pacientes'].get('estado').setValidators([Validators.required]);
      this.pacienteForm.controls['pacientes'].get('estado_republica_id').updateValueAndValidity();

      this.pacienteForm.controls['pacientes'].get('curp').patchValue('');
      this.pacienteForm.controls['pacientes'].get('curp').clearValidators();
      this.pacienteForm.controls['pacientes'].get('curp').updateValueAndValidity();


      this.pacienteForm.controls['pacientes'].get('pais_origen_id').patchValue('');
      this.pacienteForm.controls['pacientes'].get('pais_origen_id').clearValidators();
      this.pacienteForm.controls['pacientes'].get('pais_origen_id').updateValueAndValidity();

          if(this.desconocido == true){

            this.pacienteForm.controls['pacientes'].get('municipio_id').patchValue('');
            this.pacienteForm.controls['pacientes'].get('municipio_id').clearValidators();
            this.pacienteForm.controls['pacientes'].get('municipio_id').updateValueAndValidity();

            this.pacienteForm.controls['pacientes'].get('localidad_id').patchValue('');
            this.pacienteForm.controls['pacientes'].get('localidad_id').clearValidators();
            this.pacienteForm.controls['pacientes'].get('localidad_id').updateValueAndValidity();

            this.pacienteForm.controls['pacientes'].get('estado_republica_id').patchValue('');
            this.pacienteForm.controls['pacientes'].get('estado_republica_id').clearValidators();
            this.pacienteForm.controls['pacientes'].get('estado_republica_id').updateValueAndValidity();

            this.pacienteForm.controls['pacientes'].get('curp').patchValue('');
            this.pacienteForm.controls['pacientes'].get('curp').clearValidators();
            this.pacienteForm.controls['pacientes'].get('curp').updateValueAndValidity();

            this.pacienteForm.controls['pacientes'].get('pais_origen_id').patchValue('');
            this.pacienteForm.controls['pacientes'].get('pais_origen_id').clearValidators();
            this.pacienteForm.controls['pacientes'].get('pais_origen_id').updateValueAndValidity();

          }
      
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
  

  ha_estado_embarazada(val){

    if(val === 1){

      this.pacienteForm.controls['atencion'].get('haEstadoEmbarazada').patchValue(1);

      this.pacienteForm.controls['embarazo'].reset();
      
      console.log(this.pacienteForm.controls['embarazo'].value);
      console.log(this.pacienteForm.controls['atencion'].value);

      //this.pacienteForm.controls['atencion'].get('estaEmbarazada').patchValue(0);
      

      
    }else{

      this.pacienteForm.controls['atencion'].get('haEstadoEmbarazada').patchValue(0);

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

  fue_referida_embarazada(val){

    if(val === 1){

      this.pacienteForm.controls['embarazo'].get('fueReferida').patchValue(1);

    }else{

      this.pacienteForm.controls['embarazo'].get('fueReferida').patchValue(0);
      this.pacienteForm.controls['embarazo'].get('clues_referencia_id').reset();
      this.pacienteForm.controls['embarazo'].get('clues_referencia_id').patchValue(null);

    }
  }

  es_emergencia_calificada(val){

    if(val === 1){

      this.pacienteForm.controls['atencion'].get('esUrgenciaCalificada').patchValue(1);

    }else{

      this.pacienteForm.controls['atencion'].get('esUrgenciaCalificada').patchValue(0);

    }

  }

  obtenerCurp(){

    this.isLoading = true;

      const Nombres          = this.pacienteForm.controls['pacientes'].get('nombre').value;
      const ApellidoPaterno  = this.pacienteForm.controls['pacientes'].get('paterno').value;
      const ApellidoMaterno  = this.pacienteForm.controls['pacientes'].get('materno').value; 
      const Sexo             = this.pacienteForm.controls['pacientes'].get('sexo').value;
      const objeto_estado    = this.pacienteForm.controls['pacientes'].get('estado_republica_id').value;
      const fecha_nacimiento = this.pacienteForm.controls['pacientes'].get('fecha_nacimiento').value;
  
  
      const Estado = objeto_estado.nombre;
      const Fecha = moment(fecha_nacimiento).format("YYYY/MM/DD");
  
      const datos_curp = '?Nombres='+Nombres+'&ApellidoPaterno='+ApellidoPaterno+'&ApellidoMaterno='+ApellidoMaterno+'&Sexo='+Sexo+'&Fecha='+Fecha+'&Estado='+Estado;
  
      //console.log("datos", datos_curp);
  
      this.ingresosService.calcularCurp(datos_curp).subscribe(
        response =>{
  
          // this.pacienteForm.controls['pacientes'].get('curp').valueChanges.subscribe(value => {
          //   console.log('valor curp:', value)
          // });
  
          if(response.length > 0){
  
            var Message = "¡CURP Generada con Éxito!";
    
            this.sharedService.showSnackBar(Message, 'Cerrar', 4000);
            this.pacienteForm.controls['pacientes'].get('curp').setValue(response[0]);
            
          }else{
    
            var Message = "¡La CURP no se a podido generar!";
    
            this.sharedService.showSnackBar(Message, 'Cerrar', 2000);
  
          }
          this.isLoading = false;
      },
  
        errorResponse => {
          console.log(errorResponse);
          this.isLoading = false;
      });

  }

  comparePaisActualSelect(op,value){
    return op.id == value.id;
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

  savePersona(){

    const formData =  JSON.parse(JSON.stringify(this.pacienteForm.value));

    console.log("la cama",formData.atencion.no_cama);

    if(formData.pacientes.estado_republica_id){
      formData.pacientes.estado_republica_id = formData.pacientes.estado_republica_id.id;
    }

    if(formData.pacientes.municipio_id){
      formData.pacientes.municipio_id = formData.pacientes.municipio_id.id;
    }
    if(formData.pacientes.localidad_id){
      formData.pacientes.localidad_id = formData.pacientes.localidad_id.id;
    }
    if(formData.pacientes.pais_origen_id){
      formData.pacientes.pais_origen_id = formData.pacientes.pais_origen_id.id;
    }


    if(formData.atencion.estado_actual_id){

      formData.atencion.ultimo_estado_actual_id   = formData.atencion.estado_actual_id.id;
      formData.atencion.estado_actual_id          = formData.atencion.estado_actual_id.id;
      
    }

    // if(formData.atencion.especialidad_id){

    //   formData.atencion.especialidad_id = formData.atencion.especialidad_id.id;
      
    // }

    if(formData.atencion.servicio_id){

      formData.atencion.ultimo_servicio_id  = formData.atencion.servicio_id.id;
      formData.atencion.servicio_id         = formData.atencion.servicio_id.id;
      
    }
    if(formData.atencion.no_cama){

      formData.atencion.ultimo_no_cama      = formData.atencion.no_cama.numero;
      formData.atencion.cama_id             = formData.atencion.no_cama.id;
      formData.atencion.ultima_cama_id      = formData.atencion.no_cama.id;
      formData.atencion.no_cama             = formData.atencion.no_cama.numero;

      
    }
    
    //dataEmbarazo

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

    // let datoGuardado = {
    //   data: formData
    // }

    this.isLoading = true;

    if(this.persona_id > 0 ){

      this.ingresosService.updatePaciente(this.persona_id, formData).subscribe({
        next:(response) => {

          this.isLoading = false;
          let Message = "";
          if(response.data.pacientes.esDesconocido == 1){
            Message = "Se Editaron los datos del Paciente con Alias: "+" "+response.data.pacientes.alias+" "+"con Éxito!";
          }else{
            Message = "Se Editaron los datos del Paciente: "+" "+response.data.pacientes.nombre+" "+response.data.pacientes.paterno+" "+response.data.pacientes.materno+" "+" con Éxito!";
          }
          this.sharedService.showSnackBar(Message, 'Cerrar', 5000);
          this.router.navigate(['/ingresos']);
        },
        error:(errorResponse: HttpErrorResponse) => {
          console.log(errorResponse);
          this.isLoading = false;
        },
        complete:() =>{}
      });

    }else{

      this.ingresosService.createPaciente(formData).
      subscribe({
        next:(response) => {

          this.isLoading = false;

          const Message = "Paciente Registrado con Éxito!";
          this.sharedService.showSnackBar(Message, 'Cerrar', 3000);
          this.router.navigate(['/atencion-pacientes']);

        },
        error:(errorResponse: HttpErrorResponse) => {
          console.log(errorResponse);
          this.reponseErrorsPaciente(errorResponse);
          this.isLoading = false;
        },
        complete:() =>{}
      });
    }
  }

  reponseErrorsPaciente(errorResponse:any){

    if(errorResponse.error.errores){

      for(const campo in errorResponse.error.errores){

        switch (campo) {
          case 'curp':

            const error_curp = errorResponse.error.errores[campo];
            for(const j in error_curp){
  
                const message = error_curp[j];

                this.sharedService.showSnackBar(message, 'Cerrar', 9000);
                this.openDialogSearchPacienteReingreso( campo );
            }

            break;

          case 'numero_expediente':

            const error_num_expediente = errorResponse.error.errores[campo];
            for(const j in error_num_expediente){
  
                const message = error_num_expediente[j];

                this.sharedService.showSnackBar(message, 'Cerrar', 9000);
                this.openDialogSearchPacienteReingreso( campo );
            }

            break;
        
          default:0
        }

      }
    }
  }



  openDialogSearchPacienteReingreso( campo ){

    let configDialog = {};
    if(this.mediaSize == 'xs'){
      configDialog = {
        maxWidth: '100vw',
        maxHeight: '100vh',
        height: '100%',
        width: '100%',
        data:{ scSize:this.mediaSize }

      };
    }else{
      configDialog = {
        width: '99%',
        maxHeight: '90vh',
        height: '643px',
        //data:{id: id}
      }
    }

    let obj = {};

    if( campo === 'curp' ){
      
      const curp = this.pacienteForm.controls['pacientes'].get('curp').value;

      obj = {
        curp: curp
      };

    }else if( campo === 'numero_expediente' ) {

      const numero_expediente = this.pacienteForm.controls['pacientes'].get('numero_expediente').value;

      obj = {
        numero_expediente: numero_expediente
      };

    }

    const dialogRef = this.dialog.open(ConfirmActionDialogComponent, {
      width: '500px',
      data:{ dialogTitle:'Buscar y Reingresar Paciente:',dialogMessage:  (campo === 'curp') ? '¿Desea Generar una Nueva Atención al Paciente con CURP: '+this.pacienteForm.controls['pacientes'].get('curp').value : (campo === 'numero_expediente') ? '¿Desea Generar una Nueva Atención al Paciente con Número de Expediente: '+this.pacienteForm.controls['pacientes'].get('numero_expediente').value : '',
      btnColor:'primary',btnText:'Si', campo: obj }
    });

    dialogRef.afterClosed().subscribe(valid => {
      if(valid){
        console.log('Aceptar');
      }else{
        console.log('Cancelar');
      }
    });
    
  }

  calculateAge() {

      const fecha1 = moment(this.fechaActual);
      const fecha2 = moment(this.pacienteForm.controls['pacientes'].get('fecha_nacimiento').value).format('YYYY-MM-D');
  
      //this.pacienteForm.controls['pacientes'].get('edad').patchValue(fecha1.diff(fecha2, 'years'));
      //this.pacienteForm.controls['pacientes'].get('edad').patchValue(fecha1.diff(fecha2, 'months') % 12);

      switch (this.pacienteForm.controls['pacientes'].get('tipo_edad').value != "" && this.pacienteForm.controls['pacientes'].get('fecha_nacimiento').value != "" ) {

        case this.pacienteForm.controls['pacientes'].get('tipo_edad').value == "Meses":

          this.pacienteForm.controls['pacientes'].get('edad').reset();
          this.pacienteForm.controls['pacientes'].get('edad').patchValue(fecha1.diff(fecha2, 'months'));
          break;

        case this.pacienteForm.controls['pacientes'].get('tipo_edad').value == "Dias":

          this.pacienteForm.controls['pacientes'].get('edad').reset();
          this.pacienteForm.controls['pacientes'].get('edad').patchValue(fecha1.diff(fecha2, 'days'));
          break;

        case this.pacienteForm.controls['pacientes'].get('tipo_edad').value == "Años":

          this.pacienteForm.controls['pacientes'].get('edad').reset();
          this.pacienteForm.controls['pacientes'].get('edad').patchValue(fecha1.diff(fecha2, 'years'));
          break;

      }

  }

  clearEge(){

    this.pacienteForm.controls['pacientes'].get('edad').reset();
    this.pacienteForm.controls['pacientes'].get('tipo_edad').reset();

  }

  resetEmbarazo(event){

    if( event.value === "Masculino" ){
      
      this.pacienteForm.controls['atencion'].get('estaEmbarazada').reset();

    }

  }

  getDisplayFn(label: string){
    return (val) => this.displayFn(val,label);
  }

  displayFn(value: any, valueLabel: string){
    return value ? value[valueLabel] : value;
  }

}