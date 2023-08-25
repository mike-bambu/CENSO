import { Component, OnInit } from '@angular/core';
import { ProfileService } from './profile.service';
import { SharedService } from '../shared/shared.service';
import { Validators, FormControl, UntypedFormBuilder } from '@angular/forms';
import { AVATARS } from '../avatars';
import { User } from '../auth/models/user';
import { AuthService } from '../auth/auth.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(
    private sharedService: SharedService, 
    private profileService: ProfileService,
    private authService: AuthService, 
    private route: ActivatedRoute, 
    private fb: UntypedFormBuilder,
    public dialog: MatDialog
  ) { }

  isLoading = false;
  hidePassword = true;

  authUser: User;
  
  usuario:any = {};

  usuarioForm = this.fb.group({
    'name': ['',Validators.required],
    'email': ['',[Validators.required, Validators.email]],
    'username': ['',[Validators.required, Validators.minLength(4)]],
    'password': ['',[Validators.minLength(6)]],
    'is_superuser': [false],
    'avatar': [''],
    'roles': [[]],
    'permissions': [[]]
  });

  avatarList: any[] = [];

  selectedRoles: any[] = [];
  selectedRolePermissions: any[] = [];
  rolesPermissions: any[] = [];
  selectedPermissions: any[] = [];
  selectedRoleChipId = 0;

  selectedAvatar:string = AVATARS[0].file;

  ngOnInit() {
    this.isLoading = true;

    this.authUser = this.authService.getUserData();

    this.avatarList = AVATARS;

    const id = this.authUser.id;

    this.profileService.getProfileData(id).subscribe(
      response => {
        console.log(response);

        this.usuario = response.data;
        this.usuarioForm.patchValue(this.usuario);

        this.selectedAvatar = this.usuario.avatar;

        this.selectedRoleChipId = 0;

        //Load Roles
        for(const i in this.usuario.roles){
          const role = this.usuario.roles[i];
          this.selectedRoles.push(role);
          for(const j in role.permissions){
            const permission = role.permissions[j];
            if(!this.rolesPermissions[permission.id]){
              this.rolesPermissions[permission.id] = {
                roles: [],
                active: true
              }
            }
            this.rolesPermissions[permission.id].roles.push(role.id);
          }
        }
        
        //Load Permissions
        const tempRole = {id: 999999, name:'PERMISOS-ASIGNADOS', permissions:[]};
        for(const i in this.usuario.permissions){
          const permission = this.usuario.permissions[i];
          if(this.rolesPermissions[permission.id]){
            this.rolesPermissions[permission.id].active = (permission.pivot.status == 1);
          }else{
            this.rolesPermissions[permission.id] = {active: (permission.pivot.status == 1)};
            tempRole.permissions.push(permission);
          }
        }
        if(tempRole.permissions.length > 0){
          this.selectedRoles.push(tempRole);
        }

        this.isLoading = false;
      }
    );

    /*this.profileService.getServerProfile().subscribe( 
      response => {
        console.log(response);
      }, error => {
        console.log(error);
        this.sharedService.showSnackBar("Hubo un error al cargar el perfil.",null,3000);
      }
    );*/
  }

  showPermissionsList(role){ 
    this.selectedRoleChipId = role.id; 
    this.selectedRolePermissions = [];

    for(const i in role.permissions){
      const permission = role.permissions[i];
      if(this.rolesPermissions[permission.id].active){
        //permission.active = this.rolesPermissions[permission.id].active;
        this.selectedRolePermissions.push(permission);
      }
      /*else{
        permission.active = false;
      }*/
    }
  }

  guardarUsuario(){
    this.isLoading = true;

    this.usuarioForm.get('avatar').patchValue(this.selectedAvatar);

    this.profileService.updateUser(this.usuarioForm.value,this.usuario.id).subscribe(
      response=>{
        if(response.guardado){
          this.sharedService.showSnackBar('Datos guardados con éxito', null, 3000);
          
          if(this.authUser.id == response.usuario.id){
            this.authService.updateUserData(response.usuario);
          }
        }
        
        this.isLoading = false;
      }
    );
  }
}
