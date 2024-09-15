import { it } from 'vitest';

export const it_cb = (
  name: string,
  testMethod: (done: CallableFunction) => void
) => it(name, () => new Promise((done) => testMethod(done)));
