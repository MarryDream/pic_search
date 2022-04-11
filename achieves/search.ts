import { InputParameter } from "@modules/command";
import { formatRowMessage } from "#pic_search/utils/utils";
import { sauceNAOSearch } from "#pic_search/utils/api";
import { checkSauceNAOSearchStatus } from "#pic_search/types/check";
import { keys, config } from "#pic_search/init";

enum ErrorMsg {
	NOT_FOUNT = "未找到类似图片",
	EMPTY = "请在指令后跟随图片",
	OVERFLOW = "不得超过三张图片",
	ERROR_MESSAGE = "识图api请求出错"
}

export async function main( { sendMessage, messageData }: InputParameter ): Promise<void> {
	const { message, message_type } = messageData;
	
	const recMessage: any[] = message.filter( m => m.type === "image" || m.type === "at" );
	
	if ( !recMessage.length ) {
		await sendMessage( ErrorMsg.EMPTY );
		return;
	}
	
	if ( recMessage.length > 3 ) {
		await sendMessage( ErrorMsg.OVERFLOW );
	}
	
	if ( recMessage.length === 0 ) {
		await sendMessage( ErrorMsg.NOT_FOUNT );
	}
	
	const rowMessageArr: string[] = [];
	
	/* 群聊@换行处理 */
	if ( message_type === "group" ) {
		rowMessageArr.push( " " );
	}
	
	!config.multiple && ( recMessage.length = 1 );
	
	let imgIndex = 0;
	
	for ( const rec of recMessage ) {
		imgIndex++
		config.multiple && rowMessageArr.push( `---第${ imgIndex }张搜索结果---` );
		let url: string;
		if ( rec.type === "image" ) {
			url = rec.data.url;
		} else {
			url = `https://q1.qlogo.cn/g?b=qq&s=640&nk=${ rec.data.qq }`;
		}
		let api_key = keys.getKey();
		const result = await sauceNAOSearch( { api_key, url } );
		
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
		
		const { header, data } = result.results[0];
		if ( Number( header.similarity ) < 80 ) {
			rowMessageArr.push( ErrorMsg.NOT_FOUNT );
			continue;
		}
		
		data.title && rowMessageArr.push( `标题：${ data.title }` );
		data.pixiv_id && rowMessageArr.push( `pixiv_id：${ data.pixiv_id }` );
		data.yandere_id && rowMessageArr.push( `yandere_id：${ data.yandere_id }` );
		data.gelbooru_id && rowMessageArr.push( `gelbooru_id：${ data.gelbooru_id }` );
		data.danbooru_id && rowMessageArr.push( `danbooru_id：${ data.danbooru_id }` );
		data.creator && rowMessageArr.push( `作者：${ data.creator }` );
		data.member_name && rowMessageArr.push( `作者(pixiv)：${ data.member_name }` );
		data.member_id && rowMessageArr.push( `作者id(pixiv)：${ data.member_id }` );
		data.source && rowMessageArr.push( `来源: ${ decodeURIComponent( data.source ) }` )
	}
	
	await sendMessage( formatRowMessage( rowMessageArr ) );
}
