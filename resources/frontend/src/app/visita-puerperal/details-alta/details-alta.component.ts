import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VisitaPuerperalService } from '../visita-puerperal.service';
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
  selector: 'egreso-details-paciente',
  templateUrl: './details-alta.component.html',
  styleUrls: ['./details-alta.component.css']
})
export class DetailsComponentPacienteEgreso implements OnInit {
  


  constructor(
    public dialogRef: MatDialogRef<DetailsComponentPacienteEgreso>,
    @Inject(MAT_DIALOG_DATA) public data: FormDialogData,
    private visitaPuerperalService: VisitaPuerperalService,
    private sharedService: SharedService,
    public router: Router,
    private breakpointObserver: BreakpointObserver,

  ) {}

  public dialog: MatDialog;
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

    console.log("LOS DATOS", this.data.id);

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

    this.visitaPuerperalService.verInfoPacienteEgreso(id,params).subscribe(
      response =>{
        console.log("en el response del DIALOG",response.data);
        
        this.dataPaciente = response.data;

        console.log(this.dataPaciente);

        this.isLoading = false;
      });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public abrirPanel(item): void {
    this.IdActual = item.id;
  }

}
