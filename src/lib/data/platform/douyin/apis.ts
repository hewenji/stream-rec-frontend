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

export async function requestDouyinAccountLogin(name: string): Promise<{
	ok: boolean
	account?: string
	message?: string
	error?: string
	hint?: string
}> {
	const response = await fetchApi(`/douyin/accounts/${encodeURIComponent(name)}/login`, {
		method: "POST",
		body: JSON.stringify({ account: name }),
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
	return { ok: true, account: name, message: data.message || "Login requested", ...data }
}
