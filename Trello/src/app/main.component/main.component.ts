import { Component, OnInit } from '@angular/core';
import { BackendService } from '../services/backend.service';
import { Http, Response } from '@angular/http';
import { AuthService } from '../services/auth.service';
import { UsersService } from '../services/users.service';
import { JwtHelper } from 'angular2-jwt';
import { User } from '../models/classes/user';
import { Notification } from '../models/classes/notification';

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
    user: User;
    users: Array<User>;
    tokens: any = this.authService.getTokens();
    rights: String;
    notifications: Array<Notification>=[];
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
        this.usersService.getUsersFromServer().subscribe(
            data => {
                this.usersService.putUsers(data);
                this.users = this.usersService.getUsers();
                this.user=this.usersService.getUserById(this.jwtHelper.decodeToken(this.tokens.accessToken).id);
                this.usersService.getNotification(this.user.username).subscribe(data => {
                    // console.log('getNotification');
                    // console.log(data);
                    for (let i=0; i<data.length; i++) {
                        this.notifications[i] = new Notification(data[i].username, data[i].boardID, data[i].cards);
                        console.log(this.notifications[i].cards);
                    }
                });
            });
    }
}
