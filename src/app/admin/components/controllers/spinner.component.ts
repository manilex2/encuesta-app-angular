import { Component, OnInit } from '@angular/core';
import { SpinnerService } from '../../services/spinner.service';

@Component({
  selector: 'app-spinner',
  templateUrl: '../views/spinner.component.html',
  styleUrls: ['../styles/spinner.component.scss']
})
export class SpinnerComponent implements OnInit {
  isLoading$ = this.spinnerService.isLoading$;

  constructor(private spinnerService: SpinnerService) { }

  ngOnInit(): void {
  }

}
