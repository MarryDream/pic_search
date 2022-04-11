import { RefreshCatch } from "@modules/management/refresh";

export interface ISearchConfig {
	tip: string
	multiple: boolean
	searchKeys: string[]
}

export default class SearchConfig {
	public multiple: boolean;
	public searchKeys: string[];
	
	public static configName = "pic_search";
	
	public static init = {
		tip: "搜图插件配置文件，searchKeys必填，可填写多个",
		multiple: true,
		searchKeys: [ "searchKeyA", "searchKeyB" ]
	}
	
	constructor( config: ISearchConfig ) {
		this.multiple = config.multiple;
		this.searchKeys = config.searchKeys;
	}
	
	public async refresh( config: ISearchConfig ): Promise<string> {
		try {
			this.multiple = config.multiple;
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