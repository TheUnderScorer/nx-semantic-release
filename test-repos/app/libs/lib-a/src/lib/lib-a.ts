import { libB } from '@app/lib-a-dependency';

export function libA(): string {
  console.log('Running libA()...');

  libB();

  return 'lib-a';
}
