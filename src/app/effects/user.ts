import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/debounceTime';
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Effect, Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromUser from '../reducers/user';

import { UserService } from '../services/user';

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private api: UserService
  ) { }

  @Effect()
  auth$: Observable<Action> = this.actions$
    .ofType(fromUser.ActionTypes.USERS_REQUEST)
    .debounceTime(50)
    .map(action => action.payload)
    .switchMap(payload => {
      console.log(payload);
      return this.api.getAll()
        .map((res: Response) => {
          if (res.ok) {
            return res.json();
          } else {
            return <Action>{
              type: fromUser.ActionTypes.USERS_FAIL
            };
          }
        })
        .map(users => {
          return <Action>{
            type: fromUser.ActionTypes.USERS_SUCCESS,
            payload: users
          };
      });
    });
}
