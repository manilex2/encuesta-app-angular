import { Component, Inject } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { single } from '../models/single';

@Component({
  selector: 'app-chart-dialog',
  templateUrl: '../views/chart-dialog.component.html',
  styleUrls: ['../styles/chart-dialog.component.scss']
})
export class ChartDialogComponent {
  ponderaciones: any[] | undefined;
  processData: any[] | undefined;
  pondArray: any[] = [];
  dataArray: any[] = [];
  view: [number, number] = [700, 400];
  preguntas: any;
  resp_a: number = 0;
  resp_b: number = 0;
  resp_c: number = 0;
  resp_d: number = 0;
  resp_e: number = 0;

  // options
  showLegend: boolean = true;
  showLabels: boolean = true;

  colorScheme: Color = {
    name: 'mySceme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#7aa3e5', '#a27ea8', '#aae3f5', '#adcded', '#a8385d', '#a95963']
  };

  constructor(
    public dialogRef: MatDialogRef<ChartDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    for (let i = 0; i < data.length; i++) {
      const element = data[i];
      switch (element.selected) {
        case "A":
          this.resp_a++;
          break;
        case "B":
          this.resp_b++;
          break;
        case "C":
          this.resp_c++;
          break;
        case "D":
          this.resp_d++;
          break;
        case "E":
          this.resp_e++;
          break;
        default:
          break;
      }
    }
    const identificadorKey = 'identificador';
    const identificadornUniqueByKey: any = [...new Map(this.data.map((item: any) => [item[identificadorKey], item])).values()];
    for (let i = 0; i < identificadornUniqueByKey.length; i++) {
      const element = identificadornUniqueByKey[i];
      if (element.a) {
        this.pondArray.push({
          "name": `${element.a}`,
          "value": parseInt(element.a_pond)
        });
        this.dataArray.push({
          "name": `${element.a}`,
          "value": this.resp_a
        });
      }
      if (element.b) {
        this.pondArray.push({
          "name": `${element.b}`,
          "value": parseInt(element.b_pond)
        });
        this.dataArray.push({
          "name": `${element.b}`,
          "value": this.resp_b
        });
      }
      if (element.c) {
        this.pondArray.push({
          "name": `${element.c}`,
          "value": parseInt(element.c_pond)
        });
        this.dataArray.push({
          "name": `${element.c}`,
          "value": this.resp_c
        });
      }
      if (element.d) {
        this.pondArray.push({
          "name": `${element.d}`,
          "value": parseInt(element.d_pond)
        });
        this.dataArray.push({
          "name": `${element.d}`,
          "value": this.resp_d
        });
      }
      if (element.e) {
        this.pondArray.push({
          "name": `${element.e}`,
          "value": parseInt(element.e_pond)
        });
        this.dataArray.push({
          "name": `${element.e}`,
          "value": this.resp_e
        });
      }
    }
    Object.assign(this, { ponderaciones: this.pondArray });
    Object.assign(this, { processData: this.dataArray });
  }

  onSelect(event: any) {
    console.log(event);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onResize(event: any) {
    this.view = [event.target.innerWidth - 700, 400];
  }
}
