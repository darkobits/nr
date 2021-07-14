import execa from 'execa';
// @ts-expect-error - This package does not have type definitions.
import kebabCaseKeys from 'kebabcase-keys';
import ow from 'ow';
import unParseArgs from 'yargs-unparser';

import { CreateCommandOptions, CommandThunk } from 'etc/types';
import log, { LogPipe } from 'lib/log';


/**
 * Map of registered command names to their corresponding command thunks.
 */
const commands = new Map<string, CommandThunk>();

const commandConfigs = new Map<string, CreateCommandOptions>();


/**
 * @private
 *
 * Provided an arguments object, returns an array of strings representing the
 * "un-parsed" arguments.
 */
function parseArguments(args: CreateCommandOptions['arguments'], preserveArguments?: boolean) {
  const {
    _: positionals,
    ...flags
  } = Object.assign({_: []}, args);

  // Convert arguments object to an array of strings, first converting any
  // flags to kebab-case, unless preserveKeys is truthy.
  return unParseArgs(Object.assign(
    {_: positionals},
    preserveArguments ? flags : kebabCaseKeys(flags)
  ));
}


/**
 * Provided a command options object, creates a function that, when invoked,
 * will execute the command. This function is then added to the commands
 * registry.
 */
export function createCommand(opts: CreateCommandOptions) {
  try {
    // Prevent overwriting of existing commands.
    // if (commands.has(opts.name)) {
    //   throw new Error('Command has already been registered.');
    // }

    // Validate options.
    ow<CreateCommandOptions>(opts, ow.object.exactShape({
      name: ow.string,
      command: ow.string,
      arguments: ow.any(
        ow.undefined,
        ow.object.is(obj => {
          Object.entries(obj).forEach(([key, value]) => {
            if (key === '_') {
              ow(value, key, ow.any(
                ow.string,
                ow.array.ofType(ow.string)
              ));
            } else {
              ow(value, key, ow.any(
                ow.string,
                ow.number,
                ow.boolean
              ));
            }
          });

          return true;
        })
      ),
      execaOptions: ow.any(
        ow.undefined,
        ow.object.nonEmpty
      ),
      preserveArguments: ow.any(
        ow.undefined,
        ow.boolean
      )
    }));

    const firstSegmentOfName = opts.name.split('.')[0];

    commandConfigs.set(opts.name, opts);

    commands.set(opts.name, () => {
      const parsedArguments = parseArguments(opts.arguments, opts.preserveArguments);

      // Log the exact command being run at the verbose level.
      log.verbose(log.prefix(firstSegmentOfName), log.chalk.gray(opts.command), log.chalk.gray(parsedArguments.join(' ')));

      const command = execa(opts.command, parsedArguments, {
        stdio: 'pipe',
        env: {
          // This is needed to maintain colors in piped output.
          FORCE_COLOR: 'true'
        },
        ...opts.execaOptions
      });

      if (command.stdout) {
        command.stdout.pipe(new LogPipe((...args: Array<any>) => {
          log.info(log.prefix(firstSegmentOfName), ...args);
        }));
      }

      if (command.stderr) {
        command.stderr.pipe(new LogPipe((...args: Array<any>) => {
          log.error(log.prefix(firstSegmentOfName), ...args);
        }));
      }

      void command.on('exit', code => {
        if (code === 0) {
          log.verbose(log.prefix(log.chalk.blue(firstSegmentOfName)), log.chalk.green('Done.'));
        } else {
          log.error(log.prefix(firstSegmentOfName), log.chalk.bold(log.chalk.red.bold(`Command failed with exit code: ${code}.`)));
        }
      });

      return command;
    });
  } catch (err) {
    log.error(log.chalk.red.bold(`Unable to create command "${opts.name}":`));

    // Re-throw errors related to creating commands so that our caller can exit
    // with a non-zero code.
    throw err;
  }
}


export { commands, commandConfigs };
