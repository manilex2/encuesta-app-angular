import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { ToastrModule } from 'ngx-toastr';

import { TiposEncuestaTableComponent } from '../controllers/tipos-encuesta-table.component';

describe('TiposEncuestaTableComponent', () => {
  let component: TiposEncuestaTableComponent;
  let fixture: ComponentFixture<TiposEncuestaTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastrModule.forRoot(), RouterTestingModule, MatDialogModule],
      declarations: [ TiposEncuestaTableComponent ],
      providers: [provideMockStore({})]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TiposEncuestaTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
