import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreFeatureModule, StoreModule } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';

import { AdminsTableComponent } from '../controllers/admins-table.component';

describe('AdminsTableComponent', () => {
  let component: AdminsTableComponent;
  let fixture: ComponentFixture<AdminsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminsTableComponent ],
      providers: [provideMockStore({})]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
