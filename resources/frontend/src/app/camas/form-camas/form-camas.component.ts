import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Validators, FormBuilder } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { CamasService } from '../camas.service';
import { AuthService } from '../../auth/auth.service';
import { Clues } from '../../auth/models/clues';

import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

export interface FormDialogData {
  id: number;
}

@Component({
  selector: 'app-form-camas',
  templateUrl: './form-camas.component.html',
  styleUrls: ['./form-camas.component.css']
})
export class FormComponentCamas implements OnInit, OnDestroy {

  constructor(
    public dialogRef: MatDialogRef<FormComponentCamas>,
    @Inject(MAT_DIALOG_DATA) public data: FormDialogData,
    private CamasService: CamasService,
    private authService: AuthService,
    private fb: FormBuilder,
    private breakpointObserver: BreakpointObserver,
    public dialog: MatDialog,
  ) {}

  isLoading = false;
  camas:any = {};

  catalogos: any = {};
  filteredCatalogs:any = {};

  authClues: Clues;

  provideID = false;

    camaForm = this.fb.group ({
      numero:           ['', Validators.required],
      folio:            ['', Validators.required],
      descripcion:      ['', Validators.required],
      tipo_cama:        ['', Validators.required],
      clues_id:         ['', Validators.required],
      servicio_id:      ['', Validators.required],
      estatus_cama_id:  ['', Validators.required],
    })
  
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

  ngOnInit(): void {
    console.log(this.camaForm);

    this.renderSize();

    this.authClues = this.authService.getCluesData();

    this.camaForm.get('clues_id').patchValue(this.authClues.id);
    

    const id = this.data.id;
    if(id){
      this.isLoading = true;
      this.CamasService.getCama(id).subscribe(
        response => {
          this.isLoading = true;
          this.camas = response.catalogo_camas;
          this.camaForm.patchValue(this.camas);
          this.IniciarCatalogos(response.catalogo_camas);
          this.isLoading = false;
        },
        errorResponse => {
          console.log(errorResponse);
          this.isLoading = false;
        });
    }

    this.IniciarCatalogos(null);

  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
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

  resizeDialog(){
    if(!this.dialogMaxSize){
      this.dialogRef.updateSize('100%', '100%');
      this.dialogMaxSize = true;
    }else{
      this.dialogRef.updateSize('80%','100%');
      this.dialogMaxSize = false;
    }
  }

  public IniciarCatalogos(obj:any){
    this.isLoading = true;
    const carga_catalogos = [
      {nombre:'servicios',orden:'nombre',filtro_id:{campo:'clues_id',valor:this.authClues ? this.authClues.id : ''}},
      {nombre:'estatus_cama',orden:'nombre'},
    ];

    this.CamasService.obtenerCatalogos(carga_catalogos).subscribe({
      next:(response) => {
        this.catalogos = response.data;

        console.log("aaaa",this.catalogos);

        this.filteredCatalogs['servicios']         = this.camaForm.get('servicio_id').valueChanges.pipe(startWith(''),map(value => this._filter(value,'servicios','nombre')));
        this.filteredCatalogs['estatus_cama']      = this.camaForm.get('estatus_cama_id').valueChanges.pipe(startWith(''),map(value => this._filter(value,'estatus_cama','nombre')));        


        this.isLoading = false; 
      },
      error:(error: HttpErrorResponse) => {
        console.log(error);
        this.isLoading = false;
      },
      complete:() =>{

        if(obj){
          if(obj.servicio){
            this.camaForm.get('servicio_id').setValue(obj.servicio);
          }
          if(obj.estatus_cama){
            this.camaForm.get('estatus_cama_id').setValue(obj.estatus_cama);
          }
        }
        
        this.isLoading = false; 

      }

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
  

  getDisplayFn(label: string){
    return (val) => this.displayFn(val,label);
  }

  displayFn(value: any, valueLabel: string){
    return value ? value[valueLabel] : value;
  }

  numberOnly(event): boolean {
    
    const charCode = (event.which) ? event.which : event.keyCode;

    if(charCode == 46){
      return true;
    }
    if (charCode > 31 && (charCode < 48 || charCode > 57) ) {
      return false;
    }
    return true;

  }

  saveServicio(){

    const formData = JSON.parse(JSON.stringify(this.camaForm.value));

    if(formData.estatus_cama_id){
      formData.estatus_cama_id = formData.estatus_cama_id.id;
    }
    if(formData.servicio_id){
      formData.servicio_id = formData.servicio_id.id;
    }

    this.isLoading = true;
    
    if(this.camas.id){
      this.CamasService.updateCama(this.camas.id, formData).subscribe({
        next:(response) => {
          this.dialogRef.close(true);
          console.log(response);
          this.isLoading = false;
        },
        error:(error: HttpErrorResponse) => {
          console.log(error);
          this.isLoading = false;
        }

      });
    }else{
      this.CamasService.createCama(formData).subscribe({
        next:(response) => {

          this.dialogRef.close(true);
          console.log(response);
          this.isLoading = false;

        },
        error:(error: HttpErrorResponse) => {
          console.log(error);
          this.isLoading = false;
        }

      });
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }



}