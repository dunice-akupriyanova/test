import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BoardsComponent }  from '../boards.component/boards.component';
import { LoginComponent }    from '../login.component/login.component';
import { CurrentBoardComponent }    from '../current-board.component/current-board.component';
import { MainComponent } from '../main.component/main.component';
import { LoggedOutComponent } from '../logged-out.component/logged-out.component';
import { SignupComponent } from '../signup.component/signup.component';


const appRoutes: Routes = [
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'logged-out',
        component: LoggedOutComponent
    },
    {
        path: 'signup',
        component: SignupComponent
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
