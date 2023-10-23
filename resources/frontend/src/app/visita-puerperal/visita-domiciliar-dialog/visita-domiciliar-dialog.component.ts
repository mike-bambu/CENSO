import { Component, ElementRef, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { startWith, map } from 'rxjs/operators';
import { UntypedFormGroup, Validators, UntypedFormBuilder, UntypedFormArray } from '@angular/forms';
import { VisitaPuerperalService } from '../visita-puerperal.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedService } from '../../shared/shared.service';
import { Router, ActivatedRoute  } from '@angular/router';
import { CustomValidator } from '../../utils/classes/custom-validator';
import { AuthService } from '../../auth/auth.service';
import { Clues } from '../../auth/models/clues';
import { User } from '../../auth/models/user';

import * as moment from 'moment';
import { Distritos } from 'src/app/auth/models/distritos';

export interface FormDialogData {
  id: number;
}

@Component({
  selector: 'visita-puerperal-dialog',
  templateUrl: './visita-domiciliar-dialog.component.html',
  styleUrls: ['./visita-domiciliar-dialog.component.css']
})
export class VisitaPuerperalDialogComponent implements OnInit {

  constructor(
    private visitaPuerperalService: VisitaPuerperalService,
    private authService: AuthService,
    public dialogRef: MatDialogRef<VisitaPuerperalDialogComponent>,
    public dialog: MatDialog,
    private fb: UntypedFormBuilder,
    private snackBar: MatSnackBar,
    private sharedService: SharedService,
    private route: ActivatedRoute,
    public router: Router,

    @Inject(MAT_DIALOG_DATA) public data: FormDialogData
  ) {}

  showSnackBar(message, action, duration){
    this.snackBar.open(message, action,{
      duration: duration
    });
  }

  authDistrito: Distritos;
  authUser: User;

  localidadesIsLoading = false;
  isLoading = false;
  paciente:any = {};

  provideID = false;

  fechaActual:any = '';
  fechaInicial:any = '';
  minDate:any = '';
  maxDate:any = '';
  mediaSize: string;
  selectedItemIndex = -1;

  pacienteForm:UntypedFormGroup;

  catalogos: any = {};
  filteredCatalogs:any = {};

  folio_visita = 'VISITA';
  //folio_seguimiento_diagnostico:string = 'SEG-DIAG';
  folio_seg_diag = '';
  hora:any = '';


  ngOnInit() {


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
          fecha_inicio_atencion:[''],
          hora:[''],
          motivo_atencion:[''],
          indicaciones:[''],
          gestas:[''],
          partos:[''],
          cesareas:[''],
          abortos:[''],
          semanas_gestacionales:[''],
          estaEmbarazada:[''],
          fueReferida:[''],
          metodo_gestacional_id:[''],
          clues_referencia_id:[''],
          dadodeAlta:[''],
          estado_actual_id:[''],
          servicio_id:[''],
          no_cama:[''],
          cama_id:[''],
          especialidad_id:[''],
          clue_atencion_embarazo_id:[''],
          fecha_ultima_atencion_embarazo:[''],
          clues_control_embarazo_id:[''],
          fecha_control_embarazo:[''],
          clues_id:[''],
          paciente_id:[''],

        }),

        visita_puerperal : this.fb.group({

          id:[''],
          folio_visita:[''],
          folio_alta:[''],
          fecha_visita:['', Validators.required],
          hora_visita:['', Validators.required],
          observaciones_visita:['', Validators.required],
          estado_actual_id:['', Validators.required],
          estado_actual:[''],
          factor_covid_id:['', Validators.required],
          // diagnostico_id:[''],
          // diagnosticos:this.fb.array([]),
        }),
      
      });


      const id = this.data.id;
      if(id){

        this.isLoading = true;
        this.visitaPuerperalService.getPuerperaEmbarazada(id).subscribe(
          response => {
            console.log("data", response);
              this.paciente = response.data;

              


              this.isLoading = false;
          },
          errorResponse => {
            console.log(errorResponse);
            this.isLoading = false;
          });
          
          
      }


      moment.locale('es');
      const fecha = new Date();
      this.fechaActual = moment(fecha).format('YYYY-MM-D');

      const ahora = moment()
      this.hora = ahora.format("hh:mm a");

      this.minDate = new Date(2020, 0, 1);
      this.maxDate = fecha;

      this.authDistrito = this.authService.getDistritosData();
      this.authUser = this.authService.getUserData();
      this.generar_folio(this.folio_visita);

      this.pacienteForm.controls['visita_puerperal'].get('fecha_visita').setValue(this.maxDate);
      this.pacienteForm.controls['visita_puerperal'].get('hora_visita').setValue(this.hora);

      this.IniciarCatalogos(null);
      
      

  }


  public IniciarCatalogos(obj:any)
  {
    this.isLoading = true;
    const carga_catalogos = [
      {nombre:'estados_actuales',orden:'nombre'},
      {nombre:'factor_covid',orden:'nombre'},
    ];

    this.visitaPuerperalService.obtenerCatalogos(carga_catalogos).subscribe(
      response => {

        this.catalogos = response.data;

        this.filteredCatalogs['estados_actuales']         = this.pacienteForm.controls['visita_puerperal'].get('estado_actual_id').valueChanges.pipe(startWith(''),map(value => this._filter(value,'estados_actuales','nombre')));
        this.filteredCatalogs['factor_covid']             = this.pacienteForm.controls['visita_puerperal'].get('factor_covid_id').valueChanges.pipe(startWith(''),map(value => this._filter(value,'factor_covid','nombre')));

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

    this.visitaPuerperalService.obtenerCatalogos(carga_catalogos).subscribe(
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

    if(value == 'VISITA'){
          
      this.pacienteForm.controls['visita_puerperal'].get('folio_visita').patchValue(this.folio_visita+'-'+this.authDistrito.id+'-'+this.authDistrito.nombre+'-'+this.authUser.id+'-'+cadena+'-'+'WEB');

    }
    // if(value == 'SEG-DIAG'){

    //   this.folio_seg_diag = this.folio_seguimiento_diagnostico+'-'+this.authClues.id+'-'+this.authUser.id+'-'+cadena+'-'+'WEB'+'-';

    // }

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

      formData.seguimientos.estatus_cama_actual_id     = formData.seguimientos.no_actual_cama.estatus_cama_id;
      formData.seguimientos.cama_actual_id             = formData.seguimientos.no_actual_cama.id;
      formData.seguimientos.no_actual_cama             = formData.seguimientos.no_actual_cama.numero;

    }
    if(formData.seguimientos.servicio_actual_id){

      formData.seguimientos.servicio_actual_id   = formData.seguimientos.servicio_actual_id.id;

    }


    const dataSeguimiento = formData.seguimientos;

    const datoGuardado = {
      seguimientos: dataSeguimiento
    };


    this.visitaPuerperalService.createVisita(datoGuardado).subscribe(
      response =>{


        this.isLoading = false;

        this.dialogRef.close();
        const Message = response.messages;
        //this.verPaciente(formData.paciente.id, null);
        this.sharedService.showSnackBar(Message, 'Cerrar', 5000);
        this.router.navigate(['/atencion-pacientes'])
        .then(() => {
          window.location.reload();
        });
        //this.router.navigate(['/atencion-pacientes/detalles/'+formData.paciente.id]);
    },
      errorResponse => {
        console.log(errorResponse);
        this.isLoading = false;
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