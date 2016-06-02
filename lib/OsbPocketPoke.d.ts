import { Http } from '@angular/http';
import 'ScrollMagic';
export declare class OsbPocketPoke {
    http: Http;
    isLoading: boolean;
    navHidden: boolean;
    pokemonApiBase: string;
    pokemonList: any[];
    pokemonViewList: any[];
    pokemon: any[];
    evolutionChains: any[];
    evolutionViewList: any[];
    evolutions: any[];
    contests: any[];
    berries: any[];
    berriesData: any[];
    berryCount: number;
    locations: any[];
    locationsCount: number;
    locationData: any[];
    sectionDisplay: string;
    listCount: number;
    pageLength: number;
    pageCount: number;
    callbackCount: number;
    constructor(http: Http);
    getBerry(berry: any): void;
    setBerry(berry: any): void;
    getBerries(): void;
    setBerries(berries: any): void;
    getEvolution(evolution: any): void;
    setEvolution(evolution: any): void;
    getEvolutionChain(): void;
    setEvolutionChain(evolutions: any): void;
    getLocation(location: any): void;
    setLocation(location: any): void;
    getLocations(): void;
    setLocations(locations: any): void;
    startScrollMagic(): void;
    getMorePokemon(): void;
    setMorePokemon(pokemonList: any): void;
    updatePokemon(pokemon: any): void;
    getPokemon(pokemon: any, newList: any): boolean;
    setPokemon(pokemon: any, newList: any): void;
    getPokeList(): void;
    setPokeList(data: any): boolean;
}
