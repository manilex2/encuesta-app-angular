import { Component, ViewEncapsulation, ViewChild } from '@angular/core';
import { single } from '../models/single';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { MatAccordion } from '@angular/material/expansion';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: '../views/dashboard.component.html',
  styleUrls: ['../styles/dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent {

  @ViewChild(MatAccordion) accordion: MatAccordion | undefined;

  single: any[] | undefined;
  view: [number, number] = [700, 400];

  // options
  showLegend: boolean = true;
  showLabels: boolean = true;

  colorScheme: Color = {
    name: 'mySceme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };

  constructor() {
    Object.assign(this, { single });
  }

  onSelect(event: any) {
    console.log(event);
  }

}
