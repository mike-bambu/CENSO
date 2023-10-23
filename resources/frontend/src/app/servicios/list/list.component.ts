import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { SharedService } from '../../shared/shared.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ServiciosService } from '../servicios.service';
import { FormServiciosComponent } from '../form/form.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../auth/auth.service';
import { Clues } from '../../auth/models/clues';
import { ConfirmActionDialogComponent } from '../../utils/confirm-action-dialog/confirm-action-dialog.component';
import { MatTable } from '@angular/material/table';

@Component({
  selector: 'list-servicio',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListServiciosComponent implements OnInit {

  authClues: Clues;
  isLoading = false;
  searchQuery = '';

  pageEvent: PageEvent;
  resultsLength = 0;
  currentPage = 0;

  displayedColumns: string[] = ['id','nombre', 'es_ambulatorio', 'opciones'];
  dataSource: any = [];

  constructor(
    private sharedService: SharedService,
    private authService: AuthService,
    private ServiciosService: ServiciosService,
    public dialog: MatDialog
  ) { }

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatTable,{static:false}) serviciosTable: MatTable<any>;

  ngOnInit() {
    this.authClues = this.authService.getCluesData();
    console.log(this.authClues);
    this.loadServiciosData(null);
  }

  public loadServiciosData(event?:PageEvent){
    this.isLoading = true;
    let params:any;
    if(!event){
      params = { page: 1, per_page: 20, clues: this.authClues ? this.authClues.id : '' }
    }else{
      params = {
        page: event.pageIndex+1,
        per_page: event.pageSize,
        clues: this.authClues ? this.authClues.id : '' 
      };
    }

    params.query = this.searchQuery;
    params.show_hidden = true;

    this.ServiciosService.getServicioList(params).subscribe({
      next:(response) => {
        if(response.error) {
          const errorMessage = response.error.message;
          this.sharedService.showSnackBar(errorMessage, null, 3000);
        } else {
          if(response.catalogo_servicios.total > 0){
            this.dataSource = response.catalogo_servicios.data;
            this.resultsLength = response.catalogo_servicios.total;
          }else{
            this.dataSource = [];
            this.resultsLength = 0;
          }
        }
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
      complete:() =>{}
    });
    return event;
  }

  applyFilter(){
    this.paginator.pageIndex = 0;
    this.loadServiciosData(null);
  }

  openDialogForm(id = 0){
    const dialogRef = this.dialog.open(FormServiciosComponent, {
      width: '500px',
      data: {id: id}
    });

    dialogRef.afterClosed().subscribe(reponse => {
      if(reponse){
        this.applyFilter();
      }
    });
  }

  confirmDeleteServicio(id = 0){
    const dialogRef = this.dialog.open(ConfirmActionDialogComponent, {
      width: '500px',
      data: {dialogTitle:'Eliminar Servicio',dialogMessage:'Esta seguro de eliminar este Servicio?',btnColor:'warn',btnText:'Eliminar'}
    });

    dialogRef.afterClosed().subscribe(reponse => {
      if(reponse){
        this.ServiciosService.deleteServicio(id).subscribe(
          response => {
            console.log(response);
            this.loadServiciosData(null);
          }
        );
      }
    });
  }

}
