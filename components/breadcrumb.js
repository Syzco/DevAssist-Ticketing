import Link from 'next/link'

function Breadcrumb(props) {

     return (
          <div>
               <div className="g-hidden-sm-down g-bg-gray-light-v8 g-pa-20">
                    <ul className="u-list-inline g-color-gray-dark-v6">
                         {Object.keys(props.list).map((k, i) => {
                              //console.log(k);
                              if (i == Object.keys(props.list).length-1) {
                                   return (
                                        <li className="list-inline-item" key={k}>
                                             <span className="g-valign-middle g-font-size-18">{k}</span>
                                        </li>
                                   )
                              } else {
                                   return (
                                        <li className="list-inline-item g-mr-10" key={k}>
                                             <Link href={props.list[k]} passHREF><a className="u-link-v5 g-color-gray-dark-v6 g-color-secondary--hover g-valign-middle g-font-size-18"> {k}</a></Link>
                                             <i className="hs-admin-angle-right g-font-size-12 g-color-gray-light-v6 g-valign-middle g-ml-10"></i>
                                        </li>
                                   )
                              }
                         })}
                    </ul>
               </div>
          </div>
     )
}

export default Breadcrumb;