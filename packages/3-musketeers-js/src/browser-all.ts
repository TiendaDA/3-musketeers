import {Tiendada3musketeers} from './3-musketeers';
import {GoogleAnalytics} from './3-musketeers/provider/google-analytics';
import {Amplitude} from './3-musketeers/provider/amplitude';

const t3musketeers = new Tiendada3musketeers([GoogleAnalytics, Amplitude]);

window.t3musketeers = t3musketeers;
