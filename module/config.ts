import { RefreshCatch } from "@modules/management/refresh";
import { keys } from "#pic_search/init";

export interface ISearchConfig {
	tip: string
	at: boolean
	multiple: boolean
	similarity: number
	searchKeys: string[]
}

export default class SearchConfig {
	public at: boolean;
	public multiple: boolean;
	public similarity: number;
	public searchKeys: string[];
	
	public static configName = "pic_search";
	
	public static init = {
		tip: "搜图插件配置文件，searchKeys必填，可填写多个",
		at: true,
		multiple: true,
		similarity: 70,
		searchKeys: [ "searchKeyA", "searchKeyB" ]
	}
	
	constructor( config: ISearchConfig ) {
		this.at = config.at;
		this.multiple = config.multiple;
		this.similarity = config.similarity;
		this.searchKeys = config.searchKeys;
	}
	
	public async refresh( config: ISearchConfig ): Promise<string> {
		try {
			this.at = config.at;
			this.multiple = config.multiple;
			this.similarity = config.similarity;
			this.searchKeys = config.searchKeys;
			keys.setKey( config.searchKeys );
			return `${ SearchConfig.configName }.yml 重新加载完毕`;
		} catch ( error ) {
			throw <RefreshCatch>{
				log: ( <Error>error ).stack,
				msg: `${ SearchConfig.configName }.yml 重新加载失败，请前往控制台查看日志`
			};
		}
	}
}