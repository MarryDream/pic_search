import bot from "ROOT";
import { BOT } from "@modules/bot";
import SearchConfig from "#pic_search/module/config";
import SearchKey from "#pic_search/module/keys";
import { PluginSetting } from "@modules/plugin";
import { OrderConfig } from "@modules/command";
import FileManagement from "@modules/file";

export let config: SearchConfig
export let keys: SearchKey

const search: OrderConfig = {
	type: "order",
	cmdKey: "marry-dream.pic-search",
	desc: [ "搜图", "[图片]" ],
	headers: [ "pic_search" ],
	regexps: [ ".+" ],
	main: "achieves/search",
	detail: "附带图片发送，使用SauceNAO搜索，可同时搜索多张，上限3张\n" +
		"支持修改配置文件multiple字段，更改单/多张搜索模式"
};


function loadConfig( file: FileManagement ): SearchConfig {
	const initConfig = SearchConfig.init;
	
	const path = file.getFilePath( SearchConfig.configName + ".yml" );
	const isExit = file.isExist( path );
	
	if ( !isExit ) {
		file.createYAML( SearchConfig.configName, initConfig );
		return new SearchConfig( initConfig );
	}
	
	const config = file.loadYAML( SearchConfig.configName );
	
	return new SearchConfig( config )
}


export async function init( { file }: BOT ): Promise<PluginSetting> {
	
	config = loadConfig( file );
	keys = new SearchKey( config );
	
	bot.refresh.registerRefreshableFile( SearchConfig.configName, config );
	
	return {
		pluginName: "pic_search",
		cfgList: [ search ]
	};
}