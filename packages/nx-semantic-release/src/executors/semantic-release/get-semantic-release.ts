import type release from 'semantic-release';

/**
 * @FIXME Recently semantic-release became esm only, but until NX will support plugins in ESM, we have to use this dirty hack :/
 * */
export function getSemanticRelease() {
  const fn = new Function(
    'return import("semantic-release").then(m => m.default)'
  );

  return fn() as Promise<typeof release>;
}
