import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/src/components/new-york/ui/form"
import { Input } from "@/src/components/new-york/ui/input"
import { SelectItem } from "@/src/components/new-york/ui/select"
import React from "react"
import { Badge } from "@/src/components/new-york/ui/badge"
import Select from "@/src/app/components/empty-select"
import {
	PlatformTabContent,
	PlatformTabContentProps,
} from "@/src/app/[locale]/(feat)/settings/platform/tabs/common-platform-tab"
import { DouyinQuality, DouyinTabString } from "@/src/app/hooks/translations/douyin-translations"
import { DouyinAccountPicker } from "@/src/app/[locale]/(feat)/streamers/components/platforms/douyin-account-picker"

export type DouyinTabContentProps = {
	qualityOptions: DouyinQuality[]
	allowNone?: boolean
	/** Streamer settings: show account dropdown + login + advanced raw cookies. */
	showAccountPicker?: boolean
	/** Global / legacy: free-text cookiesFile path (no account list). */
	showCookiesFile?: boolean
} & PlatformTabContentProps<DouyinTabString>

export const DouyinTabContent = ({
	controlPrefix,
	control,
	showFetchDelay,
	showCookies,
	showPartedDownloadRetry,
	showDownloadCheckInterval,
	showAccountPicker = false,
	showCookiesFile = false,
	qualityOptions,
	allowNone = false,
	strings,
}: DouyinTabContentProps) => {
	return (
		<PlatformTabContent
			control={control}
			controlPrefix={controlPrefix}
			showCookies={showCookies}
			showPartedDownloadRetry={showPartedDownloadRetry}
			strings={strings}
			showFetchDelay={showFetchDelay}
			showDownloadCheckInterval={showDownloadCheckInterval}
		>
			{showAccountPicker && (
				<DouyinAccountPicker
					control={control}
					controlPrefix={controlPrefix}
					showAdvancedFallback={true}
					strings={{
						account: strings.account,
						accountDescription: strings.accountDescription,
						accountPlaceholder: strings.accountPlaceholder,
						accountNone: strings.accountNone,
						accountMissingFile: strings.accountMissingFile,
						accountGaps: strings.accountGaps,
						login: strings.login,
						loginRequested: strings.loginRequested,
						loginFailed: strings.loginFailed,
						refreshAccounts: strings.refreshAccounts,
						advanced: strings.advanced,
						cookiesFile: strings.cookiesFile,
						cookiesFileDescription: strings.cookiesFileDescription,
						cookieTitle: strings.cookieTitle,
						cookieDescription: strings.cookieDescription,
						loading: strings.loadingAccounts,
						empty: strings.emptyAccounts,
						newAccountTitle: strings.newAccountTitle,
						newAccountDescription: strings.newAccountDescription,
						newAccountName: strings.newAccountName,
						newAccountNamePlaceholder: strings.newAccountNamePlaceholder,
						newAccountSlug: strings.newAccountSlug,
						newAccountSlugPlaceholder: strings.newAccountSlugPlaceholder,
						newAccountConfirm: strings.newAccountConfirm,
						newAccountCancel: strings.newAccountCancel,
						newAccountNameRequired: strings.newAccountNameRequired,
						newAccountInvalidSlug: strings.newAccountInvalidSlug,
						loginPolling: strings.loginPolling,
						loginSucceeded: strings.loginSucceeded,
						loginStillRunning: strings.loginStillRunning,
					}}
				/>
			)}

			{showCookiesFile && !showAccountPicker && (
				<FormField
					control={control}
					name={controlPrefix ? `${controlPrefix}.cookiesFile` : "cookiesFile"}
					render={({ field }) => (
						<FormItem>
							<FormLabel>{strings.cookiesFile}</FormLabel>
							<FormControl>
								<Input
									placeholder="/opt/secrets/douyin_cookies_main.txt"
									value={field.value ?? ""}
									onChange={field.onChange}
								/>
							</FormControl>
							<FormDescription>{strings.cookiesFileDescription}</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
			)}

			<FormField
				control={control}
				name={controlPrefix ? `${controlPrefix}.quality` : "quality"}
				render={({ field }) => (
					<FormItem>
						<FormLabel>{strings.quality}</FormLabel>
						<Select
							onValueChange={field.onChange}
							defaultValue={field.value}
							placeholder={strings.qualityDefault}
							allowNone={allowNone}
							options={qualityOptions.map(quality => (
								<SelectItem key={quality.quality} value={quality.quality}>
									{quality.description}
								</SelectItem>
							))}
						/>
						<FormDescription>{strings.qualityDescription}</FormDescription>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={control}
				name={controlPrefix ? `${controlPrefix}.sourceFormat` : "sourceFormat"}
				render={({ field }) => (
					<FormItem>
						<FormLabel>
							<div className={"flex flex-row items-center gap-x-3"}>
								{strings.sourceFormat}
								<Badge>Experimental</Badge>
							</div>
						</FormLabel>
						<Select
							onValueChange={field.onChange}
							defaultValue={field.value}
							placeholder={strings.sourceFormatPlaceholder}
							options={["flv", "hls"].map(format => (
								<SelectItem key={format} value={format}>
									{format}
								</SelectItem>
							))}
							allowNone={allowNone}
						/>
						<FormDescription>{strings.sourceFormatDescription}</FormDescription>
						<FormMessage />
					</FormItem>
				)}
			/>
		</PlatformTabContent>
	)
}
