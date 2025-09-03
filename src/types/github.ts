export interface Repository {
	id: number;
	name: string;
	full_name: string;
	description: string | null;
	html_url: string;
	stargazers_count: number;
	forks_count: number;
	language: string | null;
	updated_at: string;
	created_at: string;
}

export interface GitHubUser {
	login: string;
	id: number;
	avatar_url: string;
	html_url: string;
	name: string | null;
	company: string | null;
	blog: string | null;
	location: string | null;
	email: string | null;
	bio: string | null;
	public_repos: number;
	public_gists: number;
	followers: number;
	following: number;
	created_at: string;
	updated_at: string;
}

export interface LanguageStats {
	[language: string]: number;
}

export interface APIResponse<T> {
	data: T;
	status: number;
}
