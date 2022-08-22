import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { CompaniaService } from './compania.service';

describe('CompaniaService', () => {
  let service: CompaniaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [provideMockStore({})]
    });
    service = TestBed.inject(CompaniaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
