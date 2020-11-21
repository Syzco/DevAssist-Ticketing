import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
const axios = require('axios');
import Head from '@Components/head.js'
import Spinner from '@Components/spinner.js'

function Signin(props) {
     const router = useRouter();
     const initialFormData = Object.freeze({
          email: "",
          pass: ""
     })
     const [formData, updateFormData] = useState(initialFormData);
     const [status, updateStatus] = useState({
          success: false,
          submitted: false,
          error: ""
     })

     const handleChange = (e) => {
          const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value.trim();
          
          updateFormData({
               ...formData,

               [e.target.name]: value
          });
     }

     const handleSubmit = (e) => {
          e.preventDefault();

          axios.post('/api/login', formData).then((res) => {
               if (res.status == 202) {
                    updateStatus({
                         submitted: true,
                         success: false,
                         error: res.data
                    });
               } else if (res.status == 200) {
                    updateStatus({
                         ...status,

                         submitted: true,
                         success: true
                    });
                    window.location = '/';
               }
          }).catch((err) => {
               return;
          });
     }

     const SubmittedErrorMessage = () => {
          if (status.submitted && !status.success && status.error != "") {
               return (
                    <>
                         <p className="g-color-red">{status.error}</p>
                    </>
               )
          }
          return null;
     }

     if (props.user) {
          window.location = '/';
          return (
               <div>
                    <Head title="Invalid Request - Redirecting..." />

                    <Spinner />
               </div>
          )
     }
     
     if (!props.user) {
          return (
               <div>
                    <Head title="Log in" />

                    <section className="container g-py-100">
                         <div className="row justify-content-center">
                              <div className="col-sm-8 col-lg-5">
                                   <div className="g-brd-around g-brd-gray-light-v4 rounded g-py-40 g-px-30">
                                        <header className="text-center mb-4">
                                             <h2 className="h2 g-color-black g-font-weight-600">Login</h2>
                                             <SubmittedErrorMessage />
                                        </header>

                                        <form className="g-py-15">
                                             <div className="mb-4">
                                                  <label className="g-color-gray-dark-v2 g-font-weight-600 g-font-size-13">Email:</label>
                                                  <input onChange={handleChange} name="email" className="form-control g-color-black g-bg-white g-bg-white--focus g-brd-gray-light-v4 g-brd-primary--hover rounded g-py-10 g-px-15 g-rounded-10" type="email" placeholder="Email" />
                                             </div>

                                             <div className="g-mb-15">
                                                  <div className="row justify-content-between">
                                                       <div className="col align-self-center">
                                                            <label className="g-color-gray-dark-v2 g-font-weight-600 g-font-size-13">Password:</label>
                                                       </div>
                                                  </div>
                                                  <input onChange={handleChange} name="pass" className="form-control g-color-black g-bg-white g-bg-white--focus g-brd-gray-light-v4 g-brd-primary--hover rounded g-py-10 g-px-15 mb-3 g-rounded-10" type="password" placeholder="Password" />
                                                  <div className="row justify-content-center g-pt-15">
                                                       <div className="col-4 align-self-center text-right">
                                                            <button onClick={handleSubmit} className="btn btn-md u-btn-primary rounded g-py-13 g-px-25" type="button">Sign In</button>
                                                       </div>
                                                  </div>
                                             </div>
                                        </form>

                                        <footer className="text-center">
                                             <p className="g-color-gray-dark-v5 g-font-size-13 mb-0">Don't have an account?&nbsp;<Link href="/signup" passHREF><a className="g-font-weight-600">Sign Up</a></Link></p>
                                        </footer>
                                   </div>
                              </div>
                         </div>
                    </section>
               </div>
          )
     }
}

export default Signin;