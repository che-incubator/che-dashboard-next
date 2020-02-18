import '@patternfly/react-core/dist/styles/base.css';
import * as React from 'react';
import {Link} from 'react-router-dom';
import * as UserStore from '../store/User';
import * as Gravatar from 'react-gravatar';
import {
    Brand,
    Dropdown,
    DropdownItem,
    DropdownToggle,
    Nav, NavGroup,
    NavItem,
    NavList,
    Page,
    PageHeader,
    PageSidebar,
    Toolbar,
    ToolbarGroup,
    ToolbarItem
} from '@patternfly/react-core';
import accessibleStyles from '@patternfly/react-styles/css/utilities/Accessibility/accessibility';
import {css} from '@patternfly/react-styles';

import './nav-menu.styl';

// At runtime, Redux will merge together...
type NavMenuProps =
    UserStore.UserState // ... state we've requested from the Redux store
    & typeof UserStore.actionCreators // ... plus action creators we've requested
    & {items: { to: string, label?: string }[]} & {children?: React.ReactNode};
// {isDropdownOpen: boolean, activeItem: string}
export class NavMenu extends React.PureComponent<any, any> {
    private onDropdownToggle: (isOpen: boolean) => void;
    private onDropdownSelect: (event: any) => void;
    private onNavSelect: (item: any) => void;


    constructor(props: any) {
        super(props);
        this.state = {
            isDropdownOpen: false,
            activeItem: ''
        };
        this.onDropdownToggle = (isDropdownOpen: any) => {
            this.setState({
                isDropdownOpen
            });
        };
        this.onDropdownSelect = () => {
            this.setState({
                isDropdownOpen: !this.state.isDropdownOpen
            });
        };
        this.onNavSelect = (result: any) => {
            this.setState({
                activeItem: result.itemId
            });
        };
    }

    render() {

        const {isDropdownOpen, activeItem} = this.state;

        const PageNav = (
            <Nav onSelect={this.onNavSelect} aria-label='Nav' theme='dark'>
                <NavList>
                        {this.props.items.map((item: { to: string, label?: string }, index: number) => {
                                if (!item.label) {
                                    return;
                                }
                                return (
                                    <NavItem key={`main_nav_bar_item_${index + 1}`}
                                             itemId={item.to}
                                             isActive={activeItem === item.to}>
                                        <Link to={item.to}>{item.label}</Link>
                                    </NavItem>
                                );
                            }
                        )}
                    <NavGroup title='RECENT WORKSPACES'>
                        {this.props.workspaces.workspaces.map((workspace: any) =>
                            <NavItem>
                                <i className='fa fa-circle-o'>
                                <Link to={`/workspace/${workspace.namespace}/${workspace.devfile.metadata.name}`}>
                                    {workspace.namespace}/{workspace.devfile.metadata.name}
                                </Link>
                                </i>
                            </NavItem>
                        )}
                    </NavGroup>
                </NavList>
            </Nav>
        );

        const userDropdownItems = [
            <DropdownItem key='account_details'>Account details</DropdownItem>,
            <DropdownItem key='account_logout' component='button'>Logout</DropdownItem>
        ];
        const PageToolbar = (
            <Toolbar>
                <ToolbarGroup>
                    <ToolbarItem
                        className={css(
                            accessibleStyles.screenReader,
                            accessibleStyles.visibleOnMd
                        )}
                    >
                        <Dropdown
                            isPlain
                            position='right'
                            onSelect={this.onDropdownSelect}
                            isOpen={isDropdownOpen}
                            toggle={
                                <DropdownToggle onToggle={this.onDropdownToggle}>
                                    {this.props.user ? this.props.user.name : ''}
                                </DropdownToggle>
                            }
                            dropdownItems={userDropdownItems}
                        />
                    </ToolbarItem>
                </ToolbarGroup>
            </Toolbar>
        );

        const Header = (
            <PageHeader
                logo={<Brand src={'.//dashboard/assets/branding/che-logo.svg'} alt='Eclipse CHE'/>}
                toolbar={PageToolbar}
                avatar={<Gravatar email={(this.props.user ? this.props.user.email : '')} className='pf-c-avatar' alt='Avatar image'/>}
                showNavToggle
            />
        );
        const Sidebar = <PageSidebar nav={PageNav} theme='dark'/>;

        return (
            <Page header={Header} sidebar={Sidebar} isManagedSidebar>
                {this.props.children}
            </Page>
        );
    }
}
