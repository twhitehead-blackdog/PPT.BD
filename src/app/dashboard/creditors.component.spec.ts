import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreditorsComponent } from './creditors.component';

describe('CreditorsComponent', () => {
  let component: CreditorsComponent;
  let fixture: ComponentFixture<CreditorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreditorsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreditorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
