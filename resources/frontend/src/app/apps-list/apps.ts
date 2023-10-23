export class App {
    name: string;
    route: string;
    icon: string;
    permission?: string; //Si tiene permisos se motrara/oculatara dependiendo de los permisos que el usuario tenga asignado
    hideHome?: boolean; //Si es verdadero ocultara el elemento que dirige a raiz, en la lista que aparece en los modulos con hijos (la raiz es la ruta de la aplicación padre)
    isHub?: boolean; //Si es verdadero solo mostrara la aplicación en el HUB cuando tenga al menos un hijo activo, de lo contario se ocultara, si es falso siempre estara presente en el HUB (tomando encuenta los permisos asignados) sin importar si tiene hijos o no activos
    children?: App[]; //Lista de modulos y componentes hijos de la aplicación
    apps?:App[]; //Hub secundario de apps
  }
  
export const APPS:App [] = [
    { name: "Usuarios", route: "usuarios",    icon: "assets/icons/users.svg",                 permission:"nTSk4Y4SFKMyQmRD4ku0UCiNWIDe8OEt" },
    { name: 'Permisos',  route: "permisos",   icon: "assets/icons/security-shield.svg",       permission:"RGMUpFAiRuv7UFoJroHP6CtvmpoFlQXl" },
    { name: 'Roles',     route: "roles",      icon: "assets/icons/users-roles.svg",           permission:"nrPqEhq2TX0mI7qT7glaOCJ7Iqx2QtPs" },

    { name:'Ingreso de Pacientes',          route: "ingresos",            icon: "assets/icons/ingreso-pacientes.svg",       permission:"89eVFFOFYgKcsugz8HiqAcjbLlYjqz1I" },
    { name:'Atención de Pacientes',         route: "atencion-pacientes",  icon: "assets/icons/atencion-pacientes.svg",      permission:"u7OGmW0LOyCRXyEce9OGPdvN6KocWj0j" },
    { name:'Camas',                         route: "resumen-camas",       icon: "assets/icons/camas.svg",                   permission:"QRZdaoNBpD8wS8bEp2hhNTia8eHiCuZq" },
    { name:'Servicios',                     route: "servicios",           icon: "assets/icons/servicios.svg",               permission:"z1UrTv1YykRmOwJKSvjOMqcbIppMrElO" },
    { name: "Monitoreo de Pacientes",       route: "reportes",            icon: "assets/icons/reportes.svg",                isHub: true, hideHome: true,
      children: [
        {
          name: "Pacientes Ambulatorios",
          route: "reportes/pacientes-ambulatorios",
          icon: "sports_kabaddi",
          permission: "ND5v4eiz1uGUY25Q5mtJYzKjeoow9jh5"
        },
        {
          name: "Pacientes Hospitalizados",
          route: "reportes/pacientes-hospitalizados",
          icon: "published_with_changes",
          permission: "icKcLeb5vUfh2kmLudIofkEeIIjx7nOA"
        },

      ],
    },
    { name:'Visita Puerperal',  route: "visita-puerperal",        icon: "assets/icons/puerpera.svg",               permission:"CMNRnYJmgbjrREVkvXOYcETIRh5aTO58" },

    { name: "Reporte de Embarazos",        route: "embarazos",               icon: "assets/icons/embarazos.svg",              isHub: true, hideHome: true,
      children: [
        {
          name: "Embarazos Hospitalizados",
          route: "embarazos/embarazos-hospitalizados",
          icon: "pregnant_woman",
          permission: "dZaXrMJMG7NV5bhr20oKEqJ4Mn8cvW55"
        },

        {
          name: "Embarazos Ambulatorios",
          route: "embarazos/embarazos-ambulatorios",
          icon: "female",
          permission: "57r97HCGmgqHD9zCJiNlRG2WZF4QNGeq"
        },
        // {
        //   name: "Pacientes Hospitalizados",
        //   route: "embarazos/pacientes-hospitalizados",
        //   icon: "published_with_changes",
        //   permission: ""
        // },
      ],
    },

    { name:'Medición de la calidad',  route: "calidad",        icon: "assets/icons/settings.svg",               permission:"5gdB4ltPL60KEtdUYuicIcHWSYo5XU8G" },



//   { name:'PADRE HUB',   route: "ruta-padre",       icon: "", 
//   apps:[
//     { name:'HIJOS',        route: "ruta-padre/ruta-hija",        icon: "assets/icons/entrada-almacen.svg", permission:""  },
//     { name:'HIJOS',        route: "ruta-padre/ruta-hija",        icon: "assets/icons/salida-almacen.svg",  permission:""  },
//   ]
// },
    

        // { 
        //     name: "Catalogos",
        //     route: "catalogos",
        //     icon: "assets/icons/catalogos.svg",
        //     isHub:true,
        //     hideHome:true, 
        //       children: [
        //           {
        //             name: "Servicios",
        //             route:"catalogos/servicios",
        //             icon: "loyalty",
        //             permission:""
        //           },
        //           {
        //             name: "Camas",
        //             route:"catalogos/camas",
        //             icon: "airline_seat_individual_suite",
        //             permission:""
        //           },
        //       ]
        // },
    
    /*
    { name: "Seguridad", route: "seguridad", icon: "assets/icons/security-shield.svg", 
        children: [
            {name:'Permisos',route:'permisos',icon:'lock', permission:"RGMUpFAiRuv7UFoJroHP6CtvmpoFlQXl"},
            {name:'Roles',route:'roles',icon:'people_alt', permission:"nrPqEhq2TX0mI7qT7glaOCJ7Iqx2QtPs"}
        ] 
    },*/
    //{ name: "Viáticos", route: "configuracion", icon: "assets/icons/travel-expenses.png" },
    //{ name: "Herramientas", route: "herramientas", icon: "assets/icons/toolbox.svg" },    
    //{ name: "Configuración", route: "configuracion", icon: "assets/icons/settings.svg" },
]