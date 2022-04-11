import { ISauceNAOResponseSuccess, ISauceNAOResponseError } from "./SauceNAO";

export function checkSauceNAOSearchStatus( response: ISauceNAOResponseSuccess | ISauceNAOResponseError ): response is ISauceNAOResponseSuccess {
	return response.header.status === 0;
}