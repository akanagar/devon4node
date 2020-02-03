import { basename, dirname, join, Path, strings } from '@angular-devkit/core';
import { chain, externalSchematic, move, Rule } from '@angular-devkit/schematics';

export interface IFilterOptions {
  name: string;
  path?: string | Path;
  language?: string;
  sourceRoot?: string;
  spec?: boolean;
  flat?: boolean;
}

export function main(options: IFilterOptions): Rule {
  const newOptions = { ...options };
  newOptions.name = options.name.startsWith('app/') ? options.name : 'app/' + options.name;
  if (newOptions.path) {
    newOptions.path = join(options.path as Path, 'src');
  }
  newOptions.language = 'ts';
  const path = newOptions.path || './src';
  const dir = dirname(newOptions.name as Path);
  const base = strings.dasherize(basename(newOptions.name as Path));

  return chain([
    externalSchematic('@nestjs/schematics', 'filter', newOptions),
    move(
      strings.dasherize(join(path as Path, dir, base + '.filter.ts')),
      strings.dasherize(join(path as Path, dir, 'filters', base + '.filter.ts')),
    ),
    move(
      strings.dasherize(join(path as Path, dir, base + '.filter.spec.ts')),
      strings.dasherize(join(path as Path, dir, 'filters', base + '.filter.spec.ts')),
    ),
  ]);
}
