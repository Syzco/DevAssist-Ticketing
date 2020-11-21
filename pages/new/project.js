import Head from '@Components/head.js'
import Breadcrumb from '@Components/breadcrumb.js'
import { useState } from 'react'
import axios from 'axios'

function NewProject(props) {
     if (props.user.usergroup != "dev" && props.user.usergroup != "admin") {
          window.location = "/";
          return (
               <div>
                    <Head title="Unauthorized" />

                    <h1>You do not appear to have access. Sending you back...</h1>
               </div>
          )
     }
     const initialFormData = Object.freeze({
          title: "New Project",
          description: "",
          img_url: "/assets/img-temp/project.jpg"
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
          if (formData.title.length > 255) {
               return "Title is too long!";
          }
          return true;
     }

     const handleSubmit = (e) => {
          e.preventDefault();
          let validation = validateFormData();
          if (validation == true) {
               axios.post(`/api/projects`, formData).then((res) => {
                    if (res.status == 202) {
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
                              "text": "<div class=\"g-mr-20\"><div class=\"noty_body__icon\"><i class=\"hs-admin-check\"></i></div></div><div>ERROR: Unknown<br>Unable to process your request because: <b>You've encountered and unknown error. Please contact our support team.</b>. </div>",
                              "theme": "unify--v1"
                         }).show();
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
                         window.location = "/view/projects"
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
                    "text": "<div class=\"g-mr-20\"><div class=\"noty_body__icon\"><i class=\"hs-admin-check\"></i></div></div><div>ERROR: TITLE TOO LONG<br>Unable to process your request because: <b>"+validation+"</b>. </div>",
                    "theme": "unify--v1"
               }).show();
               updateStatus({
                    submitted: true,
                    success: false,
                    error: validation
               })
          }
     }

     const breadcrumb = {
          "My Projects": "/projects",
          "New Project": ""
     }

     return (
          <div>
               <Head title="New Project"/> 

               <Breadcrumb list={breadcrumb} />

               <div className="col g-ml-45 g-ml-0--lg g-pb-65--md">
                    <div className="g-pa-20">
                         <div className="row">
                              <div className="col-md-3 g-mb-30 g-mb-0--md">
                                   <div className="h-100 g-brd-around g-brd-gray-light-v7 g-rounded-4 g-pa-15 g-pa-20--md">
                                        <section className="text-center g-mb-30 g-mb-50--md">
                                             <div className="d-inline-block g-pos-rel g-mb-20">
                                                  <a className="make-pointer u-badge-v2--lg u-badge--bottom-right g-width-32 g-height-32 g-bg-secondary g-bg-primary--hover g-transition-0_3 g-mb-20 g-mr-20" data-toggle="modal" data-target="#changeImage">
                                                       <i className="hs-admin-pencil g-absolute-centered g-font-size-16 g-color-white"></i>
                                                  </a>
                                                  <img className="img-fluid rounded-circle" src={formData.img_url} alt="Project Image" />
                                             </div>

                                             <div className="modal fade" id="changeImage" tabIndex="-1" role="dialog" aria-labelledby="changeImageLabel" aria-hidden="true">
                                                  <div className="modal-dialog" role="document">
                                                       <div className="modal-content">
                                                            <div className="modal-header">
                                                                 <h5 className="modal-title" id="changeImageLabel">Change Image</h5>
                                                                 <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                                      <span aria-hidden="true">&times;</span>
                                                                 </button>
                                                            </div>
                                                            <div className="modal-body">
                                                                 <h3 className="g-font-size-14">Enter the URL of the image you would like to use for your project:</h3>
                                                                 <form>
                                                                      <input onChange={handleChange} name="img_url" className="form-control g-color-black g-bg-white g-bg-white--focus g-brd-gray-light-v4 g-brd-primary--hover rounded g-py-10 g-px-15 g-rounded-10" type="text" placeholder={formData.img_url} />
                                                                 </form>
                                                            </div>
                                                            <div className="modal-footer">
                                                                 <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                                                 <button data-dismiss="modal" type="button" className="btn btn-primary">Save Changes</button>
                                                            </div>
                                                       </div>
                                                  </div>
                                             </div>
                                             <h3 className="g-font-weight-300 g-font-size-20 g-color-black mb-0">{formData.title}</h3>
                                             <p className="g-font-size-16 g-color-black">{formData.description}</p>
                                        </section>

                                        <section className="text-center g-mb-30 g-mb-50--md" >
                                             <h3 className="g-font-weight-500 g-font-size-20 g-color-black mb-0">Developed By</h3>
                                             <p className="g-font-size-16 g-color-primary">{props.user.fname.replace(/^\w/, c => c.toUpperCase()) + " " + props.user.lname.replace(/^\w/, c => c.toUpperCase())}</p>
                                        </section>
                                   </div>
                              </div>

                              <div className="col-md-9">
                                   <div className="h-100 g-brd-around g-brd-gray-light-v7 g-rounded-4 g-pa-15 g-pa-20--md">
                                        <form className="js-validate">
                                             <header>
                                                  <h2 className="text-uppercase g-font-size-12 g-font-size-default--md g-color-black mb-0">Project Information</h2>
                                             </header>

                                             <hr className="d-flex g-brd-gray-light-v7 g-my-15 g-my-30--md" />

                                             <div className="row g-mb-20">
                                                  <div className="col-md-3 align-self-center g-mb-5 g-mb-0--md">
                                                       <label className="mb-0" htmlFor="#projectTitle">Project Title</label>
                                                  </div>

                                                  <div className="col-md-9 align-self-center">
                                                       <div className="form-group g-pos-rel mb-0">
                                                            <span className="g-pos-abs g-top-0 g-right-0 d-block g-width-40 h-100 opacity-0 g-opacity-1--success">
                                                                 <i className="hs-admin-check g-absolute-centered g-font-size-default g-color-secondary"></i>
                                                            </span>
                                                            <input onChange={handleChange} id="projectTitle" name="title" className="form-control h-100 form-control-md g-brd-gray-light-v7 g-brd-lightblue-v3--focus g-brd-primary--error g-rounded-4 g-px-20 g-py-12" type="text" placeholder="New Project" required="required" data-msg="This field is mandatory" data-error-class="u-has-error-v3" data-success-class="has-success" aria-required="true" />
                                                       </div>
                                                  </div>
                                             </div>

                                             <div className="row g-mb-20">
                                                  <div className="col-md-3 align-self-center g-mb-5 g-mb-0--md">
                                                       <label className="mb-0" htmlFor="#projectDescription">Project Description</label>
                                                  </div>

                                                  <div className="col-md-9 align-self-center">
                                                       <div className="form-group g-pos-rel mb-0">
                                                            <span className="g-pos-abs g-top-0 g-right-0 d-block g-width-40 h-100 opacity-0 g-opacity-1--success">
                                                                 <i className="hs-admin-check g-absolute-centered g-font-size-default g-color-secondary"></i>
                                                            </span>
                                                            <textarea onChange={handleChange} id="projectDescription" name="description" className="form-control u-textarea-expandable g-resize-none g-overflow-hidden h-100 form-control-md g-brd-gray-light-v7 g-brd-lightblue-v3--focus g-brd-primary--error g-rounded-4 g-px-20 g-py-12" rows="5" placeholder="" required="required" data-msg="This field is mandatory" data-error-class="u-has-error-v3" data-success-class="has-success" aria-required="true" />
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

export default NewProject;