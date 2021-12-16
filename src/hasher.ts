import { H256 } from ".";

export type HasherFactoryMethod = () => Hasher;

abstract class Hasher {
  abstract update(h: H256): Hasher;
  abstract final(): H256;
}

export default Hasher;