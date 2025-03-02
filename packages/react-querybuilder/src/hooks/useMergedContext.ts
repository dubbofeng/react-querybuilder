import { useContext, useMemo } from 'react';
import { QueryBuilderContext, defaultControlElements } from '../components';
import { defaultControlClassnames, defaultTranslations } from '../defaults';
import type {
  Controls,
  Field,
  QueryBuilderContextProps,
  ToFlexibleOption,
  TranslationsFull,
} from '../types';
import { mergeClassnames, mergeTranslations } from '../utils';
import { usePreferProp } from './usePreferProp';

export type UseMergedContextProps<
  F extends ToFlexibleOption<Field> = Field,
  O extends string = string
> = QueryBuilderContextProps<F, O>;

/**
 * Merges inherited context values with props, giving precedence to props.
 */
export const useMergedContext = <
  F extends ToFlexibleOption<Field> = Field,
  O extends string = string
>(
  props: UseMergedContextProps<F, O>
) => {
  const rqbContext = useContext(QueryBuilderContext);

  const enableMountQueryChange = usePreferProp(
    true,
    props.enableMountQueryChange,
    rqbContext.enableMountQueryChange
  );

  // Drag-and-drop should be disabled if context sets it to false because
  // QueryBuilderDnD might not have loaded react-dnd yet. Therefore we prefer
  // the prop here only if context is true or undefined.
  const enableDragAndDrop =
    usePreferProp(false, props.enableDragAndDrop, rqbContext.enableDragAndDrop) &&
    rqbContext.enableDragAndDrop !== false;

  const debugMode = usePreferProp(false, props.debugMode, rqbContext.debugMode);

  const controlClassnames = useMemo(
    () =>
      mergeClassnames(
        defaultControlClassnames,
        rqbContext.controlClassnames,
        props.controlClassnames
      ),
    [rqbContext.controlClassnames, props.controlClassnames]
  );

  const controlElements = useMemo(
    () =>
      ({
        ...defaultControlElements,
        ...rqbContext.controlElements,
        ...props.controlElements,
      } as Controls<F, O>),
    [props.controlElements, rqbContext.controlElements]
  );

  const translations = useMemo(
    () =>
      mergeTranslations(
        defaultTranslations,
        rqbContext.translations,
        props.translations
      ) as TranslationsFull,
    [props.translations, rqbContext.translations]
  );

  const {
    controlClassnames: _controlClassnames,
    controlElements: _controlElements,
    debugMode: _debugMode,
    enableDragAndDrop: _enableDragAndDrop,
    enableMountQueryChange: _enableMountQueryChange,
    translations: _translations,
    ...otherContext
  } = rqbContext;

  return {
    controlClassnames,
    controlElements,
    debugMode,
    enableDragAndDrop,
    enableMountQueryChange,
    translations,
    ...otherContext,
  };
};
