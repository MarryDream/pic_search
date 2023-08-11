import type { ISauceNAOResponseSuccess, ISauceNAOResponseError } from "#/pic_search/types/SauceNAO";
import { register } from "@/utils/request";

const apis = {
	sauce_nao_search: "https://saucenao.com/search.php"
}

const { request: $https } = register( {
	timeout: 60000,
	responseType: "json",
}, apis );

export async function sauceNAOSearch( params?: Record<string, string | number> ): Promise<ISauceNAOResponseSuccess | ISauceNAOResponseError> {
	const { data } = await $https.sauce_nao_search.get( {
		db: 999,
		output_type: 2,
		numres: 3,
		...params
	} );
	return data;
}