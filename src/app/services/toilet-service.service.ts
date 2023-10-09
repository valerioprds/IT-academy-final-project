import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ToiletServiceService {
  constructor(private http: HttpClient) {}

  async getToilets() {
    const res: any = await this.http
      .get('https://toilet-locator.cyclic.app/api/v1/toilets')
      .toPromise();
    return res.data.filter(
      (toilet: any) =>
        toilet?.location?.coordinates != null &&
        toilet.location.coordinates.length == 2
    );
  }

  getAverage(toilet: Object) {
    const RATINGS = toilet['ratings'];
    if (RATINGS.length === 0) {
      return 0;
    }
    return (
      RATINGS.map((eachScore) => eachScore.score).reduce((a, b) => a + b, 0) /
      RATINGS.length
    ).toFixed(2);
  }

  getToiletsFromId(toilets: [], id: string) {
    return toilets.find((toilet: Object) => {
      return toilet['toiletId'] === id;
    });
  }
}



//http://localhost:5000/api/v1/toilets
