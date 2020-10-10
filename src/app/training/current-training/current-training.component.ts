import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StopTrainingComponent } from '../stop-training/stop-training.component';
import { TrainingService } from '../training.service';

@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.css']
})
export class CurrentTrainingComponent implements OnInit {
  progress = 0;
  timer: number;

  constructor(public dialog: MatDialog, private trainingService: TrainingService) { }

  ngOnInit(): void {
    this.startOrResumeTimer();
   }

  stopTrainingDialog(): void {
    const stopTrainingDialogRef = this.dialog.open(StopTrainingComponent, {
      data: {progress: this.progress}
    });

    stopTrainingDialogRef.afterClosed().subscribe(result => {
      console.log(`result is ${result}`);
      if (result) {
        this.trainingService.cancelExercise(this.progress);
        clearInterval(this.timer);
      } else {
        this.startOrResumeTimer();
      }
    });
  }
  startOrResumeTimer(): void {
    // calculating each step using the total duration of the exercise in seconds, dividing by 100 to get step in each second.
    // mltiplying the result by 1000 to get milliseconds
    const step = this.trainingService.getRunningExercise().duration / 100 * 1000;
    this.timer = setInterval(() => {
      this.progress = this.progress + 1;
      if (this.progress >= 100) {
        this.trainingService.completeExerise();
        clearInterval(this.timer);
        this.progress = 0;
      }
    }, step);
  }

  onStop(): void {
    clearInterval(this.timer);
    this.stopTrainingDialog();
  }

}
