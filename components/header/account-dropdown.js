import Link from 'next/link';
import isLoggedIn from '../../pages/api/auth/signedin.js';

function AccountDropDown(props) {
     if (props.user) {
          return (
               <div>
                    <div className="col-auto d-flex g-pt-5 g-pt-0--sm g-pl-10 g-pl-20--sm">
                         <div className="g-pos-rel g-px-10--lg">
                              <span className="g-pos-rel">
                                   <span className="u-badge-v2--xs u-badge--top-right g-hidden-sm-up g-bg-secondary g-mr-5"></span>
                                   <img className="g-width-30 g-width-40--md g-height-30 g-height-40--md rounded-circle g-mr-10--sm" src={props.user.img_url} alt="Image description" />
                              </span>
                              <span className="g-pos-rel g-top-2">
                                   <span className="g-hidden-sm-down">{props.user.fname.replace(/^\w/, c => c.toUpperCase()) + " " + props.user.lname.replace(/^\w/, c => c.toUpperCase())}</span>
                              </span>
                         </div>
                    </div>
               </div>
          );
     } else {
          return (
               <div>
                    <div className="col-auto d-flex g-pt-5 g-pt-0--sm g-pl-10 g-pl-20--sm">
                         <div className="g-pos-rel g-px-10--lg g-top-2">
                              <span className="g-hidden-sm-down"><Link href="/login" passHREF><a>Sign In</a></Link> or <Link href="/signup" passHREF><a>Create an Account</a></Link></span>
                         </div>
                    </div>
               </div>
          );
     }
}

export default AccountDropDown;