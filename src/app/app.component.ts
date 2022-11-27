import { Component, OnInit } from '@angular/core';
import { interval, map, mergeMap, of, tap, timer, switchMap } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  hours = '00';
  minutes = '00';
  seconds = '00';
  isVideo = false;
  iframeUrl: string = '';

  ngOnInit(): void {
    this.startTimer();
  }

  startTimer() {
    const currentTime = new Date();
    const actionDate = new Date('11/27/2022 15:40:00');
    let differenceInSeconds = Math.floor(
      (actionDate.getTime() - currentTime.getTime()) / 1000
    );
    let subs = interval(1000)
      .pipe(
        switchMap(() => {
          if (differenceInSeconds <= 0) {
            return of(1).pipe(
              switchMap((res) => {
                return res
                  ? of('https://www.youtube.com/embed/kL5UmvzG8bA')
                  : of(false);
              })
            );
          } else {
            differenceInSeconds--;
            this.generateTime(differenceInSeconds);
            return of(false);
          }
        })
      )
      .subscribe((res) => {
        if (res) {
          this.iframeUrl = res as string;
          this.isVideo = true;
          subs.unsubscribe();
        }
      });
  }

  generateTime(differenceInSeconds: number) {
    this.hours = this.formatTime(Math.floor(differenceInSeconds / 60 / 60));
    this.minutes = this.formatTime(Math.floor((differenceInSeconds / 60) % 60));
    this.seconds = this.formatTime(Math.floor(differenceInSeconds % 60));
  }

  formatTime(time: number) {
    return time < 10 ? `0${time}` : `${time}`;
  }
}
