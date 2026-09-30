import { useTranslations } from "next-intl"
import React, { useMemo } from "react"
import { PlatformTabContentStrings } from "@/src/app/[locale]/(feat)/settings/platform/tabs/common-platform-tab"
import { useBaseGlobalPlatformTranslations } from "@/src/app/hooks/translations/base-global-platform-translation"
import RichText from "@/src/components/i18n/RichText"

export const douyinQualityKeys = ["origin", "uhd", "hd", "sd", "ld", "md", "ao"] as const

export type DouyinQuality = {
	quality: string
	description: string
}

export type DouyinTabString = {
	quality: string
	qualityDescription: string
	qualityDefault: string
	sourceFormat: string
	sourceFormatPlaceholder: string
	sourceFormatDescription: string | React.ReactNode
	cookiesFile: string
	cookiesFileDescription: string
	account: string
	accountDescription: string
	accountPlaceholder: string
	accountNone: string
	accountMissingFile: string
	accountGaps: string
	login: string
	loginRequested: string
	loginFailed: string
	refreshAccounts: string
	advanced: string
	loadingAccounts: string
	emptyAccounts: string
	newAccountTitle: string
	newAccountDescription: string
	newAccountName: string
	newAccountNamePlaceholder: string
	newAccountSlug: string
	newAccountSlugPlaceholder: string
	newAccountConfirm: string
	newAccountCancel: string
	newAccountNameRequired: string
	newAccountInvalidSlug: string
	loginPolling: string
	loginSucceeded: string
	loginStillRunning: string
} & PlatformTabContentStrings

export const useDouyinTranslations = () => {
	const t = useTranslations("Douyin")
	const baseTranslations = useBaseGlobalPlatformTranslations()

	return useMemo<DouyinTabString>(
		() => ({
			...baseTranslations,
			platform: t("platform"),
			sourceFormat: t("sourceFormat"),
			sourceFormatPlaceholder: t("sourceFormatPlaceholder"),
			sourceFormatDescription: <RichText>{tags => t.rich("sourceFormatDescription", tags)}</RichText>,
			quality: t("quality"),
			qualityDescription: t("qualityDescription"),
			qualityDefault: t("qualityDefault"),
			cookieDescription: <RichText>{tags => t.rich("cookieDescription", tags)}</RichText>,
			cookiesFile: t("cookiesFile"),
			cookiesFileDescription: t("cookiesFileDescription"),
			account: t("account"),
			accountDescription: t("accountDescription"),
			accountPlaceholder: t("accountPlaceholder"),
			accountNone: t("accountNone"),
			accountMissingFile: t("accountMissingFile"),
			accountGaps: t("accountGaps"),
			login: t("login"),
			loginRequested: t("loginRequested"),
			loginFailed: t("loginFailed"),
			refreshAccounts: t("refreshAccounts"),
			advanced: t("advanced"),
			loadingAccounts: t("loadingAccounts"),
			emptyAccounts: t("emptyAccounts"),
			newAccountTitle: t("newAccountTitle"),
			newAccountDescription: t("newAccountDescription"),
			newAccountName: t("newAccountName"),
			newAccountNamePlaceholder: t("newAccountNamePlaceholder"),
			newAccountSlug: t("newAccountSlug"),
			newAccountSlugPlaceholder: t("newAccountSlugPlaceholder"),
			newAccountConfirm: t("newAccountConfirm"),
			newAccountCancel: t("newAccountCancel"),
			newAccountNameRequired: t("newAccountNameRequired"),
			newAccountInvalidSlug: t("newAccountInvalidSlug"),
			loginPolling: t("loginPolling"),
			loginSucceeded: t("loginSucceeded"),
			loginStillRunning: t("loginStillRunning"),
		}),
		[t, baseTranslations]
	)
}

export const useDouyinQualityTranslations = () => {
	const t = useTranslations("DouyinQualities")
	return useMemo(
		() =>
			douyinQualityKeys.map(key => ({
				quality: t(`${key}.id`),
				description: t(`${key}.name`),
			})),
		[t]
	)
}
