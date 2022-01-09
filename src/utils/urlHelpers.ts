export const getUpperUrl = (matchUrl: string): string => {
  const paths = matchUrl.split('/');
  paths.pop();
  return paths.join('/');
};
