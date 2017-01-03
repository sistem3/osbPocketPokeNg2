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
    pokemonViewList = [];
    pokemon = [];
    evolutionChains = [];
    evolutionViewList = [];
    evolutions = [];
    evolutionsCount = 0;
    contests = [];
    berries = [];
    berriesData = [];
    berryCount = 0;
    locations = [];
    locationsCount = 0;
    locationData = [];
    locationCount = 0;
    sectionDisplay = 'pokemon';
    pokeListCount = 0;
    pageLength = 20;

    pokePageCount = 0;
    locationsPageCount = 0;
    evolutionsPageCount = 0;
    berriesPageCount = 0;

    pokeCallbackCount = 1;
    locationCallbackCount = 1;
    evolutionsCallbackCount = 1;
    berriesCallbackCount = 1;

    pokemonScene;

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
        this.getPokeList();
    }
    // Init ScrollMagic
    startScrollMagic(section) {
        if (this.pokemonScene) {this.pokemonScene.destroy();}
        let holder = this;
        let controller = new ScrollMagic.Controller();
        let trigger = '#loading-trigger';
        if (section === 'locations') {
            trigger = '#locations-loading-trigger';
        }
        holder.pokemonScene = new ScrollMagic.Scene({triggerElement: trigger, triggerHook: 'onEnter'})
            .addTo(controller)
            .on('enter', function (e) {
                console.log(section);
                if (section === 'pokemon' &&
                    document.querySelector('#loading-trigger').className.indexOf('active') == -1) {
                    document.querySelector('#loading-trigger').classList.add('active');
                    console.log('Load more pokemon');
                    holder.getMorePokemon();
                } else if (section === 'locations' &&
                    document.querySelector('#locations-loading-trigger').className.indexOf('active') == -1) {
                    document.querySelector('#locations-loading-trigger').classList.add('active');
                    console.log('Load more locations');
                    //older.getMorePokemon();
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
    // Get Berry
    getBerry(berry) {
        this.http.get(berry.url)
            .subscribe(response => this.setBerry(response));
    }
    // Set Berry
    setBerry(berry) {
        let berryData = berry.json();
        this.berriesData.push(berryData);
        this.sectionDisplay = 'berries';
        localStorage.setItem('osbPocketPoke.berriesData', JSON.stringify(this.berriesData));
    }
    // Get Berrie(s)
    getBerries() {
        this.destroyScrollMagic();
        if (this.berriesData.length > 1) {
            this.setBerries(JSON.stringify(this.berries));
            return false;
        }
        this.http.get(this.pokemonApiBase + '/api/v2/berry/')
            .subscribe(response => this.setBerries(response));
    }
    // Set Berrie(s)
    setBerries(berries) {
        let holder = this;
        let berriesData = berries.json();
        this.berries = berriesData;
        this.berryCount = berriesData.count;
        berriesData.results.forEach(function(element) {
            holder.getBerry(element);
        });
    }
    // Get Evolution
    getEvolution(evolution) {
        this.http.get(evolution.url)
            .subscribe(response => this.setEvolution(response));
    }
    // Set Evolution
    setEvolution(evolution) {
        this.sectionDisplay = 'evolution';
        this.evolutions.push(evolution.json());
        localStorage.setItem('osbPocketPoke.evolutions', JSON.stringify(this.evolutions));
    }
    // Get Evolution Chain
    getEvolutions() {
        if (this.evolutionChains.length > 1) {
            this.sectionDisplay = 'evolution';
            return false;
        }
        this.http.get(this.pokemonApiBase + '/api/v2/evolution-chain/')
            .subscribe(response => this.setEvolutions(response));
    }
    // Set Evolution Chain
    setEvolutions(evolutions) {
        let holder = this;
        if (holder.pokemonList.length > 1) {
            this.sectionDisplay = 'locations';
            setTimeout(function() {
                holder.startScrollMagic('locations');
            }, 1000);
            return false;
        }
        let evolutionsData = evolutions.json();
        holder.evolutionChains = evolutionsData;
        localStorage.setItem('osbPocketPoke.evolutionChains', JSON.stringify(holder.evolutionChains));
        let evolutionsCount = 0;
        holder.evolutionsCount = evolutionsData.count;
        evolutionsData.results.forEach(function(element, index, array) {
            evolutionsCount++;
            if (evolutionsCount === array.length) {
                setTimeout(function() {
                    holder.startScrollMagic('evolutions');
                }, 3500);
            } else {
                holder.locations.push(element);
                holder.getEvolution(element);
            }
        });
    }
    // Get Location
    getLocation(location) {
        console.log('Check locations');
        if (this.locationData.length > 1) {
            this.sectionDisplay = 'locations';
            return false;
        }
        this.http.get(location.url)
            .subscribe(response => this.setLocation(response));
    }
    // Set Location
    setLocation(location) {
        this.locationCount++;
        if (this.locationCount === this.pageLength) {
            this.destroyScrollMagic();
            this.startScrollMagic('locations');
        }
        this.locationData.push(location.json());
        this.sectionDisplay = 'locations';
        localStorage.setItem('osbPocketPoke.locationData', JSON.stringify(this.locationData));
    }
    // Get Location(s)
    getLocations() {
        this.destroyScrollMagic();
        if (this.locationData.length > 1) {
            this.setLocations(JSON.stringify(this.locations));
            return false;
        }
        this.http.get(this.pokemonApiBase + '/api/v2/location/')
            .subscribe(response => this.setLocations(response));
    }
    // Set Location(s)
    setLocations(locations) {
        let holder = this;
        if (holder.pokemonList.length > 1) {
            this.sectionDisplay = 'locations';
            setTimeout(function() {
                holder.startScrollMagic('locations');
            }, 1000);
            return false;
        }
        let locationsResults = locations.json();
        holder.pokemonList = locationsResults;
        localStorage.setItem('osbPocketPoke.locations', JSON.stringify(holder.locations));
        let locationCount = 0;
        holder.locationsCount = locationsResults.count;
        locationsResults.results.forEach(function(element, index, array) {
            locationCount++;
            if (locationCount === array.length) {
                setTimeout(function() {
                    holder.startScrollMagic('locations');
                }, 3500);
            } else {
                holder.locations.push(element);
                holder.getLocation(element);
            }
        });
    }
    // Get More Pokemon (Pagination)
    getMorePokemon() {
        let holder = this;
        holder.pokeCallbackCount = 1;
        let pokePageCount = holder.pageLength;
        let page = holder.pageLength;
        holder.pokePageCount++;
        if (holder.pokePageCount > 1) {
            page = page * holder.pokePageCount;
        }
        this.http.get(this.pokemonApiBase + '/api/v2/pokemon/?limit=' + pokePageCount + '&offset=' + page)
            .subscribe(response => this.setMorePokemon(response));
    }
    // Set More Pokemon (Pagination)
    setMorePokemon(pokemonList) {
        let holder = this;
        let pokemonUpdate = pokemonList.json();
        pokemonUpdate.results.forEach(function(element) {
            holder.http.get(element.url)
                .subscribe(response => holder.updatePokemon(response));
        });
    }
    // Update Pokemon List
    updatePokemon(pokemon) {
        let pokeData = pokemon.json();
        this.pokemon.push(pokeData);
        this.pokeCallbackCount++;
        if (this.pokeCallbackCount === this.pageLength) {
            document.querySelector('#loading-trigger').classList.remove('active');
        }
    }
    // Get Pokemon
    getPokemon(pokemon, newList) {
        this.sectionDisplay = 'pokemon';
        let holder = this;
        if (!newList) {
            if (holder.pokemon.length > 1) {
                return false;
            }
        }
        this.http.get(pokemon.url)
            .subscribe(response => this.setPokemon(response, newList));
    }
    // Set Pokemon
    setPokemon(pokemon, newList) {
        let holder = this;
        holder.pokemon.push(pokemon.json());
        if (!newList) {
            // Cache size too small for full listing storage
            localStorage.setItem('osbPocketPoke.pokemon', JSON.stringify(holder.pokemon));
        } else {
            holder.pokeCallbackCount++;
            if (holder.pokeCallbackCount === holder.pageLength) {
                console.log('Callback');
                document.querySelector('#loading-trigger').classList.remove('active');
            }
        }
    }
    // Get Initial Poke List
    getPokeList() {
        this.destroyScrollMagic();
        if (this.pokemon.length > 1) {
            this.setPokeList(JSON.stringify(this.pokemonList));
            return false;
        }
        this.http.get(this.pokemonApiBase + '/api/v2/pokemon/')
            .subscribe(response => this.setPokeList(response));
    }
    // Get Initial Poke List
    setPokeList(data) {
        let holder = this;
        if (holder.pokemonList.length > 1) {
            this.sectionDisplay = 'pokemon';
            setTimeout(function() {
                holder.startScrollMagic('pokemon');
            }, 1000);
            return false;
        }
        let feed = data.json();
        holder.pokemonList = feed;
        localStorage.setItem('osbPocketPoke', JSON.stringify(feed.results));
        let pokeCount = 0;
        holder.pokeListCount = feed.count;
        feed.results.forEach(function(element, index, array) {
            pokeCount++;
            if (pokeCount === array.length) {
                setTimeout(function() {
                    holder.startScrollMagic('pokemon');
                }, 3500);
            } else {
                holder.pokemonViewList.push(element);
                holder.getPokemon(element, false);
            }
        });
    }
}