import '@Assets/vendor/bootstrap/bootstrap.min.css'
import '@Assets/vendor/icon-line/css/simple-line-icons.css'
import '@Assets/vendor/icon-line-pro/style.css'
import '@Assets/vendor/icon-etlinefont/style.css'
import '@Assets/vendor/icon-hs/style.css'
import '@Assets/vendor/hs-admin-icons/hs-admin-icons.css'
import '@Assets/vendor/animate.css'
import '@Assets/vendor/malihu-scrollbar/jquery.mCustomScrollbar.min.css'
import '@Assets/vendor/flatpickr/dist/css/flatpickr.min.css'
import '@Assets/vendor/fancybox/jquery.fancybox.min.css'
import '@Assets/vendor/noty/lib/noty.css'
import '@Assets/css/style.css'

import Head from '@Components/head.js'
import Scripts from '@Components/scripts.js'
import Header from '@Components/header.js'
import Nav from '@Components/side-nav.js'
import Footer from '@Components/footer.js'
import isLoggedIn from './api/auth/signedin.js'
import Spinner from '@Components/spinner.js'

import { useEffect } from "react";

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
     useEffect(() => {
          import("jquery").then($ => {
               // jQuery must be installed to the `window`:
               window.$ = window.jQuery = $;
               import("popper.js")
               import("bootstrap");
               return;
          });
     }, []);

     let {user, isLoading, isError} = isLoggedIn();

     if (isLoading) {
          return (
               <div>
                    <Head title="Loading..." />

                    <Spinner />
               </div>
          )
     }

     if (isError && !isLoading) {
          if (isError.response) {
               if (isError.response.status == 401) {
                    if (window.location.pathname != "/login" && window.location.pathname != "/signup") {
                         window.location = "/login";
                         return (
                              <div>
                                   <Head title="Loading..." />

                                   <Spinner />
                              </div>
                         )
                    }
               } else {
                    return (
                         <div>
                              <Head title="Error..." />

                              <h1 className="g-pa-20">{isError.response.status}: {isError.response.data}</h1>
                         </div>
                    )
               }
          } else {
               //console.log(isError);
               return (
                    <div>
                         <Head title="Loading..." />

                         <Spinner />
                    </div>
               )
          }
     }

     return (
          <div>
               <Scripts />
               <Header user={user} />
               <main className="container-fluid px-0 g-pt-65">
                    <div className="row no-gutters g-pos-rel g-overflow-x-hidden">
                         <Nav user={user}/>
                         <div className="col g-ml-45 g-ml-0--lg g-pb-65--md">
                              <Component {...pageProps} user={user}/>
                              <Footer />
                         </div>
                    </div>
               </main>
          </div>
     )
}
