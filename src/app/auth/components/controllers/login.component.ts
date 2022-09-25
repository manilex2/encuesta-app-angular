import { Injectable } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../models';
import { AuthService } from '../../services/auth.service';
import { select, Store } from '@ngrx/store';
import { Appstate } from 'src/app/shared/store/AppState';
import { LOGIN } from '../../store/actions/login.actions';
import { selectAppState } from 'src/app/shared/store/selectors/app.selectors';
import { setAPIStatus } from 'src/app/shared/store/actions/app.actions';
import { ToastrService } from 'ngx-toastr';
import { user } from '../../store/selectors/login.selectors';

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-login',
  templateUrl: '../views/login.component.html',
  styleUrls: ['../styles/login.component.scss']
})
export class LoginComponent implements OnInit {

  hide = true;
  token = localStorage.getItem("auth_token");

  ngOnInit() {
    if(this.token) {
      this.router.navigate(["admin"]);
    }
  }

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private appStore: Store<Appstate>,
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService
  ) { }

  loginForm = this.fb.group<User>({
    codigo: ["", [Validators.required, Validators.pattern(/[0-9]{3}/g)]],
    clave: ["", [Validators.required]]
  });

  onSubmit() {
    this.authService.login(this.loginForm.value);
    this.store.dispatch(LOGIN({ user: this.loginForm.value }));
    let apiStatus$ = this.appStore.pipe(select(selectAppState))
    apiStatus$.subscribe((data) => {
      if (data.apiStatus === "success" && data.loginStatus === "login") {
        this.appStore.dispatch(setAPIStatus({
          apiStatus: {
            apiCodeStatus: 200,
            apiResponseMessage: '',
            apiStatus: '',
            loginStatus: "logged"
          }}))
        this.toastr.success("Usuario logeado con exito.", "Login", {
          progressBar: true
        })
        this.store.pipe(select(user)).subscribe((data => {
          for (let i = 0; i < data.length; i++) {
            const token = data[i].token;
            this.router.navigate(['admin']);
            localStorage.setItem('auth_token', token);
          }
        }))
      } else if (data.apiStatus === "error" && data.loginStatus === "logout") {
        this.appStore.dispatch(setAPIStatus({ apiStatus: { apiStatus: '', apiResponseMessage: '', apiCodeStatus: 200 } }));
        this.toastr.error(data.apiResponseMessage, "Login", {
          progressBar: true
        })
      }
    })
    /* this.store.dispatch(LOGIN({user: this.loginForm.value}))
    this.store.pipe(select(user)).subscribe((data => {
      this.getToken = data.token;
    }))

    let apiStatus$ = this.appStore.pipe(select(selectAppState))
    apiStatus$.subscribe((data) => {
      console.log(data);
      if (data.apiStatus === "success" && data.loginStatus === "login") {
        console.log("Hola");
        this.appStore.dispatch(setAPIStatus({
          apiStatus: {
            apiCodeStatus: 200,
            apiResponseMessage: '',
            apiStatus: '',
            loginStatus: "login"
          }}))
        this.router.navigate(['admin']);
        localStorage.setItem('auth_token', this.getToken);
        this.toastr.success("Usuario logeado con exito.", "Login", {
          progressBar: true
        })
      } else if (data.apiStatus === "error" && data.loginStatus === "login") {
        this.appStore.dispatch(setAPIStatus({ apiStatus: { apiStatus: '', apiResponseMessage: '', apiCodeStatus: 200, adminState: "done" } }));
        this.toastr.error(data.apiResponseMessage, "Login", {
          progressBar: true
        })
      }
    }) */
  }

}
