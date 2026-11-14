// @license
// Copyright (c) ggsuite
//
// Use of this source code is governed by terms that can be
// found in the LICENSE file in the root of this package.

import { describe, expect, it } from 'vitest';

import { GgPm } from '../src/gg-pm.ts';

describe('GgPm', () => {
  it('greets with the greeting', () => {
    expect(new GgPm('Hi').greet('Ada')).toBe('Hi, Ada!');
  });

  it('example() greets with Hello', () => {
    expect(GgPm.example().greet('Ada')).toBe('Hello, Ada!');
    expect(GgPm.example({ greeting: 'Hey' }).greeting).toBe('Hey');
  });
});
