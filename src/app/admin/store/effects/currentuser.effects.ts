import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from "@ngrx/store";
import { catchError, map, of, exhaustMap, tap, EMPTY } from 'rxjs';
import { setAPIStatus } from "src/app/shared/store/actions/app.actions";
import { Appstate } from "src/app/shared/store/AppState";
import { selectAppState } from "src/app/shared/store/selectors/app.selectors";
import { AdminService } from '../../services/admin.service';
import { GET_CURRENT_USER, GET_CURRENT_USER_SUCCESS } from '../actions/currentuser.actions';

@Injectable()
export class CurrentUserEffect {
  constructor(
    private actions$: Actions,
    private adminService: AdminService,
    private appStore: Store<Appstate>
  ) {}

  loadCurrentUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GET_CURRENT_USER),
      exhaustMap(() => {
        let loginStatus: any;
        let token = localStorage.getItem('auth_token');
        this.appStore.pipe(select(selectAppState)).subscribe(data => loginStatus = data.loginStatus);
        if (loginStatus === "logout" && !token) {
          return EMPTY;
        } else {
          this.appStore.dispatch(setAPIStatus({apiStatus: {apiResponseMessage: '', apiStatus: '', apiCodeStatus: 200, loginStatus: "logged"}}))
        }
        return this.adminService.obtenerCurrentUser().pipe(
          map(currentUser => {
            return GET_CURRENT_USER_SUCCESS({currentUser});
          }),
          catchError((error) => {
            throw error;
          }),
        );
      })
    )
  )
};
