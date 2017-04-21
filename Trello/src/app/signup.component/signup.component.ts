import { Component } from '@angular/core';
import { Http, Response } from '@angular/http';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css'],
    providers: [AuthService]
})
export class SignupComponent {
    login: string;
    password: string;
    constructor(private http: Http,
                private authService: AuthService,
                private router: Router
                ) { }
    onSubmit(): void {
        this.authService.postForm(
            this.login,
            this.password,
            'http://localhost:3000/auth/signup'
        ).subscribe(
            data => {
                AuthService.setTokens(data);
                this.authService.auth(data.accessToken).subscribe(user => {
                    this.router.navigate(['/boards']);
                });
            },
            error => { });
        this.login = '';
        this.password = '';
    }
}
