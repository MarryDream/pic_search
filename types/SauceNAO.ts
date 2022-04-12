export interface ISauceNAOResult {
	header: {
		similarity: string
		thumbnail: string
	},
	data: {
		title?: string
		eng_name?: string
		jp_name?: string
		pixiv_id?: number
		tweet_id?: number
		danbooru_id?: number
		yandere_id?: number
		gelbooru_id?: number
		member_name?: string
		member_id?: number
		twitter_user_id?: number
		twitter_user_handle?: string
		creator?: string
		created_at?: string
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