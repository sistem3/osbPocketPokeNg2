import {Component} from '@angular/core';
import {bootstrap} from '@angular/platform-browser-dynamic';
import {OsbPocketPoke} from 'osb-pocket-poke/components';
import { Http, HTTP_PROVIDERS, Headers, RequestOptions } from '@angular/http';
import 'ScrollMagic';
declare let ScrollMagic;

@Component({
    selector: 'sandbox',
    directives: [OsbPocketPoke],
    template: `<osb-pocket-poke></osb-pocket-poke>`
})
export class Sandbox {
    constructor() {
        console.log('Sandbox Loaded');
    }
}

bootstrap(Sandbox, HTTP_PROVIDERS);