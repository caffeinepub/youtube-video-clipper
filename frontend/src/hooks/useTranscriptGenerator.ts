export interface TranscriptSegment {
  index: number;
  startTime: number;
  endTime: number;
  text: string;
  isSmartClip?: boolean;
  smartClipKeyword?: string;
}

const GAMING_KEYWORDS = ['Victory', 'Eliminated', 'Level Up', 'Kill', 'Win', 'Headshot', 'Ace', 'Clutch', 'Rampage', 'Unstoppable'];

const SAMPLE_PHRASES = [
  'Moving through the zone, staying low...',
  'Enemy spotted at twelve o\'clock!',
  'Taking cover behind the wall...',
  'Reloading, watch my back!',
  'Victory! We won the match!',
  'Eliminated the last player!',
  'Level Up! New rank achieved!',
  'Headshot! Clean kill!',
  'Clutch play, 1v4 situation...',
  'Ace! Entire team wiped!',
  'Rampage! Five kills in a row!',
  'Unstoppable! On a killing spree!',
  'Pushing the objective now...',
  'Need healing, low health...',
  'Flanking from the right side...',
  'Grenade out, take cover!',
  'Sniper spotted on the ridge!',
  'Reviving teammate, cover me!',
  'Final circle closing in fast...',
  'Last squad standing, let\'s go!',
];

export function generateTranscript(duration: number): TranscriptSegment[] {
  if (!duration || duration <= 0) return [];

  const segmentLength = 15;
  const segments: TranscriptSegment[] = [];
  let phraseIndex = 0;

  for (let start = 0; start < duration; start += segmentLength) {
    const end = Math.min(start + segmentLength, duration);
    const text = SAMPLE_PHRASES[phraseIndex % SAMPLE_PHRASES.length];
    phraseIndex++;

    const keyword = GAMING_KEYWORDS.find((kw) => text.toLowerCase().includes(kw.toLowerCase()));

    segments.push({
      index: segments.length,
      startTime: Math.floor(start),
      endTime: Math.floor(end),
      text,
      isSmartClip: !!keyword,
      smartClipKeyword: keyword,
    });
  }

  return segments;
}

export function useTranscriptGenerator(duration: number) {
  const segments = generateTranscript(duration);
  return { segments, isLoading: false };
}
