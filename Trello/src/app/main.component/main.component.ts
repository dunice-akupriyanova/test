import { Component, Input } from '@angular/core';
import { AppComponent } from '../app.component/app.component';
import { Board } from '../models/classes/board';
import { BackendService } from '../services/backend.service';

@Component({
    selector: 'main',
    templateUrl: './main.component.html',
    styleUrls:['./main.component.css'],
    providers: [BackendService]
})
export class MainComponent {
    constructor(private backendService: BackendService) { }
    login: string=this.backendService.getUser();
}
