export default class SearchKey {
	private keys: string[];
	private index: number;
	
	constructor( searchKeys: string[] ) {
		this.keys = searchKeys;
		this.index = 0;
	}
	
	public increaseIndex() {
		this.index = this.index === this.keys.length - 1 ? 0 : this.index + 1;
	}
	
	public setKey( keys: string[] ) {
		this.keys = keys
	}
	
	public getKey() {
		return this.keys[this.index];
	}
}