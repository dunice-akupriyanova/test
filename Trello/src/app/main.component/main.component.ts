import { Component } from '@angular/core';
import { BackendService } from '../services/backend.service';
import { Http, Response } from '@angular/http';
import { AuthService } from '../services/auth.service';

import { Injectable }              from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Component({
    selector: 'main',
    templateUrl: './main.component.html',
    styleUrls:['./main.component.css'],
    providers: [BackendService, AuthService]
})
export class MainComponent {
    constructor(private backendService: BackendService, private http: Http, private authService: AuthService) { }
    login: string=this.backendService.getUser();
    logOut(): void {
        this.authService.logOut().subscribe();;
    }
}
