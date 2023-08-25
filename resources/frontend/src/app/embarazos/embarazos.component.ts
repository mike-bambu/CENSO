import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppsListService } from '../apps-list/apps-list.service';

@Component({
    selector: 'app-embarazos',
    template: `Oops, You shouldn't be here...`,
    styles: []
})
export class EmbarazosComponent implements OnInit {

    constructor(private router: Router, private appsListService: AppsListService) { }

    ngOnInit() {
        const ruta = this.appsListService.defaultChildRoute('embarazos');
        console.log(ruta);
        if (ruta != '...') {
            this.router.navigate([ruta]);
        }
    }

}
