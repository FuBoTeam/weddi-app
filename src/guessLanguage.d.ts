declare module 'guesslanguage' {
  export namespace guessLanguage {
    export function detect(input: string, callback: (language: string) => any): void;
    export function name(input: string, callback: (languageName: string) => any): void;
    export function code(input: string, callback: (languageIANA: string) => any): void;
    export function info(input: string, callback: (languageInfo: [string, string, string]) => any): void;
  }
}
