import { Injectable } from '@angular/core';
import { Exercise } from './exercise.model';
import { Subject, Observable, Subscription } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { UiService } from '../auth/shared/ui.service';

@Injectable({
  providedIn: 'root',
})
export class TrainingService {
  // private availableExercises: Exercise[] = [
  //   { id: 'crunches', name: 'Crunches', duration: 5, calories: 8 },
  //   { id: 'touch-toes', name: 'Touch Toes', duration: 10, calories: 15 },
  //   { id: 'side-lunges', name: 'Side Lunges', duration: 8, calories: 18 },
  //   { id: 'burpees', name: 'Burpees', duration: 20, calories: 8 },
  // ];
  private availableExercises: Exercise[] = [];
  private runningExercise: Exercise;
  exerciseChanged = new Subject<Exercise>();
  exercisesChanged = new Subject<Exercise[]>();
  pastExercisesChanged = new Subject<Exercise[]>();
  private firbaseSub: Subscription[] = []; // required to cancel all subscription on signout as otherwise it will continue always

  constructor(
    private firestore: AngularFirestore,
    private uiService: UiService
  ) {}

  fetchAvailableExercises(): void {
    this.uiService.loadingStateChanged.next(true);
    this.firbaseSub.push(
      this.firestore
        .collection('availableExercises')
        .snapshotChanges()
        .pipe(
          map((result) => {
            // throw new Error(); // to view the Fetch Again button in action
            return result.map((docData) => {
              const data = docData.payload.doc.data() as object;
              const id = docData.payload.doc.id;
              return {
                // returns the id and the metadata
                id,
                ...data,
              };
            });
          })
        )
        .subscribe(
          (exercises: Exercise[]) => {
            this.uiService.loadingStateChanged.next(false);
            this.availableExercises = exercises;
            this.exercisesChanged.next([...this.availableExercises]);
          },
          (error) => {
            console.log(error);
            this.uiService.loadingStateChanged.next(false); // removing spinner
            this.uiService.showSnackBar(
              'Fetching Exercises failed, please try again later',
              null,
              3000
            );
            this.exercisesChanged.next(null); // returning no exercises inorder to facilitate fetching again
          }
        )
    );
  }
  private addDataToFirestore(exercise: Exercise): void {
    // firestore creates a collection if one does not exist with the same name
    this.firestore.collection('pastExercises').add(exercise);
  }
  getRunningExercise(): Exercise {
    return { ...this.runningExercise };
  }
  startExercise(selectedId: string): void {
    // this.firestore.doc(`availableExercises/${selectedId}`).update({lastSelected: new Date()});
    this.runningExercise = this.availableExercises.find(
      (exercise) => exercise.id === selectedId
    );
    this.exerciseChanged.next({ ...this.runningExercise });
  }
  completeExerise(): void {
    this.addDataToFirestore({
      ...this.runningExercise,
      date: new Date(),
      state: 'completed',
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }
  cancelExercise(progress: number): void {
    this.addDataToFirestore({
      ...this.runningExercise,
      duration: this.runningExercise.duration * (progress / 100),
      calories: this.runningExercise.calories * (progress / 100),
      date: new Date(),
      state: 'cancelled',
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }
  fetchCompletedOrCancelledExercises(): void {
    this.firbaseSub.push(
      this.firestore
        .collection('pastExercises')
        .valueChanges()
        .subscribe((exercises: Exercise[]) => {
          this.pastExercisesChanged.next(exercises);
        })
    );
  }
  cancelAllFirebaseSubOnSignout(): void {
    this.firbaseSub.forEach((sub) => sub.unsubscribe());
  }
}
