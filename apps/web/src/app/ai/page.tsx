/** @format */

'use client';

import { useState } from 'react';

const API_URL = (
	process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
).replace(/\/$/, '');

type FootballChatResponse = {
	answer: string;
};

type ApiErrorResponse = {
	message?: string | string[];
	error?: string;
};

export default function AiPage() {
	const [question, setQuestion] = useState('');
	const [answer, setAnswer] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function handleAsk(e: React.FormEvent) {
		e.preventDefault();
		setLoading(true);
		setError(null);
		setAnswer(null);

		try {
			const res = await fetch(`${API_URL}/ai/football-chat`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ question }),
			});

			const data = (await res.json().catch(() => null)) as
				| FootballChatResponse
				| ApiErrorResponse
				| null;

			if (!res.ok) {
				const apiError = data as ApiErrorResponse | null;
				const message = Array.isArray(apiError?.message)
					? apiError.message.join(', ')
					: apiError?.message || apiError?.error || res.statusText;
				throw new Error(`Request failed (${res.status}): ${message}`);
			}

			if (!data || typeof (data as FootballChatResponse).answer !== 'string') {
				throw new Error('The API returned an invalid response (missing answer).');
			}

			setAnswer((data as FootballChatResponse).answer);
		} catch (err: unknown) {
			setError(
				err instanceof Error
					? err.message
					: 'The request failed for an unknown reason.',
			);
		} finally {
			setLoading(false);
		}
	}

	return (
		<section className='space-y-6'>
			<div className='space-y-2'>
				<h2 className='text-2xl font-semibold'>Ask the Football AI</h2>
				<p className='text-sm text-slate-300'>
					Ask about tactics, player comparisons, strengths and weaknesses, or
					match analysis. The AI will answer in simple football language.
				</p>
			</div>

			<form
				onSubmit={handleAsk}
				className='space-y-3'>
				<textarea
					value={question}
					onChange={(e) => setQuestion(e.target.value)}
					placeholder='Example: How should Liverpool press against a possession-heavy team?'
					className='w-full min-h-[100px] rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500'
				/>

				<button
					type='submit'
					disabled={loading || !question.trim()}
					className='rounded-md px-4 py-2 text-sm font-medium bg-emerald-500 text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-400'>
					{loading ? 'Thinking...' : 'Ask'}
				</button>
			</form>

			{error && (
				<div className='text-sm text-red-400 bg-red-950/40 border border-red-800 rounded-md px-3 py-2'>
					{error}
				</div>
			)}

			{answer && (
				<div className='mt-4 space-y-2'>
					<h3 className='text-sm font-semibold text-emerald-300'>
						AI&apos;s Answer
					</h3>
					<div className='text-sm bg-slate-900 border border-slate-700 rounded-md px-3 py-3 whitespace-pre-wrap'>
						{answer}
					</div>
				</div>
			)}
		</section>
	);
}
