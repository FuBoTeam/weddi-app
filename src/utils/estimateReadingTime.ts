import guessLanguage from 'guesslanguage';

// data from https://irisreading.com/average-reading-speed-in-various-languages/
const CharactersPerMin = {
  default: 987,
  Arabic: 612,
  Chinese: 255,
  Dutch: 978,
  English: 987,
  Finnish: 1078,
  French: 998,
  German: 920,
  Hebrew: 833,
  Italian: 950,
  Japanese: 357,
  Polish: 916,
  Portuguese: 913,
  Russian: 986,
  Slovenian: 885,
  Spanish: 1025,
  Swedish: 917,
  Turkish: 1054,
};

const guessLanguageNameAsync = (paragraph: string): Promise<string> =>
  new Promise(resolve => guessLanguage.guessLanguage.name(paragraph, resolve));

export async function estimateReadingTime(paragraph: string): Promise<number> {
  const languageName: string = await guessLanguageNameAsync(paragraph);
  const readingSpeedCharPerMin = languageName in CharactersPerMin ?
    CharactersPerMin[languageName as keyof typeof CharactersPerMin] :
    CharactersPerMin.default;

  const second = Math.floor(paragraph.length / readingSpeedCharPerMin * 60);
  return second;
}
