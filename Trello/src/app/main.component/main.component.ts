import { Component, OnInit } from '@angular/core';
import { BackendService } from '../services/backend.service';
import { Http, Response } from '@angular/http';
import { AuthService } from '../services/auth.service';
import { UsersService } from '../services/users.service';
import { JwtHelper } from 'angular2-jwt';
import { User } from '../models/classes/user';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Component({
    selector: 'main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.css'],
    providers: [BackendService, AuthService, UsersService]
})
export class MainComponent {
    jwtHelper: JwtHelper = new JwtHelper();
    user: Object = {};
    users: Array<User>;
    tokens: any = this.authService.getTokens();
    rights: String;
    constructor(
        private backendService: BackendService,
        private http: Http,
        private usersService: UsersService,
        private authService: AuthService
    ) { }
    logOut(): void {
        this.authService.logOut().subscribe(_ => {
            console.trace();
        });
    }
    ngOnInit() {
        this.usersService.getUsersFromServer().subscribe(
            data => {
                this.usersService.putUsers(data);
                this.users = this.usersService.getUsers();
                this.user=this.usersService.getUserById(this.jwtHelper.decodeToken(this.tokens.accessToken).id);
            });
    }
}
