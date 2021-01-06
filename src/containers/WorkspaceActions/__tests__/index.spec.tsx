/*
 * Copyright (c) 2018-2020 Red Hat, Inc.
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Contributors:
 *   Red Hat, Inc. - initial API and implementation
 */

import React from 'react';
import { Action, Store } from 'redux';
import { Provider } from 'react-redux';
import { render, RenderResult, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WorkspaceActionsProvider from '../';
import { WorkspaceAction } from '../../../services/helpers/types';
import { ActionContextType, WorkspaceActionsConsumer } from '../context';
import { FakeStoreBuilder } from '../../../store/__mocks__/storeBuilder';
import { createFakeWorkspace } from '../../../store/__mocks__/workspace';
import { ActionCreators } from '../../../store/Workspaces';
import { AppThunk } from '../../../store';

jest.mock('../../../store/Workspaces/index', () => {
  return {
    actionCreators: {
      deleteWorkspace: (id: string): AppThunk<Action, Promise<void>> => async (): Promise<void> => {
        return Promise.resolve();
      },
    } as ActionCreators,
  };
});

describe('Workspace Actions', () => {

  const actionButtonName = 'action-button';
  const valueInputId = 'value-input';
  const defaultWorkspaceId = 'workspace-0';
  const nonExistingWorkspaceId = 'non-existing-workspace';

  const mockOnAction = jest.fn((ctx: ActionContextType, action: WorkspaceAction, id: string) =>
    ctx.handleAction(action, id));

  window.console.warn = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('using without context provider', () => {

    function renderComponent(action: WorkspaceAction): RenderResult {
      const store = createFakeStore();
      return render(
        <Provider store={store}>
          <WorkspaceActionsConsumer>
            {context => (
              <button
                onClick={() => mockOnAction(context, action, 'workspace-0')}
              >
                {actionButtonName}
              </button>
            )}
          </WorkspaceActionsConsumer>
        </Provider>
      );
    }

    it('should drop warning in console', () => {
      renderComponent(WorkspaceAction.ADD_CUSTOM_WORKSPACE);

      const actionButton = screen.getByRole('button');
      userEvent.click(actionButton);

      expect(window.console.warn).toHaveBeenCalledWith(
        expect.stringContaining('not created yet')
      );
    });

  });

  describe('using with context provider', () => {

    function renderComponent(action: WorkspaceAction, id = defaultWorkspaceId) {
      const store = createFakeStore();
      render(
        <Provider store={store}>
          <WorkspaceActionsProvider>
            <WorkspaceActionsConsumer>
              {context => (
                <>
                  <button
                    onClick={() => mockOnAction(context, action, id)}
                  >
                    {actionButtonName}
                  </button>
                  <input
                    data-testid={valueInputId}
                    defaultValue={context.isDeleted.join(',')}
                  />
                </>
              )}
            </WorkspaceActionsConsumer>
          </WorkspaceActionsProvider>
        </Provider>
      );
    }

    it('should warn if workspace is not found', () => {
      renderComponent(WorkspaceAction.ADD_CUSTOM_WORKSPACE, nonExistingWorkspaceId);

      const actionButton = screen.getByRole('button');
      userEvent.click(actionButton);

      expect(window.console.warn).toHaveBeenCalledWith(
        expect.stringMatching(/workspace not found/i)
      );
    });

    it('should warn if unhandled action', () => {
      renderComponent(WorkspaceAction.ADD_CUSTOM_WORKSPACE);

      const actionButton = screen.getByRole('button');
      userEvent.click(actionButton);

      expect(window.console.warn).toHaveBeenCalledWith(
        expect.stringMatching(/unhandled action type/i)
      );
    });

    it('should start deleting a workspace', () => {
      renderComponent(WorkspaceAction.DELETE_WORKSPACE);

      const actionButton = screen.getByRole('button');
      userEvent.click(actionButton);

      const valueInput = screen.getByTestId(valueInputId);
      expect(valueInput).toHaveValue('workspace-0');
    });

    it('should warn if workspace is being deleted', () => {
      renderComponent(WorkspaceAction.DELETE_WORKSPACE);

      const actionButton = screen.getByRole('button');
      userEvent.click(actionButton);
      userEvent.click(actionButton);

      expect(window.console.warn).toHaveBeenCalledWith(
        expect.stringMatching(/workspace.+?is being deleted/i)
      );
    });

  });

});

function createFakeStore(): Store {
  const workspaces = [0, 1, 2, 3, 4].map(i => createFakeWorkspace('workspace-' + i, 'workspace-' + i));
  return new FakeStoreBuilder()
    .withWorkspaces({
      workspaces,
    })
    .build();
}
