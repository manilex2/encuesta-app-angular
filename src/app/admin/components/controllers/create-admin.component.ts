import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { CreateAdmin } from '../interfaces/CreateAdmin';

@Component({
  selector: 'app-create-admin',
  templateUrl: '../views/create-admin.component.html',
  styleUrls: ['../styles/create-admin.component.scss']
})
export class CreateAdminComponent implements OnInit {

  hide = true;

  ngOnInit() {
    this.getIp();
  }

  constructor(private fb: FormBuilder, private adminService: AdminService) { }

  createAdminForm = this.fb.group<CreateAdmin>({
    codigo: ["", [Validators.required, Validators.pattern(/[0-9]{3}/g)]],
    nombre: ["", [Validators.required]],
    clave: ["", Validators.required],
    fsbs: [false, Validators.required],
    createdIp: ['', Validators.required],
  });

  onSubmit() {
    this.adminService.crearAdmin(this.createAdminForm.value);
  }

  getIp() {
    return this.adminService.getIPAddress().subscribe((res: any) => {
      this.createAdminForm.controls['createdIp']?.setValue(res.ip);
    })
  }

}
