import { EOL } from 'os';

import type { ExecaError } from 'execa';
import micromatch from 'micromatch';
import ow from 'ow';


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
export function matchSegmentedName(haystack: Array<string>, needle: string): string {
  // Validate haystack type.
  ow(haystack, 'script list', ow.array.ofType(ow.string));

  // Append '*' to each dot-delimited segment of the query so that we achieve
  // the desired results when using micromatch. Throw if any segment is an
  // empty string.
  const modifiedSearch = needle.split('.').map(fragment => {
    if (fragment.length === 0) {
      throw new Error(`Invalid input: ${needle}`);
    }

    return `${fragment}*`;
  }).join('.');

  const results = micromatch(haystack, [modifiedSearch]);

  // Handle cases where multiple results were found.
  if (results.length > 1) {
    // Get the set of all results that are 1 segment long.
    const singleSegmentResults = results.filter(isSingleSegment);

    // If the query is 1 segment and a single 1-segment result was found,
    // return it.
    if (isSingleSegment(needle) && singleSegmentResults.length === 1) {
      return singleSegmentResults[0];
    }

    // Otherwise, throw.
    throw new Error(`Multiple scripts match "${needle}": ${results.join(', ')}`);
  }

  // Otherwise, we only have 1 result; return it.
  return results[0];
}


/**
 * Use duck-typing to determine if the provided value is an ExecaError.
 */
export function isExecaError(value: any): value is ExecaError {
  return value?.command && value?.exitCode;
}


/**
 * Provided an Error, returns its message, stack, and command (if applicable).
 *
 * TODO: If 'command' is not used any more, remove it.
 */
export function parseError<E extends Error>(err: E) {
  let command: string | undefined;

  if (isExecaError(err)) {
    command = err.command?.split(' ')[0];
  }

  const [message, ...stackLines] = err.message.split(EOL);
  const stack = stackLines.join(EOL);

  return {
    message,
    stack,
    command
  };
}
