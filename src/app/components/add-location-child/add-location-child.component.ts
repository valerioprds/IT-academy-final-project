import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-add-location-child',
  templateUrl: './add-location-child.component.html',
  styleUrls: ['./add-location-child.component.css']
})
export class AddLocationChildComponent {
  @Input() toiledIdforChildComponent!: string

}
