import micromatch from 'micromatch';

import ow from 'lib/ow';


/**
 * @private
 *
 * Returns true if the provided string contains a single dot-delimited segment.
 */
function isSingleSegment(input: string) {
  return !input.includes('.');
}


/**
 * Provided an array of strings and a search query, returns the element from the
 * search set that most closely matches the query. If zero or multiple results
 * are found, throws an error.
 */
export default function match(haystack: Array<string>, needle: string | undefined): string | undefined {
  // Validate haystack type.
  ow(haystack, 'script list', ow.array.ofType(ow.string));

  if (!needle) {
    return;
  }

  // If the user provided an exact match, use it, even if the query may have
  // partially matched one or more scripts.
  if (haystack.includes(needle)) {
    return needle;
  }

  // Append '*' to each character within each dot-delimited segment of the query
  // so that we achieve the desired results when using micromatch. Throw if any
  // segment is an empty string.
  const modifiedSearch = needle.split('.').map(segment => {
    if (segment.length === 0) {
      throw new Error(`Invalid input: ${needle}`);
    }

    return segment.split('').map(char => `${char}*`).join('');
  }).join('.');

  const results = micromatch(haystack, [modifiedSearch], { nocase: true });

  // Handle cases where multiple results were found.
  if (results.length > 1) {
    // Get the set of all results that are 1 segment long.
    const singleSegmentResults = results.filter(isSingleSegment);

    // If the query is 1 segment and a single 1-segment result was found,
    // return it.
    if (isSingleSegment(needle) && singleSegmentResults.length === 1) {
      return singleSegmentResults[0];
    }

    const formattedResults = results.map(result => `"${result}"`);
    formattedResults[formattedResults.length - 1] = `and ${formattedResults.at(-1)}`;

    // Otherwise, throw.
    throw new Error(`Multiple scripts matched "${needle}": ${formattedResults.join(', ')}. Use more characters to disambiguate.`);
  }

  // Otherwise, we only have 1 result; return it.
  return results[0];
}
