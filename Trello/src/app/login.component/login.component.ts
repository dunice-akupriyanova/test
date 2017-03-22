import { Component, Input } from '@angular/core';
import { AppComponent } from '../app.component/app.component';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  login: string;
  saveLogin(login): void {
    if (login) {
      localStorage.setItem('login', login);
    } else {
      localStorage.setItem('login', '');
      return;
    }
  }
}
