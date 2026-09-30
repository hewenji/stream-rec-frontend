"use client"

import React, { useCallback, useEffect, useMemo, useState, useTransition } from "react"
import { Control, useFormContext } from "react-hook-form"
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/src/components/new-york/ui/form"
import { Button } from "@/src/components/new-york/ui/button"
import { Input } from "@/src/components/new-york/ui/input"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/src/components/new-york/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/src/components/new-york/ui/collapsible"
import { CookiesFormfield } from "@/src/app/[locale]/(feat)/settings/components/form/cookies-formfield"
import {
	DouyinAccount,
	fetchDouyinAccounts,
	requestDouyinAccountLogin,
} from "@/src/lib/data/platform/douyin/apis"
import { CaretSortIcon } from "@radix-ui/react-icons"

export type DouyinAccountPickerStrings = {
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
	cookiesFile: string
	cookiesFileDescription: string
	cookieTitle: string
	cookieDescription: string | React.ReactNode
	loading: string
	empty: string
}

type Props = {
	control: Control<any>
	controlPrefix?: string
	strings: DouyinAccountPickerStrings
	/** When true, show raw cookies + manual path under Advanced. */
	showAdvancedFallback?: boolean
}

const NONE_VALUE = "__none__"

function matchAccount(accounts: DouyinAccount[], cookiesFile: string | null | undefined): DouyinAccount | undefined {
	if (!cookiesFile) return undefined
	const exact = accounts.find(a => a.cookiesFile === cookiesFile)
	if (exact) return exact
	// Fallback: match by filename when path prefixes differ (host vs container).
	const base = cookiesFile.replace(/\\/g, "/").split("/").pop()
	if (!base) return undefined
	return accounts.find(a => {
		const file = (a.cookiesFile || a.outFile || "").replace(/\\/g, "/").split("/").pop()
		return file === base
	})
}

export function DouyinAccountPicker({
	control,
	controlPrefix,
	strings,
	showAdvancedFallback = true,
}: Props) {
	const form = useFormContext()
	const cookiesFileName = controlPrefix ? `${controlPrefix}.cookiesFile` : "cookiesFile"
	const cookiesName = controlPrefix ? `${controlPrefix}.cookies` : "cookies"

	const [accounts, setAccounts] = useState<DouyinAccount[]>([])
	const [gaps, setGaps] = useState<string[]>([])
	const [loadError, setLoadError] = useState<string | null>(null)
	const [statusMsg, setStatusMsg] = useState<string | null>(null)
	const [pending, startTransition] = useTransition()
	const [advancedOpen, setAdvancedOpen] = useState(false)

	const load = useCallback(() => {
		startTransition(async () => {
			try {
				setLoadError(null)
				const res = await fetchDouyinAccounts()
				setAccounts(res.accounts || [])
				setGaps(res.gaps || [])
			} catch (e: any) {
				setLoadError(e?.message || String(e))
				setAccounts([])
			}
		})
	}, [])

	useEffect(() => {
		load()
	}, [load])

	const enabledAccounts = useMemo(
		() => accounts.filter(a => a.enabled !== false && !!a.cookiesFile),
		[accounts]
	)

	const currentCookiesFile: string = form.watch(cookiesFileName) || ""
	const selectedAccount = useMemo(
		() => matchAccount(accounts, currentCookiesFile),
		[accounts, currentCookiesFile]
	)

	const onLogin = () => {
		const name = selectedAccount?.name || enabledAccounts[0]?.name
		if (!name) {
			setStatusMsg(strings.empty)
			return
		}
		startTransition(async () => {
			const res = await requestDouyinAccountLogin(name)
			if (res.ok) {
				setStatusMsg(res.message || strings.loginRequested)
				load()
			} else {
				setStatusMsg(`${strings.loginFailed}: ${res.error || ""}${res.hint ? ` — ${res.hint}` : ""}`)
			}
		})
	}

	return (
		<div className="space-y-4">
			{/* Single FormField owns cookiesFile so Select + advanced Input stay in sync. */}
			<FormField
				control={control}
				name={cookiesFileName}
				render={({ field }) => {
					// Use cookiesFile path as Select value (ASCII) so Radix controlled value always
					// matches a SelectItem. Deriving value from account *name* snapped back when
					// reverse lookup lagged or name/path got out of sync after setValue.
					const fieldPath = (field.value as string | null | undefined) || ""
					const matched = matchAccount(enabledAccounts, fieldPath) || matchAccount(accounts, fieldPath)
					const selectValue = matched?.cookiesFile || (fieldPath ? fieldPath : NONE_VALUE)
					const hasOrphanPath = !!fieldPath && !matched && !enabledAccounts.some(a => a.cookiesFile === fieldPath)

					return (
						<>
							<FormItem>
								<FormLabel>{strings.account}</FormLabel>
								<div className="flex flex-col gap-2 sm:flex-row sm:items-center">
									<div className="flex-1">
										<Select
											disabled={pending}
											value={selectValue}
											onValueChange={next => {
												if (!next || next === NONE_VALUE) {
													field.onChange(null)
												} else {
													// Prefer canonical cookiesFile from accounts list.
													const acc = enabledAccounts.find(a => a.cookiesFile === next)
													field.onChange(acc?.cookiesFile || next)
												}
												// Prefer file over raw string so hot-reload stays active.
												form.setValue(cookiesName, null, { shouldDirty: true })
												setStatusMsg(null)
											}}
										>
											<SelectTrigger>
												<SelectValue
													placeholder={pending ? strings.loading : strings.accountPlaceholder}
												/>
											</SelectTrigger>
											<SelectContent>
												<SelectItem value={NONE_VALUE}>{strings.accountNone}</SelectItem>
												{enabledAccounts.map(a => (
													<SelectItem key={a.cookiesFile} value={a.cookiesFile}>
														{a.name}
														{a.status ? ` (${a.status})` : ""}
														{a.filePresent === false ? ` — ${strings.accountMissingFile}` : ""}
													</SelectItem>
												))}
												{hasOrphanPath && (
													<SelectItem value={fieldPath}>{fieldPath}</SelectItem>
												)}
											</SelectContent>
										</Select>
									</div>
									<Button type="button" variant="secondary" disabled={pending} onClick={onLogin}>
										{strings.login}
									</Button>
									<Button type="button" variant="outline" disabled={pending} onClick={load}>
										{strings.refreshAccounts}
									</Button>
								</div>
								<FormDescription>{strings.accountDescription}</FormDescription>
								{loadError && <p className="text-sm text-destructive">{loadError}</p>}
								{gaps.length > 0 && (
									<p className="text-sm text-muted-foreground">
										{strings.accountGaps}: {gaps.join("; ")}
									</p>
								)}
								{statusMsg && <p className="text-sm text-muted-foreground">{statusMsg}</p>}
								<FormMessage />
							</FormItem>

							{/* Advanced manual path — same RHF field as the Select. */}
							<div className={advancedOpen && showAdvancedFallback ? "space-y-2" : "hidden"}>
								<FormItem>
									<FormLabel>{strings.cookiesFile}</FormLabel>
									<FormControl>
										<Input
											placeholder="/opt/secrets/douyin_cookies_chaichai.txt"
											value={fieldPath}
											onChange={e => {
												const v = e.target.value.trim()
												field.onChange(v === "" ? null : v)
											}}
										/>
									</FormControl>
									<FormDescription>{strings.cookiesFileDescription}</FormDescription>
									<FormMessage />
								</FormItem>
							</div>
						</>
					)
				}}
			/>

			{showAdvancedFallback && (
				<Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
					<CollapsibleTrigger asChild>
						<Button type="button" variant="ghost" className="px-0">
							{strings.advanced}
							<CaretSortIcon className="ml-1 h-4 w-4" />
						</Button>
					</CollapsibleTrigger>
					<CollapsibleContent className="space-y-4 pt-2">
						{/* cookiesFile Input is toggled visible above; raw cookies live here */}
						<CookiesFormfield
							title={strings.cookieTitle}
							description={strings.cookieDescription}
							name={cookiesName}
							control={control}
						/>
					</CollapsibleContent>
				</Collapsible>
			)}
		</div>
	)
}
