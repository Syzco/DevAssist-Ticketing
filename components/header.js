import Link from 'next/link';
import AccountDropdown from './header/account-dropdown.js';

function header(props) {  
     return (
          <div>
               <header id="js-header" className="u-header u-header--sticky-top">
                    <div className="u-header__section u-header__section--admin-dark g-min-height-65">
                         <nav className="navbar no-gutters g-pa-0">
                              <div className="col-auto d-flex flex-nowrap u-header-logo-toggler g-py-12">
                                   <Link href="/" passHREF>
                                        <a className="navbar-brand d-flex align-self-center g-hidden-xs-down g-line-height-1 py-0 g-mt-5">
                                             <img src="/assets/img/logo/logo.png" alt="Logo" style={{width: "90%"}} />
                                        </a>
                                   </Link>
                              </div>
                              {/*<SearchBox />*/}
                              <div className="col-auto d-flex g-py-12 g-pl-40--lg ml-auto">
                                   <AccountDropdown user={props.user}/>
                              </div>
                         </nav>
                    </div>
               </header>
          </div>
     )
}

export default header;