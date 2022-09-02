import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';

import { FsbsGuard } from './fsbs.guard';

describe('FsbsGuard', () => {
  let guard: FsbsGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        JwtHelperService,
        { provide: JWT_OPTIONS, useValue: JWT_OPTIONS }
      ]
    });
    guard = TestBed.inject(FsbsGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
