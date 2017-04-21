import { Component } from '@angular/core';
import { Http, Response } from '@angular/http';
import { AuthService } from '../services/auth.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { WebsocketService } from '../services/websocket.service';
import { Observable } from 'rxjs/Observable';

import { Injectable } from '@angular/core';
import { JwtHelper } from 'angular2-jwt';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Component({
    selector: 'reset',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.css'],
    providers: []
})
export class ResetPasswordComponent {
    jwtHelper: JwtHelper = new JwtHelper();
    newPassword: string;
    repeatNewPassword: string;
    token: string;
    constructor(private http: Http,
        private authService: AuthService,
        private route: ActivatedRoute,
        private router: Router
    ) {

    }
    ngOnInit() {
        this.route.params
            .subscribe((params) => {
                this.token = params['token'];
            });
    }
    onSubmit(): void {
        if (!this.newPassword || !this.repeatNewPassword) {
            alert('Fill in all the fields');
            return;
        }
        if (this.repeatNewPassword != this.newPassword) {
            alert('Wrong data');
            return;
        }
        this.authService.resetPassword(this.token, this.newPassword).subscribe(
            data => {
                this.router.navigate(['/login']);
            });
        this.newPassword = '';
        this.repeatNewPassword = '';
    }
}
