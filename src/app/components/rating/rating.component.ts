import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MapService } from 'src/app/services/map.service';
import { ToastrService } from 'ngx-toastr';
import { ToiletServiceService } from 'src/app/services/toilet-service.service';
import { DashboardComponent } from '../dashboard/dashboard.component';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css'],
})
export class RatingComponent implements OnChanges {
  @Input() toilet: {};

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private mapService: MapService,
    private dashboard : DashboardComponent
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    // changes.prop contains the old and the new value...
    //console.log(changes['toilet']['currentValue']);
    this.toilet = changes['toilet']['currentValue'];
  }

  ngOnInit(): void {
    console.log(this.toilet);
  }

  postRating(toiletId: string, userRating: number) {
    console.log('from postRating ', toiletId);
    this.mapService.postRating(toiletId, userRating).subscribe(
      (res: any) => {
        this.toastr.success('Rating posted successfully');
        this.dashboard.loadToilets()

      },
      (err) => {
        this.toastr.error('Failed to post rating:', err);
      }
    );
  }

  getAverage(toiletId: string) {}
}
