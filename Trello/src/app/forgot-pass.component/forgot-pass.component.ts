import { Component } from '@angular/core';
import { Http, Response } from '@angular/http';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { WebsocketService } from '../services/websocket.service';
import { Observable } from 'rxjs/Observable';

// import { JwtHelper } from 'angular2-jwt';
import 'rxjs/add/operator/map';

@Component({
    selector: 'forgot-pass',
    templateUrl: './forgot-pass.component.html',
    styleUrls: ['./forgot-pass.component.css'],
    providers: []
})
export class ForgotPpassComponent {
    username: string;
    public forgotPass: Observable<any>;
    constructor(private http: Http,
        private authService: AuthService,
        private router: Router,
        private wsService: WebsocketService
    ) {}
    onSubmit(): void {
        this.authService.forgotPassword(this.username).subscribe(data => {
            if (!data) {
                alert('Something went wrong');
                return;
            }
            alert('The link for reset you password was sent to your email.');
        });
        this.username = '';
    }
}
