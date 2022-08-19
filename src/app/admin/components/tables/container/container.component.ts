import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-container-table',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss']
})
export class ContainerComponent {

  @Input() tableName: String = "";
}
