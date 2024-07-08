import { TestBed } from '@angular/core/testing';

import { RecepcionProductoService } from './recepcion.service';

describe('RecepcionService', () => {
  let service: RecepcionProductoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecepcionProductoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
