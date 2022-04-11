export interface ISauceNAOResult {
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