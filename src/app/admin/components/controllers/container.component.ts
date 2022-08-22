import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-container-table',
  templateUrl: '../views/container.component.html',
  styleUrls: ['../styles/container.component.scss']
})
export class ContainerComponent {

  @Input() tableName: String = "";
}
