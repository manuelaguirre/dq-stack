import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BackofficeService } from '../../../shared/services/backoffice.service';
import { catchError, map } from 'rxjs/operators';
import { SnackBarService } from '../../../../../shared/services/snack-bar.service';
import { Router } from '@angular/router';
import { DqQuestion } from 'src/app/shared/models/dq-questions';
import { of } from 'rxjs';

@Component({
  selector: 'dq-new-question',
  templateUrl: './dq-new-question.component.html'
})

export class DqNewQuestionComponent implements OnInit {
  newQuestionForm: FormGroup = null;

  loadingNew = false;

  constructor(
    private formBuilder: FormBuilder,
    private backOfficeService: BackofficeService,
    private snackBarService: SnackBarService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.newQuestionForm = this.formBuilder.group({
      theme: ['', Validators.required],
      text: ['', Validators.required],
      answer1: ['', Validators.required],
      answer2: ['', Validators.required],
      answer3: ['', Validators.required],
      answer4: ['', Validators.required],
      correct: [0, [Validators.required, Validators.max(4), Validators.min(1)]],
    });
  }

  addNewQuestion() {
    this.loadingNew = true
    this.backOfficeService.createNewQuestion(this.getQuestion())
      .pipe(
        map((question) => {
          if (question) {
            this.snackBarService.showMessage('Question created successfully');
            this.router.navigate(['home/questions']);
          } else {
            this.snackBarService.showError('Error: Question not created');
          }
        }),
        catchError((error) => {
          this.snackBarService.showError('Error: Question not created');
          return of(null);
        })
      )
      .subscribe(() => this.loadingNew = false);
  }

  getQuestion(): Partial<DqQuestion> {
    return {
      theme: this.newQuestionForm.value.theme,
      text: this.newQuestionForm.value.text,
      answer1: this.newQuestionForm.value.answer1,
      answer2: this.newQuestionForm.value.answer2,
      answer3: this.newQuestionForm.value.answer3,
      answer4: this.newQuestionForm.value.answer4,
      correct: this.newQuestionForm.value.correct - 1, 
    }
  }
}