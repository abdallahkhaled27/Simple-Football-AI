import { requiresLiveFootballContext } from './live-football-context.service';

describe('requiresLiveFootballContext', () => {
  it.each([
    'How is Messi doing now?',
    "how's Messi?",
    'Liverpool last match',
    'latest Arsenal injuries',
    'Mbappe stats this season',
    'who is top of the Premier League?',
    'latest transfer news',
  ])('detects a current question: %s', (question) => {
    expect(requiresLiveFootballContext(question)).toBe(true);
  });

  it.each([
    'Explain a 4-3-3 formation',
    'How does a mid-block work?',
    'Compare the tactical profiles of Messi and Ronaldo',
  ])('does not search for timeless analysis: %s', (question) => {
    expect(requiresLiveFootballContext(question)).toBe(false);
  });
});
