import { Injectable } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../interfaces/Users';
import { AuthService } from '../../services/auth.service';

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

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) { }

  loginForm = this.fb.group<User>({
    codigo: ["", [Validators.required]],
    clave: ["", Validators.required]
  });

  onSubmit() {
    this.authService.login(this.loginForm.value);
  }

}
