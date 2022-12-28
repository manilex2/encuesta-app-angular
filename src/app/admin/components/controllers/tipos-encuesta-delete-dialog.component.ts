import { Component, Inject } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-tipos-encuesta-delete-dialog',
  templateUrl: '../views/tipos-encuesta-delete-dialog.component.html',
  styleUrls: ['../styles/tipos-encuesta-delete-dialog.component.scss']
})
export class TiposEncuestaDeleteDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<TiposEncuestaDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
