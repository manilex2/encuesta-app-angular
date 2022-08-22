import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { EMPTY, map, mergeMap, withLatestFrom } from 'rxjs';
import { AdminService } from '../../services/admin.service';
import { adminGET, adminGETSuccess } from '../actions/admin.action';
import { selectAdmins } from '../selectors/admin.selector';

@Injectable()
export class AdminsEffect {
  constructor(
    private actions$: Actions,
    private adminService: AdminService,
    private store: Store
  ) {}

  loadAllAdmins$ = createEffect(() =>
    this.actions$.pipe(
      ofType(adminGET),
      withLatestFrom(this.store.pipe(select(selectAdmins))),
      mergeMap(([, adminsStore]) => {
        if (adminsStore.length > 0) {
          return EMPTY;
        }
        return this.adminService
          .obtenerTodosAdmins()
          .pipe(map((data) => adminGETSuccess({ admins: data })));
      })
    )
  );
}
