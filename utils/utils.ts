export interface IParams {
	[fieldName: string]: string | number
}

export function formatGetURL( url: string, params: IParams | undefined ): string {
	if ( !params ) return url;
	let paramsStr = "";
	for ( const key in params ) {
		paramsStr += `&${ key }=${ encodeURIComponent( params[key] ) }`;
	}
	return `${ url }?${ paramsStr.substring( 1 ) }`
}