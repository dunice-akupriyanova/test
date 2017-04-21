import { Component } from '@angular/core';
import { Http, Response } from '@angular/http';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { WebsocketService } from '../services/websocket.service';
import { Observable } from 'rxjs/Observable';

// import { JwtHelper } from 'angular2-jwt';
import 'rxjs/add/operator/map';

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    providers: []
})
export class LoginComponent {
    // jwtHelper: JwtHelper = new JwtHelper();
    username: string;
    password: string;
    public forgotPass: Observable<any>;
    constructor(private http: Http,
        private authService: AuthService,
        private router: Router,
        private wsService: WebsocketService
    ) {}
    onSubmit(): void {
        this.authService.postForm(this.username, this.password, 'http://localhost:3000/auth/token').subscribe(
            data => {
                AuthService.setTokens(data);
                this.authService.auth(data.accessToken).subscribe(data => {
                    this.router.navigate(['/boards']);
                });
            });
        this.username = '';
        this.password = '';
    }
    forgotPassword(): void {
        this.router.navigate(['/forgot-pass']);
    }
}
