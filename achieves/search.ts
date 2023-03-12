import { InputParameter } from "@modules/command";
import { sauceNAOSearch } from "#pic_search/utils/api";
import { checkSauceNAOSearchStatus } from "#pic_search/types/check";
import { keys, config } from "#pic_search/init";
import { ISauceNAOResponseError, ISauceNAOResponseSuccess, ISauceNAOResult } from "#pic_search/types/SauceNAO";
import { Quotable, AtElem, ImageElem, Message, Group, User, GroupMessage, PrivateMessage } from "icqq";
import { isGroupMessage } from "@modules/message";

enum ErrorMsg {
	CANNOT_AT = "未开启 at 查询头像功能",
	NOT_FOUNT = "未找到类似图片",
	EMPTY = "请在指令后跟随图片",
	EMPTY_AT = "请在指令后跟随图片或@用户",
	OVERFLOW = "不得超过三张图片",
	ERROR_MESSAGE = "识图api请求出错",
	REPLY_ERROR = "获取引用信息出错：",
	INCOMPLETE_RESULTS = "*服务端异常，结果可能不完全",
	REPLY_ERROR_RESULTS = "*引用消息获取出错，请重试"
}

const keyToDiy = {
	title: "标题",
	eng_name: "标题（英）",
	jp_name: "标题（日）",
	tweet_id: "twitter_id",
	pixiv_id: "pixiv_id",
	yandere_id: "yandere_id",
	gelbooru_id: "gelbooru_id",
	danbooru_id: "danbooru_id",
	creator: "作者",
	member_id: "作者id(pixiv)",
	member_name: "作者(pixiv)",
	twitter_user_id: "作者id(推特)",
	twitter_user_handle: "作者用户名(推特)",
	created_at: "发布日期",
	user_id: "作者id（pixiv Fanbox）",
	user_name: "作者（pixiv Fanbox）",
	publish: "发布日期（pixiv Fanbox）",
	service_name: "发布地址"
}

export async function main( { sendMessage, messageData, logger, client }: InputParameter ): Promise<void> {
	const { message, source } = messageData;
	
	const hasReply: boolean = !!source;
	const recReplyImage: ImageElem[] = [];
	
	let replyError: boolean = false; // 获取回复消息是否出错
	/* 尝试获取回复信息中的图片 */
	if ( source ) {
		try {
			let data: GroupMessage[] | PrivateMessage[] = [];
			if ( isGroupMessage( messageData ) ) {
				const group: Group = client.pickGroup( messageData.group_id );
				data = await group.getChatHistory( source.seq, 1 );
			} else {
				const user: User = client.pickUser( source.user_id );
				data = await user.getChatHistory( source.time, 1 );
			}
			
			if ( data.length === 0 ) {
				throw new Error( "未获取到引用消息" );
			}
			recReplyImage.push( ...<ImageElem[]>data.map( ( msg: GroupMessage | PrivateMessage ) => msg.message[0] ).filter( m => m.type === "image" ) );
		} catch ( error ) {
			replyError = true;
			logger.error( ErrorMsg.REPLY_ERROR + error?.message || "" );
		}
	}
	
	const recImage = <ImageElem[]>message.filter( m => m.type === "image" );
	const recAt = <AtElem[]>message.filter( m => m.type === "at" );
	
	const recMessage: Array<ImageElem | AtElem> = [ ...recReplyImage, ...recImage ];
	
	/* 当开启@搜头像且不存在回复消息时结果中包含头像，否则不包含 */
	if ( config.at && !hasReply ) {
		recMessage.push( ...recAt );
	}
	
	if ( !recMessage.length ) {
		if ( config.at && !hasReply ) {
			await sendMessage( ErrorMsg.EMPTY_AT );
		} else {
			await sendMessage( recAt.length ? ErrorMsg.CANNOT_AT : ErrorMsg.EMPTY );
		}
		return;
	}
	
	if ( recMessage.length > 3 ) {
		await sendMessage( ErrorMsg.OVERFLOW );
		return;
	}
	
	const rowMessageArr: string[] = [];
	
	!config.multiple && ( recMessage.length = 1 );
	
	let imgIndex = 0;
	
	for ( const rec of recMessage ) {
		imgIndex++
		config.multiple && rowMessageArr.push( `---第${ imgIndex }张搜索结果---` );
		let url: string;
		if ( rec.type === "image" ) {
			url = <string>rec.url;
		} else {
			url = `https://q1.qlogo.cn/g?b=qq&s=640&nk=${ ( <AtElem>rec ).qq }`;
		}
		
		let api_key = keys.getKey();
		
		let result: ISauceNAOResponseSuccess | ISauceNAOResponseError;
		try {
			result = await sauceNAOSearch( { api_key, url } );
		} catch ( error ) {
			logger.error( error );
			rowMessageArr.push( ErrorMsg.ERROR_MESSAGE );
			continue;
		}
		
		if ( !checkSauceNAOSearchStatus( result ) ) {
			rowMessageArr.push( result.header.message || ErrorMsg.ERROR_MESSAGE );
			/* 当前keys无效时，切换 */
			if ( result.header.status === -1 ) {
				keys.increaseIndex();
			}
			continue;
		}
		
		/* keys次数用完时，切换 */
		if ( result.header.long_remaining === 0 ) {
			keys.increaseIndex();
		}
		
		/* 当引用消息获取出错时，提示 */
		if ( replyError ) {
			rowMessageArr.push( ErrorMsg.REPLY_ERROR_RESULTS );
		}
		
		/* 当状态为3时，查询结果不完全 */
		if ( result.header.status === 3 ) {
			rowMessageArr.push( ErrorMsg.INCOMPLETE_RESULTS );
		}
		
		/* 获取前两个相似度匹配的数据 */
		const gottenResult = result.results.filter( r => Number( r.header.similarity ) >= config.similarity ).slice( 0, 2 );
		
		if ( !gottenResult.length ) {
			rowMessageArr.push( ErrorMsg.NOT_FOUNT );
			continue;
		}
		
		const sendMessageObj: { [field: string]: string } = {};
		
		/* 生成返回数据对象方法 */
		const setMessageData = ( data: ISauceNAOResult["data"], key: string, diyKey: string ) => {
			if ( data[key] && !sendMessageObj[diyKey] ) {
				sendMessageObj[diyKey] = data[key];
			}
		}
		
		/* 生成返回数据对象 */
		for ( const { data } of gottenResult ) {
			for ( const k in keyToDiy ) {
				setMessageData( data, k, keyToDiy[k] );
			}
		}
		
		/* 根据数据对象生成返回数据 */
		for ( const sKey in sendMessageObj ) {
			rowMessageArr.push( `${ sKey }：${ sendMessageObj[sKey] }` );
		}
	}
	await sendMessage( rowMessageArr.join( "\n" ) );
}
