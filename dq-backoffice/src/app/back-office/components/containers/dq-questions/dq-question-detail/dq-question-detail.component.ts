import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BackofficeService } from '../../../shared/services/backoffice.service';
import { catchError, map, switchMap } from 'rxjs/operators';
import { SnackBarService } from '../../../../../shared/services/snack-bar.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DqQuestion } from '../../../../../shared/models/dq-questions';
import { of, Observable } from 'rxjs';

@Component({
  selector: 'dq-question-detail',
  templateUrl: './dq-question-detail.component.html'
})

export class DqQuestionDetailComponent implements OnInit {
  questionDetailForm$: Observable<FormGroup> = null;

  loadingNew = false;

  createNew = false;

  questionId = '';

  constructor(
    private formBuilder: FormBuilder,
    private backOfficeService: BackofficeService,
    private snackBarService: SnackBarService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.questionDetailForm$ = this.route.params.pipe(
      switchMap((params) => {
        if (params.id && params.id !== 'new') {
          this.questionId = params.id;
          return this.backOfficeService.getQuestion(this.questionId);
        }
        this.createNew = true;
        return of(null);
      }),
      switchMap((question: DqQuestion) => of(this.createForm(question))),
    );
  }

  addNewQuestion(questionForm: FormGroup) {
    this.loadingNew = true
    this.backOfficeService.createNewQuestion(this.getQuestion(questionForm))
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

  editQuestion(newQuestionForm: FormGroup): void {
    this.loadingNew = true;
    this.backOfficeService.editQuestion(this.questionId, {
      theme: newQuestionForm.value.theme,
      text: newQuestionForm.value.text,
      answer1: newQuestionForm.value.answer1,
      answer2: newQuestionForm.value.answer2,
      answer3: newQuestionForm.value.answer3,
      answer4: newQuestionForm.value.answer4,
      correct: newQuestionForm.value.correct - 1,
    }).pipe(
      map((question) => {
        if (question) {
          this.snackBarService.showMessage('Question edited successfully');
          this.router.navigate(['home/questions']);
        } else {
          this.snackBarService.showError('Error: Question not edited');
        }
      }),
      catchError((error) => {
        this.snackBarService.showError('Error: Question not edited');
        return of(null);
      })
    )
    .subscribe(() => this.loadingNew = false);
  }

  getQuestion(newQuestionForm: FormGroup): Partial<DqQuestion> {
    return {
      theme: newQuestionForm.value.theme,
      text: newQuestionForm.value.text,
      answer1: newQuestionForm.value.answer1,
      answer2: newQuestionForm.value.answer2,
      answer3: newQuestionForm.value.answer3,
      answer4: newQuestionForm.value.answer4,
      correct: newQuestionForm.value.correct - 1,
    }
  }

  createForm(question?: DqQuestion): FormGroup {
    if (!question) {
      this.createNew = true;
    }
    return this.formBuilder.group({
      theme: [question ? question.theme : '', Validators.required],
      text: [question ? question.text : '', Validators.required],
      answer1: [question ? question.answer1 : '', Validators.required],
      answer2: [question ? question.answer2 : '', Validators.required],
      answer3: [question ? question.answer3 : '', Validators.required],
      answer4: [question ? question.answer4 : '', Validators.required],
      correct: [question ? question.correct + 1 : 0, [Validators.required, Validators.max(4), Validators.min(1)]],
    });
  }
}