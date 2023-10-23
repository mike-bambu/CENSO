export class Calidad {
    name: string;
    route: string;
    icon: string;
    permission?: string; //Si tiene permisos se motrara/oculatara dependiendo de los permisos que el usuario tenga asignado
    hideHome?: boolean; //Si es verdadero ocultara el elemento que dirige a raiz, en la lista que aparece en los modulos con hijos (la raiz es la ruta de la aplicación padre)
    isHub?: boolean; //Si es verdadero solo mostrara la aplicación en el HUB cuando tenga al menos un hijo activo, de lo contario se ocultara, si es falso siempre estara presente en el HUB (tomando encuenta los permisos asignados) sin importar si tiene hijos o no activos
    children?: Calidad[]; //Lista de modulos y componentes hijos de la aplicación
    apps?:Calidad[]; //Hub secundario de apps
  }
  
export const CALIDADAPPS:Calidad [] = [
    
    { name:'Atención de partos',          route: "calidad-partos",            icon: "assets/icons/quality-births.png",       permission:"5nk8JKI05ZTkJ5m4nyigUbhXdj1dfPRK" },
    { name:'Complicaciones obstétricas',          route: "vista-complicaciones",            icon: "assets/icons/quality-obstetric.png",       permission:"Gd48WHVrVKUZsD10xPc1jDRv7KdLUYPw" },
    { name:'Recién nacidos prematuros',          route: "vista-recien-nacidos",            icon: "assets/icons/quality-premature.png",       permission:"qf6YTqckJSFAqBQcNXfs6ZLeyQXmqB9T" },
    { name:'Complicaciones neonatales',          route: "vista-complicaciones-neonatales",            icon: "assets/icons/quality-complications.png",       permission:"f5qlK1VSzhwKpARNr247Rsklnnx9Hsfw" },
    { name:'Referencia y contrarreferencia',          route: "vista-referencia",            icon: "assets/icons/quality-reference.png",       permission:"mxZg8nYXsxZizyD9ZtruCYSBSh24SUqN" },
    { name:'Reportes',          route: "calidad-reportes",            icon: "assets/icons/quality-reports.png",       permission:"1gpG93AQcwZGPIbWtF67OjzSGU909yVA" },
]