import { Component } from '@angular/core';
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
