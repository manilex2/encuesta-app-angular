import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { currentUser } from 'src/app/admin/store/selectors/currentuser.selectors';
import { GET_CURRENT_USER } from 'src/app/admin/store/actions/currentuser.actions';

@Component({
  selector: 'app-selec-encuesta',
  templateUrl: '../views/selec-encuesta.component.html',
  styleUrls: ['../styles/selec-encuesta.component.scss']
})
export class SelecEncuestaComponent implements OnInit {
  encuestas? = [];

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.store.pipe(select(currentUser))
    .subscribe(current => {
      this.store.dispatch(GET_CURRENT_USER());
      this.encuestas = current.tipos_encuesta;
    });
  }

}
