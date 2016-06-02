"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
const core_1 = require('@angular/core');
const http_1 = require('@angular/http');
require('ScrollMagic');
let OsbPocketPoke = class OsbPocketPoke {
    constructor(http) {
        this.http = http;
        this.isLoading = true;
        this.navHidden = true;
        this.pokemonApiBase = 'http://pokeapi.co';
        this.pokemonList = [];
        this.pokemonViewList = [];
        this.pokemon = [];
        this.evolutionChains = [];
        this.evolutionViewList = [];
        this.evolutions = [];
        this.contests = [];
        this.berries = [];
        this.berriesData = [];
        this.berryCount = 0;
        this.locations = [];
        this.locationsCount = 0;
        this.locationData = [];
        this.sectionDisplay = 'pokemon';
        this.listCount = 0;
        this.pageLength = 20;
        this.pageCount = 0;
        this.callbackCount = 1;
        var pokeListCache = localStorage.getItem('osbPocketPoke');
        if (pokeListCache) {
            this.pokemonList = JSON.parse(pokeListCache);
        }
        var pokeCache = localStorage.getItem('osbPocketPoke.pokemon');
        if (pokeCache) {
            this.pokemon = JSON.parse(pokeCache);
        }
        var evolutionChainsCache = localStorage.getItem('osbPocketPoke.evolutionChains');
        if (evolutionChainsCache) {
            this.evolutionChains = JSON.parse(evolutionChainsCache);
        }
        var evolutionsCache = localStorage.getItem('osbPocketPoke.evolutions');
        if (evolutionsCache) {
            this.evolutions = JSON.parse(evolutionsCache);
        }
        var berriesCache = localStorage.getItem('osbPocketPoke.berries');
        if (berriesCache) {
            this.berries = JSON.parse(berriesCache);
        }
        var berriesDataCache = localStorage.getItem('osbPocketPoke.berriesData');
        if (berriesDataCache) {
            this.berriesData = JSON.parse(berriesDataCache);
        }
        var locationsCache = localStorage.getItem('osbPocketPoke.locations');
        if (locationsCache) {
            this.locations = JSON.parse(locationsCache);
        }
        var locationDataCache = localStorage.getItem('osbPocketPoke.locationData');
        if (locationDataCache) {
            this.locations = JSON.parse(locationDataCache);
        }
        console.log(this);
        this.getPokeList();
    }
    getBerry(berry) {
        this.http.get(berry.url)
            .subscribe(response => this.setBerry(response));
    }
    setBerry(berry) {
        var berryData = berry.json();
        this.berriesData.push(berryData);
        this.sectionDisplay = 'berries';
        localStorage.setItem('osbPocketPoke.berriesData', JSON.stringify(this.berriesData));
    }
    getBerries() {
        this.http.get(this.pokemonApiBase + '/api/v2/berry/')
            .subscribe(response => this.setBerries(response));
    }
    setBerries(berries) {
        var holder = this;
        var berriesData = berries.json();
        this.berries = berriesData;
        this.berryCount = berriesData.count;
        berriesData.results.forEach(function (element) {
            holder.getBerry(element);
        });
    }
    getEvolution(evolution) {
        this.http.get(evolution.url)
            .subscribe(response => this.setEvolution(response));
    }
    setEvolution(evolution) {
        this.sectionDisplay = 'evolution';
        this.evolutions.push(evolution.json());
        localStorage.setItem('osbPocketPoke.evolutions', JSON.stringify(this.evolutions));
    }
    getEvolutionChain() {
        this.http.get(this.pokemonApiBase + '/api/v2/evolution-chain/')
            .subscribe(response => this.setEvolutionChain(response));
    }
    setEvolutionChain(evolutions) {
        var holder = this;
        var evolutionsData = evolutions.json();
        this.evolutionChains = evolutionsData;
        evolutionsData.results.forEach(function (element) {
            holder.getEvolution(element);
        });
        localStorage.setItem('osbPocketPoke.evolutionChains', JSON.stringify(this.evolutionChains));
    }
    getLocation(location) {
        this.http.get(location.url)
            .subscribe(response => this.setLocation(response));
    }
    setLocation(location) {
        this.locationData.push(location.json());
        this.sectionDisplay = 'locations';
        localStorage.setItem('osbPocketPoke.locationData', JSON.stringify(this.locationData));
    }
    getLocations() {
        this.http.get(this.pokemonApiBase + '/api/v2/location/')
            .subscribe(response => this.setLocations(response));
    }
    setLocations(locations) {
        var holder = this;
        var locationsResults = locations.json();
        this.locationsCount = locationsResults.count;
        locationsResults.results.forEach(function (element) {
            holder.locations.push(element);
            holder.getLocation(element);
        });
        localStorage.setItem('osbPocketPoke.locations', JSON.stringify(holder.locations));
    }
    startScrollMagic() {
        var holder = this;
        var controller = new ScrollMagic.Controller();
        var scene = new ScrollMagic.Scene({ triggerElement: '#loading-trigger', triggerHook: 'onEnter' })
            .addTo(controller)
            .on('enter', function (e) {
            if (document.querySelector('#loading-trigger').className.indexOf('active') == -1) {
                document.querySelector('#loading-trigger').classList.add('active');
                console.log('Load more data');
                holder.getMorePokemon();
            }
        });
        scene.update();
    }
    getMorePokemon() {
        var holder = this;
        holder.callbackCount = 1;
        var pageCount = holder.pageLength;
        var page = holder.pageLength;
        holder.pageCount++;
        if (holder.pageCount > 1) {
            page = page * holder.pageCount;
        }
        this.http.get(this.pokemonApiBase + '/api/v2/pokemon/?limit=' + pageCount + '&offset=' + page)
            .subscribe(response => this.setMorePokemon(response));
    }
    setMorePokemon(pokemonList) {
        var holder = this;
        var pokemonUpdate = pokemonList.json();
        pokemonUpdate.results.forEach(function (element) {
            holder.http.get(element.url)
                .subscribe(response => holder.updatePokemon(response));
        });
    }
    updatePokemon(pokemon) {
        var pokeData = pokemon.json();
        this.pokemon.push(pokeData);
        this.callbackCount++;
        if (this.callbackCount === this.pageLength) {
            document.querySelector('#loading-trigger').classList.remove('active');
        }
    }
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
    setPokemon(pokemon, newList) {
        var holder = this;
        holder.pokemon.push(pokemon.json());
        if (!newList) {
            localStorage.setItem('osbPocketPoke.pokemon', JSON.stringify(holder.pokemon));
        }
        else {
            holder.callbackCount++;
            if (holder.callbackCount === holder.pageLength) {
                console.log('Callback');
                document.querySelector('#loading-trigger').classList.remove('active');
            }
        }
    }
    getPokeList() {
        this.http.get(this.pokemonApiBase + '/api/v2/pokemon/')
            .subscribe(response => this.setPokeList(response));
    }
    setPokeList(data) {
        var holder = this;
        if (holder.pokemonList.length > 1) {
            setTimeout(function () {
                holder.startScrollMagic();
            }, 1500);
            return false;
        }
        var feed = data.json();
        holder.pokemonList = feed;
        localStorage.setItem('osbPocketPoke', JSON.stringify(feed.results));
        var pokeCount = 0;
        holder.listCount = feed.count;
        feed.results.forEach(function (element, index, array) {
            pokeCount++;
            if (pokeCount === array.length) {
                setTimeout(function () {
                    holder.startScrollMagic();
                }, 3500);
            }
            else {
                holder.pokemonViewList.push(element);
                holder.getPokemon(element, false);
            }
        });
    }
};
OsbPocketPoke = __decorate([
    core_1.Component({
        selector: 'osb-pocket-poke',
        templateUrl: 'vendor/osb-pocket-poke/lib/OsbPocketPoke.html',
        styleUrls: ['vendor/osb-pocket-poke/lib/OsbPocketPoke.css']
    }), 
    __metadata('design:paramtypes', [http_1.Http])
], OsbPocketPoke);
exports.OsbPocketPoke = OsbPocketPoke;
//# sourceMappingURL=OsbPocketPoke.js.map