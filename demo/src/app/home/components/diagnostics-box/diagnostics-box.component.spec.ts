import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagnosticsBoxComponent } from './diagnostics-box.component';

describe('DiagnosticsBoxComponent', () => {
  let component: DiagnosticsBoxComponent;
  let fixture: ComponentFixture<DiagnosticsBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiagnosticsBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiagnosticsBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
