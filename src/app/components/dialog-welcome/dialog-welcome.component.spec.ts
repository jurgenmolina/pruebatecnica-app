import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogWelcomeComponent } from './dialog-welcome.component';

describe('DialogWelcomeComponent', () => {
  let component: DialogWelcomeComponent;
  let fixture: ComponentFixture<DialogWelcomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogWelcomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogWelcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
