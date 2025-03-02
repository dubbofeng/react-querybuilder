import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { TestID } from '../src/defaults';
import type { DragHandleProps, Field, Schema, ToFullOption } from '../src/types';

export const defaultDragHandleProps = {
  level: 1,
  path: [0],
  schema: {} as Schema<ToFullOption<Field>, string>,
  ruleOrGroup: { combinator: 'and', rules: [] },
} satisfies DragHandleProps;

export const testDragHandle = (
  DragHandle: React.ForwardRefExoticComponent<DragHandleProps & React.RefAttributes<any>>
) => {
  const title = DragHandle.displayName ?? 'DragHandle';
  const props = { ...defaultDragHandleProps, title };

  describe(title, () => {
    it('should not render if drag-and-drop is disabled', () => {
      render(<DragHandle {...props} className="foo" />);
      expect(() => screen.getByTestId(TestID.dragHandle)).toThrow();
    });

    it('should have the className passed into the <span />', () => {
      render(<DragHandle {...props} className="foo" />);
      expect(screen.getByTitle(title)).toHaveClass('foo');
    });
  });
};
