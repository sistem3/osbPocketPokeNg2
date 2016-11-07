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
    pokemonApiBase = 'http://pokeapi.co';
    caughtPokemon = [];
    pokemonList = [];
    pokemonViewList = [];
    pokemon = [];
    evolutionChains = [];
    evolutionViewList = [];
    evolutions = [];
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
    locationsScene;

    constructor(public http: Http) {
        // Check Cache - Main
        var pokeListCache = localStorage.getItem('osbPocketPoke');
        if (pokeListCache) {
            this.pokemonList = JSON.parse(pokeListCache);
        }
        var pokeCache = localStorage.getItem('osbPocketPoke.pokemon');
        if (pokeCache) {
            this.pokemon = JSON.parse(pokeCache);
        }
        // Check Caught Pokemon
        var caughtPokeList = localStorage.getItem('osbPocketPoke.caughtPokemon');
        if (caughtPokeList) {
            this.caughtPokemon = JSON.parse(caughtPokeList);
        }
        // Check Cache - Evolutions
        var evolutionChainsCache = localStorage.getItem('osbPocketPoke.evolutionChains');
        if (evolutionChainsCache) {
            this.evolutionChains = JSON.parse(evolutionChainsCache);
        }
        var evolutionsCache = localStorage.getItem('osbPocketPoke.evolutions');
        if (evolutionsCache) {
            this.evolutions = JSON.parse(evolutionsCache);
        }
        // Check Cache - Berries
        var berriesCache = localStorage.getItem('osbPocketPoke.berries');
        if (berriesCache) {
            this.berries = JSON.parse(berriesCache);
        }
        var berriesDataCache = localStorage.getItem('osbPocketPoke.berriesData');
        if (berriesDataCache) {
            this.berriesData = JSON.parse(berriesDataCache);
        }
        // Check Cache - Locations
        var locationsCache = localStorage.getItem('osbPocketPoke.locations');
        if (locationsCache) {
            this.locations = JSON.parse(locationsCache);
        }
        var locationDataCache = localStorage.getItem('osbPocketPoke.locationData');
        if (locationDataCache) {
            this.locationData = JSON.parse(locationDataCache);
        }
        console.log(this);
        this.getPokeList();
    }
    // Init ScrollMagic
    startScrollMagic() {
        var holder = this;
        var controller = new ScrollMagic.Controller();
        holder.pokemonScene = new ScrollMagic.Scene({triggerElement: '#loading-trigger', triggerHook: 'onEnter'})
            .addTo(controller)
            .on('enter', function (e) {
                if (document.querySelector('#loading-trigger').className.indexOf('active') == -1) {
                    document.querySelector('#loading-trigger').classList.add('active');
                    console.log('Load more data');
                    holder.getMorePokemon();
                }
            });
        holder.pokemonScene.update();
    }
    // Init Location ScrollMagic (to be consolidated later)
    startLocationScrollMagic() {
        console.log('What up');
        var holder = this;
        var location_controller = new ScrollMagic.Controller();
        holder.locationsScene = new ScrollMagic.Scene({triggerElement: '#location-loading-trigger', triggerHook: 'onEnter'})
            .addTo(location_controller)
            .on('enter', function (e) {
                if (document.querySelector('#location-loading-trigger').className.indexOf('active') == -1) {
                    document.querySelector('#location-loading-trigger').classList.add('active');
                    console.log('Load more locations');
                    //holder.getMorePokemon();
                }
            });
        holder.locationsScene.update();
    }
    // Destroy ScrollMagic Instances
    destroyScrollMagic() {
        if (this.pokemonScene) {
            console.log('Exists');
            this.pokemonScene.destroy();
        } else {
            console.log('Doesnt exist');
        }

        if (this.locationsScene) {
            console.log('Locations exists');
            this.locationsScene.destroy();
        } else {
            console.log('Locations doesnt exist');
        }
        /*this.pokemonScene.destroy();
        this.locationsScene.destroy();*/
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
        var berryData = berry.json();
        this.berriesData.push(berryData);
        this.sectionDisplay = 'berries';
        localStorage.setItem('osbPocketPoke.berriesData', JSON.stringify(this.berriesData));
    }
    // Get Berrie(s)
    getBerries() {
        this.http.get(this.pokemonApiBase + '/api/v2/berry/')
            .subscribe(response => this.setBerries(response));
    }
    // Set Berrie(s)
    setBerries(berries) {
        var holder = this;
        var berriesData = berries.json();
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
    getEvolutionChain() {
        if (this.evolutionChains.length > 1) {
            console.log('Got some of these');
        }
        this.http.get(this.pokemonApiBase + '/api/v2/evolution-chain/')
            .subscribe(response => this.setEvolutionChain(response));
    }
    // Set Evolution Chain
    setEvolutionChain(evolutions) {
        var holder = this;
        var evolutionsData = evolutions.json();
        this.evolutionChains = evolutionsData;
        evolutionsData.results.forEach(function(element) {
            holder.getEvolution(element);
        });
        localStorage.setItem('osbPocketPoke.evolutionChains', JSON.stringify(this.evolutionChains));
    }
    // Get Location
    getLocation(location) {
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
            this.startLocationScrollMagic();
        }
        this.locationData.push(location.json());
        this.sectionDisplay = 'locations';
        localStorage.setItem('osbPocketPoke.locationData', JSON.stringify(this.locationData));
    }
    // Get Location(s)
    getLocations(newList) {
        var holder = this;
        var queryParams = '';
        if (holder.locations.length > 1 && !newList) {
            holder.locations.forEach(function(element) {
                holder.locations.push(element);
                holder.getLocation(element);
            });
            return false;
        }
        if (newList) {
            holder.locationsPageCount++;
            queryParams = '?limit=' + holder.pokePageCount + '&offset=' + holder.locationsPageCount;
        }
        this.http.get(this.pokemonApiBase + '/api/v2/location/' + queryParams)
            .subscribe(response => this.setLocations(response));
    }
    // Set Location(s)
    setLocations(locations) {
        var holder = this;
        var locationsResults = locations.json();
        holder.destroyScrollMagic();
        holder.locationsCount = locationsResults.count;
        holder.locationCount = 0;
        locationsResults.results.forEach(function(element, index, array) {
            holder.locations.push(element);
            holder.getLocation(element);
        });
        localStorage.setItem('osbPocketPoke.locations', JSON.stringify(holder.locations));
    }
    // Get More Pokemon (Pagination)
    getMorePokemon() {
        var holder = this;
        holder.pokeCallbackCount = 1;
        var pokePageCount = holder.pageLength;
        var page = holder.pageLength;
        holder.pokePageCount++;
        if (holder.pokePageCount > 1) {
            page = page * holder.pokePageCount;
        }
        this.http.get(this.pokemonApiBase + '/api/v2/pokemon/?limit=' + pokePageCount + '&offset=' + page)
            .subscribe(response => this.setMorePokemon(response));
    }
    // Set More Pokemon (Pagination)
    setMorePokemon(pokemonList) {
        var holder = this;
        var pokemonUpdate = pokemonList.json();
        pokemonUpdate.results.forEach(function(element) {
            holder.http.get(element.url)
                .subscribe(response => holder.updatePokemon(response));
        });
    }
    // Update Pokemon List
    updatePokemon(pokemon) {
        var pokeData = pokemon.json();
        this.pokemon.push(pokeData);
        this.pokeCallbackCount++;
        if (this.pokeCallbackCount === this.pageLength) {
            document.querySelector('#loading-trigger').classList.remove('active');
        }
    }
    // Get Pokemon
    getPokemon(pokemon, newList) {
        var holder = this;
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
        var holder = this;
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
        if (this.pokemon.length > 1) {
            console.log('Already got me some');
            this.setPokeList(JSON.stringify(this.pokemonList));
        }
        this.http.get(this.pokemonApiBase + '/api/v2/pokemon/')
            .subscribe(response => this.setPokeList(response));
    }
    // Get Initial Poke List
    setPokeList(data) {
        var holder = this;
        if (holder.pokemonList.length > 1) {
            holder.destroyScrollMagic();
            setTimeout(function() {
                holder.startScrollMagic();
            }, 1500);
            return false;
        }
        var feed = data.json();
        holder.pokemonList = feed;
        localStorage.setItem('osbPocketPoke', JSON.stringify(feed.results));
        var pokeCount = 0;
        holder.pokeListCount = feed.count;
        feed.results.forEach(function(element, index, array) {
            pokeCount++;
            if (pokeCount === array.length) {
                setTimeout(function() {
                    holder.destroyScrollMagic();
                    holder.startScrollMagic();
                }, 3500);
            } else {
                holder.pokemonViewList.push(element);
                holder.getPokemon(element, false);
            }
        });
    }
}