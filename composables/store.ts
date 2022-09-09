import { defineStore } from "pinia";
import { Player } from "~~/models/interfaces/Player";
import { Song } from "~~/models/interfaces/Song";

export const useStore = defineStore("store", {
	state: () => ({}),
	actions: {},
	getters: {
		songs() {
			return songs;
		},
		players() {
			return players;
		},
	},
});

const songs: Song[] = [
	{
		name: "Tabi no Tochuu",
		origin: "Spice and Wolf",
		genres: ["Adventure", "Fantasy", "Romance", "Adult Cast", "Historical"],
		revealed: false,
		correct: [],
	},
	{
		name: "Tabi no Tochuu",
		origin: "Spice and Wolf",
		genres: ["Adventure", "Fantasy", "Romance", "Adult Cast", "Historical"],
		revealed: false,
		correct: [],
	},
	{
		name: "Tabi no Tochuu",
		origin: "Spice and Wolf",
		genres: ["Adventure", "Fantasy", "Romance", "Adult Cast", "Historical"],
		revealed: false,
		correct: [],
	},
	{
		name: "Tabi no Tochuu",
		origin: "Spice and Wolf",
		genres: ["Adventure", "Fantasy", "Romance", "Adult Cast", "Historical"],
		revealed: false,
		correct: [],
	},
	{
		name: "Tabi no Tochuu",
		origin: "Spice and Wolf",
		genres: ["Adventure", "Fantasy", "Romance", "Adult Cast", "Historical"],
		revealed: false,
		correct: [],
	},
	{
		name: "Tabi no Tochuu",
		origin: "Spice and Wolf",
		genres: ["Adventure", "Fantasy", "Romance", "Adult Cast", "Historical"],
		revealed: false,
		correct: [],
	},
	{
		name: "Tabi no Tochuu",
		origin: "Spice and Wolf",
		genres: ["Adventure", "Fantasy", "Romance", "Adult Cast", "Historical"],
		revealed: false,
		correct: [],
	},
	{
		name: "Tabi no Tochuu",
		origin: "Spice and Wolf",
		genres: ["Adventure", "Fantasy", "Romance", "Adult Cast", "Historical"],
		revealed: false,
		correct: [],
	},
	{
		name: "Tabi no Tochuu",
		origin: "Spice and Wolf",
		genres: ["Adventure", "Fantasy", "Romance", "Adult Cast", "Historical"],
		revealed: false,
		correct: [],
	},
	{
		name: "Tabi no Tochuu",
		origin: "Spice and Wolf",
		genres: ["Adventure", "Fantasy", "Romance", "Adult Cast", "Historical"],
		revealed: false,
		correct: [],
	},
];

const players: Player[] = [
	{
		name: "Julia",
		points: 0,
		id: 0,
	},
	{
		name: "Fabian",
		points: 0,
		id: 1,
	},
	{
		name: "Philipp",
		points: 0,
		id: 2,
	},
];
