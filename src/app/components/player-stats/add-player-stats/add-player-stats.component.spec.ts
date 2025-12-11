import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddPlayerStatsComponent } from './add-player-stats.component';

describe('AddPlayerStatsComponent', () => {
  let component: AddPlayerStatsComponent;
  let fixture: ComponentFixture<AddPlayerStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddPlayerStatsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddPlayerStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
