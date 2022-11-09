import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-encuesta-delete-dialog',
  templateUrl: '../views/encuesta-delete-dialog.component.html',
  styleUrls: ['../styles/encuesta-delete-dialog.component.scss']
})
export class EncuestaDeleteDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<EncuestaDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
