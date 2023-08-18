import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoidmFsZXJpb3ByZHMiLCJhIjoiY2xsM3kyYWc3MDE1cTNka2RuNWU5YTRobiJ9.ixrPJgwmaCl6V6hi5WcI-g';

if (!navigator.geolocation) {
  alert('Broweser does not support geolocalization');
  throw new Error('Broweser does not support geolocalization');
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
