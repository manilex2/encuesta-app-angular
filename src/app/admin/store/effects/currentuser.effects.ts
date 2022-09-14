import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, exhaustMap } from 'rxjs';
import { AdminService } from '../../services/admin.service';
import { GET_CURRENT_USER, GET_CURRENT_USER_ERROR, GET_CURRENT_USER_SUCCESS} from '../actions/currentuser.actions';

@Injectable()
export class CurrentUserEffect {
  constructor(
    private actions$: Actions,
    private adminService: AdminService,
  ) {}

  loadCurrentUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GET_CURRENT_USER),
      exhaustMap((initAction) => {
        return this.adminService.obtenerCurrentUser().pipe(
          map(currentUser => GET_CURRENT_USER_SUCCESS({currentUser})),
          catchError(() => of(GET_CURRENT_USER_ERROR({error: "Ha ocurrido un error al obtener el usuario actual"}))),
        );
      })
    )
  )
};
