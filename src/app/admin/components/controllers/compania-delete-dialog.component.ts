import { Component, Inject } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-compania-delete-dialog',
  templateUrl: '../views/compania-delete-dialog.component.html',
  styleUrls: ['../styles/compania-delete-dialog.component.scss']
})
export class CompaniaDeleteDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<CompaniaDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
