type Primitive = string | number;

type GenericObject = Record<Primitive, unknown>;

/**
 * NestedPaths
 * Get all the possible paths of an object
 * @example
 * type Keys = NestedPaths<{ a: { b: { c: string } }>
 * // 'a' | 'a.b' | 'a.b.c'
 */
export type NestedPaths<ObjectType extends object> = {
  [Key in keyof ObjectType & Primitive]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedPaths<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & Primitive];

/**
 * TypeFromPath
 * Get the type of the element specified by the path
 * @example
 * type TypeOfAB = TypeFromPath<{ a: { b: { c: string } }, 'a.b'>
 * // { c: string }
 */
export type TypeFromPath<
  T extends GenericObject,
  Path extends string, // Or, if you prefer, NestedPaths<T>
> = {
  [K in Path]: K extends keyof T
    ? T[K]
    : K extends `${infer P}.${infer S}`
    ? T[P] extends GenericObject
      ? TypeFromPath<T[P], S>
      : never
    : never;
}[Path];
