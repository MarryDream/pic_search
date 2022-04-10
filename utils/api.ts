import fetch from "node-fetch"
import { formatGetURL, IParams } from "./utils"

interface ISauceNAOResult {
	header: {
		similarity: string
		thumbnail: string
	},
	data: {
		title?: string
		pixiv_id?: number
		danbooru_id?: number
		yandere_id?: number
		gelbooru_id?: number
		member_name?: string
		member_id?: number
		creator?: string
		source?: string
	}
}

export interface ISauceNAOResponseSuccess {
	header: {
		status: number
		long_remaining: number
	}
	results: ISauceNAOResult[]
}

export interface ISauceNAOResponseError {
	header: {
		status: number
		message: string
		long_remaining: number
	}
}

export function checkSauceNAOSearchStatus( response: ISauceNAOResponseSuccess | ISauceNAOResponseError ): response is ISauceNAOResponseSuccess {
	return response.header.status === 0
}

const _api = {
	sauce_nao_search: "https://saucenao.com/search.php"
}

export function sauceNAOSearch( params: IParams | undefined ): Promise<ISauceNAOResponseSuccess | ISauceNAOResponseError> {
	const url = formatGetURL( _api.sauce_nao_search, {
		db: 999,
		output_type: 2,
		numres: 3,
		...params
	} );
	return new Promise( ( resolve ) => {
		fetch( url ).then( async ( result: Response ) => {
			resolve( await result.json() );
		} )
	} )
}