"use client"
import { DouyinTabContent } from "@/src/app/[locale]/(feat)/settings/platform/tabs/douyin-tab"
import React from "react"
import { useFormContext } from "react-hook-form"
import { DouyinQuality, DouyinTabString } from "@/src/app/hooks/translations/douyin-translations"

type DouyinPlatformProps = {
	allowNone?: boolean
	strings: DouyinTabString
	douyinQualityOptions: DouyinQuality[]
}

export const DouyinPlatform = ({ allowNone, strings, douyinQualityOptions }: DouyinPlatformProps) => {
	const form = useFormContext()

	return (
		<>
			{/*
			 * Per-streamer Douyin login:
			 * - Account dropdown binds cookiesFile to /opt/secrets/...
			 * - Login button asks the host dycookie bridge to open QR / Telegram flow
			 * - Advanced keeps raw cookies + manual path as fallback
			 * Raw cookies disable hot-reload; prefer cookiesFile.
			 */}
			<DouyinTabContent
				controlPrefix={"downloadConfig"}
				allowNone={allowNone}
				control={form.control}
				strings={strings}
				showCookies={false}
				showAccountPicker={true}
				qualityOptions={douyinQualityOptions}
			/>
		</>
	)
}
