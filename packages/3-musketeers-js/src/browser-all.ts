import {Tiendada3musketeers} from './3-musketeers';
import {GoogleAnalytics} from './3-musketeers/provider/google-analytics';

const t3musketeers = new Tiendada3musketeers([GoogleAnalytics]);

window.t3musketeers = t3musketeers;
