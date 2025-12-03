/** @format */

const teams = [
	{ id: '1', name: 'FC Barcelona', league: 'La Liga', country: 'Spain' },
	{
		id: '2',
		name: 'Liverpool FC',
		league: 'Premier League',
		country: 'England',
	},
	{
		id: '3',
		name: 'Al Ahly SC',
		league: 'Egyptian Premier League',
		country: 'Egypt',
	},
];

export default function HomePage() {
	return (
		<section className='space-y-8'>
			<div className='grid md:grid-cols-2 gap-8 items-center'>
				<div className='space-y-4'>
					<h2 className='text-3xl md:text-4xl font-semibold leading-tight'>
						Welcome to <span className='text-emerald-400'>Football Brain</span>
					</h2>
					<p className='text-slate-300 text-sm'>
						Explore your favorite clubs and ask our AI anything about tactics,
						players, and matches. Perfect for fans, analysts and Football
						Manager nerds.
					</p>
					<a
						href='/ai'
						className='inline-block mt-2 rounded-md px-4 py-2 border border-emerald-400 text-emerald-300 text-sm hover:bg-emerald-500/10'>
						Try the Football AI →
					</a>
				</div>
				<div className='bg-slate-900/70 border border-slate-800 rounded-xl p-4'>
					<h3 className='font-semibold mb-3 text-sm'>Featured Clubs</h3>
					<ul className='space-y-2 text-sm'>
						{teams.map((team) => (
							<li
								key={team.id}
								className='flex items-center justify-between bg-slate-900/60 px-3 py-2 rounded-md'>
								<div>
									<div className='font-medium'>{team.name}</div>
									<div className='text-xs text-slate-400'>
										{team.league} · {team.country}
									</div>
								</div>
								<span className='text-xs px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'>
									Club
								</span>
							</li>
						))}
					</ul>
				</div>
			</div>
		</section>
	);
}
