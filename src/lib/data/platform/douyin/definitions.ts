import { z } from "zod"
import { baseDownloadConfig } from "@/src/lib/data/streams/definitions"
import { globalPlatformConfig } from "@/src/lib/data/platform/definitions"
import { douyinAcNonceRegex, douyinAcSignatureRegex } from "@/src/lib/data/platform/douyin/constants"

export enum DouyinQuality {
	origin = "origin",
	uhd = "uhd",
	hd = "hd",
	sd = "sd",
	ld = "ld",
	md = "md",
	ao = "ao",
}

export const douyinGlobalConfig = globalPlatformConfig.extend({
	cookies: z.string().nullish(),
	// Cookie 由 dycookie 維護並寫成檔案，前端只設定「要讀哪個檔」。
	// 直接貼 Cookie 字串的欄位已移除：那份字串會被 stream-rec 以 INFO 等級
	// 連同整個 AppConfig 印進 run.log，等於把 sessionid 原文長期留存。
	cookiesFile: z.string().nullish(),
	quality: z.nativeEnum(DouyinQuality).nullish(),
	sourceFormat: z.enum(["flv", "hls"]).nullish(),
})

export const douyinDownloadConfig = baseDownloadConfig.merge(douyinGlobalConfig)

export type DouyinGlobalConfig = z.infer<typeof douyinGlobalConfig>
export type DouyinDownloadConfig = z.infer<typeof douyinDownloadConfig>
