import Head from '@Components/head.js'
import Breadcrumb from '@Components/breadcrumb.js'
import Spinner from '@Components/spinner'
import { useRouter } from 'next/router'
import { useState } from 'react'
import useSWR from 'swr'
import axios from 'axios'

function EditProfile() {
     const router = useRouter()
     const { uid } = router.query

     const [formData, updateFormData] = useState({
          fname: "",
          lname: "",
          email: "",
          img_url: "",
          usergroup: "",
          confirmEmail: ""
     })
     const [status, updateStatus] = useState({
          success: false,
          submitted: false,
          error: ""
     })

     const getCurrentUser = (uid) => { 
          const fetcher = url => axios.get(url).then(res => res.data);
          const { data, error } = useSWR(`/api/users/${uid}`, fetcher, {
               revalidateOnMount: true,
               shouldRetryOnError: true,
               initialData: {
                    fname: "",
                    lname: "",
                    usergroup: "",
                    email: "",
                    img_url: ""
               }
          });
     
          return {
               user: data,
               isLoading: !error && !data,
               isError: error
          }
     }

     let {user, isLoading, isError} = getCurrentUser(uid);
     
     if (isLoading) {
          return (
               <div>
                    <Head title="Loading..." />

                    <Spinner />
               </div>
          )
     }

     if (isError && !isLoading) {
          window.location = "/admin";
          return (
               <div>
                    <Head title="Loading..." />

                    <Spinner />
               </div>
          )
     }      

     const handleChange = (e) => {
          const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value.trim();
          
          updateFormData({
               ...formData,

               [e.target.name]: value
          });
     }

     const validateFormData = () => {
          //verify emails match.
          if (user.email != formData.confirmEmail && formData.email != formData.confirmEmail) {
               return false
          }
          
          //Verify new information.
          let newInfo = parseFormData();
          if (Object.keys(newInfo).length < 1) {
               return false
          }
          return newInfo
     }

     const parseFormData = () => {
          Object.keys(formData).forEach((k) => {
               if (formData[k] == "" || formData[k] == user[k] || k == "confirmEmail") {
                    delete formData[k]
               }
          })

          console.log(formData)

          return formData
     }

     const handleSubmit = (e) => {
          e.preventDefault();

          let validated = validateFormData();
          
          if (validated != false) {
               axios.put(`/api/users/${uid}`, validated).then((res) => {
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
                         "text": "<div class=\"g-mr-20\"><div class=\"noty_body__icon\"><i class=\"hs-admin-check\"></i></div></div><div>ERROR: UNKNOWN<br><b>"+err+"</b>. </div>",
                         "theme": "unify--v1"
                    }).show();
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

     if (user) {
          //console.log(user);

          if (status.submitted == true && status.success == false && status.error) {
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
                    "text": "<div class=\"g-mr-20\"><div class=\"noty_body__icon\"><i class=\"hs-admin-check\"></i></div></div><div>ERROR: UNKNOWN<br>Unable to process your request because: <b>"+status.error+"</b>. </div>",
                    "theme": "unify--v1"
               }).show();
          }
          
          if (status.submitted == true && status.success == true) {
               var newNoty = new Noty({
                    "type": "success",
                    "layout": "topCenter",
                    "timeout": "5000",
                    "animation": {
                         "open": "animated fadeIn",
                         "close": "animated fadeOut"
                    },
                    "closeWith": [
                         "click"
                    ],
                    "text": "<div class=\"g-mr-20\"><div class=\"noty_body__icon\"><i class=\"hs-admin-check\"></i></div></div><div>Updated User Information<br>You have successfully updated the user's information.</div>",
                    "theme": "unify--v1"
               }).show();
          }

          const breadcrumb = {
               "Admin": "/admin",
               ["Editing User: " + user.fname.replace(/^\w/, c => c.toUpperCase()) + " " + user.lname.replace(/^\w/, c => c.toUpperCase())]: ""
          }

          return (
               <div>
                    <Head title={"Edit Profile - " + user.fname.replace(/^\w/, c => c.toUpperCase()) + " " + user.lname.replace(/^\w/, c => c.toUpperCase())}/> 

                    <Breadcrumb list={breadcrumb} />

                    <div className="col g-ml-45 g-ml-0--lg g-pb-65--md">
                         <div className="g-pa-20">
                              <div className="row">
                                   <div className="col-md-3 g-mb-30 g-mb-0--md">
                                        <div className="h-100 g-brd-around g-brd-gray-light-v7 g-rounded-4 g-pa-15 g-pa-20--md">
                                             <section className="text-center g-mb-30 g-mb-50--md">
                                                  <div className="d-inline-block g-pos-rel g-mb-20">
                                                       <img className="img-fluid rounded-circle" src={user.img_url} alt="Image Avatar" />
                                                  </div>

                                                  <h3 className="g-font-weight-600 g-font-size-20 g-color-black mb-0">{user.fname.replace(/^\w/, c => c.toUpperCase()) + " " + user.lname.replace(/^\w/, c => c.toUpperCase())}</h3>
                                                  <h3 className="g-font-weight-300 g-font-size-16 g-color-primary mb-0">{user.usergroup.toUpperCase()}</h3>
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
                                                                 <input onChange={handleChange} id="firstName" name="fname" className="form-control h-100 form-control-md g-brd-gray-light-v7 g-brd-lightblue-v3--focus g-brd-primary--error g-rounded-4 g-px-20 g-py-12" type="text" placeholder={user.fname} required="required" data-msg="This field is mandatory" data-error-class="u-has-error-v3" data-success-class="has-success" aria-required="true" />
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
                                                                 <input onChange={handleChange} id="lastName" name="lname" className="form-control h-100 form-control-md g-brd-gray-light-v7 g-brd-lightblue-v3--focus g-brd-primary--error g-rounded-4 g-px-20 g-py-12" type="text" placeholder={user.lname} required="required" data-msg="This field is mandatory" data-error-class="u-has-error-v3" data-success-class="has-success" aria-required="true" />
                                                            </div>
                                                       </div>
                                                  </div>

                                                  <div className="row g-mb-20">
                                                       <div className="col-md-3 align-self-center g-mb-5 g-mb-0--md">
                                                            <label className="mb-0" htmlFor="#img_url">Image URL</label>
                                                       </div>

                                                       <div className="col-md-9 align-self-center">
                                                            <div className="form-group g-pos-rel mb-0">
                                                                 <span className="g-pos-abs g-top-0 g-right-0 d-block g-width-40 h-100 opacity-0 g-opacity-1--success">
                                                                 <i className="hs-admin-check g-absolute-centered g-font-size-default g-color-secondary"></i>
                                                                 </span>
                                                                 <input onChange={handleChange} id="img_url" name="img_url" className="form-control h-100 form-control-md g-brd-gray-light-v7 g-brd-lightblue-v3--focus g-brd-primary--error g-rounded-4 g-px-20 g-py-12" type="text" placeholder={user.img_url} required="required" data-msg="This field is mandatory" data-error-class="u-has-error-v3" data-success-class="has-success" aria-required="true" />
                                                            </div>
                                                       </div>
                                                  </div>

                                                  <div className="row g-mb-20">
                                                       <div className="col-md-3 align-self-center g-mb-5 g-mb-0--md">
                                                            <label className="mb-0" htmlFor="#usergroup">Usergroup</label>
                                                       </div>

                                                       <div className="col-md-9 align-self-center">
                                                            <div className="form-group g-pos-rel mb-0">
                                                                 <label className="form-check-inline u-check g-pl-25">
                                                                      <input onChange={handleChange} name="usergroup" value="user" className="g-hidden-xs-up g-pos-abs g-top-0 g-left-0" type="radio" defaultChecked={user.usergroup == "user" ? true : false}/>
                                                                      <div className="u-check-icon-radio-v4 g-absolute-centered--y g-left-0 g-width-18 g-height-18">
                                                                           <i className="g-absolute-centered d-block g-width-10 g-height-10 g-bg-primary--checked"></i>
                                                                      </div>
                                                                      User
                                                                 </label>

                                                                 <label className="form-check-inline u-check g-pl-25">
                                                                      <input onChange={handleChange} name="usergroup" value="dev" className="g-hidden-xs-up g-pos-abs g-top-0 g-left-0" type="radio" defaultChecked={user.usergroup == "dev" ? true : false}/>
                                                                      <div className="u-check-icon-radio-v4 g-absolute-centered--y g-left-0 g-width-18 g-height-18">
                                                                           <i className="g-absolute-centered d-block g-width-10 g-height-10 g-bg-primary--checked"></i>
                                                                      </div>
                                                                      Developer
                                                                 </label>

                                                                 <label className="form-check-inline u-check g-pl-25">
                                                                      <input onChange={handleChange} name="usergroup" value="admin" className="g-hidden-xs-up g-pos-abs g-top-0 g-left-0" type="radio" defaultChecked={user.usergroup == "admin" ? true : false}/>
                                                                      <div className="u-check-icon-radio-v4 g-absolute-centered--y g-left-0 g-width-18 g-height-18">
                                                                           <i className="g-absolute-centered d-block g-width-10 g-height-10 g-bg-primary--checked"></i>
                                                                      </div>
                                                                      Admin
                                                                 </label>
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
                                                                 <input onChange={handleChange} id="email" name="email" className="form-control h-100 form-control-md g-brd-gray-light-v7 g-brd-lightblue-v3--focus g-brd-primary--error g-rounded-4 g-px-20 g-py-12" type="email" placeholder={user.email} required="required" data-msg="This field is mandatory" data-error-class="u-has-error-v3" data-success-class="has-success" aria-required="true" />
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
}

export default EditProfile;