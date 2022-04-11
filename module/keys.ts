import SearchConfig from "#pic_search/module/config";

export default class SearchKey {
	private keys: string[];
	private index: number;
	
	constructor( config: SearchConfig ) {
		this.keys = config.searchKeys;
		this.index = 0;
	}
	
	public increaseIndex() {
		this.index = this.index === this.keys.length - 1 ? 0 : this.index + 1;
	}
	
	public setKey(keys: string[]) {
		this.keys = keys
	}
	
	public getKey() {
		return this.keys[this.index];
	}
}