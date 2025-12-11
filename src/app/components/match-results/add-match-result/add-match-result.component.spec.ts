import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddMatchResultComponent } from './add-match-result.component';

describe('AddMatchResultComponent', () => {
  let component: AddMatchResultComponent;
  let fixture: ComponentFixture<AddMatchResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddMatchResultComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddMatchResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
