import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlayerStatsListComponent } from './player-stats-list.component';

describe('PlayerStatsListComponent', () => {
  let component: PlayerStatsListComponent;
  let fixture: ComponentFixture<PlayerStatsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlayerStatsListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlayerStatsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
