import SearchKey from "#/pic_search/module/keys";
import { OrderConfig } from "@/modules/command";
import { definePlugin } from "@/modules/plugin";
import { ExportConfig } from "@/modules/config";

const initConfig = {
	tip: "搜图插件配置文件，searchKeys必填，可填写多个",
	at: true,
	multiple: true,
	similarity: 70,
	searchKeys: [ "searchKeyA", "searchKeyB" ],
	aliases: [ "搜图" ]
}

export let config: ExportConfig<typeof initConfig>;
export let keys: SearchKey

const search: OrderConfig = {
	type: "order",
	cmdKey: "marry-dream.pic-search",
	desc: [ "搜图", "(图片)" ],
	headers: [ "pic_search" ],
	regexps: [ "[\\w\\W]*" ],
	main: "achieves/search",
	detail: "附带图片发送，使用SauceNAO搜索，可同时搜索多张，上限3张\n" +
		"支持修改配置文件multiple字段，更改单/多张搜索模式\n" +
		"支持回复图片进行查询，当为回复消息时，at搜头像不可用"
};

export default definePlugin( {
	name: "搜图",
	cfgList: [ search ],
	repo: {
		owner: "MarryDream",
		repoName: "pic_search",
		ref: "main"
	},
	async mounted( params ) {
		config = params.configRegister( "main", initConfig );
		config.on( "refresh", newCfg => {
			params.setAlias( config.aliases );
		} );
		
		params.setAlias( config.aliases );
		keys = new SearchKey( config.searchKeys );
	}
} );