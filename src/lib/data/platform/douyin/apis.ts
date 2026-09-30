"use server"

import { fetchApi } from "@/src/lib/data/api"

export type DouyinAccount = {
	name: string
	outFile?: string | null
	cookiesFile: string
	enabled?: boolean
	status?: string | null
	note?: string | null
	sidFingerprint?: string | null
	lastOkAt?: string | null
	filePresent?: boolean
}

export type DouyinAccountsResponse = {
	version: number
	source: string
	accounts: DouyinAccount[]
	gaps: string[]
}

export async function fetchDouyinAccounts(): Promise<DouyinAccountsResponse> {
	const response = await fetchApi("/douyin/accounts", { cache: "no-store" })
	if (!response.ok) {
		const text = await response.text()
		throw new Error(text || `Failed to list Douyin accounts (${response.status})`)
	}
	return response.json()
}

export type DouyinLoginOptions = {
	/** When true, bridge creates the account config if missing, then starts QR login. */
	create?: boolean
	/** Optional ASCII slug for douyin_cookies_<slug>.txt (defaults from name). */
	slug?: string
	note?: string
}

export async function requestDouyinAccountLogin(
	name: string,
	options: DouyinLoginOptions = {}
): Promise<{
	ok: boolean
	account?: string
	message?: string
	error?: string
	hint?: string
	created?: boolean
	cookiesFile?: string
	outFile?: string
}> {
	const response = await fetchApi(`/douyin/accounts/${encodeURIComponent(name)}/login`, {
		method: "POST",
		body: JSON.stringify({
			account: name,
			create: options.create === true,
			slug: options.slug || undefined,
			note: options.note || undefined,
		}),
	})
	const data = await response.json().catch(() => ({}))
	if (!response.ok) {
		return {
			ok: false,
			account: name,
			error: data.error || data.message || `Login request failed (${response.status})`,
			hint: data.hint,
		}
	}
	return {
		ok: true,
		account: name,
		message: data.message || "Login requested",
		created: data.created,
		cookiesFile: data.cookiesFile,
		outFile: data.outFile,
		...data,
	}
}

export async function fetchDouyinLoginStatus(name: string): Promise<{
	ok: boolean
	job?: {
		account?: string
		status?: string
		ok?: boolean | null
		reason?: string
		started_at?: string
		finished_at?: string
	} | null
	message?: string
	error?: string
}> {
	const response = await fetchApi(`/douyin/accounts/${encodeURIComponent(name)}/login`, {
		cache: "no-store",
	})
	const data = await response.json().catch(() => ({}))
	if (!response.ok) {
		return {
			ok: false,
			error: data.error || data.message || `Login status failed (${response.status})`,
		}
	}
	return { ok: true, ...data }
}
