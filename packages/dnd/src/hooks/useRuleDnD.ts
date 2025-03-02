import { useRef } from 'react';
import type {
  DndDropTargetType,
  DraggedItem,
  DropCollection,
  DropResult,
  Path,
  QueryActions,
  UseRuleDnD,
} from 'react-querybuilder';
import { getParentPath, isAncestor, pathsAreEqual } from 'react-querybuilder';
import type { QueryBuilderDndContextProps } from '../types';
import { useDragCommon } from './useDragCommon';

type UseRuleDndParams = {
  path: Path;
  disabled?: boolean;
  independentCombinators?: boolean;
} & Pick<QueryActions, 'moveRule'> &
  Pick<QueryBuilderDndContextProps, 'canDrop'> &
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  Pick<typeof import('react-dnd'), 'useDrag' | 'useDrop'>;

const accept: [DndDropTargetType, DndDropTargetType] = ['rule', 'ruleGroup'];

export const useRuleDnD = ({
  path,
  disabled,
  independentCombinators,
  moveRule,
  useDrag,
  useDrop,
  canDrop,
}: UseRuleDndParams): UseRuleDnD => {
  const dndRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<HTMLSpanElement>(null);

  const [{ isDragging, dragMonitorId }, drag, preview] = useDragCommon({
    type: 'rule',
    path,
    disabled,
    independentCombinators,
    moveRule,
    useDrag,
  });

  const [{ isOver, dropMonitorId, dropEffect }, drop] = useDrop<
    DraggedItem,
    DropResult,
    DropCollection
  >(
    () => ({
      accept,
      canDrop: item => {
        if (typeof canDrop === 'function' && !canDrop({ item, path })) {
          return false;
        }
        const parentHoverPath = getParentPath(path);
        const parentItemPath = getParentPath(item.path);
        const hoverIndex = path[path.length - 1];
        const itemIndex = item.path[item.path.length - 1];

        // Don't allow drop if 1) item is ancestor of drop target,
        // or 2) item is hovered over itself or the previous item
        return !(
          isAncestor(item.path, path) ||
          (pathsAreEqual(parentHoverPath, parentItemPath) &&
            (hoverIndex === itemIndex ||
              hoverIndex === itemIndex - 1 ||
              (independentCombinators && hoverIndex === itemIndex - 2)))
        );
      },
      collect: monitor => ({
        isOver: monitor.canDrop() && monitor.isOver(),
        dropMonitorId: monitor.getHandlerId() ?? '',
        dropEffect: (monitor.getDropResult() ?? {}).dropEffect,
      }),
      // `dropEffect` gets added automatically to the object returned from `drop`:
      drop: () => ({ type: 'rule', path }),
    }),
    [disabled, independentCombinators, moveRule, path]
  );

  drag(dragRef);
  preview(drop(dndRef));

  return { isDragging, dragMonitorId, isOver, dropMonitorId, dndRef, dragRef, dropEffect };
};
