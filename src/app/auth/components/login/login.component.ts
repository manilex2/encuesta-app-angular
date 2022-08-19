import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
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

  loginForm = this.fb.group({
    codigo: ["", [Validators.required]],
    usuario: ["", Validators.required],
    clave: ["", Validators.required]
  });

  onSubmit() {
    this.authService.login(this.loginForm.value);
  }

}
