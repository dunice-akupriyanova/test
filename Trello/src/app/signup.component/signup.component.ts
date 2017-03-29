import { Component } from '@angular/core';
import { Http, Response } from '@angular/http';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

import { Injectable }              from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';


@Component({
  selector: 'signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  providers: [AuthService]
})
export class SignupComponent {
    email: string;
    password: string;
    constructor (private http: Http, private authService: AuthService, private router: Router) {}
    onSubmit(): void {
        this.authService.postForm(this.email, this.password, 'http://localhost:3000/auth/signup').subscribe(
                     data  => {},
                     error =>  {});
        console.log("ok");
        this.email='';
        this.password='';
        this.router.navigate(['/boards']);
    }
}
