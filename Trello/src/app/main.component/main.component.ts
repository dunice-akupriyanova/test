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
    // username = MainComponent.username;
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
        this.authService.logOut().subscribe();
    }
    ngOnInit() {
        // console.log(this.tokens);
        this.usersService.getUsersFromServer().subscribe(
            data => {
                this.usersService.putUsers(data);
                this.users = this.usersService.getUsers();
                // MainComponent.user=this.usersService.getUserById(this.jwtHelper.decodeToken(this.tokens.accessToken).id);
                this.user=this.usersService.getUserById(this.jwtHelper.decodeToken(this.tokens.accessToken).id);
                let id = JSON.parse(localStorage.getItem('UserID')?localStorage.getItem('UserID'):'');
                // this.usersService.getRights(id, this.currentBoard.id).subscribe(
                //     data => {
                //         this.rights = data.rights;
                //         // console.log('getRights');
                //         // console.log(this.rights);
                //     }
                // );
            });
    }
}
