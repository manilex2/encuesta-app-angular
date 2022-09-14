import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { TipoEncuestaService } from './tipo-encuesta.service';

describe('TipoEncuestaService', () => {
  let service: TipoEncuestaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ]
    });
    service = TestBed.inject(TipoEncuestaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
