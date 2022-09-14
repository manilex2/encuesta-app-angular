import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, exhaustMap } from 'rxjs';
import { AdminService } from '../../services/admin.service';
import { GET_ADMINS, GET_ADMINS_ERROR, GET_ADMINS_SUCCESS } from '../actions/admin.actions';

@Injectable()
export class AdminsEffect {
  constructor(
    private actions$: Actions,
    private adminService: AdminService,
  ) {}

  loadAllAdmins$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GET_ADMINS),
      exhaustMap((initAction) => {
        return this.adminService.obtenerTodosAdmins().pipe(
          map(admins => GET_ADMINS_SUCCESS({admins})),
          catchError(() => of(GET_ADMINS_ERROR({error: "Ha ocurrido un error al obtener los admins"}))),
        );
      })
    )
  )
};
