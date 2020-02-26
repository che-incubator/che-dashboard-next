import accessibleStyles from '@patternfly/react-styles/css/utilities/Accessibility/accessibility';
import '@patternfly/react-core/dist/styles/base.css';
import * as React from 'react';
import {Link} from 'react-router-dom';
import * as Gravatar from 'react-gravatar';
import {css} from '@patternfly/react-styles';
import {
    Brand,
    Dropdown,
    DropdownItem,
    DropdownToggle,
    Nav,
    NavGroup,
    NavItem,
    NavList,
    Page,
    PageHeader,
    PageSidebar,
    Toolbar,
    ToolbarGroup,
    ToolbarItem
} from '@patternfly/react-core';
import './nav-menu.styl';

const THEME = 'dark';

type INavItem = { to: string, label?: string, ico?: string };

export class NavMenu extends React.PureComponent<any, any> {
    private readonly onDropdownToggle: (isOpen: boolean) => void;
    private readonly onDropdownSelect: (event: any) => void;
    private readonly onNavSelect: (item: any) => void;

    constructor(props: any) {
        super(props);

        this.state = {isDropdownOpen: false, activeItem: ''};
        this.onDropdownToggle = (isDropdownOpen: any) => {
            this.setState({isDropdownOpen})
        };
        this.onDropdownSelect = () => {
            this.setState({isDropdownOpen: !this.state.isDropdownOpen})
        };
        this.onNavSelect = (result: any) => {
            this.setState({activeItem: result.itemId})
        };
    }

    render() {
        const {isDropdownOpen, activeItem} = this.state;

        // create a Sidebar
        const PageNav = (
            <Nav onSelect={this.onNavSelect} aria-label='Nav' theme={THEME}>
                <NavList>
                    {this.props.items.filter((item: INavItem) => !!item.label).map((item: INavItem, index: number) => (
                        <NavItem key={`main_nav_bar_item_${index + 1}`}
                                 itemId={item.to}
                                 isActive={activeItem === item.to}>
                            <Link to={item.to}><i className={item.ico}>&nbsp;&nbsp;</i>{item.label}</Link>
                        </NavItem>
                    ))}
                    <NavGroup title='RECENT WORKSPACES'>
                        <NavItem>
                            <Link to={this.props.creationLink}>
                                <i className='fa fa-plus'>&nbsp;&nbsp;</i>
                                Create Workspace
                            </Link>
                        </NavItem>
                        {this.props.workspaces.map((workspace: any, index: number) =>
                            <NavItem key={`nav_bar_sub_item_${index + 1}`}>
                                <Link to={`/ide/${workspace.namespace}/${workspace.devfile.metadata.name}`}>
                                    <i className='fa fa-circle-o'>&nbsp;&nbsp;</i>
                                    {workspace.namespace}/{workspace.devfile.metadata.name}
                                </Link>
                            </NavItem>
                        )}
                    </NavGroup>
                </NavList>
            </Nav>
        );
        const Sidebar = <PageSidebar nav={PageNav} theme={THEME}/>;

        // create a Header
        const UserDropdownItems = [
            <DropdownItem key='account_details'>Account details</DropdownItem>,
            <DropdownItem key='account_logout' component='button'>Logout</DropdownItem>
        ];
        const UserDropdownToggle = (<DropdownToggle onToggle={this.onDropdownToggle}>
            {this.props.user ? this.props.user.name : ''}
        </DropdownToggle>);
        const PageToolbar = (
            <Toolbar>
                <ToolbarGroup>
                    <ToolbarItem className={css(accessibleStyles.screenReader, accessibleStyles.visibleOnMd)}>
                        <Dropdown toggle={UserDropdownToggle} isOpen={isDropdownOpen} isPlain position='right'
                                  dropdownItems={UserDropdownItems} onSelect={this.onDropdownSelect}/>
                    </ToolbarItem>
                </ToolbarGroup>
            </Toolbar>
        );
        const Avatar = <Gravatar email={(this.props.user ? this.props.user.email : '')} className='pf-c-avatar'/>;
        const Logo = <Brand src={`./${this.props.logoURL}`} alt=''/>;
        const Header = <PageHeader showNavToggle logo={Logo} avatar={Avatar} toolbar={PageToolbar}/>;

        return (
            // create a Page
            <Page header={Header} sidebar={Sidebar} isManagedSidebar>
                {this.props.children}
            </Page>
        );
    }
}
