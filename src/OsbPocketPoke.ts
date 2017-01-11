import {Component} from '@angular/core';
import { Http, HTTP_PROVIDERS, Headers, RequestOptions } from '@angular/http';
import 'ScrollMagic';
declare let ScrollMagic;

@Component({
    selector: 'osb-pocket-poke',
    templateUrl: 'node_modules/osb-pocket-poke/lib/OsbPocketPoke.html',
    styleUrls: ['node_modules/osb-pocket-poke/lib/OsbPocketPoke.css']
})
export class OsbPocketPoke {
    isLoading = true;
    navHidden = true;
    pokemonApiBase = 'https://pokeapi.co';
    caughtPokemon = [];

    pokemonList = [];
    pokemon = [];
    locationData = [];
    locations = [];
    evolutionChains = [];
    evolutions = [];
    berriesData = [];
    berries = [];

    sectionDisplay = 'pokemon';
    pageLength = 20;

    pokePageCount = 1;
    locationsPageCount = 1;
    evolutionsPageCount = 1;
    berriesPageCount = 1;

    pokemonScene;
    overlayShowing = false;
    overlayType = '';
    overlayContent = {};

    constructor(public http: Http) {
        // Check Cache - Main
        let pokeListCache = localStorage.getItem('osbPocketPoke');
        if (pokeListCache) {
            this.pokemonList = JSON.parse(pokeListCache);
        }
        let pokeCache = localStorage.getItem('osbPocketPoke.pokemon');
        if (pokeCache) {
            this.pokemon = JSON.parse(pokeCache);
        }
        // Check Caught Pokemon
        let caughtPokeList = localStorage.getItem('osbPocketPoke.caughtPokemon');
        if (caughtPokeList) {
            this.caughtPokemon = JSON.parse(caughtPokeList);
        }
        // Check Cache - Evolutions
        let evolutionChainsCache = localStorage.getItem('osbPocketPoke.evolutionChains');
        if (evolutionChainsCache) {
            this.evolutionChains = JSON.parse(evolutionChainsCache);
        }
        let evolutionsCache = localStorage.getItem('osbPocketPoke.evolutions');
        if (evolutionsCache) {
            this.evolutions = JSON.parse(evolutionsCache);
        }
        // Check Cache - Berries
        let berriesCache = localStorage.getItem('osbPocketPoke.berries');
        if (berriesCache) {
            this.berries = JSON.parse(berriesCache);
        }
        let berriesDataCache = localStorage.getItem('osbPocketPoke.berriesData');
        if (berriesDataCache) {
            this.berriesData = JSON.parse(berriesDataCache);
        }
        // Check Cache - Locations
        let locationsCache = localStorage.getItem('osbPocketPoke.locations');
        if (locationsCache) {
            this.locations = JSON.parse(locationsCache);
        }
        let locationDataCache = localStorage.getItem('osbPocketPoke.locationData');
        if (locationDataCache) {
            this.locationData = JSON.parse(locationDataCache);
        }
        console.log(this);
        //this.getPokeList();
        this.getSectionList('pokemon', 1);
    }
    // Init ScrollMagic
    startScrollMagic(section) {
        if (this.pokemonScene) {this.pokemonScene.destroy();}
        let holder = this;
        let controller = new ScrollMagic.Controller();
        let trigger = '#loading-trigger';
        switch(section) {
            case 'pokemon':
                trigger = '#loading-trigger';
                break;
            case 'locations':
                trigger = '#locations-loading-trigger';
                break;
            case 'evolutions':
                trigger = '#evolutions-loading-trigger';
                break;
            case 'berries':
                trigger = '#berries-loading-trigger';
                break;
        }
        holder.pokemonScene = new ScrollMagic.Scene({triggerElement: trigger, triggerHook: 'onEnter'})
            .addTo(controller)
            .on('enter', function (e) {
                if (section === 'pokemon' &&
                    document.querySelector(trigger).className.indexOf('active') == -1) {
                    document.querySelector(trigger).classList.add('active');
                    holder.pokePageCount++;
                    holder.getSectionList('pokemon', holder.pokePageCount);
                } else if (section === 'locations' &&
                    document.querySelector(trigger).className.indexOf('active') == -1) {
                    document.querySelector(trigger).classList.add('active');
                    holder.locationsPageCount++;
                    holder.getSectionList('locations', holder.locationsPageCount);
                } else if (section === 'evolutions' &&
                    document.querySelector(trigger).className.indexOf('active') == -1) {
                    document.querySelector(trigger).classList.add('active');
                    holder.evolutionsPageCount++;
                    holder.getSectionList('evolutions', holder.evolutionsPageCount);

                } else if (section === 'berries' &&
                    document.querySelector(trigger).className.indexOf('active') == -1) {
                    document.querySelector(trigger).classList.add('active');
                    holder.berriesPageCount++;
                    holder.getSectionList('berries', holder.berriesPageCount);
                }
            });
        holder.pokemonScene.update();
    }
    // Destroy ScrollMagic Instances
    destroyScrollMagic() {
        //console.log(this.pokemonScene);
        if (this.pokemonScene) {
            //console.log('Destroy');
            this.pokemonScene.destroy();
        }
    }
    // Capture Pokemon
    capturePokemon(pokemon) {
        console.log('Gotta catch em allllllllll......');
        console.log(pokemon);
        this.caughtPokemon.push(pokemon);
        localStorage.setItem('osbPocketPoke.caughtPokemon', JSON.stringify(this.caughtPokemon));
    }
    // Get Section Data
    getSectionData(section, item, cache) {
        this.sectionDisplay = section;
        this.http.get(item.url)
            .subscribe(response => this.setSectionData(section, response, cache));
    }
    // Set Section Data
    setSectionData(section, data, cache) {
        //console.log('Set section data. Section = ' + section);
        this.isLoading = false;
        if (section == 'pokemon') {
            this.pokemon.push(data.json());
            if (this.pokemon.length < ((this.pageLength + 1) * this.pokePageCount) && !cache) {
                localStorage.setItem('osbPocketPoke.pokemon', JSON.stringify(this.pokemon));
            }
            if (this.pokemon.length > ((this.pageLength - 1) * this.pokePageCount)) {
                document.querySelector('#loading-trigger').classList.remove('active');
                this.startScrollMagic('pokemon');
            }
        }
        if (section == 'locations') {
            this.locations.push(data.json());
            if (this.locations.length < ((this.pageLength + 1) * this.locationsPageCount) && !cache) {
                localStorage.setItem('osbPocketPoke.locations', JSON.stringify(this.locations));
            }
            if (this.locations.length > ((this.pageLength - 1) * this.locationsPageCount)) {
                document.querySelector('#locations-loading-trigger').classList.remove('active');
                this.startScrollMagic('locations');
            }
        }
        if (section == 'evolutions') {
            this.evolutions.push(data.json());
            if (this.evolutions.length < ((this.pageLength + 1) * this.evolutionsPageCount) && !cache) {
                localStorage.setItem('osbPocketPoke.evolutions', JSON.stringify(this.evolutions));
            }
            if (this.evolutions.length > ((this.pageLength - 1) * this.evolutionsPageCount)) {
                document.querySelector('#evolutions-loading-trigger').classList.remove('active');
                this.startScrollMagic('evolutions');
            }
        }
        if (section == 'berries') {
            this.berries.push(data.json());
            if (this.berries.length < ((this.pageLength + 1) * this.berriesPageCount) && cache) {
                localStorage.setItem('osbPocketPoke.berries', JSON.stringify(this.berries));
            }
            if (this.berries.length > ((this.pageLength - 1) * this.berriesPageCount)) {
                document.querySelector('#berries-loading-trigger').classList.remove('active');
                this.startScrollMagic('berries');
            }
        }
    }
    // Get Section List
    getSectionList(section, page) {
        this.isLoading = true;
        this.destroyScrollMagic();
        let sectionDataUrl = '';
        switch(section) {
            case 'pokemon':
                sectionDataUrl = '/api/v2/pokemon/';
                break;
            case 'locations':
                sectionDataUrl = '/api/v2/location/';
                break;
            case 'evolutions':
                sectionDataUrl = '/api/v2/evolution-chain/';
                break;
            case 'berries':
                sectionDataUrl = '/api/v2/berry/';
                break;
        }
        if (page > 1) {
            let pageOffset = (page - 1) * this.pageLength;
            sectionDataUrl = sectionDataUrl + '?limit=' + this.pageLength + '&offset=' + pageOffset;

            this.http.get(this.pokemonApiBase + sectionDataUrl)
                .subscribe(response => this.setSectionList(section, response, true));

            return false;
        }
        if (this.pokemon.length > 1 &&
            section == 'pokemon') {
            //console.log('load poke from cache');
            this.setSectionList('pokemon', this.pokemon, false);
            return false;
        }
        if (this.locations.length > 1 &&
            section == 'locations') {
            //console.log('load location from cache');
            this.setSectionList('locations', this.locations, false);
            return false;
        }
        if (this.evolutions.length > 1 &&
            section == 'evolutions') {
            //console.log('load evolutions from cache');
            this.setSectionList('evolutions', this.evolutions, false);
            return false;
        }
        if (this.berries.length > 1 &&
            section == 'berries') {
            //console.log('load evolutions from cache');
            this.setSectionList('berries', this.berries, false);
            return false;
        }
        this.http.get(this.pokemonApiBase + sectionDataUrl)
            .subscribe(response => this.setSectionList(section, response, false));
    }
    // Set Section List
    setSectionList(section, data, paginated) {
        //console.log('Set section list data. Section = ' + section);
        let holder = this;
        if (section == 'pokemon' && this.pokemonList.length > (this.pageLength - 1) && !paginated) {
            this.sectionDisplay = 'pokemon';
            setTimeout(function() {
                holder.startScrollMagic('pokemon');
            }, 1000);
            return false;
        }
        if (section == 'locations' && this.locations.length > (this.pageLength - 1) && !paginated) {
            this.sectionDisplay = 'locations';
            setTimeout(function() {
                holder.startScrollMagic('locations');
            }, 1000);
            return false;
        }
        if (section == 'evolutions' && this.evolutions.length > (this.pageLength - 1) && !paginated) {
            this.sectionDisplay = 'evolutions';
            setTimeout(function() {
                holder.startScrollMagic('evolutions');
            }, 1000);
            return false;
        }
        if (section == 'berries' && this.berries.length > (this.pageLength - 1) && !paginated) {
            this.sectionDisplay = 'berries';
            setTimeout(function() {
                holder.startScrollMagic('berries');
            }, 1000);
            return false;
        }

        let feed = data.json();
        if (section == 'pokemon') {
            this.pokemonList = feed;
            if (!paginated) {
                localStorage.setItem('osbPocketPoke', JSON.stringify(feed.results));
            }
            feed.results.forEach(function(element) {
                holder.getSectionData('pokemon', element, paginated);
            });
        }
        if (section == 'locations') {
            this.locationData = feed;
            if (!paginated) {
                localStorage.setItem('osbPocketPoke.locationsData', JSON.stringify(feed.results));
            }
            feed.results.forEach(function(element) {
                holder.getSectionData('locations', element, paginated);
            });
        }
        if (section == 'evolutions') {
            this.evolutionChains = feed;
            if (!paginated) {
                localStorage.setItem('osbPocketPoke.evolutionsData', JSON.stringify(feed.results));
            }
            feed.results.forEach(function(element) {
                holder.getSectionData('evolutions', element, paginated);
            });
        }
        if (section == 'berries') {
            this.berriesData = feed;
            if (!paginated) {
                localStorage.setItem('osbPocketPoke.berriesData', JSON.stringify(feed.results));
            }
            feed.results.forEach(function(element) {
                holder.getSectionData('berries', element, paginated);
            });
        }
    }
    // Show Overlay
    showOverlay(section, content) {
        this.overlayType = section;
        this.overlayContent = content;
        this.overlayShowing = true;
    }
    // Hide Overlay
    hideOverlay() {
        this.overlayType = '';
        this.overlayContent = {};
        this.overlayShowing = false;
    }
}