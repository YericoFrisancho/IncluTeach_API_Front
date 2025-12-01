import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ExternalApiService {
  private http = inject(HttpClient);

  private frasesBackup = [
    { content: "La educación no cambia el mundo, cambia a las personas que van a cambiar el mundo.", author: "Paulo Freire" },
    { content: "El objetivo principal de la educación es crear personas capaces de hacer cosas nuevas.", author: "Jean Piaget" },
    { content: "Dime y lo olvido, enséñame y lo recuerdo, involúcrame y lo aprendo.", author: "Benjamin Franklin" },
    { content: "La enseñanza que deja huella no es la que se hace de cabeza a cabeza, sino de corazón a corazón.", author: "Howard G. Hendricks" },
    { content: "Lo que se les dé a los niños, los niños darán a la sociedad.", author: "Karl A. Menninger" }
  ];

  getAvatarUrl(seed: string): string {
    return `https://api.dicebear.com/9.x/avataaars/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
  }

  getFraseInspiradora(): Observable<any> {
    return this.http.get<any>('https://dummyjson.com/quotes/random').pipe(
      
      map(data => ({ 
        content: data.quote, 
        author: data.author 
      })),
      
      catchError(() => {
        const randomIndex = Math.floor(Math.random() * this.frasesBackup.length);
        return of(this.frasesBackup[randomIndex]);
      })
    );
  }

  buscarLibros(tema: string): Observable<any[]> {
    const query = tema.trim().replace(/\s+/g, '+');
    
    return this.http.get<any>(`https://openlibrary.org/search.json?q=${query}&limit=6`).pipe(
      map(response => {
        return response.docs.map((doc: any) => ({
          titulo: doc.title,
          autor: doc.author_name ? doc.author_name[0] : 'Autor desconocido',
          anio: doc.first_publish_year || 'S/F',
          portada: doc.cover_i 
            ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg` 
            : 'assets/book-placeholder.png'
        }));
      })
    );
  }
}