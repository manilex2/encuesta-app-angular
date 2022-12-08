import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelecEncuestaComponent } from '../controllers/selec-encuesta.component';

describe('SelecEncuestaComponent', () => {
  let component: SelecEncuestaComponent;
  let fixture: ComponentFixture<SelecEncuestaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelecEncuestaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelecEncuestaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
