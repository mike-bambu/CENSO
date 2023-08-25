import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { UntypedFormBuilder, FormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { SharedService } from 'src/app/shared/shared.service';
import { UsersService } from '../users.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmPasswordDialogComponent } from '../confirm-password-dialog/confirm-password-dialog.component';
import { Observable, combineLatest, of, forkJoin } from 'rxjs';
import { startWith, map, debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { AuthService } from '../../auth/auth.service';
import { Clues } from '../../auth/models/clues';
import { User } from '../../auth/models/user';
import { AVATARS } from '../../avatars';

import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog} from '@angular/material/dialog';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})

export class FormComponent implements OnInit {

  constructor(
    private sharedService: SharedService, 
    private usersService: UsersService,
    private authService: AuthService, 
    private route: ActivatedRoute, 
    private fb: UntypedFormBuilder,
    public dialog: MatDialog,
    public router: Router,
  ) { }

  isLoading = false;
  hidePassword = true;

  authUser: User;
  authClues: Clues;

  filteredClues: Observable<any[]>;
  cluesIsLoading = false;
  displayedColumnsClues: string[] = ['id', 'nombre', 'nivelAtencion', 'actions'];
  dataSourceClues:any = '';
  valorClue: any[] = [];

  dataClues = Object.assign( this.valorClue );

  filteredDistritos: Observable<any[]>;
  distritosIsLoading = false;
  displayedColumnsDistritos: string[] = ['clave', 'nombre', 'actions'];
  dataSourceDistritos:any = '';
  valorDistrito: any[] = [];

  dataDistrito = Object.assign( this.valorDistrito );

  serviciosIsLoading = false;
  filteredServicios: Observable<any[]>;
  displayedColumnsServicios: string[] = ['nombre', 'tipo', 'actions'];
  dataSourceServicios:any = '';
  valorServicio: any[] = [];
  
  dataServicio = Object.assign( this.valorServicio );
  
  usuario:any = {};

  catalogos: any = {};
  filteredCatalogs:any = {};

  usuarioForm = this.fb.group({
    'name'          : ['',Validators.required],
    'email'         : ['',[Validators.required, Validators.email]],
    'username'      : ['',[Validators.required, Validators.minLength(4)]],
    'password'      : ['',[Validators.minLength(6)]],
    'is_superuser'  : [false],
    'avatar'        : [''],
    'roles'         : [[]],
    'permissions'   : [[]],
    'clues'         : [[]],
    'distritos'     : [[]],
    'distrito'      : [''],
    'distrito_id'   : [''],
    'servicios'     : [[]],
    'servicio_id'   : [''],
    'servicio'      : ['']
  });

  avatarList: any[] = [];

  //Para el filtro de Roles
  catalogRoles: any[] = [];
  listOfRoles$: Observable<any[]>;
  filterInputRoles: UntypedFormControl = new UntypedFormControl('');
  filterInputRoles$: Observable<string> = this.filterInputRoles.valueChanges.pipe(startWith(''));
  filteredRoles$: Observable<any[]>;
  selectedRolesControl:any = {};
  selectedRoles: any[] = [];
  selectedRolePermissions: any[] = [];
  assignedPermissions: any[] = [];
  deniedPermissions: any[] = [];
  selectedRoleChipId = 0;

  selectedAvatar:string = AVATARS[0].file;

  //Para el filtro de Permisos
  catalogPermissions: any[] = [];
  listOfPermissions$: Observable<any[]>;
  filterInputPermissions: UntypedFormControl = new UntypedFormControl('');
  filterInputPermissions$: Observable<string> = this.filterInputPermissions.valueChanges.pipe(startWith(''));
  filteredPermissions$: Observable<any[]>;
  selectedPermissions: any[] = [];

  index = 0;

  @ViewChild('tableClues', { static: true }) tableClues
  @ViewChild('tableServicios', { static: true }) tableServicios
  @ViewChild('tableDistritos', { static: true }) tableDistritos
  


  ngOnInit() {

    this.authUser = this.authService.getUserData();
    this.authClues = this.authService.getCluesData();

    this.avatarList = AVATARS;

    const callRolesCatalog = this.usersService.getAllRoles();
    const callPermissionsCatalog = this.usersService.getAllPermissions();
    
    const httpCalls = [callRolesCatalog, callPermissionsCatalog];

    this.route.paramMap.subscribe(params => {
      if(params.get('id')){

        const id = params.get('id');

        const callUserData = this.usersService.getUser(id);

        httpCalls.push(callUserData);
      }else{
        this.usuarioForm.get('password').setValidators([Validators.minLength(6), Validators.required]);
      }

      this.isLoading = true;

      //Calls: 0 => Roles, 1 => Permissions, 2 => User
      forkJoin(httpCalls).subscribe(
        results => {
          console.log("calls",results);

          //Starts: Roles
          this.catalogRoles = results[0].data;
          this.listOfRoles$ = of(this.catalogRoles);
          this.filteredRoles$ = combineLatest(this.listOfRoles$,this.filterInputRoles$).pipe(
            map(
              ([roles,filterString]) => roles.filter(
                role => (role.name.toLowerCase().indexOf(filterString.toLowerCase()) !== -1)
              )
            )
          );
          //Ends: Roles

          //Starts: Permissions
          this.catalogPermissions = results[1].data;
          this.listOfPermissions$ = of(this.catalogPermissions);
          this.filteredPermissions$ = combineLatest(this.listOfPermissions$,this.filterInputPermissions$).pipe(
            map(
              ([permissions,filterString]) => permissions.filter(
                permission => (permission.description.toLowerCase().indexOf(filterString.toLowerCase()) !== -1) || (permission.group.toLowerCase().indexOf(filterString.toLowerCase()) !== -1)
              )
            )
          );
          //Ends: Permissions

          //Starts: User
          if(results[2]){
            this.usuario = results[2];

            this.valorClue =  results[2].clues;
            this.dataSourceClues = new MatTableDataSource<Element>(this.valorClue);

            this.valorDistrito = results[2].distritos;
            this.dataSourceDistritos = new MatTableDataSource<Element>(this.valorDistrito);

            this.valorServicio = results[2].servicios;
            this.dataSourceServicios = new MatTableDataSource<Element>(this.valorServicio); 

            this.IniciarCatalogos(results[2].clues[0], results[2].servicios, results[2].distritos);

            this.usuarioForm.patchValue(this.usuario);
            //this.usuarioForm.get('clues').patchValue(this.usuario.clues[0].id);
            this.selectedAvatar = this.usuario.avatar;
            //Load Roles
            for(const i in this.usuario.roles){
              const roleIndex = this.catalogRoles.findIndex(item => item.id == this.usuario.roles[i].id);
              this.selectRole(this.catalogRoles[roleIndex]);
            }

            this.selectedRoleChipId = 0;

            //Load Permissions
            for(const i in this.usuario.permissions){
              const permission = this.usuario.permissions[i];
              if(this.assignedPermissions[permission.id]){
                this.assignedPermissions[permission.id].active = (permission.pivot.status == 1);
              }else{
                this.assignedPermissions[permission.id] = {
                  active: (permission.pivot.status == 1)?true:false,
                  description: permission.description,
                  inRoles:[]
                }
                this.selectedPermissions.push(permission);
              }
            }
          }
          //Ends: User

          this.isLoading = false;
        }
      );
    });

    this.usuarioForm.get('clues').valueChanges
    .pipe(
      debounceTime(300),
      tap( () => {
        this.cluesIsLoading = true;
      } ),
      switchMap(value => {
          if(!(typeof value === 'object')){
            return this.usersService.buscarClue({query:value}).pipe(
              finalize(() => this.cluesIsLoading = false )
            );
          }else{
            this.cluesIsLoading = false;
            return [];
          }
        }
      ),
    ).subscribe(items => this.filteredClues = items);

    this.IniciarCatalogos(null, null, null);

  }

  displayCluesFn(item: any) {

    if (item) {
      return item.nombre;
    }
  }

  agregarClue( event: MatAutocompleteSelectedEvent ){

    console.log(event.option.value);

    if(this.valorClue.length == 0){

      this.dataSourceClues = new MatTableDataSource<Element>(this.dataClues);

      this.valorClue.push(event.option.value);
      this.dataSourceClues = this.valorClue;

    }

  }

  agregarDistrito( event: MatAutocompleteSelectedEvent ){

      this.dataSourceDistritos = new MatTableDataSource<Element>(this.dataDistrito);

      this.valorDistrito.push(event.option.value);
      this.dataSourceDistritos.data = this.valorDistrito;
      this.tableServicios.renderRows();

  }

  public IniciarCatalogos(clue:any, servicio:any, distrito:any)
  {

    this.isLoading = true;    
    
    const carga_catalogos = [

      {nombre:'servicios',orden:'id', filtro_id:{campo:'clues_id',valor: clue != null ? clue.id : '' } },
      {nombre:'distritos',orden:'id'},


    ];

    this.usersService.obtenerCatalogos(carga_catalogos).subscribe(
      response => {

        this.catalogos = response.data;


        this.filteredCatalogs['servicios'] = this.usuarioForm.get('servicio_id').valueChanges.pipe(startWith(''),map(value => this._filter(value,'servicios','nombre')));
        this.filteredCatalogs['distritos'] = this.usuarioForm.get('distrito_id').valueChanges.pipe(startWith(''),map(value => this._filter(value,'distritos','nombre')));


        if(servicio)
        {
            this.usuarioForm.get('servicio_id').setValue(servicio.id);
        }
        if(distrito){

          this.usuarioForm.get('distrito_id').setValue(distrito.id);

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

  cargarServicios(event){
    
    this.isLoading = true;
    const clues = event.option.value;

    const carga_catalogos = [
      { nombre:'servicios',orden:'id', filtro_id:{campo:'clues_id',valor:clues.id} },
    ];
    console.log(carga_catalogos);
    this.catalogos['servicios'] = false;
    this.usuarioForm.get('servicio_id').reset();
    this.usuarioForm.get('servicio').reset();

    this.usersService.obtenerCatalogos(carga_catalogos).subscribe(
      response => {
        if(response.data['servicios'].length > 0){
          this.catalogos['servicios'] = response.data['servicios'];
        }
        
        this.actualizarValidacionesCatalogos('servicios');
        this.isLoading = false;
      }
    );
  }

  actualizarValidacionesCatalogos(catalogo){
    switch (catalogo) {
      case 'servicios':
        if(this.catalogos['servicios']){
          this.usuarioForm.get('servicio').clearValidators();

          this.usuarioForm.get('servicio_id').clearValidators();
        }else{
          this.usuarioForm.get('servicio').clearValidators();
          this.usuarioForm.get('servicio_id').clearValidators();
        }
        this.usuarioForm.get('servicio').updateValueAndValidity();
        this.usuarioForm.get('servicio_id').updateValueAndValidity();
        break;
      default:
        break;
    }
  }

  checkAutocompleteValue(field_name) {
    setTimeout(() => {
      if (typeof(this.usuarioForm.get(field_name).value) != 'object') {
        this.usuarioForm.get(field_name).reset();
        if(field_name != 'servicio_id'){
          this.catalogos['servicios'] = false;
          this.actualizarValidacionesCatalogos('servicios');  
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

  borrarClue(e: any){

    console.log(e);
    console.log(this.dataSourceClues.data);

        
        this.valorClue.splice(e, 1);
        this.tableClues.renderRows();
        this.valorServicio = [];
        this.dataSourceServicios.data = [];
        this.tableServicios.renderRows();

        this.usuarioForm.get('clues').reset();
        this.usuarioForm.get('servicios').reset();
        this.usuarioForm.get('servicio').reset();
        this.usuarioForm.get('servicio_id').reset();

  }

  borrarDistrito(index: any){

    console.log(index);
    console.log(this.dataSourceDistritos.data);

    this.dataSourceDistritos.data.splice(index, 1);
    this.tableDistritos.renderRows();

    //this.dataSourceDistritos = new MatTableDataSource<Element>(this.dataDistrito);
    //this.dataSourceDistritos.data.splice(index, 1);

    // for(var i = this.dataSourceDistritos.length - 1; i >= 0; i--) {
        
    //     this.dataSourceDistritos.splice(e, 1);
    //     this.dataSourceDistritos = new MatTableDataSource<Element>(this.dataDistrito);

    //     this.usuarioForm.get('distritos').setValue([]);
        
    // }
    

  }

  displayServiciosFn(item: any) {

      if (item) {
        return item.nombre;
      }

  }

  agregarServicio( event: MatAutocompleteSelectedEvent ){

      this.dataSourceServicios = new MatTableDataSource<Element>(this.dataServicio);

      this.valorServicio.push(event.option.value);
      this.dataSourceServicios.data = this.valorServicio;
      this.tableServicios.renderRows();

  }

  borrarServicio(index: any){

    //for(var i = this.dataSourceServicios.data.length - 1; i >= 0; i--) {
        
        //this.dataSourceServicios.data.splice(e.option.value, 1);
        this.dataSourceServicios.data.splice(index, 1);
        this.tableServicios.renderRows();
        //this.dataSourceServicios = new MatTableDataSource<Element>(this.dataServicio);

        // this.usuarioForm.get('servicios').setValue([]);
        // this.usuarioForm.get('servicio').reset();
        // this.usuarioForm.get('servicio_id').reset();

    //}

  }

  removeRole(index){
    const role = this.selectedRoles[index];
    this.selectedRoles.splice(index,1);
    this.selectedRolesControl[role.id] = false;

    if(role.id == this.selectedRoleChipId){
      this.selectedRoleChipId = 0;
    }

    for(const i in role.permissions){
      const permission = role.permissions[i];
      const indexOfRole = this.assignedPermissions[permission.id].inRoles.indexOf(role.id);
      this.assignedPermissions[permission.id].inRoles.splice(indexOfRole,1);

      if(this.assignedPermissions[permission.id].inRoles.length <= 0){
        delete this.assignedPermissions[permission.id];
      }
    }
    //this.usuarioForm.get('roles').patchValue(this.selectedRoles);
  }

  selectRole(role){
    //Si el Rol no esta seleccionado
    if(!this.selectedRolesControl[role.id]){

      //Lo agregamos a la lista de Roles;
      this.selectedRoles.push(role);
      this.selectedRolesControl[role.id] = true; 
      
      //Agregamos los permisos del Rol a un arreglo global de permisos
      for(const i in role.permissions){
        const permission = role.permissions[i];
        
        if(!this.assignedPermissions[permission.id]){
          this.assignedPermissions[permission.id] = {
            active: true,
            description: permission.description,
            inRoles:[role.id]
          }
        }else{
          //Si el permiso ya esta asignado es probable que este asignado desde permisos individuales
          if(this.assignedPermissions[permission.id].inRoles.length <= 0){
            const permissionIndex = this.selectedPermissions.findIndex(item => item.id == permission.id); //Si encontramos el permiso en el arreglo de permisos individuales, lo quitamos
            if(permissionIndex >= 0){
              this.selectedPermissions.splice(permissionIndex,1);
            }
          }

          this.assignedPermissions[permission.id].inRoles.push(role.id);
        }
      }

      this.showPermissionsList(role);
      //this.usuarioForm.get('roles').patchValue(this.selectedRoles);
    }else{
      //Si el rol ya esta seleccionado, lo quitamos
      const roleIndex = this.selectedRoles.findIndex(item => item.id == role.id);
      this.removeRole(roleIndex);
    }
  }

  showPermissionsList(role){ 
    this.selectedRoleChipId = role.id; 
    this.selectedRolePermissions = [];

    for(const i in role.permissions){
      const permission = role.permissions[i];
      if(this.assignedPermissions[permission.id]){
        permission.active = this.assignedPermissions[permission.id].active;
        permission.disabled = !(this.assignedPermissions[permission.id].inRoles.length > 0);
      }else{
        permission.active = false;
        permission.disabled = true;
      }
      
      this.selectedRolePermissions.push(permission);
    }
  }

  changePermissionStatus(permission){
    this.assignedPermissions[permission.id].active = !this.assignedPermissions[permission.id].active;
  }

  removePermission(index){
    const permission = this.selectedPermissions[index];
    if(this.assignedPermissions[permission.id].inRoles.length <= 0){
      if(this.assignedPermissions[permission.id].active){
        delete this.assignedPermissions[permission.id];
      }else{
        this.assignedPermissions[permission.id].active = !this.assignedPermissions[permission.id].active;
      }
    }else{
      this.assignedPermissions[permission.id].active = !this.assignedPermissions[permission.id].active;
    }

    if(!this.assignedPermissions[permission.id] || !this.assignedPermissions[permission.id].active){
      this.selectedPermissions.splice(index,1);
    }
  }

  selectPermission(permission){
    if(this.assignedPermissions[permission.id]){
      const permissionIndex = this.selectedPermissions.findIndex(item => item.id == permission.id);
      this.removePermission(permissionIndex);
    }else{
      this.selectedPermissions.push(permission);
      this.assignedPermissions[permission.id] = {
        active: true,
        description: permission.description,
        inRoles:[]
      };
    }
    //console.log(this.assignedPermissions);
  }

  accionGuardar(){
    if(this.usuarioForm.valid){
      if(this.usuarioForm.get('password').value){
        this.confirmarContrasenia();
      }else{
        this.guardarUsuario();
      }
    }
  }

  confirmarContrasenia():void {
    const dialogRef = this.dialog.open(ConfirmPasswordDialogComponent, {
      width: '500px',
      data: {password: this.usuarioForm.get('password').value}
    });

    dialogRef.afterClosed().subscribe(validPassword => {
      if(validPassword){
        this.guardarUsuario();
      }
    });
  }

  guardarUsuario(){
    this.isLoading = true;

    const roles = [];
    const permissions = {};
    let clues = [];
    let servicios_asignados = [];
    let distritos = [];

    //clues.push(this.dataSourceClues[0].id);

    for(const id in this.assignedPermissions){

      const permission = this.assignedPermissions[id];

      if(permission.inRoles.length <= 0 || (permission.inRoles.length > 0 && !permission.active)){
        permissions[id]={status:permission.active};
      }
      
      if(permission.inRoles.length > 0){
        for(const i in permission.inRoles){
          if(roles.indexOf(permission.inRoles[i]) < 0){
            roles.push(permission.inRoles[i]);
          }
        }
      }

    }

    // if(this.dataSourceClues != ""){
    //   for(let i in this.dataSourceClues){
    //     clues.push(this.dataSourceClues[i].id);
    //   }
    // }else{

    //   clues = this.dataSourceClues;

    // }
    
    // console.log('distrito', this.dataSourceDistritos);
    // console.log('clues', this.dataSourceClues);
    // console.log('servicios', this.dataSourceServicios);


    if(!this.dataSourceClues){
      for(const i in this.dataSourceClues){
        if(this.dataSourceClues[i].id){

          clues.push(this.dataSourceClues[i].id);

        }
        else{
          clues = this.valorClue[0].id;
        }
        
      }
    }else {
          clues = this.valorClue[0].id;
    }

    

    // if(this.dataSourceDistritos != ""){
    //   for(let i in this.dataSourceDistritos){
    //     distritos.push(this.dataSourceDistritos[i].id);
    //   }
    // }else{

    //   distritos = this.dataSourceDistritos;

    // }

    if(!this.dataSourceDistritos?.data){
      for(const i in this.dataSourceDistritos?.data){
        if(this.dataSourceDistritos?.data[i].id){

          distritos.push(this.dataSourceDistritos?.data[i].id);

        }
        else{
          distritos = [];
        }
        
      }
    }else{
      distritos = [];
    }

    if(!this.dataSourceServicios?.data){
      for(const i in this.dataSourceServicios?.data){
        if(this.dataSourceServicios?.data[i].id){

          servicios_asignados.push(this.dataSourceServicios?.data[i].id);

        }
        else{
          servicios_asignados = [];
        }
        
      }
    }else{
      servicios_asignados = [];
    }

    if(!clues || !distritos){
      
      this.isLoading = false;
      this.sharedService.showSnackBar('Debe seleccionar una Clues ó Distrito al Usuario', 'Cerrar', 6000);

    }else{

      console.log("unidad",clues);
      

        this.usuarioForm.get('permissions').patchValue(permissions);
        this.usuarioForm.get('roles').patchValue(roles);
        this.usuarioForm.get('clues').patchValue(clues);
        this.usuarioForm.get('distritos').patchValue(distritos);
        this.usuarioForm.get('servicios').patchValue(servicios_asignados);
        this.usuarioForm.get('avatar').patchValue(this.selectedAvatar);

        if(this.usuario.id){
          this.usersService.updateUser(this.usuarioForm.value,this.usuario.id).subscribe(
            response=>{
              if(response.guardado){
                this.sharedService.showSnackBar('Usuario Actualizado con éxito', 'Cerrar', 4000);
                this.router.navigate(['/usuarios']);
                if(this.authUser.id == response.usuario.id){
                  this.authService.updateUserData(response.usuario);
                }
              }
              
              this.isLoading = false;
            }
          );
        }else{
          this.usersService.createUser(this.usuarioForm.value).subscribe(
            response =>{
              this.sharedService.showSnackBar('Usuario guardados con éxito', 'Cerrar', 4000);
              this.router.navigate(['/usuarios']);
              this.usuario = response.data;
              this.isLoading = false;
            }
          );
        }
    }
  }

  clearRolesFilter(){
    this.filterInputRoles.setValue('');
  }
  clearPermissionsFilter(){
    this.filterInputPermissions.setValue('');
  }
}