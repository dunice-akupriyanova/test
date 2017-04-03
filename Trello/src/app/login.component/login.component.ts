import { Component } from '@angular/core';
import { Http, Response } from '@angular/http';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { JwtHelper } from 'angular2-jwt';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    providers: [AuthService]
})
export class LoginComponent {
    jwtHelper: JwtHelper = new JwtHelper();
    username: string;
    password: string;
    user: any;
    constructor(private http: Http,
                private authService: AuthService,
                private router: Router
               ) { }
    goToBoatds(): void {
        this.router.navigate(['/boards']);
    }
    onSubmit(): void {
        this.authService.postForm(this.username, this.password, 'http://localhost:3000/auth/token').subscribe(
            data => {
                this.authService.setTokens(data);
                this.authService.auth(data.accessToken).subscribe(data => {
                    this.router.navigate(['/boards']);
                });
            });
        this.username = '';
        this.password = '';
    }
}
