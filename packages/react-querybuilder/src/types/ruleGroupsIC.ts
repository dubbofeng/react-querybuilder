import type {
  DefaultCombinatorName,
  DefaultRuleGroupArray,
  DefaultRuleGroupType,
  DefaultRuleType,
  RuleGroupArray,
  RuleGroupType,
  RuleType,
} from './ruleGroups';
import type { MappedTuple } from './ruleGroupsIC.utils';

/**
 * The main rule group type when using independent combinators. This type is used
 * for query definitions as well as all sub-groups of queries.
 */
export type RuleGroupTypeIC<R extends RuleType = RuleType, C extends string = string> = Omit<
  RuleGroupType<R, C>,
  'combinator' | 'rules'
> & {
  combinator?: undefined;
  rules: RuleGroupICArray<RuleGroupTypeIC<R, C>, R, C>;
  /**
   * Only used when adding a rule to a query that uses independent combinators
   */
  combinatorPreceding?: C;
};

/**
 * Shorthand for "either {@link RuleGroupType} or {@link RuleGroupTypeIC}".
 */
export type RuleGroupTypeAny<R extends RuleType = RuleType, C extends string = string> =
  | RuleGroupType<R, C>
  | RuleGroupTypeIC<R, C>;

/**
 * The type of the `rules` array in a {@link RuleGroupTypeIC}.
 */
export type RuleGroupICArray<
  RG extends RuleGroupTypeIC = RuleGroupTypeIC,
  R extends RuleType = RuleType,
  C extends string = string
> = [R | RG] | [R | RG, ...MappedTuple<[C, R | RG]>] | ((R | RG)[] & { length: 0 });

/**
 * Shorthand for "either {@link RuleGroupArray} or {@link RuleGroupICArray}".
 */
export type RuleOrGroupArray = RuleGroupArray | RuleGroupICArray;

/**
 * The type of the `rules` array in a {@link DefaultRuleGroupTypeIC}.
 */
export type DefaultRuleGroupICArray<F extends string = string> = RuleGroupICArray<
  DefaultRuleGroupTypeIC<F>,
  DefaultRuleType<F>,
  DefaultCombinatorName
>;

/**
 * Shorthand for "either {@link DefaultRuleGroupArray} or {@link DefaultRuleGroupICArray}".
 */
export type DefaultRuleOrGroupArray<F extends string = string> =
  | DefaultRuleGroupArray<F>
  | DefaultRuleGroupICArray<F>;

/**
 * {@link RuleGroupTypeIC} with combinators limited to
 * {@link DefaultCombinatorName} and rules limited to {@link DefaultRuleType}.
 */
export interface DefaultRuleGroupTypeIC<F extends string = string>
  extends RuleGroupTypeIC<DefaultRuleType<F>> {
  rules: DefaultRuleGroupICArray<F>;
}

/**
 * Shorthand for "either {@link DefaultRuleGroupType} or {@link DefaultRuleGroupTypeIC}".
 */
export type DefaultRuleGroupTypeAny<F extends string = string> =
  | DefaultRuleGroupType<F>
  | DefaultRuleGroupTypeIC<F>;

/**
 * Determines if a type extending {@link RuleGroupTypeAny} is actually
 * {@link RuleGroupType} or {@link RuleGroupTypeIC}.
 */
export type GetRuleGroupType<RG> = RG extends { combinator: string }
  ? RuleGroupType
  : RuleGroupTypeIC;
