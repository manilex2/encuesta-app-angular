import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { AdminDeleteDialogComponent } from '../controllers/admin-delete-dialog.component';

describe('DeleteDialogComponent', () => {
  let component: AdminDeleteDialogComponent;
  let fixture: ComponentFixture<AdminDeleteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminDeleteDialogComponent ],
      providers: [
        {provide: MatDialogRef, useValue: {}},
        {provide: MAT_DIALOG_DATA, useValue: []},
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
