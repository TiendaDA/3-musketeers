import {Tiendada3musketeers} from './3-musketeers';
import {GoogleAnalytics} from './3-musketeers/provider/google-analytics';
import {Amplitude} from './3-musketeers/provider/amplitude';
import {CustomerIo} from './3-musketeers/provider/customer-io';
import {FacebookPixel} from './3-musketeers/provider/facebook-pixel';
import {Hotjar} from './3-musketeers/provider/hotjar';
import {UserGuiding} from './3-musketeers/provider/user-guiding';

const t3musketeers = new Tiendada3musketeers([
  GoogleAnalytics,
  Amplitude,
  CustomerIo,
  FacebookPixel,
  Hotjar,
  UserGuiding,
]);

window.t3musketeers = t3musketeers;
