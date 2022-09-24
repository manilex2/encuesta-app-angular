import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { CompaniasComponent } from '../controllers/companias.component';

describe('CompaniasComponent', () => {
  let component: CompaniasComponent;
  let fixture: ComponentFixture<CompaniasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ RouterTestingModule ],
      declarations: [ CompaniasComponent ],
      providers: [provideMockStore({}), ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompaniasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
