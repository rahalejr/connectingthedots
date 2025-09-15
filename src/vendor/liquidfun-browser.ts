// Use the UMD build (browser-safe). Adjust the path only if your node_modules differs.
// @ts-ignore: no types for this file
import anyFactory from '../../node_modules/liquidfun-wasm/dist/umd/Box2D.js';

// Normalize default vs. commonjs export
const factory: any = (anyFactory as any)?.default ?? anyFactory;

export default factory;