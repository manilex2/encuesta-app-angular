import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { CompaniaDeleteDialogComponent } from '../controllers/compania-delete-dialog.component';

describe('CompaniaDeleteDialogComponent', () => {
  let component: CompaniaDeleteDialogComponent;
  let fixture: ComponentFixture<CompaniaDeleteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompaniaDeleteDialogComponent ],
      providers: [
        {provide: MatDialogRef, useValue: {}},
        {provide: MAT_DIALOG_DATA, useValue: []},
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompaniaDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
