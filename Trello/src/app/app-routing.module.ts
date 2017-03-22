import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BoardsComponent }  from './boards.component/boards.component';
import { LoginComponent }    from './login.component/login.component';
import { CurrentBoardComponent }    from './current-board.component/current-board.component';
import {MainComponent} from './main.component/main.component';

const appRoutes: Routes = [
    {
        path: 'login',
        component: LoginComponent
    },
    { 
        path: '',
        component: MainComponent,
        children: [
        {
            path: 'boards',
            component: BoardsComponent
        },
        {
            path: 'board/:id',
            component: CurrentBoardComponent
        }
        ]
    }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
