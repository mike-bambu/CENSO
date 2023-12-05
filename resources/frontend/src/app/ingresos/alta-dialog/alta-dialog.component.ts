import { Component, ElementRef, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { startWith, map } from 'rxjs/operators';
import { UntypedFormGroup, Validators, UntypedFormBuilder, FormArray } from '@angular/forms';
import { IngresosService } from '../ingresos.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedService } from '../../shared/shared.service';
import { Router, ActivatedRoute  } from '@angular/router';
import { CustomValidator } from '../../utils/classes/custom-validator';
import { AuthService } from '../../auth/auth.service';
import { Clues } from '../../auth/models/clues';
import { User } from '../../auth/models/user';

import { MatDialog} from '@angular/material/dialog';
import { DetailsComponentPaciente } from './../details-paciente/details-paciente.component';


import * as moment from 'moment';

export interface FormDialogData {
  id: number;
}

@Component({
  selector: 'ingresos-alta-dialog',
  templateUrl: './alta-dialog.component.html',
  styleUrls: ['./alta-dialog.component.css']
})
export class AltaDialogComponent implements OnInit {

  constructor(
    private ingresosService: IngresosService,
    private authService: AuthService,
    public dialogRef: MatDialogRef<AltaDialogComponent>,
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

  authClues: Clues;
  authUser: User;

  localidadesIsLoading = false;
  isLoading = false;
  paciente:any = {};

  provideID = false;

  fechaActual:any = '';
  fechaInicial:any = '';
  maxDate:Date;
  minDate:Date;

  pacienteForm:UntypedFormGroup;



  catalogos: any = {};
  filteredCatalogs:any = {};

  folio_alta = 'ALT';

  selectedItemIndex = -1;
  mediaSize: string;




  ngOnInit() {
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
          especialidad_id:[''],
          clue_atencion_embarazo_id:[''],
          fecha_ultima_atencion_embarazo:[''],
          clues_control_embarazo_id:[''],
          fecha_control_embarazo:[''],
          clues_id:[''],
          paciente_id:[''],

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
          observaciones:['', Validators.required],
          dadodeAlta:[1],
          tieneAtencion:[0],
          telefono:[''],
          direccion_completa:[''],
          motivo_egreso_id:[''],
          condicion_egreso_id:[''],
          estado_actual_id:[''],
          metodo_anticonceptivo_id:[''],
          municipio_id:[''],
          localidad_id:[''],
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
        this.ingresosService.getPaciente(id).subscribe(
          response => {
              this.paciente = response.paciente;

              this.pacienteForm.controls['paciente'].patchValue(this.paciente);

              if(this.paciente.ultima_atencion != null){

                console.log("ultima_atencion",this.paciente.ultima_atencion);

                this.pacienteForm.controls['ultima_atencion'].patchValue(this.paciente.ultima_atencion);
                this.pacienteForm.controls['alta'].get('atencion_id').patchValue(this.paciente.ultima_atencion.id);
                this.pacienteForm.controls['alta'].get('folio_atencion').patchValue(this.paciente.ultima_atencion.folio_atencion);

                this.pacienteForm.controls['alta'].get('atencion_id').patchValue(this.paciente.ultima_atencion.id);

                this.pacienteForm.controls['alta'].get('cama_id').patchValue(this.paciente.ultima_atencion.cama_id);
                this.pacienteForm.controls['alta'].get('servicio_id').patchValue(this.paciente.ultima_atencion.servicio_id);
                this.pacienteForm.controls['alta'].get('no_cama').patchValue(this.paciente.ultima_atencion.no_cama);
                
              }

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

      this.minDate = new Date(2021, 0, 1);
      this.maxDate = fecha;


      this.authClues = this.authService.getCluesData();
      this.authUser = this.authService.getUserData();
      this.generar_folio(this.folio_alta);

      this.IniciarCatalogos(null);

  }


  public IniciarCatalogos(obj:any)
  {
    this.isLoading = true;
    const carga_catalogos = [
      {nombre:'motivos_egresos',orden:'nombre'},
      {nombre:'estados_actuales',orden:'nombre'},
    ];

    this.ingresosService.obtenerCatalogos(carga_catalogos).subscribe(
      response => {

        this.catalogos = response.data;

        console.log("aaaa",this.catalogos);

        this.filteredCatalogs['motivos_egresos']         = this.pacienteForm.controls['alta'].get('motivo_egreso_id').valueChanges.pipe(startWith(''),map(value => this._filter(value,'motivos_egresos','nombre')));
        this.filteredCatalogs['estados_actuales']        = this.pacienteForm.controls['alta'].get('estado_actual_id').valueChanges.pipe(startWith(''),map(value => this._filter(value,'estados_actuales','nombre')));


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

  }

  savePaciente(){

    this.isLoading = true;

    console.log(this.pacienteForm.value);
    const formData = JSON.parse(JSON.stringify(this.pacienteForm.value));

    if(formData.alta.motivo_egreso_id){
      formData.alta.motivo_egreso_id = formData.alta.motivo_egreso_id.id;
    }

    if(formData.alta.estado_actual_id){
      formData.alta.estado_actual_id = formData.alta.estado_actual_id.id;
    }



    const dataAlta = formData.alta;

    const datoGuardado = {
      alta: dataAlta
    };

    console.log(datoGuardado);

    this.ingresosService.createAlta(datoGuardado).subscribe(
      response =>{

        console.log(response.messages);
        this.isLoading = false;

        this.dialogRef.close();
        const Message = response.messages;
        //this.verPaciente(formData.paciente.id, null);
        this.sharedService.showSnackBar(Message, 'Cerrar', 3000);
        this.router.navigate(['/ingreso-pacientes'])
        .then(() => {
          window.location.reload();
        });
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
  
  
      console.log(this.pacienteForm.get('fecha_nacimiento').value);

      console.log("ingreso",this.pacienteForm.get('fecha_ingreso').value);

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