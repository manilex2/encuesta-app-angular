import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { EncuestaService } from './encuesta.service';

describe('EncuestaService', () => {
  let service: EncuestaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ]
    });
    service = TestBed.inject(EncuestaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
