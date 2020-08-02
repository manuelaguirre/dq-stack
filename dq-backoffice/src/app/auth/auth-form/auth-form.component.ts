import {
    Component, AfterContentInit, Injector, forwardRef, Input,
} from '@angular/core';
import { FormGroup, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ComponentUtilsService } from '../../shared/services/component-utils';

@Component({
  selector: 'app-auth-form',
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => AuthFormComponent),
    },
  ],
})
export class AuthFormComponent implements ControlValueAccessor, AfterContentInit {
  @Input() authFormGroup: FormGroup;

  @Input() types: string[] = [];

  @Input() categories: { id: string; name: string; }[] = [];

  @Input() contestEnroll = false;

  minDate = new Date();

  constructor(
    private injector: Injector,
    private componentUtils: ComponentUtilsService,
  ) { }

  ngAfterContentInit() {
    if (!this.authFormGroup) {
      this.authFormGroup = (
        this.componentUtils
            .getFormGroup(this.injector).controls.projectMainInfo as FormGroup
      );
    }
  }

  propagateChange = (_: any) => {};

  registerOnChange(fn) {
      this.propagateChange = fn;
  }

  registerOnTouched() {}

  writeValue(value: string): void {}

  setDisabledState?(isDisabled: boolean): void {}
}
