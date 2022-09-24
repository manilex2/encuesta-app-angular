import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { ToastrModule } from 'ngx-toastr';

import { CompaniasTableComponent } from '../controllers/companias-table.component';

describe('CompaniasTableComponent', () => {
  let component: CompaniasTableComponent;
  let fixture: ComponentFixture<CompaniasTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastrModule.forRoot(), RouterTestingModule, MatDialogModule],
      declarations: [ CompaniasTableComponent ],
      providers: [provideMockStore({})]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompaniasTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
