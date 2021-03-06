import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { MdSnackBar } from '@angular/material';
import * as fromRoot from '../reducers';
import * as fromAuthentication from '../reducers/authentication';

@Component({
  selector: 'login',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <md-card>
      <md-card-title>Login</md-card-title>
      <md-card-content>
        <md-input-container>
          <input md-input [(ngModel)]="username" placeholder="Username">
        </md-input-container>

        <md-input-container>
          <input md-input [(ngModel)]="password" placeholder="Password">
        </md-input-container>
      </md-card-content>
      <md-card-actions>
        <button md-raised-button color="primary" (click)="doLogin(username, password)">Login</button>
        <button md-raised-button color="secondary" routerLink="/register">Register</button>
      </md-card-actions>
    </md-card>
  `,
  styles: [`
    :host {
      text-align: center;
    }
  `]
})
export class LoginPageComponent {
  authentication$: Observable<any>;
  username: string;
  password: string;

  constructor(
    private store: Store<fromRoot.State>,
    private router: Router,
    private snackbar: MdSnackBar
  ) {
    // this.authentication$ = store.select('authentication');
    this.authentication$ = store.select(s => s.authentication);

    this.authentication$.subscribe((action: fromAuthentication.State) => {
      if (action.isLogged) {
        this.snackbar.open('You are logged in', 'Ok', {
          duration: 2000
        });
        this.router.navigate(['dashboard']);
      } else {
        this.snackbar.open('You are not logged in', 'Ok', {
          duration: 2500
        });
        window.localStorage.removeItem('token');
      }
    });

    this.store.dispatch({
      type: fromAuthentication.ActionTypes.AUTHENTICATION_TEST_REQUEST,
    });
  }

  doLogin(username, password) {
    this.store.dispatch({
      type: fromAuthentication.ActionTypes.AUTHENTICATION_REQUEST,
      payload: {
        username,
        password
      }
    });
  }
}
