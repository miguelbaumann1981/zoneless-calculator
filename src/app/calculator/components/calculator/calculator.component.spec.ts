import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalculatorComponent } from './calculator.component';
import { CalculatorService } from '@/calculator/services/calculator.service';
import { By } from '@angular/platform-browser';
import { CalculatorButtonComponent } from '../calculator-button/calculator-button.component';


class MockCalculatorService {
    public resultText = jasmine.createSpy('resultText').and.returnValue('100.00');
    public subResultText = jasmine.createSpy('subResultText').and.returnValue('0');
    public lastOperator = jasmine.createSpy('lastOperator').and.returnValue('+');
    public constructNumber = jasmine.createSpy('constructNumber');
}


describe('CalculatorComponent', () => {
  let fixture: ComponentFixture<CalculatorComponent>;
  let component: CalculatorComponent;
  let compiled: HTMLElement;
  let mockCalculatorService: MockCalculatorService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalculatorComponent],
      providers: [
        {
            provide: CalculatorService,
            useClass: MockCalculatorService
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CalculatorComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement as HTMLElement;
    mockCalculatorService = TestBed.inject(CalculatorService) as unknown as MockCalculatorService;
    // fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have the current getters', () => {
    expect(component.resultText()).toBe('100.00');
    expect(component.subResultText()).toBe('0');
    expect(component.lastOperator()).toBe('+');
  });

  it('should display proper calculation values', () => {
    mockCalculatorService.resultText.and.returnValue('123');
    mockCalculatorService.subResultText.and.returnValue('45');
    mockCalculatorService.lastOperator.and.returnValue('*');
    fixture.detectChanges();

    expect(component.resultText()).toBe('123');
    expect(component.subResultText()).toBe('45');
    expect(component.lastOperator()).toBe('*');

    expect(compiled.querySelector('span')?.innerText).toBe('45 *');
  });

  it('should have 19 calculator buttons', () => {
    expect(component.calculatorButtons).toBeTruthy();
    expect(component.calculatorButtons().length).toBe(19);
  });

  it('should have 19 calculator buttons with content projection', () => {
    // const buttonsByDirective = fixture.debugElement.queryAll(By.directive(CalculatorButtonComponent));
    const buttons = compiled.querySelectorAll('calculator-button');
    expect(buttons.length).toBe(19);
    expect(buttons[0].textContent?.trim()).toBe('C');
    expect(buttons[1].textContent?.trim()).toBe('+/-');
    expect(buttons[2].textContent?.trim()).toBe('%');
  });

  it('should handle keyboard events correctly', () => {
    const eventEnter = new KeyboardEvent('keyup', { key: 'Enter' });
    document.dispatchEvent(eventEnter);
    expect(mockCalculatorService.constructNumber).toHaveBeenCalledWith('=');

    const eventEsc = new KeyboardEvent('keyup', { key: 'Escape' });
    document.dispatchEvent(eventEsc);
    expect(mockCalculatorService.constructNumber).toHaveBeenCalledWith('C');
  });

  it('should display result text correctly', () => {
    mockCalculatorService.resultText.and.returnValue('123');
    mockCalculatorService.subResultText.and.returnValue('10');
    mockCalculatorService.lastOperator.and.returnValue('-');
    fixture.detectChanges();
    expect(component.resultText()).toBe('123');
    expect(compiled.querySelector('#sub-result')?.textContent).toContain('10 -');
  });

});
