import { RefreshCatch } from "@modules/management/refresh";

export interface ISearchConfig {
	searchKeys: string[]
}

export default class SearchConfig {
	public searchKeys: string[];
	
	public static configName = "pic_search";
	
	public static init = {
		searchKeys: [ "searchKeyA", "searchKeyB" ]
	}
	
	constructor( config: ISearchConfig ) {
		this.searchKeys = config.searchKeys;
	}
	
	public async refresh( config: ISearchConfig ): Promise<string> {
		try {
			this.searchKeys = config.searchKeys;
			return `${ SearchConfig.configName }.yml 重新加载完毕`;
		} catch ( error ) {
			throw <RefreshCatch>{
				log: ( <Error>error ).stack,
				msg: `${ SearchConfig.configName }.yml 重新加载失败，请前往控制台查看日志`
			};
		}
	}
}