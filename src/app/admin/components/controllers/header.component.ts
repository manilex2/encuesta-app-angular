import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { AdminService } from '../../services/admin.service';
import { CurrentUser } from '../models';
import { select, Store } from '@ngrx/store';
import { currentUser } from '../../store/selectors/currentuser.selectors';
import { GET_CURRENT_USER } from '../../store/actions/currentuser.actions';

@Component({
  selector: 'app-header',
  templateUrl: '../views/header.component.html',
  styleUrls: ['../styles/header.component.scss']
})
export class HeaderComponent implements OnInit {
  show: boolean = false;
  logo: string | Blob = '';
  backgColor: string = '';
  currentUser: CurrentUser[] = [];

  constructor(private authService: AuthService, private store: Store) { }

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      localStorage.removeItem('auth_token');
    } else {
      this.transformar();
    }
  }

  transformar() {
    if (!this.authService.isAuthenticated()) {
      localStorage.removeItem('auth_token');
      this.show = false;
      return;
    } else {
      this.store.pipe(select(currentUser))
      .subscribe(current => {
        this.store.dispatch(GET_CURRENT_USER());
        if (current.logo) {
          const canvas: any = current.logo;
          this.logo = current.logo;
          this.show = true;
          /* const ctx = canvas.getContext('2d');
          canvas.width = 1;
          canvas.height = 1;
          const _that = this;
          this.getDominantColor(this.logo, ctx, _that); */
        } else {
          this.show = false;
        }
      });
    }
  }

  /* getDominantColor(imageObject: any, ctx: any, _that: any) {
    //draw the image to one pixel and let the browser find the dominant color
    ctx.drawImage(imageObject, 0, 0, 1, 1);

    //get pixel color
    const i = ctx.getImageData(0, 0, 1, 1).data;

    console.log(`rgba(${i[0]},${i[1]},${i[2]},${i[3]})`);
    console.log(
      '#' +
        ((1 << 24) + (i[0] << 16) + (i[1] << 8) + i[2]).toString(16).slice(1)
    );
  } */
}
