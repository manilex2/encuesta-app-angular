import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { TiposEncuestaDeleteDialogComponent } from '../controllers/tipos-encuesta-delete-dialog.component';

describe('TiposEncuestaDeleteDialogComponent', () => {
  let component: TiposEncuestaDeleteDialogComponent;
  let fixture: ComponentFixture<TiposEncuestaDeleteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TiposEncuestaDeleteDialogComponent ],
      providers: [
        {provide: MatDialogRef, useValue: {}},
        {provide: MAT_DIALOG_DATA, useValue: []},
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TiposEncuestaDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
