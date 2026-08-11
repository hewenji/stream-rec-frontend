import React from "react"
import { DouyinTabContent } from "@/src/app/[locale]/(feat)/settings/platform/tabs/douyin-tab"
import { useFormContext } from "react-hook-form"
import { DouyinQuality, DouyinTabString } from "@/src/app/hooks/translations/douyin-translations"

type DouyinPlatformFormProps = {
	allowNone?: boolean
	strings: DouyinTabString
	douyinQualityOptions: DouyinQuality[]
}

export const DouyinPlatform = ({ allowNone, strings, douyinQualityOptions }: DouyinPlatformFormProps) => {
	const form = useFormContext()

	return (
		<>
			{/*
			 * showCookies：抖音的登入態必須逐位主播設定。
			 * 一個抖音帳號無法多處同時登入，若靠全域 cookies 讓所有主播共用同一組
			 * sessionid，併發錄製時會互相踢掉，結果大家都收不到禮物。
			 * 後端已移除全域後備，沒設定就是匿名連線（收得到聊天，收不到禮物）。
			 */}
			<DouyinTabContent
				controlPrefix={"downloadConfig"}
				allowNone={allowNone}
				control={form.control}
				strings={strings}
				showCookies={true}
				qualityOptions={douyinQualityOptions}
			/>
		</>
	)
}
