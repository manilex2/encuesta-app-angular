import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiposEncuestaComponent } from '../controllers/tipos-encuesta.component';

describe('TiposEncuestaComponent', () => {
  let component: TiposEncuestaComponent;
  let fixture: ComponentFixture<TiposEncuestaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TiposEncuestaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TiposEncuestaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
