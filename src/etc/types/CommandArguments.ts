/**
 * Shape of the array passed as the second argument to `command`.
 *
 * The first member should be the command to execute.
 *
 * If passing only positional arguments, these may be provided as an array of
 * strings as the second member of the array.
 *
 * If passing only flags, these may be provided as an object as the second
 * member of the array.
 *
 * If passing both positional arguments and flags, positionals should be
 * provided as the second member and flags as the third.
 */
export type CommandArguments =
  // Single positional argument or user opted to specify all arguments as a
  // single string.
  string |
  // Flags only.
  Record<string, any> |
  // Mixed positional arguments and flags.
  Array<string | Record<string, any>>;
