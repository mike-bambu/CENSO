import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog} from '@angular/material/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AtencionPacientesService } from '../atencion-pacientes.service';
import { SharedService } from '../../shared/shared.service';
import { Router, ActivatedRoute  } from '@angular/router';


//tamaño de pantalla
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';


export interface FormDialogData {
  id: number;
}

@Component({
  selector: 'app-details-paciente',
  templateUrl: './details-paciente.component.html',
  styleUrls: ['./details-paciente.component.css']
})
export class DetailsComponentPaciente implements OnInit {
  


  constructor(
    public dialogRef: MatDialogRef<DetailsComponentPaciente>,
    @Inject(MAT_DIALOG_DATA) public data: FormDialogData,
    private AtencionPacientesService: AtencionPacientesService,
    private sharedService: SharedService,
    public router: Router,
    public dialog: MatDialog,
    private breakpointObserver: BreakpointObserver

  ) {}
  panelAtencion     = false;
  panelSeguimiento  = false;
  panelEmabarazo    = false;
  panelOpenState    = false;

  IdActual: number;

  dataPaciente: any;

  isLoading = false;

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

    this.cargarDatosPaciente(this.data.id);
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


  cargarDatosPaciente(id:any){

    const params = {};
    const query = this.sharedService.getDataFromCurrentApp('searchQuery');

    if(query){
      params['query'] = query;
    }

    this.isLoading = true;

    this.AtencionPacientesService.verInfoPaciente(id,params).subscribe(
      response =>{
        
        this.dataPaciente = response?.data;
        console.log(this.dataPaciente);

        this.isLoading = false;
      });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public abrirPanel(item): void {
    this.IdActual = item.id;
    this.panelSeguimiento = true;
  }

}
