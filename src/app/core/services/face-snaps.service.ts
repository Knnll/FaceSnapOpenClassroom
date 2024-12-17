import { Injectable } from '@angular/core';
import { FaceSnap } from '../models/face-snap.model';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {map, switchMap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class FaceSnapsService {

  // On injecte le HttpClient grâce au constructeur, on n'oublie pas cette notion hein ! ;)
  // La première requête qu'on veut faire est pour récupérer la liste de toutes les faceSnaps donc
  // On passe à dace-snap-list.component.ts ! :)
  constructor(private http: HttpClient) {}

  faceSnaps: FaceSnap[] = [];

  getAllFaceSnaps(): Observable<FaceSnap[]> {
    // Pour que cette requête 'get' soit envoyée au server, il faut souscrire à l'Obs ! (dans le composant)
    return this.http.get<FaceSnap[]>('http://localhost:3000/facesnaps');
  }

  getFaceSnapById(faceSnapId: number): Observable<FaceSnap> {
    return this.http.get<FaceSnap>(`http://localhost:3000/facesnaps/${faceSnapId}`);
  }

  snapFaceSnapById(faceSnapId: number, snapType: 'snap' | 'unsnap'): Observable<FaceSnap> {
    return this.getFaceSnapById(faceSnapId).pipe(
      map(faceSnap => ({
        ...faceSnap,
        snaps: faceSnap.snaps + (snapType === 'snap' ? 1 : -1)
      })),
      switchMap(updatedFaceSnap => this.http.put<FaceSnap>(`http://localhost:3000/facesnaps/${faceSnapId}`, updatedFaceSnap))
    );
  }

  addFaceSnap(formValue: {title: string, description: string, imageUrl: string, location?: string}): Observable<FaceSnap> {
    return this.getAllFaceSnaps().pipe(
      // On trie les faceSnaps par leurs id
      map(facesnaps => [...facesnaps].sort((a, b) => a.id - b.id)),
      // On récupère le dernier du tableau
      map(sortedFacesnaps => sortedFacesnaps[sortedFacesnaps.length - 1]),
      // On génère notre nouveau faceSNap
      map(previousFaceSnap => ({
        ...formValue,
        snaps: 0,
        createdDate: new Date(),
        // On lui ajoute une valeur par rapport au dernier facesnap existant du tableau pour avoir une suite d'id cohérent
        id: previousFaceSnap.id + 1
      })),
      // Génère la requête POST finale
      switchMap(newFaceSnap => this.http.post<FaceSnap>('http://localhost:3000/facesnaps', newFaceSnap))
    );
  }
}
