import { TestBed } from '@angular/core/testing';

import { ToiletServiceService } from './services/toilet-service.service';

describe('ToiletServiceService', () => {
  let service: ToiletServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToiletServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
