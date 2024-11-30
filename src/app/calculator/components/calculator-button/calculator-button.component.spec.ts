import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalculatorButtonComponent } from './calculator-button.component';
import { Component }  from '@angular/core';

@Component({
    standalone: true,
    imports: [CalculatorButtonComponent],
    template: `
        <calculator-button>
            <span class="projected-content underline">Test content</span>
        </calculator-button>
        `
})
class TestHostComponent {}


describe('CalculatorButtonComponent', () => {
  let fixture: ComponentFixture<CalculatorButtonComponent>;
  let component: CalculatorButtonComponent;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalculatorButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CalculatorButtonComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should apply w-1/4 if doubleSize is false', () => {
    const hostCssClass: string[] = compiled.classList.value.split(' ');
    expect(hostCssClass).toContain('w-1/4');
    expect(component.isDoubleSize()).toBeFalse();
  });

  it('should apply w-2/4 if doubleSize is true', () => {
    fixture.componentRef.setInput('isDoubleSize', true);
    fixture.detectChanges();
    const hostCssClass: string[] = compiled.classList.value.split(' ');
    expect(hostCssClass).toContain('w-2/4');
    expect(component.isDoubleSize()).toBeTrue();
  });

  it('should emit onClick when handleClick is called', () => {
    spyOn(component.onClick, 'emit');
    component.handleClick();
    expect(component.onClick.emit).toHaveBeenCalled();
    // expect(component.onClick.emit).toHaveBeenCalledWith('');
  });

  it('should set isPressed to true and then false when keyboardPressedStyle is called', (done) => {
    component.contentValue()!.nativeElement.innerHTML = '1';
    component.keyboardPressedStyle('1');
    expect(component.isPressed()).toBeTrue();
    setTimeout(() => {
        expect(component.isPressed()).toBeFalse();
        done();
    }, 100);
  });

  it('should not seet isPressed if key is not matching', () => {
    component.contentValue()!.nativeElement.innerHTML = '1';
    component.keyboardPressedStyle('2');
    expect(component.isPressed()).toBeFalse();
  });

  it('should displsy projected content', () => {
    const testHostFixture = TestBed.createComponent(TestHostComponent);
    const compiled = testHostFixture.nativeElement as HTMLDivElement;
    const projectedContent = compiled.querySelector('.projected-content');
    expect(projectedContent).not.toBeNull();
    expect(projectedContent?.classList.contains('underline')).toBeTrue();
   
  });



});
