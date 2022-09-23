import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, exhaustMap, tap } from 'rxjs';
import { AdminService } from '../../services/admin.service';
import { GET_CURRENT_USER, GET_CURRENT_USER_SUCCESS } from '../actions/currentuser.actions';

@Injectable()
export class CurrentUserEffect {
  constructor(
    private actions$: Actions,
    private adminService: AdminService,
  ) {}

  loadCurrentUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GET_CURRENT_USER),
      exhaustMap(() => {
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
