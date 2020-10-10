import { Component, OnInit, OnDestroy} from '@angular/core';
import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';
import { NgForm } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { UiService } from 'src/app/auth/shared/ui.service';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  // exerciseId: string; // 2way databinding approach
  exercises: Exercise[];
  exerciseSub: Subscription;
  isLoading = true;
  loadingSub: Subscription;

  constructor(private trainingService: TrainingService, private firestore: AngularFirestore, private uiService: UiService) { }

  ngOnInit(): void {
    // this.exercises = this.angularFirestoreDB.collection('availableExercises').valueChanges(); // gives only the meta data
    this.loadingSub = this.uiService.loadingStateChanged.subscribe(status => this.isLoading = status);
    this.exerciseSub = this.trainingService.exercisesChanged.subscribe(exercises => {
      console.log(exercises);
      this.exercises = exercises;
    });
    this.fetchAvailableExercises();
  }
  fetchAvailableExercises(): void {
    this.trainingService.fetchAvailableExercises();
  }
  onStartTraining(form: NgForm): void {
    this.trainingService.startExercise(form.value.exercise);
    // this.trainingService.startExercise(exerciseId); // using 2 way data binding without using angular forms
  }
  ngOnDestroy(): void {
    if (this.exerciseSub){
      this.exerciseSub.unsubscribe();
    }
    if (this.loadingSub) {
      this.loadingSub.unsubscribe();
    }
  }
}
