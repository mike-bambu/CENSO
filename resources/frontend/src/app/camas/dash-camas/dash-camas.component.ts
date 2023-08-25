import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog} from '@angular/material/dialog';
import { CamasService } from '../camas.service';
import { SharedService } from '../../shared/shared.service';
import { AuthService } from '../../auth/auth.service';
import { Clues } from '../../auth/models/clues';


@Component({
  selector: 'dash-camas-total',
  templateUrl: './dash-camas.component.html',
  styleUrls: ['./dash-camas.component.css']
})
export class DashCamasComponent implements OnInit {
  


  constructor(
    private CamasService: CamasService,
    private sharedService: SharedService,
    private authService: AuthService,

  ) {}

  public dialog: MatDialog;

  authClues: Clues;

  isLoading = false;

  TotalServiciosCamas: any;
  TotalCamasPorEstatus: any;

  TotalServiciosCamasAmbulatorios: any;
  TotalCamasPorEstatusAmbulatorios: any;

  TotalAmbulatorias:any;

  camas_servicio_disponibles:any[] =[];
  camas_servicio_ocupadas:any[] =[];

  data:any = '';
  pageSize = 20;
  breakpoint: number;

  ngOnInit() {

    this.breakpoint = (window.innerWidth <= 500) ? 1 : 3;

    this.authClues = this.authService.getCluesData();

    this.getDashCamas();

  }

  decimalNumber(value) {
    return value == 100 ? 100 : Number.parseFloat(value).toFixed(1);
  }

  onResize(event) {

    if(event.target.innerWidth <= 400){
      this.breakpoint = 1;
    }else if(event.target.innerWidth <= 500){
      this.breakpoint = 1;
    }else if(event.target.innerWidth <= 800){
      this.breakpoint = 1;
    }else if(event.target.innerWidth <= 900){
      this.breakpoint = 2;
    }else if(event.target.innerWidth <= 1004){
      this.breakpoint = 2;
    }else if(event.target.innerWidth <= 1200){
      this.breakpoint = 3;
    }else if(event.target.innerWidth > 1200){
      this.breakpoint = 3;
    }

    //this.breakpoint = (event.target.innerWidth <= 500 || event.target.innerWidth <= 900) ? 1 : 4;
  }


  getDashCamas(){

    this.isLoading = true;

    let params:any;
    
    params = { page: 1, per_page: this.pageSize, clues: this.authClues ? this.authClues.id : '' }

    this.CamasService.getCamasTotal(params).subscribe(
      response =>{
        if(response.error) {
          const errorMessage = response.error.message;
          this.sharedService.showSnackBar(errorMessage, 'Cerrar', 3000);
        } else {

          this.TotalServiciosCamas  = response.total_camas;
          this.TotalCamasPorEstatus = response.total_estatus_camas;

          this.TotalServiciosCamasAmbulatorios  = response.total_camas_ambulatorias;
          this.TotalCamasPorEstatusAmbulatorios = response.total_estatus_camas_ambulatorias;


          this.TotalAmbulatorias = response.total_ambulatorias;

          //this.camas_servicio_disponibles = this.TotalServiciosCamas.filter((item) => this.TotalCamasPorEstatus.includes(item.servicio_id));

          this.camas_servicio_disponibles = this.TotalCamasPorEstatus.filter((item) => {
            return item.nombre_estatus === 'Disponible';
          });

          this.camas_servicio_ocupadas = this.TotalCamasPorEstatus.filter((item) => {
            return item.nombre_estatus === 'Ocupada';
          });

            
        }


          console.log("disponibles",this.camas_servicio_disponibles);
          console.log("ocupadas",this.camas_servicio_ocupadas);

          console.log("ambulatorios",this.TotalServiciosCamasAmbulatorios);
          console.log("ambulatorios",this.TotalCamasPorEstatusAmbulatorios);

        

          //var total = response.total_estatus_camas_ambulatorias.reduce((sum, value) => (typeof value.total_camas_por_estatus == "number" ? sum + value.total_camas_por_estatus : sum), 0);

        this.isLoading = false;
      },
      errorResponse =>{
        let errorMessage = "Ocurrió un error.";
        if(errorResponse.status == 409){
          errorMessage = errorResponse.error.message;
        }
        this.sharedService.showSnackBar(errorMessage, null, 3000);
        this.isLoading = false;
      }
    );
  }


}
