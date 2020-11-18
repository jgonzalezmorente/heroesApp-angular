import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HeroeModel } from '../models/heroes.model';
import { map, delay } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeroesService {

  private url = 'https://login-app-49cde.firebaseio.com';

  constructor( private http: HttpClient ) { }

  crearHeroe( heroe: HeroeModel ): Observable<HeroeModel> {

    return this.http.post( `${ this.url }/heroes.json`, heroe )
            .pipe(
              map( (resp: any) => {
                heroe.id = resp.name;
                return heroe;
              })
            );
  }

  actualizarHeroe( heroe: HeroeModel ): Observable<any> {

    const heroeTemp = {
      ...heroe
    };
    delete heroeTemp.id;
    return this.http.put( `${ this.url }/heroes/${ heroe.id }.json`, heroeTemp );
  }

  borrarHeroe( id: string ): Observable<any> {

    return this.http.delete(`${ this.url }/heroes/${ id }.json`);

  }

  getHeroes(): Observable<HeroeModel[]> {
    return this.http.get(`${ this.url }/heroes.json`)
            .pipe(
              map( this.crearArreglo ),
              delay(1500)
            );
    }

  getHeroe( id: string): Observable<any> {
      return this.http.get(`${ this.url }/heroes/${ id }.json`);
    }

  private crearArreglo( heroesObj: object ): HeroeModel[] {
    const heroes: HeroeModel[] = [];

    if ( heroesObj == null ) { return heroes; }

    Object.keys( heroesObj ).forEach( key => {

      const heroe: HeroeModel = heroesObj[key];
      heroe.id = key;
      heroes.push(heroe);

    });

    return heroes;


  }
}
