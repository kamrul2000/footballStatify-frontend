import { TestBed } from '@angular/core/testing';
import { FixtureGeneratorService } from './fixture-generator.service';

describe('FixtureGeneratorService', () => {
  let service: FixtureGeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FixtureGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
