import { Component, Inject } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: '../views/admin-delete-dialog.component.html',
  styleUrls: ['../styles/admin-delete-dialog.component.scss']
})
export class AdminDeleteDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<AdminDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
