import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
const axios = require('axios');
import Head from '@Components/head.js'
import isLoggedIn from './api/auth/signedin.js'
import Spinner from '@Components/spinner.js'

function Signup(props) {
     const router = useRouter();
     const initialFormData = Object.freeze({
          email: "",
          fname: "",
          lname: "",
          pass1: "",
          pass2: "",
          tos: false
     })
     //0 = Unvalidated - 1 = Validated - 2 = Invalid
     const initialValidationData = Object.freeze({
          email: 0,
          fname: 0,
          lname: 0,
          pass1: 0,
          pass2: 0,
          tos: 0
     })

     const [formData, updateFormData] = useState(initialFormData);
     const [validationInfo, updateValidationInfo] = useState(initialValidationData);
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

          validate(e.target.name, value);
     }

     const validate = (name, value) => {
          switch(name) {
               case "email":
                    if (!value.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
                         updateValidationInfo({
                              ...validationInfo,

                              [name]: 2
                         });
                    } else {
                         updateValidationInfo({
                              ...validationInfo,

                              [name]: 1
                         });
                    }
                    break;
               case "fname":
               case "lname":
                    if (!value.match(/[a-zA-Z]\b/)) {
                         updateValidationInfo({
                              ...validationInfo,

                              [name]: 2
                         });
                    } else {
                         updateValidationInfo({
                              ...validationInfo,

                              [name]: 1
                         });
                    }
                    break;
               case "pass1":
                    if (value.length > 30) {
                         updateValidationInfo({
                              ...validationInfo,

                              [name]: 2
                         });
                    } else {
                         updateValidationInfo({
                              ...validationInfo,

                              [name]: 1
                         });
                    }
                    break;
               case "pass2":
                    if (value != formData.pass1) {
                         updateValidationInfo({
                              ...validationInfo,

                              [name]: 2
                         });
                    } else {
                         updateValidationInfo({
                              ...validationInfo,

                              [name]: 1
                         });
                    }
                    break;
               case "tos":
                    if (value == false) {
                         updateValidationInfo({
                              ...validationInfo,

                              [name]: 2
                         });
                    } else {
                         updateValidationInfo({
                              ...validationInfo,

                              [name]: 1
                         });
                    }
                    break;
          }
     }

     const isFilled = (data) => {
          for (let key in data) {
               if (data[key] == 0) {
                    return false;
               }
          }
          return true;
     }

     const isValidated = (data) => {
          for (let key in data) {
               if (data[key] != 1) {
                    return false;
               }
          }

          return true;
     }

     const formatForAPI = (data) => {
          return {
               email: data.email.toLowerCase(),
               fname: data.fname.toLowerCase(),
               lname: data.lname.toLowerCase(),
               pass: data.pass1
          }
     }

     const formatSubmissionError = (msg) => {
          if (msg.match(/ER_DUP_ENTRY/)) {
               return "The email already exists. Please login or try new one.";
          }
          return "Error processing your request. Please try again. If the error persists, please contact our support team.";
     }

     const handleSubmit = (e) => {
          e.preventDefault();

          if (isValidated(validationInfo) && isFilled(validationInfo)) {
               let formattedData = formatForAPI(formData);
               axios.post('/api/signup', formattedData).then((res) => {
                    if (res.status == 202) {
                         updateStatus({
                              submitted: true,
                              success: false,
                              error: formatSubmissionError(res.data)
                         });
                    } else if (res.status == 200) {
                         updateStatus({
                              ...status,

                              submitted: true,
                              success: true
                         });
                         window.location = "/login";
                    }
               }).catch((err) => {
                    return;
               });
          }
     }

     const findError = (data) => {
          let langConv = {
               fname: "First Name",
               lname: "Last Name",
               email: "Email",
               pass1: "Password",
               pass2: "Confirm Password",
               tos: "Terms of Service"
          }
          for (let key in data) {
               if (data[key] == 2) {
                    return "There is an issue with your " + langConv[key] + ". Please try again..";
               }
          }
          return false;
     }

     const ValidationErrorMessage = () => {
          let err = findError(validationInfo);
          if (err != false) {
               return (
                    <>
                         <p className="g-color-red">{err}</p>
                    </>
               )
          }
          return null;
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

     const SuccessState = (props) => {
          if (validationInfo[props.name] == 0) {
               return null;
          }

          if (validationInfo[props.name] == 1) {
               return (
                    <>
                         <span className="g-pos-abs g-top-0 g-right-0 d-block g-width-40 h-100 g-opacity-1--success">
                              <i className="hs-admin-check g-absolute-centered g-font-size-10 g-color-secondary"></i>
                         </span>
                    </>
               )
          }

          return (
               <>
                    <span className="g-pos-abs g-top-0 g-right-0 d-block g-width-40 h-100 g-opacity-1--success">
                         <i className="hs-admin-close g-absolute-centered g-font-size-10 g-color-primary"></i>
                    </span>
               </>
          )
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
                    <Head title="Sign Up" />
                    <section className="container g-py-100">
                         <div className="row justify-content-center">
                              <div className="col-sm-10 col-md-9 col-lg-6">
                                   <div className="g-brd-around g-brd-gray-light-v4 rounded g-py-40 g-px-30">
                                   <header className="text-center mb-4">
                                        <h2 className="h2 g-color-black g-font-weight-600">Signup</h2>
                                        <ValidationErrorMessage />
                                        <SubmittedErrorMessage />
                                   </header>

                                   <form className="g-py-15">
                                        <div className="row">
                                             <div className="col-xs-12 col-sm-6 mb-4">
                                                  <label className="g-color-gray-dark-v2 g-font-weight-600 g-font-size-13">First name:</label>
                                                  <div className="g-pos-rel">
                                                       <SuccessState name="fname" />
                                                       <input onChange={handleChange} name="fname" className="form-control g-color-black g-bg-white g-bg-white--focus g-brd-gray-light-v4 g-brd-primary--hover rounded g-py-10 g-px-15 g-rounded-10" type="text" placeholder="" />
                                                  </div>
                                             </div>

                                             <div className="col-xs-12 col-sm-6 mb-4">
                                                  <label className="g-color-gray-dark-v2 g-font-weight-600 g-font-size-13">Last name:</label>
                                                  <div className="g-pos-rel">
                                                       <SuccessState name="lname" />
                                                       <input onChange={handleChange} name="lname" className="form-control g-color-black g-bg-white g-bg-white--focus g-brd-gray-light-v4 g-brd-primary--hover rounded g-py-10 g-px-15 g-rounded-10" type="text" placeholder="" />
                                                  </div>
                                             </div>
                                        </div>

                                        <div className="mb-4">
                                             <label className="g-color-gray-dark-v2 g-font-weight-600 g-font-size-13">Email (only accepts ".com" emails):</label>
                                             <div className="g-pos-rel">
                                                  <SuccessState name="email" />
                                                  <input onChange={handleChange} name="email" className="form-control g-color-black g-bg-white g-bg-white--focus g-brd-gray-light-v4 g-brd-primary--hover rounded g-py-10 g-px-15 g-rounded-10" type="email" placeholder="" />
                                             </div>
                                        </div>

                                        <div className="row">
                                             <div className="col-xs-12 col-sm-6 mb-4">
                                                  <label className="g-color-gray-dark-v2 g-font-weight-600 g-font-size-13">Password:</label>
                                                  <div className="g-pos-rel">
                                                       <SuccessState name="pass1" />
                                                       <input onChange={handleChange} name="pass1" className="form-control g-color-black g-bg-white g-bg-white--focus g-brd-gray-light-v4 g-brd-primary--hover rounded g-py-10 g-px-15 g-rounded-10" type="password" placeholder="" />
                                                  </div>
                                             </div>

                                             <div className="col-xs-12 col-sm-6 mb-4">
                                                  <label className="g-color-gray-dark-v2 g-font-weight-600 g-font-size-13">Confirm Password:</label>
                                                  <div className="g-pos-rel">
                                                       <SuccessState name="pass2" />
                                                       <input onChange={handleChange} name="pass2" className="form-control g-color-black g-bg-white g-bg-white--focus g-brd-gray-light-v4 g-brd-primary--hover rounded g-py-10 g-px-15 g-rounded-10" type="password" placeholder="" />
                                                  </div>
                                             </div>
                                        </div>

                                        <div className="row justify-content-between mb-5">
                                             <div className="col-8 align-self-center">
                                                  <label className="form-check-inline u-check g-color-gray-dark-v5 g-font-size-13 g-pl-25">
                                                       <input onChange={handleChange} name="tos" checked={formData.tos} className="g-hidden-xs-up g-pos-abs g-top-0 g-left-0" type="checkbox" />
                                                       <div className="u-check-icon-radio-v4 g-absolute-centered--y g-left-0 g-width-18 g-height-18">
                                                            <i className="g-absolute-centered d-block g-width-10 g-height-10 g-bg-primary--checked"></i>
                                                       </div>
                                                       I accept the&nbsp;<Link href="/terms" passHREF><a>Terms and Conditions</a></Link>
                                                  </label>
                                             </div>
                                             <div className="col-4 align-self-center text-right">
                                                  <button onClick={handleSubmit} className="btn btn-md u-btn-primary rounded g-py-13 g-px-25" type="button">Signup</button>
                                             </div>
                                        </div>
                                   </form>
                                   <footer className="text-center">
                                        <p className="g-color-gray-dark-v5 g-font-size-13 mb-0">Already have an account?&nbsp;<Link href="/login" passHREF><a className="g-font-weight-600">Sign In</a></Link></p>
                                   </footer>
                                   </div>
                              </div>
                         </div>
                    </section>
               </div>
          )
     }
}

/*Signup.getInitialProps = async (ctx) => {
     try {
          const cookie = ctx.req.headers.cookie || "";

          let resp = await axios.get("/api/auth", {
               httpsAgent: new https.Agent({ rejectUnauthorized: false }),
               headers: {
                    'cookie': cookie
               }
          });

          if (resp.status != 401 && !ctx.req) {
               window.location = "/";
               return {};
          }

          if (resp.status != 401 && ctx.req) {
               ctx.res.writeHead(302, {
                    Location: '/'
               });
               ctx.res.end();
               return {};
          }

          //console.log(resp)

          return {userData: resp.data};
     } catch (err) {
          if (err.response.status == 401) {
               return {};
          }
     }
}*/

export default Signup;