import {Tiendada3musketeers} from './3-musketeers';
import {GoogleTagManager} from './3-musketeers/provider/google-tag-manager';
import {Amplitude} from './3-musketeers/provider/amplitude';
import {CustomerIo} from './3-musketeers/provider/customer-io';
import {FacebookPixel} from './3-musketeers/provider/facebook-pixel';
import {Hotjar} from './3-musketeers/provider/hotjar';
import {UserGuiding} from './3-musketeers/provider/user-guiding';

const t3musketeers = new Tiendada3musketeers([
  GoogleTagManager,
  Amplitude,
  CustomerIo,
  FacebookPixel,
  Hotjar,
  UserGuiding,
]);

window.t3musketeers = t3musketeers;
