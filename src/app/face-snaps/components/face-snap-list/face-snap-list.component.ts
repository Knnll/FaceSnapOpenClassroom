import {Component, OnDestroy, OnInit} from '@angular/core';
import { FaceSnap } from '../../../core/models/face-snap.model';
import { FaceSnapsService } from '../../../core/services/face-snaps.service';
import {take, takeUntil, tap} from "rxjs/operators";
import {interval, Observable, Subject} from "rxjs";

@Component({
  selector: 'app-face-snap-list',
  templateUrl: './face-snap-list.component.html',
  styleUrls: ['./face-snap-list.component.scss']
})
export class FaceSnapListComponent implements OnInit, OnDestroy {

  faceSnaps!: FaceSnap[];
  faceSnaps$!: Observable<FaceSnap[]>;
  private destroy$!: Subject<boolean>;

  constructor(private faceSnapsService: FaceSnapsService) { }

  ngOnInit(): void {
    this.destroy$ = new Subject<boolean>();
    // ça, ça ne peut plus marcher parce que getAllFaceSnaps appelle le code en dur dans le service
    // Donc il faut aller changer l'empreinte de cette méthode dans service, on y retourne zébartiii
    //this.faceSnaps = this.faceSnapsService.getAllFaceSnaps();
    // Et là, il manque juste à l'insérer dans le template :)
    this.faceSnaps$ = this.faceSnapsService.getAllFaceSnaps();

    interval(1000).pipe(
      takeUntil(this.destroy$),
      tap(console.log)
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

}
