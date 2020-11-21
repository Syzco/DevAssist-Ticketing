import EditAvatar from '@Components/profile/edit-avatar.js'
import Head from '@Components/head.js'
import Breadcrumb from '@Components/breadcrumb.js'
import Link from 'next/link'
import { useState } from 'react'
import axios from 'axios'

function MyProfile(props) {

     const initialFormData = Object.freeze({
          fname: props.user.fname,
          lname: props.user.lname,
          email: props.user.email,
          confirmEmail: ""
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

     const validateFormData = () => {
          //verify emails match.
          if (formData.email != formData.confirmEmail) {
               return false
          }
          return true
     }

     const parseFormData = () => {
          return {
               fname: formData.fname,
               lname: formData.lname,
               email: formData.email
          }
     }

     const handleSubmit = (e) => {
          e.preventDefault();
          
          if (validateFormData()) {
               axios.put(`/api/users/${props.user.uid}`, parseFormData()).then((res) => {
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
                         window.location = window.location;
                    }
               }).catch((err) => {
                    return;
               });
          } else {
               var newNoty = new Noty({
                    "type": "error",
                    "layout": "topCenter",
                    "timeout": "5000",
                    "animation": {
                         "open": "animated fadeIn",
                         "close": "animated fadeOut"
                    },
                    "closeWith": [
                         "click"
                    ],
                    "text": "<div class=\"g-mr-20\"><div class=\"noty_body__icon\"><i class=\"hs-admin-check\"></i></div></div><div>ERROR: EMAILS DO NOT MATCH<br>Unable to process your request because: <b>emails entered do not match</b>. </div>",
                    "theme": "unify--v1"
               }).show();
          }
     }

     const breadcrumb = {
          "My Profile": ""
     }

     return (
          <div>
               <Head title="My Profile"/> 

               <Breadcrumb list={breadcrumb} />

               <div className="col g-ml-45 g-ml-0--lg g-pb-65--md">
                    <div className="g-pa-20">
                         <div className="row">
                              <div className="col-md-3 g-mb-30 g-mb-0--md">
                                   <div className="h-100 g-brd-around g-brd-gray-light-v7 g-rounded-4 g-pa-15 g-pa-20--md">
                                        <section className="text-center g-mb-30 g-mb-50--md">
                                             <EditAvatar user={props.user} />

                                             <h3 className="g-font-weight-600 g-font-size-20 g-color-black mb-0">{props.user.fname.replace(/^\w/, c => c.toUpperCase()) + " " + props.user.lname.replace(/^\w/, c => c.toUpperCase())}</h3>
                                             <h3 className="g-font-weight-300 g-font-size-16 g-color-primary mb-0">{props.user.usergroup.toUpperCase()}</h3>
                                        </section>
                                   </div>
                              </div>

                              <div className="col-md-9">
                                   <div className="h-100 g-brd-around g-brd-gray-light-v7 g-rounded-4 g-pa-15 g-pa-20--md">
                                        <form className="js-validate">
                                             <header>
                                                  <h2 className="text-uppercase g-font-size-12 g-font-size-default--md g-color-black mb-0">General information</h2>
                                             </header>

                                             <hr className="d-flex g-brd-gray-light-v7 g-my-15 g-my-30--md" />

                                             <div className="row g-mb-20">
                                                  <div className="col-md-3 align-self-center g-mb-5 g-mb-0--md">
                                                       <label className="mb-0" htmlFor="#firstName">First Name</label>
                                                  </div>

                                                  <div className="col-md-9 align-self-center">
                                                       <div className="form-group g-pos-rel mb-0">
                                                            <span className="g-pos-abs g-top-0 g-right-0 d-block g-width-40 h-100 opacity-0 g-opacity-1--success">
                                                                 <i className="hs-admin-check g-absolute-centered g-font-size-default g-color-secondary"></i>
                                                            </span>
                                                            <input onChange={handleChange} id="firstName" name="fname" className="form-control h-100 form-control-md g-brd-gray-light-v7 g-brd-lightblue-v3--focus g-brd-primary--error g-rounded-4 g-px-20 g-py-12" type="text" placeholder={props.user.fname} required="required" data-msg="This field is mandatory" data-error-class="u-has-error-v3" data-success-class="has-success" aria-required="true" />
                                                       </div>
                                                  </div>
                                             </div>

                                             <div className="row g-mb-20">
                                                  <div className="col-md-3 align-self-center g-mb-5 g-mb-0--md">
                                                       <label className="mb-0" htmlFor="#lastName">Last Name</label>
                                                  </div>

                                                  <div className="col-md-9 align-self-center">
                                                       <div className="form-group g-pos-rel mb-0">
                                                            <span className="g-pos-abs g-top-0 g-right-0 d-block g-width-40 h-100 opacity-0 g-opacity-1--success">
                                                            <i className="hs-admin-check g-absolute-centered g-font-size-default g-color-secondary"></i>
                                                            </span>
                                                            <input onChange={handleChange} id="lastName" name="lname" className="form-control h-100 form-control-md g-brd-gray-light-v7 g-brd-lightblue-v3--focus g-brd-primary--error g-rounded-4 g-px-20 g-py-12" type="text" placeholder={props.user.lname} required="required" data-msg="This field is mandatory" data-error-class="u-has-error-v3" data-success-class="has-success" aria-required="true" />
                                                       </div>
                                                  </div>
                                             </div>

                                             <div className="row g-mb-20">
                                                  <div className="col-md-3 align-self-center g-mb-5 g-mb-0--md">
                                                       <label className="mb-0" htmlFor="#email">Email</label>
                                                  </div>

                                                  <div className="col-md-9 align-self-center">
                                                       <div className="form-group g-pos-rel mb-0">
                                                            <span className="g-pos-abs g-top-0 g-right-0 d-block g-width-40 h-100 opacity-0 g-opacity-1--success">
                                                                 <i className="hs-admin-check g-absolute-centered g-font-size-default g-color-secondary"></i>
                                                            </span>
                                                            <input onChange={handleChange} id="email" name="email" className="form-control h-100 form-control-md g-brd-gray-light-v7 g-brd-lightblue-v3--focus g-brd-primary--error g-rounded-4 g-px-20 g-py-12" type="email" placeholder={props.user.email} required="required" data-msg="This field is mandatory" data-error-class="u-has-error-v3" data-success-class="has-success" aria-required="true" />
                                                       </div>
                                                  </div>
                                             </div>

                                             <div className="row g-mb-20">
                                                  <div className="col-md-3 align-self-center g-mb-5 g-mb-0--md">
                                                       <label className="mb-0" htmlFor="#confirmEmail">Confirm Email</label>
                                                  </div>

                                                  <div className="col-md-9 align-self-center">
                                                       <div className="form-group g-pos-rel mb-0">
                                                            <span className="g-pos-abs g-top-0 g-right-0 d-block g-width-40 h-100 opacity-0 g-opacity-1--success">
                                                                 <i className="hs-admin-check g-absolute-centered g-font-size-default g-color-secondary"></i>
                                                            </span>
                                                            <input onChange={handleChange} id="confirmEmail" name="confirmEmail" className="form-control h-100 form-control-md g-brd-gray-light-v7 g-brd-lightblue-v3--focus g-brd-primary--error g-rounded-4 g-px-20 g-py-12" type="email" required="required" data-msg="This field is mandatory" data-error-class="u-has-error-v3" data-success-class="has-success" aria-required="true" />
                                                       </div>
                                                  </div>
                                             </div>                         

                                             <hr className="d-flex g-brd-gray-light-v7 g-my-15 g-my-30--md" />

                                             <div>
                                                  <button onClick={handleSubmit} className="btn btn-md btn-xl--md u-btn-secondary g-width-160--md g-font-size-12 g-font-size-default--md g-mb-10" type="button">Save Changes</button>
                                             </div>
                                        </form> 
                                   </div>
                              </div>
                         </div>
                    </div>
               </div>
          </div>
     )
}

export default MyProfile;