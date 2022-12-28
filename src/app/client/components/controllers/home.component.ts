import { Component } from '@angular/core';
import { OnlineStatusService, OnlineStatusType } from 'ngx-online-status';
import { ToastrService } from 'ngx-toastr';
import { ClientService } from '../../services/client.service';
import { DbPwaService } from '../../services/db-pwa.service';

@Component({
  selector: 'app-home',
  templateUrl: '../views/home.component.html',
  styleUrls: ['../styles/home.component.scss']
})
export class HomeComponent {
  status: OnlineStatusType = this.onlineStatusService.getStatus();
  ip;

  constructor(
    private onlineStatusService: OnlineStatusService,
    private dbPwaService: DbPwaService,
    private clientService: ClientService,
    private toastr: ToastrService
  ) {
    this.getIp();
    this.onlineStatusService.status.subscribe((status: OnlineStatusType) => {
      // Retrieve Online status Type
      this.status = status;
      if (this.status === 1) {
        this.syncAll();
      }
    });
  }

  getIp() {
    return this.clientService.getIPAddress().subscribe((res: any) => {
      this.ip = res.ip;
    })
  }

  syncAll() {
    this.dbPwaService.getAll()
    .then((items: Array<any>) => {
      return Promise.all(items.map((row) => {
        return this.sendData(row.doc);
      }))
    })
    .catch((error) => {
      console.error(error);
    })
  }

  sendData(data: any){
    this.clientService.saveClientData({...data, ip: this.ip}).subscribe(data => {
      this.toastr.success("Conexión reestrablecida. Respuestas sincronizadas con el servidor.", "Encuesta", {
        progressBar: true,
        timeOut: 8000
      });
      this.dbPwaService.clearData(data);
    }, () => {
      this.toastr.info("La encuesta no pudo enviarse porque no hay conexión, se guardo en local, cuando sea reestablecida la conexión se sincronizará.", "Encuesta", {
        progressBar: true,
        timeOut: 12000
      });
      this.dbPwaService.addData(data);
    });
  }

}
