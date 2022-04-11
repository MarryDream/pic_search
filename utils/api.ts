import fetch from "node-fetch";
import { formatGetURL, IParams } from "./utils";
import { ISauceNAOResponseSuccess, ISauceNAOResponseError } from "#pic_search/types/SauceNAO";

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