
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Note
 * 
 */
export type Note = $Result.DefaultSelection<Prisma.$NotePayload>
/**
 * Model Edge
 * 
 */
export type Edge = $Result.DefaultSelection<Prisma.$EdgePayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Notes
 * const notes = await prisma.note.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Notes
   * const notes = await prisma.note.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.note`: Exposes CRUD operations for the **Note** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Notes
    * const notes = await prisma.note.findMany()
    * ```
    */
  get note(): Prisma.NoteDelegate<ExtArgs>;

  /**
   * `prisma.edge`: Exposes CRUD operations for the **Edge** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Edges
    * const edges = await prisma.edge.findMany()
    * ```
    */
  get edge(): Prisma.EdgeDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Note: 'Note',
    Edge: 'Edge'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "note" | "edge"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Note: {
        payload: Prisma.$NotePayload<ExtArgs>
        fields: Prisma.NoteFieldRefs
        operations: {
          findUnique: {
            args: Prisma.NoteFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.NoteFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotePayload>
          }
          findFirst: {
            args: Prisma.NoteFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.NoteFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotePayload>
          }
          findMany: {
            args: Prisma.NoteFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotePayload>[]
          }
          create: {
            args: Prisma.NoteCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotePayload>
          }
          createMany: {
            args: Prisma.NoteCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.NoteCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotePayload>[]
          }
          delete: {
            args: Prisma.NoteDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotePayload>
          }
          update: {
            args: Prisma.NoteUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotePayload>
          }
          deleteMany: {
            args: Prisma.NoteDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.NoteUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.NoteUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotePayload>
          }
          aggregate: {
            args: Prisma.NoteAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateNote>
          }
          groupBy: {
            args: Prisma.NoteGroupByArgs<ExtArgs>
            result: $Utils.Optional<NoteGroupByOutputType>[]
          }
          count: {
            args: Prisma.NoteCountArgs<ExtArgs>
            result: $Utils.Optional<NoteCountAggregateOutputType> | number
          }
        }
      }
      Edge: {
        payload: Prisma.$EdgePayload<ExtArgs>
        fields: Prisma.EdgeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EdgeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EdgePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EdgeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EdgePayload>
          }
          findFirst: {
            args: Prisma.EdgeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EdgePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EdgeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EdgePayload>
          }
          findMany: {
            args: Prisma.EdgeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EdgePayload>[]
          }
          create: {
            args: Prisma.EdgeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EdgePayload>
          }
          createMany: {
            args: Prisma.EdgeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EdgeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EdgePayload>[]
          }
          delete: {
            args: Prisma.EdgeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EdgePayload>
          }
          update: {
            args: Prisma.EdgeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EdgePayload>
          }
          deleteMany: {
            args: Prisma.EdgeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EdgeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.EdgeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EdgePayload>
          }
          aggregate: {
            args: Prisma.EdgeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEdge>
          }
          groupBy: {
            args: Prisma.EdgeGroupByArgs<ExtArgs>
            result: $Utils.Optional<EdgeGroupByOutputType>[]
          }
          count: {
            args: Prisma.EdgeCountArgs<ExtArgs>
            result: $Utils.Optional<EdgeCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type NoteCountOutputType
   */

  export type NoteCountOutputType = {
    outgoingEdges: number
    incomingEdges: number
  }

  export type NoteCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    outgoingEdges?: boolean | NoteCountOutputTypeCountOutgoingEdgesArgs
    incomingEdges?: boolean | NoteCountOutputTypeCountIncomingEdgesArgs
  }

  // Custom InputTypes
  /**
   * NoteCountOutputType without action
   */
  export type NoteCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NoteCountOutputType
     */
    select?: NoteCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * NoteCountOutputType without action
   */
  export type NoteCountOutputTypeCountOutgoingEdgesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EdgeWhereInput
  }

  /**
   * NoteCountOutputType without action
   */
  export type NoteCountOutputTypeCountIncomingEdgesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EdgeWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Note
   */

  export type AggregateNote = {
    _count: NoteCountAggregateOutputType | null
    _min: NoteMinAggregateOutputType | null
    _max: NoteMaxAggregateOutputType | null
  }

  export type NoteMinAggregateOutputType = {
    id: string | null
    userId: string | null
    content: string | null
    type: string | null
    url: string | null
    title: string | null
    summary: string | null
    topics: string | null
    tags: string | null
    embedding: string | null
    createdAt: Date | null
    status: string | null
  }

  export type NoteMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    content: string | null
    type: string | null
    url: string | null
    title: string | null
    summary: string | null
    topics: string | null
    tags: string | null
    embedding: string | null
    createdAt: Date | null
    status: string | null
  }

  export type NoteCountAggregateOutputType = {
    id: number
    userId: number
    content: number
    type: number
    url: number
    title: number
    summary: number
    topics: number
    tags: number
    embedding: number
    createdAt: number
    status: number
    _all: number
  }


  export type NoteMinAggregateInputType = {
    id?: true
    userId?: true
    content?: true
    type?: true
    url?: true
    title?: true
    summary?: true
    topics?: true
    tags?: true
    embedding?: true
    createdAt?: true
    status?: true
  }

  export type NoteMaxAggregateInputType = {
    id?: true
    userId?: true
    content?: true
    type?: true
    url?: true
    title?: true
    summary?: true
    topics?: true
    tags?: true
    embedding?: true
    createdAt?: true
    status?: true
  }

  export type NoteCountAggregateInputType = {
    id?: true
    userId?: true
    content?: true
    type?: true
    url?: true
    title?: true
    summary?: true
    topics?: true
    tags?: true
    embedding?: true
    createdAt?: true
    status?: true
    _all?: true
  }

  export type NoteAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Note to aggregate.
     */
    where?: NoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notes to fetch.
     */
    orderBy?: NoteOrderByWithRelationInput | NoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: NoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Notes
    **/
    _count?: true | NoteCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: NoteMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: NoteMaxAggregateInputType
  }

  export type GetNoteAggregateType<T extends NoteAggregateArgs> = {
        [P in keyof T & keyof AggregateNote]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateNote[P]>
      : GetScalarType<T[P], AggregateNote[P]>
  }




  export type NoteGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NoteWhereInput
    orderBy?: NoteOrderByWithAggregationInput | NoteOrderByWithAggregationInput[]
    by: NoteScalarFieldEnum[] | NoteScalarFieldEnum
    having?: NoteScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: NoteCountAggregateInputType | true
    _min?: NoteMinAggregateInputType
    _max?: NoteMaxAggregateInputType
  }

  export type NoteGroupByOutputType = {
    id: string
    userId: string
    content: string
    type: string
    url: string | null
    title: string | null
    summary: string | null
    topics: string | null
    tags: string | null
    embedding: string | null
    createdAt: Date
    status: string
    _count: NoteCountAggregateOutputType | null
    _min: NoteMinAggregateOutputType | null
    _max: NoteMaxAggregateOutputType | null
  }

  type GetNoteGroupByPayload<T extends NoteGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<NoteGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof NoteGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], NoteGroupByOutputType[P]>
            : GetScalarType<T[P], NoteGroupByOutputType[P]>
        }
      >
    >


  export type NoteSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    content?: boolean
    type?: boolean
    url?: boolean
    title?: boolean
    summary?: boolean
    topics?: boolean
    tags?: boolean
    embedding?: boolean
    createdAt?: boolean
    status?: boolean
    outgoingEdges?: boolean | Note$outgoingEdgesArgs<ExtArgs>
    incomingEdges?: boolean | Note$incomingEdgesArgs<ExtArgs>
    _count?: boolean | NoteCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["note"]>

  export type NoteSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    content?: boolean
    type?: boolean
    url?: boolean
    title?: boolean
    summary?: boolean
    topics?: boolean
    tags?: boolean
    embedding?: boolean
    createdAt?: boolean
    status?: boolean
  }, ExtArgs["result"]["note"]>

  export type NoteSelectScalar = {
    id?: boolean
    userId?: boolean
    content?: boolean
    type?: boolean
    url?: boolean
    title?: boolean
    summary?: boolean
    topics?: boolean
    tags?: boolean
    embedding?: boolean
    createdAt?: boolean
    status?: boolean
  }

  export type NoteInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    outgoingEdges?: boolean | Note$outgoingEdgesArgs<ExtArgs>
    incomingEdges?: boolean | Note$incomingEdgesArgs<ExtArgs>
    _count?: boolean | NoteCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type NoteIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $NotePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Note"
    objects: {
      outgoingEdges: Prisma.$EdgePayload<ExtArgs>[]
      incomingEdges: Prisma.$EdgePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      content: string
      type: string
      url: string | null
      title: string | null
      summary: string | null
      topics: string | null
      tags: string | null
      embedding: string | null
      createdAt: Date
      status: string
    }, ExtArgs["result"]["note"]>
    composites: {}
  }

  type NoteGetPayload<S extends boolean | null | undefined | NoteDefaultArgs> = $Result.GetResult<Prisma.$NotePayload, S>

  type NoteCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<NoteFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: NoteCountAggregateInputType | true
    }

  export interface NoteDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Note'], meta: { name: 'Note' } }
    /**
     * Find zero or one Note that matches the filter.
     * @param {NoteFindUniqueArgs} args - Arguments to find a Note
     * @example
     * // Get one Note
     * const note = await prisma.note.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends NoteFindUniqueArgs>(args: SelectSubset<T, NoteFindUniqueArgs<ExtArgs>>): Prisma__NoteClient<$Result.GetResult<Prisma.$NotePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Note that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {NoteFindUniqueOrThrowArgs} args - Arguments to find a Note
     * @example
     * // Get one Note
     * const note = await prisma.note.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends NoteFindUniqueOrThrowArgs>(args: SelectSubset<T, NoteFindUniqueOrThrowArgs<ExtArgs>>): Prisma__NoteClient<$Result.GetResult<Prisma.$NotePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Note that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NoteFindFirstArgs} args - Arguments to find a Note
     * @example
     * // Get one Note
     * const note = await prisma.note.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends NoteFindFirstArgs>(args?: SelectSubset<T, NoteFindFirstArgs<ExtArgs>>): Prisma__NoteClient<$Result.GetResult<Prisma.$NotePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Note that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NoteFindFirstOrThrowArgs} args - Arguments to find a Note
     * @example
     * // Get one Note
     * const note = await prisma.note.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends NoteFindFirstOrThrowArgs>(args?: SelectSubset<T, NoteFindFirstOrThrowArgs<ExtArgs>>): Prisma__NoteClient<$Result.GetResult<Prisma.$NotePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Notes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NoteFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Notes
     * const notes = await prisma.note.findMany()
     * 
     * // Get first 10 Notes
     * const notes = await prisma.note.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const noteWithIdOnly = await prisma.note.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends NoteFindManyArgs>(args?: SelectSubset<T, NoteFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Note.
     * @param {NoteCreateArgs} args - Arguments to create a Note.
     * @example
     * // Create one Note
     * const Note = await prisma.note.create({
     *   data: {
     *     // ... data to create a Note
     *   }
     * })
     * 
     */
    create<T extends NoteCreateArgs>(args: SelectSubset<T, NoteCreateArgs<ExtArgs>>): Prisma__NoteClient<$Result.GetResult<Prisma.$NotePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Notes.
     * @param {NoteCreateManyArgs} args - Arguments to create many Notes.
     * @example
     * // Create many Notes
     * const note = await prisma.note.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends NoteCreateManyArgs>(args?: SelectSubset<T, NoteCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Notes and returns the data saved in the database.
     * @param {NoteCreateManyAndReturnArgs} args - Arguments to create many Notes.
     * @example
     * // Create many Notes
     * const note = await prisma.note.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Notes and only return the `id`
     * const noteWithIdOnly = await prisma.note.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends NoteCreateManyAndReturnArgs>(args?: SelectSubset<T, NoteCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Note.
     * @param {NoteDeleteArgs} args - Arguments to delete one Note.
     * @example
     * // Delete one Note
     * const Note = await prisma.note.delete({
     *   where: {
     *     // ... filter to delete one Note
     *   }
     * })
     * 
     */
    delete<T extends NoteDeleteArgs>(args: SelectSubset<T, NoteDeleteArgs<ExtArgs>>): Prisma__NoteClient<$Result.GetResult<Prisma.$NotePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Note.
     * @param {NoteUpdateArgs} args - Arguments to update one Note.
     * @example
     * // Update one Note
     * const note = await prisma.note.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends NoteUpdateArgs>(args: SelectSubset<T, NoteUpdateArgs<ExtArgs>>): Prisma__NoteClient<$Result.GetResult<Prisma.$NotePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Notes.
     * @param {NoteDeleteManyArgs} args - Arguments to filter Notes to delete.
     * @example
     * // Delete a few Notes
     * const { count } = await prisma.note.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends NoteDeleteManyArgs>(args?: SelectSubset<T, NoteDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Notes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NoteUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Notes
     * const note = await prisma.note.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends NoteUpdateManyArgs>(args: SelectSubset<T, NoteUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Note.
     * @param {NoteUpsertArgs} args - Arguments to update or create a Note.
     * @example
     * // Update or create a Note
     * const note = await prisma.note.upsert({
     *   create: {
     *     // ... data to create a Note
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Note we want to update
     *   }
     * })
     */
    upsert<T extends NoteUpsertArgs>(args: SelectSubset<T, NoteUpsertArgs<ExtArgs>>): Prisma__NoteClient<$Result.GetResult<Prisma.$NotePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Notes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NoteCountArgs} args - Arguments to filter Notes to count.
     * @example
     * // Count the number of Notes
     * const count = await prisma.note.count({
     *   where: {
     *     // ... the filter for the Notes we want to count
     *   }
     * })
    **/
    count<T extends NoteCountArgs>(
      args?: Subset<T, NoteCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], NoteCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Note.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NoteAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends NoteAggregateArgs>(args: Subset<T, NoteAggregateArgs>): Prisma.PrismaPromise<GetNoteAggregateType<T>>

    /**
     * Group by Note.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NoteGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends NoteGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: NoteGroupByArgs['orderBy'] }
        : { orderBy?: NoteGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, NoteGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetNoteGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Note model
   */
  readonly fields: NoteFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Note.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__NoteClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    outgoingEdges<T extends Note$outgoingEdgesArgs<ExtArgs> = {}>(args?: Subset<T, Note$outgoingEdgesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EdgePayload<ExtArgs>, T, "findMany"> | Null>
    incomingEdges<T extends Note$incomingEdgesArgs<ExtArgs> = {}>(args?: Subset<T, Note$incomingEdgesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EdgePayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Note model
   */ 
  interface NoteFieldRefs {
    readonly id: FieldRef<"Note", 'String'>
    readonly userId: FieldRef<"Note", 'String'>
    readonly content: FieldRef<"Note", 'String'>
    readonly type: FieldRef<"Note", 'String'>
    readonly url: FieldRef<"Note", 'String'>
    readonly title: FieldRef<"Note", 'String'>
    readonly summary: FieldRef<"Note", 'String'>
    readonly topics: FieldRef<"Note", 'String'>
    readonly tags: FieldRef<"Note", 'String'>
    readonly embedding: FieldRef<"Note", 'String'>
    readonly createdAt: FieldRef<"Note", 'DateTime'>
    readonly status: FieldRef<"Note", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Note findUnique
   */
  export type NoteFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Note
     */
    select?: NoteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NoteInclude<ExtArgs> | null
    /**
     * Filter, which Note to fetch.
     */
    where: NoteWhereUniqueInput
  }

  /**
   * Note findUniqueOrThrow
   */
  export type NoteFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Note
     */
    select?: NoteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NoteInclude<ExtArgs> | null
    /**
     * Filter, which Note to fetch.
     */
    where: NoteWhereUniqueInput
  }

  /**
   * Note findFirst
   */
  export type NoteFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Note
     */
    select?: NoteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NoteInclude<ExtArgs> | null
    /**
     * Filter, which Note to fetch.
     */
    where?: NoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notes to fetch.
     */
    orderBy?: NoteOrderByWithRelationInput | NoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Notes.
     */
    cursor?: NoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Notes.
     */
    distinct?: NoteScalarFieldEnum | NoteScalarFieldEnum[]
  }

  /**
   * Note findFirstOrThrow
   */
  export type NoteFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Note
     */
    select?: NoteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NoteInclude<ExtArgs> | null
    /**
     * Filter, which Note to fetch.
     */
    where?: NoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notes to fetch.
     */
    orderBy?: NoteOrderByWithRelationInput | NoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Notes.
     */
    cursor?: NoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Notes.
     */
    distinct?: NoteScalarFieldEnum | NoteScalarFieldEnum[]
  }

  /**
   * Note findMany
   */
  export type NoteFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Note
     */
    select?: NoteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NoteInclude<ExtArgs> | null
    /**
     * Filter, which Notes to fetch.
     */
    where?: NoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notes to fetch.
     */
    orderBy?: NoteOrderByWithRelationInput | NoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Notes.
     */
    cursor?: NoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notes.
     */
    skip?: number
    distinct?: NoteScalarFieldEnum | NoteScalarFieldEnum[]
  }

  /**
   * Note create
   */
  export type NoteCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Note
     */
    select?: NoteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NoteInclude<ExtArgs> | null
    /**
     * The data needed to create a Note.
     */
    data: XOR<NoteCreateInput, NoteUncheckedCreateInput>
  }

  /**
   * Note createMany
   */
  export type NoteCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Notes.
     */
    data: NoteCreateManyInput | NoteCreateManyInput[]
  }

  /**
   * Note createManyAndReturn
   */
  export type NoteCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Note
     */
    select?: NoteSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Notes.
     */
    data: NoteCreateManyInput | NoteCreateManyInput[]
  }

  /**
   * Note update
   */
  export type NoteUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Note
     */
    select?: NoteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NoteInclude<ExtArgs> | null
    /**
     * The data needed to update a Note.
     */
    data: XOR<NoteUpdateInput, NoteUncheckedUpdateInput>
    /**
     * Choose, which Note to update.
     */
    where: NoteWhereUniqueInput
  }

  /**
   * Note updateMany
   */
  export type NoteUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Notes.
     */
    data: XOR<NoteUpdateManyMutationInput, NoteUncheckedUpdateManyInput>
    /**
     * Filter which Notes to update
     */
    where?: NoteWhereInput
  }

  /**
   * Note upsert
   */
  export type NoteUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Note
     */
    select?: NoteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NoteInclude<ExtArgs> | null
    /**
     * The filter to search for the Note to update in case it exists.
     */
    where: NoteWhereUniqueInput
    /**
     * In case the Note found by the `where` argument doesn't exist, create a new Note with this data.
     */
    create: XOR<NoteCreateInput, NoteUncheckedCreateInput>
    /**
     * In case the Note was found with the provided `where` argument, update it with this data.
     */
    update: XOR<NoteUpdateInput, NoteUncheckedUpdateInput>
  }

  /**
   * Note delete
   */
  export type NoteDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Note
     */
    select?: NoteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NoteInclude<ExtArgs> | null
    /**
     * Filter which Note to delete.
     */
    where: NoteWhereUniqueInput
  }

  /**
   * Note deleteMany
   */
  export type NoteDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Notes to delete
     */
    where?: NoteWhereInput
  }

  /**
   * Note.outgoingEdges
   */
  export type Note$outgoingEdgesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Edge
     */
    select?: EdgeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EdgeInclude<ExtArgs> | null
    where?: EdgeWhereInput
    orderBy?: EdgeOrderByWithRelationInput | EdgeOrderByWithRelationInput[]
    cursor?: EdgeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EdgeScalarFieldEnum | EdgeScalarFieldEnum[]
  }

  /**
   * Note.incomingEdges
   */
  export type Note$incomingEdgesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Edge
     */
    select?: EdgeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EdgeInclude<ExtArgs> | null
    where?: EdgeWhereInput
    orderBy?: EdgeOrderByWithRelationInput | EdgeOrderByWithRelationInput[]
    cursor?: EdgeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EdgeScalarFieldEnum | EdgeScalarFieldEnum[]
  }

  /**
   * Note without action
   */
  export type NoteDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Note
     */
    select?: NoteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NoteInclude<ExtArgs> | null
  }


  /**
   * Model Edge
   */

  export type AggregateEdge = {
    _count: EdgeCountAggregateOutputType | null
    _avg: EdgeAvgAggregateOutputType | null
    _sum: EdgeSumAggregateOutputType | null
    _min: EdgeMinAggregateOutputType | null
    _max: EdgeMaxAggregateOutputType | null
  }

  export type EdgeAvgAggregateOutputType = {
    similarity: number | null
  }

  export type EdgeSumAggregateOutputType = {
    similarity: number | null
  }

  export type EdgeMinAggregateOutputType = {
    id: string | null
    sourceId: string | null
    targetId: string | null
    similarity: number | null
    explanation: string | null
    createdAt: Date | null
  }

  export type EdgeMaxAggregateOutputType = {
    id: string | null
    sourceId: string | null
    targetId: string | null
    similarity: number | null
    explanation: string | null
    createdAt: Date | null
  }

  export type EdgeCountAggregateOutputType = {
    id: number
    sourceId: number
    targetId: number
    similarity: number
    explanation: number
    createdAt: number
    _all: number
  }


  export type EdgeAvgAggregateInputType = {
    similarity?: true
  }

  export type EdgeSumAggregateInputType = {
    similarity?: true
  }

  export type EdgeMinAggregateInputType = {
    id?: true
    sourceId?: true
    targetId?: true
    similarity?: true
    explanation?: true
    createdAt?: true
  }

  export type EdgeMaxAggregateInputType = {
    id?: true
    sourceId?: true
    targetId?: true
    similarity?: true
    explanation?: true
    createdAt?: true
  }

  export type EdgeCountAggregateInputType = {
    id?: true
    sourceId?: true
    targetId?: true
    similarity?: true
    explanation?: true
    createdAt?: true
    _all?: true
  }

  export type EdgeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Edge to aggregate.
     */
    where?: EdgeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Edges to fetch.
     */
    orderBy?: EdgeOrderByWithRelationInput | EdgeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EdgeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Edges from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Edges.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Edges
    **/
    _count?: true | EdgeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: EdgeAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: EdgeSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EdgeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EdgeMaxAggregateInputType
  }

  export type GetEdgeAggregateType<T extends EdgeAggregateArgs> = {
        [P in keyof T & keyof AggregateEdge]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEdge[P]>
      : GetScalarType<T[P], AggregateEdge[P]>
  }




  export type EdgeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EdgeWhereInput
    orderBy?: EdgeOrderByWithAggregationInput | EdgeOrderByWithAggregationInput[]
    by: EdgeScalarFieldEnum[] | EdgeScalarFieldEnum
    having?: EdgeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EdgeCountAggregateInputType | true
    _avg?: EdgeAvgAggregateInputType
    _sum?: EdgeSumAggregateInputType
    _min?: EdgeMinAggregateInputType
    _max?: EdgeMaxAggregateInputType
  }

  export type EdgeGroupByOutputType = {
    id: string
    sourceId: string
    targetId: string
    similarity: number
    explanation: string
    createdAt: Date
    _count: EdgeCountAggregateOutputType | null
    _avg: EdgeAvgAggregateOutputType | null
    _sum: EdgeSumAggregateOutputType | null
    _min: EdgeMinAggregateOutputType | null
    _max: EdgeMaxAggregateOutputType | null
  }

  type GetEdgeGroupByPayload<T extends EdgeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EdgeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EdgeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EdgeGroupByOutputType[P]>
            : GetScalarType<T[P], EdgeGroupByOutputType[P]>
        }
      >
    >


  export type EdgeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sourceId?: boolean
    targetId?: boolean
    similarity?: boolean
    explanation?: boolean
    createdAt?: boolean
    source?: boolean | NoteDefaultArgs<ExtArgs>
    target?: boolean | NoteDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["edge"]>

  export type EdgeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sourceId?: boolean
    targetId?: boolean
    similarity?: boolean
    explanation?: boolean
    createdAt?: boolean
    source?: boolean | NoteDefaultArgs<ExtArgs>
    target?: boolean | NoteDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["edge"]>

  export type EdgeSelectScalar = {
    id?: boolean
    sourceId?: boolean
    targetId?: boolean
    similarity?: boolean
    explanation?: boolean
    createdAt?: boolean
  }

  export type EdgeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    source?: boolean | NoteDefaultArgs<ExtArgs>
    target?: boolean | NoteDefaultArgs<ExtArgs>
  }
  export type EdgeIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    source?: boolean | NoteDefaultArgs<ExtArgs>
    target?: boolean | NoteDefaultArgs<ExtArgs>
  }

  export type $EdgePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Edge"
    objects: {
      source: Prisma.$NotePayload<ExtArgs>
      target: Prisma.$NotePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      sourceId: string
      targetId: string
      similarity: number
      explanation: string
      createdAt: Date
    }, ExtArgs["result"]["edge"]>
    composites: {}
  }

  type EdgeGetPayload<S extends boolean | null | undefined | EdgeDefaultArgs> = $Result.GetResult<Prisma.$EdgePayload, S>

  type EdgeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<EdgeFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: EdgeCountAggregateInputType | true
    }

  export interface EdgeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Edge'], meta: { name: 'Edge' } }
    /**
     * Find zero or one Edge that matches the filter.
     * @param {EdgeFindUniqueArgs} args - Arguments to find a Edge
     * @example
     * // Get one Edge
     * const edge = await prisma.edge.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EdgeFindUniqueArgs>(args: SelectSubset<T, EdgeFindUniqueArgs<ExtArgs>>): Prisma__EdgeClient<$Result.GetResult<Prisma.$EdgePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Edge that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {EdgeFindUniqueOrThrowArgs} args - Arguments to find a Edge
     * @example
     * // Get one Edge
     * const edge = await prisma.edge.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EdgeFindUniqueOrThrowArgs>(args: SelectSubset<T, EdgeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EdgeClient<$Result.GetResult<Prisma.$EdgePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Edge that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EdgeFindFirstArgs} args - Arguments to find a Edge
     * @example
     * // Get one Edge
     * const edge = await prisma.edge.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EdgeFindFirstArgs>(args?: SelectSubset<T, EdgeFindFirstArgs<ExtArgs>>): Prisma__EdgeClient<$Result.GetResult<Prisma.$EdgePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Edge that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EdgeFindFirstOrThrowArgs} args - Arguments to find a Edge
     * @example
     * // Get one Edge
     * const edge = await prisma.edge.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EdgeFindFirstOrThrowArgs>(args?: SelectSubset<T, EdgeFindFirstOrThrowArgs<ExtArgs>>): Prisma__EdgeClient<$Result.GetResult<Prisma.$EdgePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Edges that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EdgeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Edges
     * const edges = await prisma.edge.findMany()
     * 
     * // Get first 10 Edges
     * const edges = await prisma.edge.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const edgeWithIdOnly = await prisma.edge.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EdgeFindManyArgs>(args?: SelectSubset<T, EdgeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EdgePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Edge.
     * @param {EdgeCreateArgs} args - Arguments to create a Edge.
     * @example
     * // Create one Edge
     * const Edge = await prisma.edge.create({
     *   data: {
     *     // ... data to create a Edge
     *   }
     * })
     * 
     */
    create<T extends EdgeCreateArgs>(args: SelectSubset<T, EdgeCreateArgs<ExtArgs>>): Prisma__EdgeClient<$Result.GetResult<Prisma.$EdgePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Edges.
     * @param {EdgeCreateManyArgs} args - Arguments to create many Edges.
     * @example
     * // Create many Edges
     * const edge = await prisma.edge.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EdgeCreateManyArgs>(args?: SelectSubset<T, EdgeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Edges and returns the data saved in the database.
     * @param {EdgeCreateManyAndReturnArgs} args - Arguments to create many Edges.
     * @example
     * // Create many Edges
     * const edge = await prisma.edge.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Edges and only return the `id`
     * const edgeWithIdOnly = await prisma.edge.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends EdgeCreateManyAndReturnArgs>(args?: SelectSubset<T, EdgeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EdgePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Edge.
     * @param {EdgeDeleteArgs} args - Arguments to delete one Edge.
     * @example
     * // Delete one Edge
     * const Edge = await prisma.edge.delete({
     *   where: {
     *     // ... filter to delete one Edge
     *   }
     * })
     * 
     */
    delete<T extends EdgeDeleteArgs>(args: SelectSubset<T, EdgeDeleteArgs<ExtArgs>>): Prisma__EdgeClient<$Result.GetResult<Prisma.$EdgePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Edge.
     * @param {EdgeUpdateArgs} args - Arguments to update one Edge.
     * @example
     * // Update one Edge
     * const edge = await prisma.edge.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EdgeUpdateArgs>(args: SelectSubset<T, EdgeUpdateArgs<ExtArgs>>): Prisma__EdgeClient<$Result.GetResult<Prisma.$EdgePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Edges.
     * @param {EdgeDeleteManyArgs} args - Arguments to filter Edges to delete.
     * @example
     * // Delete a few Edges
     * const { count } = await prisma.edge.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EdgeDeleteManyArgs>(args?: SelectSubset<T, EdgeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Edges.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EdgeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Edges
     * const edge = await prisma.edge.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EdgeUpdateManyArgs>(args: SelectSubset<T, EdgeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Edge.
     * @param {EdgeUpsertArgs} args - Arguments to update or create a Edge.
     * @example
     * // Update or create a Edge
     * const edge = await prisma.edge.upsert({
     *   create: {
     *     // ... data to create a Edge
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Edge we want to update
     *   }
     * })
     */
    upsert<T extends EdgeUpsertArgs>(args: SelectSubset<T, EdgeUpsertArgs<ExtArgs>>): Prisma__EdgeClient<$Result.GetResult<Prisma.$EdgePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Edges.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EdgeCountArgs} args - Arguments to filter Edges to count.
     * @example
     * // Count the number of Edges
     * const count = await prisma.edge.count({
     *   where: {
     *     // ... the filter for the Edges we want to count
     *   }
     * })
    **/
    count<T extends EdgeCountArgs>(
      args?: Subset<T, EdgeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EdgeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Edge.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EdgeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends EdgeAggregateArgs>(args: Subset<T, EdgeAggregateArgs>): Prisma.PrismaPromise<GetEdgeAggregateType<T>>

    /**
     * Group by Edge.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EdgeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends EdgeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EdgeGroupByArgs['orderBy'] }
        : { orderBy?: EdgeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, EdgeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEdgeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Edge model
   */
  readonly fields: EdgeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Edge.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EdgeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    source<T extends NoteDefaultArgs<ExtArgs> = {}>(args?: Subset<T, NoteDefaultArgs<ExtArgs>>): Prisma__NoteClient<$Result.GetResult<Prisma.$NotePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    target<T extends NoteDefaultArgs<ExtArgs> = {}>(args?: Subset<T, NoteDefaultArgs<ExtArgs>>): Prisma__NoteClient<$Result.GetResult<Prisma.$NotePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Edge model
   */ 
  interface EdgeFieldRefs {
    readonly id: FieldRef<"Edge", 'String'>
    readonly sourceId: FieldRef<"Edge", 'String'>
    readonly targetId: FieldRef<"Edge", 'String'>
    readonly similarity: FieldRef<"Edge", 'Float'>
    readonly explanation: FieldRef<"Edge", 'String'>
    readonly createdAt: FieldRef<"Edge", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Edge findUnique
   */
  export type EdgeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Edge
     */
    select?: EdgeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EdgeInclude<ExtArgs> | null
    /**
     * Filter, which Edge to fetch.
     */
    where: EdgeWhereUniqueInput
  }

  /**
   * Edge findUniqueOrThrow
   */
  export type EdgeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Edge
     */
    select?: EdgeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EdgeInclude<ExtArgs> | null
    /**
     * Filter, which Edge to fetch.
     */
    where: EdgeWhereUniqueInput
  }

  /**
   * Edge findFirst
   */
  export type EdgeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Edge
     */
    select?: EdgeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EdgeInclude<ExtArgs> | null
    /**
     * Filter, which Edge to fetch.
     */
    where?: EdgeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Edges to fetch.
     */
    orderBy?: EdgeOrderByWithRelationInput | EdgeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Edges.
     */
    cursor?: EdgeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Edges from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Edges.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Edges.
     */
    distinct?: EdgeScalarFieldEnum | EdgeScalarFieldEnum[]
  }

  /**
   * Edge findFirstOrThrow
   */
  export type EdgeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Edge
     */
    select?: EdgeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EdgeInclude<ExtArgs> | null
    /**
     * Filter, which Edge to fetch.
     */
    where?: EdgeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Edges to fetch.
     */
    orderBy?: EdgeOrderByWithRelationInput | EdgeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Edges.
     */
    cursor?: EdgeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Edges from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Edges.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Edges.
     */
    distinct?: EdgeScalarFieldEnum | EdgeScalarFieldEnum[]
  }

  /**
   * Edge findMany
   */
  export type EdgeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Edge
     */
    select?: EdgeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EdgeInclude<ExtArgs> | null
    /**
     * Filter, which Edges to fetch.
     */
    where?: EdgeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Edges to fetch.
     */
    orderBy?: EdgeOrderByWithRelationInput | EdgeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Edges.
     */
    cursor?: EdgeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Edges from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Edges.
     */
    skip?: number
    distinct?: EdgeScalarFieldEnum | EdgeScalarFieldEnum[]
  }

  /**
   * Edge create
   */
  export type EdgeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Edge
     */
    select?: EdgeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EdgeInclude<ExtArgs> | null
    /**
     * The data needed to create a Edge.
     */
    data: XOR<EdgeCreateInput, EdgeUncheckedCreateInput>
  }

  /**
   * Edge createMany
   */
  export type EdgeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Edges.
     */
    data: EdgeCreateManyInput | EdgeCreateManyInput[]
  }

  /**
   * Edge createManyAndReturn
   */
  export type EdgeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Edge
     */
    select?: EdgeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Edges.
     */
    data: EdgeCreateManyInput | EdgeCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EdgeIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Edge update
   */
  export type EdgeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Edge
     */
    select?: EdgeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EdgeInclude<ExtArgs> | null
    /**
     * The data needed to update a Edge.
     */
    data: XOR<EdgeUpdateInput, EdgeUncheckedUpdateInput>
    /**
     * Choose, which Edge to update.
     */
    where: EdgeWhereUniqueInput
  }

  /**
   * Edge updateMany
   */
  export type EdgeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Edges.
     */
    data: XOR<EdgeUpdateManyMutationInput, EdgeUncheckedUpdateManyInput>
    /**
     * Filter which Edges to update
     */
    where?: EdgeWhereInput
  }

  /**
   * Edge upsert
   */
  export type EdgeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Edge
     */
    select?: EdgeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EdgeInclude<ExtArgs> | null
    /**
     * The filter to search for the Edge to update in case it exists.
     */
    where: EdgeWhereUniqueInput
    /**
     * In case the Edge found by the `where` argument doesn't exist, create a new Edge with this data.
     */
    create: XOR<EdgeCreateInput, EdgeUncheckedCreateInput>
    /**
     * In case the Edge was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EdgeUpdateInput, EdgeUncheckedUpdateInput>
  }

  /**
   * Edge delete
   */
  export type EdgeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Edge
     */
    select?: EdgeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EdgeInclude<ExtArgs> | null
    /**
     * Filter which Edge to delete.
     */
    where: EdgeWhereUniqueInput
  }

  /**
   * Edge deleteMany
   */
  export type EdgeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Edges to delete
     */
    where?: EdgeWhereInput
  }

  /**
   * Edge without action
   */
  export type EdgeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Edge
     */
    select?: EdgeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EdgeInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const NoteScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    content: 'content',
    type: 'type',
    url: 'url',
    title: 'title',
    summary: 'summary',
    topics: 'topics',
    tags: 'tags',
    embedding: 'embedding',
    createdAt: 'createdAt',
    status: 'status'
  };

  export type NoteScalarFieldEnum = (typeof NoteScalarFieldEnum)[keyof typeof NoteScalarFieldEnum]


  export const EdgeScalarFieldEnum: {
    id: 'id',
    sourceId: 'sourceId',
    targetId: 'targetId',
    similarity: 'similarity',
    explanation: 'explanation',
    createdAt: 'createdAt'
  };

  export type EdgeScalarFieldEnum = (typeof EdgeScalarFieldEnum)[keyof typeof EdgeScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    
  /**
   * Deep Input Types
   */


  export type NoteWhereInput = {
    AND?: NoteWhereInput | NoteWhereInput[]
    OR?: NoteWhereInput[]
    NOT?: NoteWhereInput | NoteWhereInput[]
    id?: StringFilter<"Note"> | string
    userId?: StringFilter<"Note"> | string
    content?: StringFilter<"Note"> | string
    type?: StringFilter<"Note"> | string
    url?: StringNullableFilter<"Note"> | string | null
    title?: StringNullableFilter<"Note"> | string | null
    summary?: StringNullableFilter<"Note"> | string | null
    topics?: StringNullableFilter<"Note"> | string | null
    tags?: StringNullableFilter<"Note"> | string | null
    embedding?: StringNullableFilter<"Note"> | string | null
    createdAt?: DateTimeFilter<"Note"> | Date | string
    status?: StringFilter<"Note"> | string
    outgoingEdges?: EdgeListRelationFilter
    incomingEdges?: EdgeListRelationFilter
  }

  export type NoteOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    content?: SortOrder
    type?: SortOrder
    url?: SortOrderInput | SortOrder
    title?: SortOrderInput | SortOrder
    summary?: SortOrderInput | SortOrder
    topics?: SortOrderInput | SortOrder
    tags?: SortOrderInput | SortOrder
    embedding?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    status?: SortOrder
    outgoingEdges?: EdgeOrderByRelationAggregateInput
    incomingEdges?: EdgeOrderByRelationAggregateInput
  }

  export type NoteWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: NoteWhereInput | NoteWhereInput[]
    OR?: NoteWhereInput[]
    NOT?: NoteWhereInput | NoteWhereInput[]
    userId?: StringFilter<"Note"> | string
    content?: StringFilter<"Note"> | string
    type?: StringFilter<"Note"> | string
    url?: StringNullableFilter<"Note"> | string | null
    title?: StringNullableFilter<"Note"> | string | null
    summary?: StringNullableFilter<"Note"> | string | null
    topics?: StringNullableFilter<"Note"> | string | null
    tags?: StringNullableFilter<"Note"> | string | null
    embedding?: StringNullableFilter<"Note"> | string | null
    createdAt?: DateTimeFilter<"Note"> | Date | string
    status?: StringFilter<"Note"> | string
    outgoingEdges?: EdgeListRelationFilter
    incomingEdges?: EdgeListRelationFilter
  }, "id">

  export type NoteOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    content?: SortOrder
    type?: SortOrder
    url?: SortOrderInput | SortOrder
    title?: SortOrderInput | SortOrder
    summary?: SortOrderInput | SortOrder
    topics?: SortOrderInput | SortOrder
    tags?: SortOrderInput | SortOrder
    embedding?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    status?: SortOrder
    _count?: NoteCountOrderByAggregateInput
    _max?: NoteMaxOrderByAggregateInput
    _min?: NoteMinOrderByAggregateInput
  }

  export type NoteScalarWhereWithAggregatesInput = {
    AND?: NoteScalarWhereWithAggregatesInput | NoteScalarWhereWithAggregatesInput[]
    OR?: NoteScalarWhereWithAggregatesInput[]
    NOT?: NoteScalarWhereWithAggregatesInput | NoteScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Note"> | string
    userId?: StringWithAggregatesFilter<"Note"> | string
    content?: StringWithAggregatesFilter<"Note"> | string
    type?: StringWithAggregatesFilter<"Note"> | string
    url?: StringNullableWithAggregatesFilter<"Note"> | string | null
    title?: StringNullableWithAggregatesFilter<"Note"> | string | null
    summary?: StringNullableWithAggregatesFilter<"Note"> | string | null
    topics?: StringNullableWithAggregatesFilter<"Note"> | string | null
    tags?: StringNullableWithAggregatesFilter<"Note"> | string | null
    embedding?: StringNullableWithAggregatesFilter<"Note"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Note"> | Date | string
    status?: StringWithAggregatesFilter<"Note"> | string
  }

  export type EdgeWhereInput = {
    AND?: EdgeWhereInput | EdgeWhereInput[]
    OR?: EdgeWhereInput[]
    NOT?: EdgeWhereInput | EdgeWhereInput[]
    id?: StringFilter<"Edge"> | string
    sourceId?: StringFilter<"Edge"> | string
    targetId?: StringFilter<"Edge"> | string
    similarity?: FloatFilter<"Edge"> | number
    explanation?: StringFilter<"Edge"> | string
    createdAt?: DateTimeFilter<"Edge"> | Date | string
    source?: XOR<NoteRelationFilter, NoteWhereInput>
    target?: XOR<NoteRelationFilter, NoteWhereInput>
  }

  export type EdgeOrderByWithRelationInput = {
    id?: SortOrder
    sourceId?: SortOrder
    targetId?: SortOrder
    similarity?: SortOrder
    explanation?: SortOrder
    createdAt?: SortOrder
    source?: NoteOrderByWithRelationInput
    target?: NoteOrderByWithRelationInput
  }

  export type EdgeWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    sourceId_targetId?: EdgeSourceIdTargetIdCompoundUniqueInput
    AND?: EdgeWhereInput | EdgeWhereInput[]
    OR?: EdgeWhereInput[]
    NOT?: EdgeWhereInput | EdgeWhereInput[]
    sourceId?: StringFilter<"Edge"> | string
    targetId?: StringFilter<"Edge"> | string
    similarity?: FloatFilter<"Edge"> | number
    explanation?: StringFilter<"Edge"> | string
    createdAt?: DateTimeFilter<"Edge"> | Date | string
    source?: XOR<NoteRelationFilter, NoteWhereInput>
    target?: XOR<NoteRelationFilter, NoteWhereInput>
  }, "id" | "sourceId_targetId">

  export type EdgeOrderByWithAggregationInput = {
    id?: SortOrder
    sourceId?: SortOrder
    targetId?: SortOrder
    similarity?: SortOrder
    explanation?: SortOrder
    createdAt?: SortOrder
    _count?: EdgeCountOrderByAggregateInput
    _avg?: EdgeAvgOrderByAggregateInput
    _max?: EdgeMaxOrderByAggregateInput
    _min?: EdgeMinOrderByAggregateInput
    _sum?: EdgeSumOrderByAggregateInput
  }

  export type EdgeScalarWhereWithAggregatesInput = {
    AND?: EdgeScalarWhereWithAggregatesInput | EdgeScalarWhereWithAggregatesInput[]
    OR?: EdgeScalarWhereWithAggregatesInput[]
    NOT?: EdgeScalarWhereWithAggregatesInput | EdgeScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Edge"> | string
    sourceId?: StringWithAggregatesFilter<"Edge"> | string
    targetId?: StringWithAggregatesFilter<"Edge"> | string
    similarity?: FloatWithAggregatesFilter<"Edge"> | number
    explanation?: StringWithAggregatesFilter<"Edge"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Edge"> | Date | string
  }

  export type NoteCreateInput = {
    id?: string
    userId: string
    content: string
    type?: string
    url?: string | null
    title?: string | null
    summary?: string | null
    topics?: string | null
    tags?: string | null
    embedding?: string | null
    createdAt?: Date | string
    status?: string
    outgoingEdges?: EdgeCreateNestedManyWithoutSourceInput
    incomingEdges?: EdgeCreateNestedManyWithoutTargetInput
  }

  export type NoteUncheckedCreateInput = {
    id?: string
    userId: string
    content: string
    type?: string
    url?: string | null
    title?: string | null
    summary?: string | null
    topics?: string | null
    tags?: string | null
    embedding?: string | null
    createdAt?: Date | string
    status?: string
    outgoingEdges?: EdgeUncheckedCreateNestedManyWithoutSourceInput
    incomingEdges?: EdgeUncheckedCreateNestedManyWithoutTargetInput
  }

  export type NoteUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    url?: NullableStringFieldUpdateOperationsInput | string | null
    title?: NullableStringFieldUpdateOperationsInput | string | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    topics?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: NullableStringFieldUpdateOperationsInput | string | null
    embedding?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    outgoingEdges?: EdgeUpdateManyWithoutSourceNestedInput
    incomingEdges?: EdgeUpdateManyWithoutTargetNestedInput
  }

  export type NoteUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    url?: NullableStringFieldUpdateOperationsInput | string | null
    title?: NullableStringFieldUpdateOperationsInput | string | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    topics?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: NullableStringFieldUpdateOperationsInput | string | null
    embedding?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    outgoingEdges?: EdgeUncheckedUpdateManyWithoutSourceNestedInput
    incomingEdges?: EdgeUncheckedUpdateManyWithoutTargetNestedInput
  }

  export type NoteCreateManyInput = {
    id?: string
    userId: string
    content: string
    type?: string
    url?: string | null
    title?: string | null
    summary?: string | null
    topics?: string | null
    tags?: string | null
    embedding?: string | null
    createdAt?: Date | string
    status?: string
  }

  export type NoteUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    url?: NullableStringFieldUpdateOperationsInput | string | null
    title?: NullableStringFieldUpdateOperationsInput | string | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    topics?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: NullableStringFieldUpdateOperationsInput | string | null
    embedding?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
  }

  export type NoteUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    url?: NullableStringFieldUpdateOperationsInput | string | null
    title?: NullableStringFieldUpdateOperationsInput | string | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    topics?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: NullableStringFieldUpdateOperationsInput | string | null
    embedding?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
  }

  export type EdgeCreateInput = {
    id?: string
    similarity: number
    explanation: string
    createdAt?: Date | string
    source: NoteCreateNestedOneWithoutOutgoingEdgesInput
    target: NoteCreateNestedOneWithoutIncomingEdgesInput
  }

  export type EdgeUncheckedCreateInput = {
    id?: string
    sourceId: string
    targetId: string
    similarity: number
    explanation: string
    createdAt?: Date | string
  }

  export type EdgeUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    similarity?: FloatFieldUpdateOperationsInput | number
    explanation?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    source?: NoteUpdateOneRequiredWithoutOutgoingEdgesNestedInput
    target?: NoteUpdateOneRequiredWithoutIncomingEdgesNestedInput
  }

  export type EdgeUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sourceId?: StringFieldUpdateOperationsInput | string
    targetId?: StringFieldUpdateOperationsInput | string
    similarity?: FloatFieldUpdateOperationsInput | number
    explanation?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EdgeCreateManyInput = {
    id?: string
    sourceId: string
    targetId: string
    similarity: number
    explanation: string
    createdAt?: Date | string
  }

  export type EdgeUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    similarity?: FloatFieldUpdateOperationsInput | number
    explanation?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EdgeUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    sourceId?: StringFieldUpdateOperationsInput | string
    targetId?: StringFieldUpdateOperationsInput | string
    similarity?: FloatFieldUpdateOperationsInput | number
    explanation?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type EdgeListRelationFilter = {
    every?: EdgeWhereInput
    some?: EdgeWhereInput
    none?: EdgeWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type EdgeOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type NoteCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    content?: SortOrder
    type?: SortOrder
    url?: SortOrder
    title?: SortOrder
    summary?: SortOrder
    topics?: SortOrder
    tags?: SortOrder
    embedding?: SortOrder
    createdAt?: SortOrder
    status?: SortOrder
  }

  export type NoteMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    content?: SortOrder
    type?: SortOrder
    url?: SortOrder
    title?: SortOrder
    summary?: SortOrder
    topics?: SortOrder
    tags?: SortOrder
    embedding?: SortOrder
    createdAt?: SortOrder
    status?: SortOrder
  }

  export type NoteMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    content?: SortOrder
    type?: SortOrder
    url?: SortOrder
    title?: SortOrder
    summary?: SortOrder
    topics?: SortOrder
    tags?: SortOrder
    embedding?: SortOrder
    createdAt?: SortOrder
    status?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NoteRelationFilter = {
    is?: NoteWhereInput
    isNot?: NoteWhereInput
  }

  export type EdgeSourceIdTargetIdCompoundUniqueInput = {
    sourceId: string
    targetId: string
  }

  export type EdgeCountOrderByAggregateInput = {
    id?: SortOrder
    sourceId?: SortOrder
    targetId?: SortOrder
    similarity?: SortOrder
    explanation?: SortOrder
    createdAt?: SortOrder
  }

  export type EdgeAvgOrderByAggregateInput = {
    similarity?: SortOrder
  }

  export type EdgeMaxOrderByAggregateInput = {
    id?: SortOrder
    sourceId?: SortOrder
    targetId?: SortOrder
    similarity?: SortOrder
    explanation?: SortOrder
    createdAt?: SortOrder
  }

  export type EdgeMinOrderByAggregateInput = {
    id?: SortOrder
    sourceId?: SortOrder
    targetId?: SortOrder
    similarity?: SortOrder
    explanation?: SortOrder
    createdAt?: SortOrder
  }

  export type EdgeSumOrderByAggregateInput = {
    similarity?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type EdgeCreateNestedManyWithoutSourceInput = {
    create?: XOR<EdgeCreateWithoutSourceInput, EdgeUncheckedCreateWithoutSourceInput> | EdgeCreateWithoutSourceInput[] | EdgeUncheckedCreateWithoutSourceInput[]
    connectOrCreate?: EdgeCreateOrConnectWithoutSourceInput | EdgeCreateOrConnectWithoutSourceInput[]
    createMany?: EdgeCreateManySourceInputEnvelope
    connect?: EdgeWhereUniqueInput | EdgeWhereUniqueInput[]
  }

  export type EdgeCreateNestedManyWithoutTargetInput = {
    create?: XOR<EdgeCreateWithoutTargetInput, EdgeUncheckedCreateWithoutTargetInput> | EdgeCreateWithoutTargetInput[] | EdgeUncheckedCreateWithoutTargetInput[]
    connectOrCreate?: EdgeCreateOrConnectWithoutTargetInput | EdgeCreateOrConnectWithoutTargetInput[]
    createMany?: EdgeCreateManyTargetInputEnvelope
    connect?: EdgeWhereUniqueInput | EdgeWhereUniqueInput[]
  }

  export type EdgeUncheckedCreateNestedManyWithoutSourceInput = {
    create?: XOR<EdgeCreateWithoutSourceInput, EdgeUncheckedCreateWithoutSourceInput> | EdgeCreateWithoutSourceInput[] | EdgeUncheckedCreateWithoutSourceInput[]
    connectOrCreate?: EdgeCreateOrConnectWithoutSourceInput | EdgeCreateOrConnectWithoutSourceInput[]
    createMany?: EdgeCreateManySourceInputEnvelope
    connect?: EdgeWhereUniqueInput | EdgeWhereUniqueInput[]
  }

  export type EdgeUncheckedCreateNestedManyWithoutTargetInput = {
    create?: XOR<EdgeCreateWithoutTargetInput, EdgeUncheckedCreateWithoutTargetInput> | EdgeCreateWithoutTargetInput[] | EdgeUncheckedCreateWithoutTargetInput[]
    connectOrCreate?: EdgeCreateOrConnectWithoutTargetInput | EdgeCreateOrConnectWithoutTargetInput[]
    createMany?: EdgeCreateManyTargetInputEnvelope
    connect?: EdgeWhereUniqueInput | EdgeWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type EdgeUpdateManyWithoutSourceNestedInput = {
    create?: XOR<EdgeCreateWithoutSourceInput, EdgeUncheckedCreateWithoutSourceInput> | EdgeCreateWithoutSourceInput[] | EdgeUncheckedCreateWithoutSourceInput[]
    connectOrCreate?: EdgeCreateOrConnectWithoutSourceInput | EdgeCreateOrConnectWithoutSourceInput[]
    upsert?: EdgeUpsertWithWhereUniqueWithoutSourceInput | EdgeUpsertWithWhereUniqueWithoutSourceInput[]
    createMany?: EdgeCreateManySourceInputEnvelope
    set?: EdgeWhereUniqueInput | EdgeWhereUniqueInput[]
    disconnect?: EdgeWhereUniqueInput | EdgeWhereUniqueInput[]
    delete?: EdgeWhereUniqueInput | EdgeWhereUniqueInput[]
    connect?: EdgeWhereUniqueInput | EdgeWhereUniqueInput[]
    update?: EdgeUpdateWithWhereUniqueWithoutSourceInput | EdgeUpdateWithWhereUniqueWithoutSourceInput[]
    updateMany?: EdgeUpdateManyWithWhereWithoutSourceInput | EdgeUpdateManyWithWhereWithoutSourceInput[]
    deleteMany?: EdgeScalarWhereInput | EdgeScalarWhereInput[]
  }

  export type EdgeUpdateManyWithoutTargetNestedInput = {
    create?: XOR<EdgeCreateWithoutTargetInput, EdgeUncheckedCreateWithoutTargetInput> | EdgeCreateWithoutTargetInput[] | EdgeUncheckedCreateWithoutTargetInput[]
    connectOrCreate?: EdgeCreateOrConnectWithoutTargetInput | EdgeCreateOrConnectWithoutTargetInput[]
    upsert?: EdgeUpsertWithWhereUniqueWithoutTargetInput | EdgeUpsertWithWhereUniqueWithoutTargetInput[]
    createMany?: EdgeCreateManyTargetInputEnvelope
    set?: EdgeWhereUniqueInput | EdgeWhereUniqueInput[]
    disconnect?: EdgeWhereUniqueInput | EdgeWhereUniqueInput[]
    delete?: EdgeWhereUniqueInput | EdgeWhereUniqueInput[]
    connect?: EdgeWhereUniqueInput | EdgeWhereUniqueInput[]
    update?: EdgeUpdateWithWhereUniqueWithoutTargetInput | EdgeUpdateWithWhereUniqueWithoutTargetInput[]
    updateMany?: EdgeUpdateManyWithWhereWithoutTargetInput | EdgeUpdateManyWithWhereWithoutTargetInput[]
    deleteMany?: EdgeScalarWhereInput | EdgeScalarWhereInput[]
  }

  export type EdgeUncheckedUpdateManyWithoutSourceNestedInput = {
    create?: XOR<EdgeCreateWithoutSourceInput, EdgeUncheckedCreateWithoutSourceInput> | EdgeCreateWithoutSourceInput[] | EdgeUncheckedCreateWithoutSourceInput[]
    connectOrCreate?: EdgeCreateOrConnectWithoutSourceInput | EdgeCreateOrConnectWithoutSourceInput[]
    upsert?: EdgeUpsertWithWhereUniqueWithoutSourceInput | EdgeUpsertWithWhereUniqueWithoutSourceInput[]
    createMany?: EdgeCreateManySourceInputEnvelope
    set?: EdgeWhereUniqueInput | EdgeWhereUniqueInput[]
    disconnect?: EdgeWhereUniqueInput | EdgeWhereUniqueInput[]
    delete?: EdgeWhereUniqueInput | EdgeWhereUniqueInput[]
    connect?: EdgeWhereUniqueInput | EdgeWhereUniqueInput[]
    update?: EdgeUpdateWithWhereUniqueWithoutSourceInput | EdgeUpdateWithWhereUniqueWithoutSourceInput[]
    updateMany?: EdgeUpdateManyWithWhereWithoutSourceInput | EdgeUpdateManyWithWhereWithoutSourceInput[]
    deleteMany?: EdgeScalarWhereInput | EdgeScalarWhereInput[]
  }

  export type EdgeUncheckedUpdateManyWithoutTargetNestedInput = {
    create?: XOR<EdgeCreateWithoutTargetInput, EdgeUncheckedCreateWithoutTargetInput> | EdgeCreateWithoutTargetInput[] | EdgeUncheckedCreateWithoutTargetInput[]
    connectOrCreate?: EdgeCreateOrConnectWithoutTargetInput | EdgeCreateOrConnectWithoutTargetInput[]
    upsert?: EdgeUpsertWithWhereUniqueWithoutTargetInput | EdgeUpsertWithWhereUniqueWithoutTargetInput[]
    createMany?: EdgeCreateManyTargetInputEnvelope
    set?: EdgeWhereUniqueInput | EdgeWhereUniqueInput[]
    disconnect?: EdgeWhereUniqueInput | EdgeWhereUniqueInput[]
    delete?: EdgeWhereUniqueInput | EdgeWhereUniqueInput[]
    connect?: EdgeWhereUniqueInput | EdgeWhereUniqueInput[]
    update?: EdgeUpdateWithWhereUniqueWithoutTargetInput | EdgeUpdateWithWhereUniqueWithoutTargetInput[]
    updateMany?: EdgeUpdateManyWithWhereWithoutTargetInput | EdgeUpdateManyWithWhereWithoutTargetInput[]
    deleteMany?: EdgeScalarWhereInput | EdgeScalarWhereInput[]
  }

  export type NoteCreateNestedOneWithoutOutgoingEdgesInput = {
    create?: XOR<NoteCreateWithoutOutgoingEdgesInput, NoteUncheckedCreateWithoutOutgoingEdgesInput>
    connectOrCreate?: NoteCreateOrConnectWithoutOutgoingEdgesInput
    connect?: NoteWhereUniqueInput
  }

  export type NoteCreateNestedOneWithoutIncomingEdgesInput = {
    create?: XOR<NoteCreateWithoutIncomingEdgesInput, NoteUncheckedCreateWithoutIncomingEdgesInput>
    connectOrCreate?: NoteCreateOrConnectWithoutIncomingEdgesInput
    connect?: NoteWhereUniqueInput
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NoteUpdateOneRequiredWithoutOutgoingEdgesNestedInput = {
    create?: XOR<NoteCreateWithoutOutgoingEdgesInput, NoteUncheckedCreateWithoutOutgoingEdgesInput>
    connectOrCreate?: NoteCreateOrConnectWithoutOutgoingEdgesInput
    upsert?: NoteUpsertWithoutOutgoingEdgesInput
    connect?: NoteWhereUniqueInput
    update?: XOR<XOR<NoteUpdateToOneWithWhereWithoutOutgoingEdgesInput, NoteUpdateWithoutOutgoingEdgesInput>, NoteUncheckedUpdateWithoutOutgoingEdgesInput>
  }

  export type NoteUpdateOneRequiredWithoutIncomingEdgesNestedInput = {
    create?: XOR<NoteCreateWithoutIncomingEdgesInput, NoteUncheckedCreateWithoutIncomingEdgesInput>
    connectOrCreate?: NoteCreateOrConnectWithoutIncomingEdgesInput
    upsert?: NoteUpsertWithoutIncomingEdgesInput
    connect?: NoteWhereUniqueInput
    update?: XOR<XOR<NoteUpdateToOneWithWhereWithoutIncomingEdgesInput, NoteUpdateWithoutIncomingEdgesInput>, NoteUncheckedUpdateWithoutIncomingEdgesInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type EdgeCreateWithoutSourceInput = {
    id?: string
    similarity: number
    explanation: string
    createdAt?: Date | string
    target: NoteCreateNestedOneWithoutIncomingEdgesInput
  }

  export type EdgeUncheckedCreateWithoutSourceInput = {
    id?: string
    targetId: string
    similarity: number
    explanation: string
    createdAt?: Date | string
  }

  export type EdgeCreateOrConnectWithoutSourceInput = {
    where: EdgeWhereUniqueInput
    create: XOR<EdgeCreateWithoutSourceInput, EdgeUncheckedCreateWithoutSourceInput>
  }

  export type EdgeCreateManySourceInputEnvelope = {
    data: EdgeCreateManySourceInput | EdgeCreateManySourceInput[]
  }

  export type EdgeCreateWithoutTargetInput = {
    id?: string
    similarity: number
    explanation: string
    createdAt?: Date | string
    source: NoteCreateNestedOneWithoutOutgoingEdgesInput
  }

  export type EdgeUncheckedCreateWithoutTargetInput = {
    id?: string
    sourceId: string
    similarity: number
    explanation: string
    createdAt?: Date | string
  }

  export type EdgeCreateOrConnectWithoutTargetInput = {
    where: EdgeWhereUniqueInput
    create: XOR<EdgeCreateWithoutTargetInput, EdgeUncheckedCreateWithoutTargetInput>
  }

  export type EdgeCreateManyTargetInputEnvelope = {
    data: EdgeCreateManyTargetInput | EdgeCreateManyTargetInput[]
  }

  export type EdgeUpsertWithWhereUniqueWithoutSourceInput = {
    where: EdgeWhereUniqueInput
    update: XOR<EdgeUpdateWithoutSourceInput, EdgeUncheckedUpdateWithoutSourceInput>
    create: XOR<EdgeCreateWithoutSourceInput, EdgeUncheckedCreateWithoutSourceInput>
  }

  export type EdgeUpdateWithWhereUniqueWithoutSourceInput = {
    where: EdgeWhereUniqueInput
    data: XOR<EdgeUpdateWithoutSourceInput, EdgeUncheckedUpdateWithoutSourceInput>
  }

  export type EdgeUpdateManyWithWhereWithoutSourceInput = {
    where: EdgeScalarWhereInput
    data: XOR<EdgeUpdateManyMutationInput, EdgeUncheckedUpdateManyWithoutSourceInput>
  }

  export type EdgeScalarWhereInput = {
    AND?: EdgeScalarWhereInput | EdgeScalarWhereInput[]
    OR?: EdgeScalarWhereInput[]
    NOT?: EdgeScalarWhereInput | EdgeScalarWhereInput[]
    id?: StringFilter<"Edge"> | string
    sourceId?: StringFilter<"Edge"> | string
    targetId?: StringFilter<"Edge"> | string
    similarity?: FloatFilter<"Edge"> | number
    explanation?: StringFilter<"Edge"> | string
    createdAt?: DateTimeFilter<"Edge"> | Date | string
  }

  export type EdgeUpsertWithWhereUniqueWithoutTargetInput = {
    where: EdgeWhereUniqueInput
    update: XOR<EdgeUpdateWithoutTargetInput, EdgeUncheckedUpdateWithoutTargetInput>
    create: XOR<EdgeCreateWithoutTargetInput, EdgeUncheckedCreateWithoutTargetInput>
  }

  export type EdgeUpdateWithWhereUniqueWithoutTargetInput = {
    where: EdgeWhereUniqueInput
    data: XOR<EdgeUpdateWithoutTargetInput, EdgeUncheckedUpdateWithoutTargetInput>
  }

  export type EdgeUpdateManyWithWhereWithoutTargetInput = {
    where: EdgeScalarWhereInput
    data: XOR<EdgeUpdateManyMutationInput, EdgeUncheckedUpdateManyWithoutTargetInput>
  }

  export type NoteCreateWithoutOutgoingEdgesInput = {
    id?: string
    userId: string
    content: string
    type?: string
    url?: string | null
    title?: string | null
    summary?: string | null
    topics?: string | null
    tags?: string | null
    embedding?: string | null
    createdAt?: Date | string
    status?: string
    incomingEdges?: EdgeCreateNestedManyWithoutTargetInput
  }

  export type NoteUncheckedCreateWithoutOutgoingEdgesInput = {
    id?: string
    userId: string
    content: string
    type?: string
    url?: string | null
    title?: string | null
    summary?: string | null
    topics?: string | null
    tags?: string | null
    embedding?: string | null
    createdAt?: Date | string
    status?: string
    incomingEdges?: EdgeUncheckedCreateNestedManyWithoutTargetInput
  }

  export type NoteCreateOrConnectWithoutOutgoingEdgesInput = {
    where: NoteWhereUniqueInput
    create: XOR<NoteCreateWithoutOutgoingEdgesInput, NoteUncheckedCreateWithoutOutgoingEdgesInput>
  }

  export type NoteCreateWithoutIncomingEdgesInput = {
    id?: string
    userId: string
    content: string
    type?: string
    url?: string | null
    title?: string | null
    summary?: string | null
    topics?: string | null
    tags?: string | null
    embedding?: string | null
    createdAt?: Date | string
    status?: string
    outgoingEdges?: EdgeCreateNestedManyWithoutSourceInput
  }

  export type NoteUncheckedCreateWithoutIncomingEdgesInput = {
    id?: string
    userId: string
    content: string
    type?: string
    url?: string | null
    title?: string | null
    summary?: string | null
    topics?: string | null
    tags?: string | null
    embedding?: string | null
    createdAt?: Date | string
    status?: string
    outgoingEdges?: EdgeUncheckedCreateNestedManyWithoutSourceInput
  }

  export type NoteCreateOrConnectWithoutIncomingEdgesInput = {
    where: NoteWhereUniqueInput
    create: XOR<NoteCreateWithoutIncomingEdgesInput, NoteUncheckedCreateWithoutIncomingEdgesInput>
  }

  export type NoteUpsertWithoutOutgoingEdgesInput = {
    update: XOR<NoteUpdateWithoutOutgoingEdgesInput, NoteUncheckedUpdateWithoutOutgoingEdgesInput>
    create: XOR<NoteCreateWithoutOutgoingEdgesInput, NoteUncheckedCreateWithoutOutgoingEdgesInput>
    where?: NoteWhereInput
  }

  export type NoteUpdateToOneWithWhereWithoutOutgoingEdgesInput = {
    where?: NoteWhereInput
    data: XOR<NoteUpdateWithoutOutgoingEdgesInput, NoteUncheckedUpdateWithoutOutgoingEdgesInput>
  }

  export type NoteUpdateWithoutOutgoingEdgesInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    url?: NullableStringFieldUpdateOperationsInput | string | null
    title?: NullableStringFieldUpdateOperationsInput | string | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    topics?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: NullableStringFieldUpdateOperationsInput | string | null
    embedding?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    incomingEdges?: EdgeUpdateManyWithoutTargetNestedInput
  }

  export type NoteUncheckedUpdateWithoutOutgoingEdgesInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    url?: NullableStringFieldUpdateOperationsInput | string | null
    title?: NullableStringFieldUpdateOperationsInput | string | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    topics?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: NullableStringFieldUpdateOperationsInput | string | null
    embedding?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    incomingEdges?: EdgeUncheckedUpdateManyWithoutTargetNestedInput
  }

  export type NoteUpsertWithoutIncomingEdgesInput = {
    update: XOR<NoteUpdateWithoutIncomingEdgesInput, NoteUncheckedUpdateWithoutIncomingEdgesInput>
    create: XOR<NoteCreateWithoutIncomingEdgesInput, NoteUncheckedCreateWithoutIncomingEdgesInput>
    where?: NoteWhereInput
  }

  export type NoteUpdateToOneWithWhereWithoutIncomingEdgesInput = {
    where?: NoteWhereInput
    data: XOR<NoteUpdateWithoutIncomingEdgesInput, NoteUncheckedUpdateWithoutIncomingEdgesInput>
  }

  export type NoteUpdateWithoutIncomingEdgesInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    url?: NullableStringFieldUpdateOperationsInput | string | null
    title?: NullableStringFieldUpdateOperationsInput | string | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    topics?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: NullableStringFieldUpdateOperationsInput | string | null
    embedding?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    outgoingEdges?: EdgeUpdateManyWithoutSourceNestedInput
  }

  export type NoteUncheckedUpdateWithoutIncomingEdgesInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    url?: NullableStringFieldUpdateOperationsInput | string | null
    title?: NullableStringFieldUpdateOperationsInput | string | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    topics?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: NullableStringFieldUpdateOperationsInput | string | null
    embedding?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: StringFieldUpdateOperationsInput | string
    outgoingEdges?: EdgeUncheckedUpdateManyWithoutSourceNestedInput
  }

  export type EdgeCreateManySourceInput = {
    id?: string
    targetId: string
    similarity: number
    explanation: string
    createdAt?: Date | string
  }

  export type EdgeCreateManyTargetInput = {
    id?: string
    sourceId: string
    similarity: number
    explanation: string
    createdAt?: Date | string
  }

  export type EdgeUpdateWithoutSourceInput = {
    id?: StringFieldUpdateOperationsInput | string
    similarity?: FloatFieldUpdateOperationsInput | number
    explanation?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    target?: NoteUpdateOneRequiredWithoutIncomingEdgesNestedInput
  }

  export type EdgeUncheckedUpdateWithoutSourceInput = {
    id?: StringFieldUpdateOperationsInput | string
    targetId?: StringFieldUpdateOperationsInput | string
    similarity?: FloatFieldUpdateOperationsInput | number
    explanation?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EdgeUncheckedUpdateManyWithoutSourceInput = {
    id?: StringFieldUpdateOperationsInput | string
    targetId?: StringFieldUpdateOperationsInput | string
    similarity?: FloatFieldUpdateOperationsInput | number
    explanation?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EdgeUpdateWithoutTargetInput = {
    id?: StringFieldUpdateOperationsInput | string
    similarity?: FloatFieldUpdateOperationsInput | number
    explanation?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    source?: NoteUpdateOneRequiredWithoutOutgoingEdgesNestedInput
  }

  export type EdgeUncheckedUpdateWithoutTargetInput = {
    id?: StringFieldUpdateOperationsInput | string
    sourceId?: StringFieldUpdateOperationsInput | string
    similarity?: FloatFieldUpdateOperationsInput | number
    explanation?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EdgeUncheckedUpdateManyWithoutTargetInput = {
    id?: StringFieldUpdateOperationsInput | string
    sourceId?: StringFieldUpdateOperationsInput | string
    similarity?: FloatFieldUpdateOperationsInput | number
    explanation?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use NoteCountOutputTypeDefaultArgs instead
     */
    export type NoteCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = NoteCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use NoteDefaultArgs instead
     */
    export type NoteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = NoteDefaultArgs<ExtArgs>
    /**
     * @deprecated Use EdgeDefaultArgs instead
     */
    export type EdgeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = EdgeDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}