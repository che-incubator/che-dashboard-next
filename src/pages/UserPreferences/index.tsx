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

import {
  AlertVariant, Button, ButtonVariant, Checkbox, Modal, ModalVariant, PageSection,
  PageSectionVariants, Tab, Tabs, Text, TextContent, TextVariants, Title,
} from '@patternfly/react-core';
import ExclamationTriangleIcon from '@patternfly/react-icons/dist/js/icons/exclamation-triangle-icon';
import { Table, TableBody, TableHeader } from '@patternfly/react-table';
import { History } from 'history';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import Head from '../../components/Head';
import CheProgress from '../../components/Progress';
import * as styles from '../../components/Workspace/action.module.css';
import { container } from '../../inversify.config';
import { AppAlerts } from '../../services/alerts/appAlerts';
import { AlertItem } from '../../services/helpers/types';
import { ROUTE } from '../../route.enum';
import { AppState } from '../../store';
import * as UserPreferencesStore from '../../store/UserPreferences';

import './UserPreferences.styl';

const DOCKER_REGISTRIES_TAB_KEY = 'docker-registries';

type DockerCredentials = {
  [key: string]: {
    username?: string;
    password?: string;
  }
};

type Registry = {
  url: string;
  username?: string;
  password?: string;
  selected: boolean;
};

type Props = {
  history: History;
}
  & MappedProps;

type State = {
  selectedItems: string[];
  registries: Registry[];
  currentRegistryIndex: number;
  isInfoOpen?: boolean;
  warningInfoCheck?: boolean;
  activeTabKey: string;
}

export class Administration extends React.PureComponent<Props, State> {
  private readonly appAlerts: AppAlerts;
  private readonly actions: any;

  constructor(props: Props) {
    super(props);

    const registries = this.getRegistries();

    this.state = { registries, selectedItems: [], activeTabKey: DOCKER_REGISTRIES_TAB_KEY, currentRegistryIndex: -1 };

    this.appAlerts = container.get(AppAlerts);

    this.actions = [
      {
        title: <a href="#">Link</a>
      },
      {
        title: 'Action'
      },
      {
        isSeparator: true
      },
      {
        title: <a href="#">Separated link</a>
      }
    ];
  }

  private getRegistries(): Registry[] {
    const registries: Registry[] = [];
    const { preferences: { dockerCredentials } } = this.props;
    if (dockerCredentials) {
      const dockerCredentialsObj: DockerCredentials = JSON.parse(atob(dockerCredentials));
      for (const [url, value] of Object.entries(dockerCredentialsObj)) {
        const { username, password } = value || {};
        registries.push({ url, username, password, selected: false });
      }
    }
    return registries;
  }

  private onSelect(isSelected: boolean, rowIndex: number) {
    let registries = [...this.state.registries];
    if (rowIndex === -1) {
      registries = registries.map(registry => {
        registry.selected = isSelected;
        return registry;
      });
      const selectedItems = isSelected ? registries.map(registry => registry.url) : [];
      this.setState({ registries, selectedItems });
    } else {
      registries[rowIndex].selected = isSelected;
      const url = registries[rowIndex].url;
      this.setState((prevState: State) => {
        return {
          registries,
          selectedItems: isSelected
            ? [...prevState.selectedItems, url]
            : prevState.selectedItems.filter(itemUrl => itemUrl !== url)
        };
      });
    }
  }

  public componentDidUpdate(prevProps: Props): void {
    if (prevProps.preferences.dockerCredentials !== this.props.preferences.dockerCredentials) {
      const registries = this.getRegistries();
      this.setState({ registries });
    }
  }

  private showAlert(alert: AlertItem): void {
    this.appAlerts.showAlert(alert);
  }

  private handleTabClick(activeTabKey: React.ReactText): void {
    this.props.history.push(`${ROUTE.USER_PREFERENCES}?tab=${activeTabKey}`);

    this.setState({
      activeTabKey: activeTabKey as string,
    });
  }

  private buildRegistryRow(registry: Registry): React.ReactNodeArray {
    return ([
      <span
        key="host"
        onClick={() => this.props.history.push(registry.url)}
      >
        {registry.url}
      </span>,
      <span
        key="username"
        onClick={() => this.props.history.push(registry.url)}
      >
        {registry.username}
      </span>,
    ]);
  }

  private onEditRegistry(rowIndex: number): void {
    this.setState({ currentRegistryIndex: rowIndex });
  }

  private showOnDeleteRegistryModal(rowIndex: number): void {
    this.setState({ currentRegistryIndex: rowIndex, isInfoOpen: true, warningInfoCheck: false });
  }

  private async onDelete(rowIndex: number): Promise<void> {
    const registries = [...this.state.registries];
    if (rowIndex < 0 || rowIndex >= registries.length) {
      this.showAlert({
        key: 'delete-registry-fail',
        variant: AlertVariant.danger,
        title: 'Unable to find the target registry.',
      });
      return;
    }
    registries.splice(rowIndex, 1);
    this.setState({ isInfoOpen: false, currentRegistryIndex: -1 });
    try {
      await this.saveDockerRegistries(registries);
      this.showAlert({
        key: 'delete-registry-success',
        variant: AlertVariant.success,
        title: 'Registry successfully deleted.',
      });
    } catch (e) {
      this.showAlert({
        key: 'delete-registry-fail',
        variant: AlertVariant.danger,
        title: `Unable to delete the registry. ${e}`,
      });
    }
  }

  private async saveDockerRegistries(registries: Registry[]): Promise<void> {
    const newDockerCredentials: DockerCredentials = {};
    registries.forEach(item => {
      const { url, username, password } = item;
      newDockerCredentials[url] = { username, password };
    });
    const preferences = Object.assign({}, this.props.preferences);
    preferences.dockerCredentials = btoa(JSON.stringify(newDockerCredentials));
    this.props.replaceUserPreferences(preferences);
  }

  private getDeleteModalContent(): React.ReactNode {
    const index = this.state.currentRegistryIndex;
    const registryUrl = index > -1 && index < this.state.registries.length ? `'${this.state.registries[index].url}'` : '';

    return (
      <TextContent>
        <Text>{`Would you like to delete registry ${registryUrl}?`}</Text>
        <Checkbox
          style={{ margin: '0 0 0 0.4rem' }}
          data-testid="warning-info-checkbox"
          isChecked={this.state.warningInfoCheck}
          onChange={() => {
            this.setState({ warningInfoCheck: !this.state.warningInfoCheck });
          }}
          id="delete-warning-info-check"
          label="I understand, this operation cannot be reverted."
        />
      </TextContent>);
  }

  private setInfoModalStatus(isInfoOpen: boolean): void {
    if (this.state.isInfoOpen === isInfoOpen) {
      return;
    }
    this.setState({ isInfoOpen });
  }

  private getInfoModal(): React.ReactNode {
    const { isInfoOpen, warningInfoCheck, currentRegistryIndex } = this.state;

    return (
      <Modal
        header={(
          <span className={styles.infoModalHeader}>
            <ExclamationTriangleIcon />Delete Docker Registry
          </span>)}
        variant={ModalVariant.small}
        isOpen={isInfoOpen}
        onClose={() => this.setInfoModalStatus(false)}
        aria-label="warning-info"
        footer={(
          <React.Fragment>
            <Button variant={ButtonVariant.danger} isDisabled={!warningInfoCheck}
              data-testid="delete-button" onClick={() => this.onDelete(currentRegistryIndex)}>
              Delete
            </Button>
            <Button variant={ButtonVariant.link} data-testid="cancel-button"
              onClick={() => this.setInfoModalStatus(false)}>
              Cancel
            </Button>
          </React.Fragment>)}
      >
        {this.getDeleteModalContent()}
      </Modal>
    );
  }

  render(): React.ReactNode {
    const columns = ['Host', 'Username', 'Actions'];
    const rows = this.state.registries.map(registry => ({
      cells: this.buildRegistryRow(registry),
      selected: registry.selected
    })) || [];
    const actions = [
      {
        title: 'Edit registry',
        onClick: (event, rowIndex) => this.onEditRegistry(rowIndex),
      },
      {
        title: 'Delete registry',
        onClick: (event, rowIndex) => this.showOnDeleteRegistryModal(rowIndex),
      }
    ];

    return (
      <React.Fragment>
        <Head pageName="User Preferences" />
        <PageSection variant={PageSectionVariants.light}>
          <Title headingLevel={'h1'}>User Preferences</Title>
          <TextContent className={'pf-u-mt-0'}>
            <Text component={TextVariants.p}>
              Control the configuration and policies for your installation.
            </Text>
          </TextContent>
        </PageSection>
        <Tabs
          style={{ backgroundColor: 'var(--pf-global--BackgroundColor--100)' }}
          activeKey={this.state.activeTabKey}
          onSelect={(event, tabKey) => this.handleTabClick(tabKey)}>
          <Tab eventKey={DOCKER_REGISTRIES_TAB_KEY} title="Docker Registries">
            <CheProgress isLoading={this.props.isLoading} />
            <PageSection>
              {rows.length === 0 ? (<Text component='p' className='registries-list-empty-state'>
                There are no Docker Registries.
              </Text>) :
                (<React.Fragment>
                  {this.getInfoModal()}
                  <Table cells={columns}
                    actions={actions}
                    rows={rows}
                    onSelect={(event, isSelected, rowIndex) => this.onSelect(isSelected, rowIndex)}
                    canSelectAll={true}
                    aria-label="Docker credentials"
                    variant="compact">
                    <TableHeader />
                    <TableBody />
                  </Table></React.Fragment>)}
            </PageSection>
          </Tab>
        </Tabs>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  branding: state.branding,
  isLoading: state.userPreferences.isLoading,
  preferences: state.userPreferences.preferences,
});

const connector = connect(
  mapStateToProps,
  UserPreferencesStore.actionCreators
);

type MappedProps = ConnectedProps<typeof connector>;
export default connector(Administration);
