export class CorruptedStackError extends Error {
  constructor() {
    super('Corrupted serialized proof stack');
  }
}

export class CorruptedProofError extends Error {
  constructor() {
    super('Corrupted proof');
  }
}

export class IncorrectNumberOfLeaves extends Error {
  constructor(expect: number, actual: number) {
    super('Incorrect number of leaves, expected ' + expect + 'actual ' + actual)
  }
}

export class EmptyKeys extends Error {
  constructor() {
    super('Empty Keys');
  }
}
