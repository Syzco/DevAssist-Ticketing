import Link from 'next/link'
import { useRouter } from 'next/router'

function sideNav(props) {
     const router = useRouter()

     const NavItem = (props) => {
          //let listClassName = ((router.pathname == props.href) ? 'u-sidebar-navigation-v1-menu-item u-side-nav--has-sub-menu u-side-nav--top-level-menu-item u-side-nav-opened has-active' : 'u-sidebar-navigation-v1-menu-item u-side-nav--has-sub-menu u-side-nav--top-level-menu-item u-side-nav-opened');
          let listClassName = 'u-sidebar-navigation-v1-menu-item u-side-nav--has-sub-menu u-side-nav--top-level-menu-item u-side-nav-opened';
          let anchorClassName = ((router.pathname == props.href) ? 'media u-side-nav--top-level-menu-link u-side-nav--hide-on-hidden g-px-15 g-py-12 active active' : 'media u-side-nav--top-level-menu-link u-side-nav--hide-on-hidden g-px-15 g-py-12');
          return (
               <>
                    <li className={listClassName}>
                         <Link href={props.href} passHREF>
                              <a className={anchorClassName}>
                                   <span className="d-flex align-self-center g-pos-rel g-font-size-18 g-mr-18">
                                        <i className={props.icon}></i>
                                   </span>
                                   <span className="media-body align-self-center">{props.title}</span>
                              </a>
                         </Link>
                    </li>
               </>
          )
     }

     const NewProjectOption = (props) => {
          if (props.group == "admin" || props.group == "dev") {
               return (
                    <>
                         <NavItem href="/new/project" icon="hs-admin-plus" title="New Project" />
                    </>
               )
          }
          return null;
     }

     const AdminOption = (props) => {
          if (props.group == "admin") {
               return (
                    <>
                         <NavItem href="/admin" icon="hs-admin-lock" title="Admin" />
                    </>
               )
          }
          return null;
     }

     if (props.user) {
          return (
               <div>
                    <div id="sideNav" className="col-auto u-sidebar-navigation-v1 u-sidebar-navigation--dark">
                         <ul id="sideNavMenu" className="u-sidebar-navigation-v1-menu u-side-nav--top-level-menu g-min-height-100vh mb-0">
                              <NewProjectOption group={props.user.usergroup} />
                              <NavItem href="/view/projects" icon="hs-admin-ruler-pencil" title="My Projects" />
                              <NavItem href="/edit/profile" icon="hs-admin-user" title="My Profile" />
                              <NavItem href="/api/signout" icon="hs-admin-shift-left" title="Sign Out" />
                              <AdminOption group={props.user.usergroup} />
                         </ul>
                    </div>
               </div>
          )
     } else {
          return (
               <div>
                    <div id="sideNav" className="col-auto u-sidebar-navigation-v1 u-sidebar-navigation--dark">
                         <ul id="sideNavMenu" className="u-sidebar-navigation-v1-menu u-side-nav--top-level-menu g-min-height-100vh mb-0">
                              <li className="u-sidebar-navigation-v1-menu-item u-side-nav--has-sub-menu u-side-nav--top-level-menu-item u-side-nav-opened">
                                   <Link href="/login" passHREF>
                                        <a className="media u-side-nav--top-level-menu-link u-side-nav--hide-on-hidden g-px-15 g-py-12">
                                             <span className="d-flex align-self-center g-pos-rel g-font-size-18 g-mr-18">
                                                  <i className="hs-admin-user"></i>
                                             </span>
                                             <span className="media-body align-self-center">Sign In</span>
                                        </a>
                                   </Link>
                              </li>

                              <li className="u-sidebar-navigation-v1-menu-item u-side-nav--has-sub-menu u-side-nav--top-level-menu-item u-side-nav-opened">
                                   <Link href="/signup" passHREF>
                                        <a className="media u-side-nav--top-level-menu-link u-side-nav--hide-on-hidden g-px-15 g-py-12">
                                             <span className="d-flex align-self-center g-pos-rel g-font-size-18 g-mr-18">
                                                  <i className="hs-admin-pencil-alt"></i>
                                             </span>
                                             <span className="media-body align-self-center">Create an Account</span>
                                        </a>
                                   </Link>
                              </li>
                         </ul>
                    </div>
               </div>
          )
     }
}

export default sideNav;