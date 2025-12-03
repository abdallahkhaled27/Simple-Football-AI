/** @format */

import './globals.css';
import type { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
	title: 'Football Brain',
	description: 'AI-powered football analysis and Q&A',
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang='en'>
			<body className='min-h-screen bg-slate-950 text-slate-100'>
				<header className='border-b border-slate-800'>
					<div className='max-w-5xl mx-auto flex items-center justify-between py-4 px-4'>
						<h1 className='text-2xl font-bold tracking-tight'>
							⚽ Football Brain
						</h1>
						<nav className='space-x-4 text-sm'>
							<a
								href='/'
								className='hover:underline'>
								Home
							</a>
							<a
								href='/ai'
								className='hover:underline'>
								Ask the AI
							</a>
						</nav>
					</div>
				</header>
				<main className='max-w-5xl mx-auto px-4 py-8'>{children}</main>
			</body>
		</html>
	);
}
