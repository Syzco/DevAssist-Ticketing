import Head from '@Components/head.js'
import Breadcrumb from '@Components/breadcrumb.js'
import Spinner from '@Components/spinner.js'
import ProjectUsers from '@Components/project/users.js'
import { useRouter } from 'next/router'
import { useState } from 'react'
import useSWR, {mutate} from 'swr'
import axios from 'axios'
import {capitalize, parseSerialized, formatTime} from '@Utils/misc.js'

function EditProject(props) {
     if (props.user.usergroup != "dev" && props.user.usergroup != "admin") {
          window.location = "/view/projects";
          return (
               <div>
                    <Head title="Unauthorized" />

                    <h1>You do not appear to have access. Sending you back...</h1>
               </div>
          )
     }
     const router = useRouter()
     const { pid } = router.query

     const [formData, updateFormData] = useState({
          title: "",
          description: "",
          img_url: "",
          author: "",
          created_at: "",
          updated_at: "",
          authorName: "",
          users: []
     })

     const [status, updateStatus] = useState({
          success: false,
          submitted: false,
          error: ""
     })

     const getCurrentProject = (pid) => { 
          if (typeof pid == 'undefined') pid = "";
          const fetcher = url => axios.get(url).then(res => res.data);
          const { data, error } = useSWR(`/api/projects/${pid}`, fetcher, {
               revalidateOnMount: true,
               shouldRetryOnError: true,
               initialData: {
                    title: "",
                    description: "",
                    img_url: "",
                    author: "",
                    created_at: "",
                    updated_at: "",
                    authorName: "",
                    users: []
               },
               onSuccess: (data) => {
                    updateFormData({
                         ...formData,
                         ...data
                    })
               }
          });
     
          return {
               project: data,
               isLoading: !error && !data,
               isError: error
          }
     }

     let {project, isLoading, isError} = getCurrentProject(pid);
     
     if (isLoading) {
          return (
               <div>
                    <Head title="Loading..." />

                    <Spinner />
               </div>
          )
     }

     if (isError && !isLoading) {
          window.location = "/view/projects";
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
          if (formData.title.length > 255) {
               return "Title is too long!";
          }
          return true;
     }

     const parseFormData = () => {
          return {
               type: "info",
               title: formData.title,
               description: formData.description,
               img_url: formData.img_url
          }
     }

     const handleSubmit = (e) => {
          e.preventDefault();
          let validated = validateFormData()
          if (validated == true) {
               axios.put(`/api/projects/${pid}`, parseFormData()).then((res) => {
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
                              "text": "<div class=\"g-mr-20\"><div class=\"noty_body__icon\"><i class=\"hs-admin-check\"></i></div></div><div>Updated Project Information<br>You have successfully updated the project's information.</div>",
                              "theme": "unify--v1"
                         }).show();
                         mutate(`/api/projects/${pid}`)
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
                    "text": "<div class=\"g-mr-20\"><div class=\"noty_body__icon\"><i class=\"hs-admin-check\"></i></div></div><div>ERROR: UNKNOWN<br><b>"+validated+"</b>. </div>",
                    "theme": "unify--v1"
               }).show();
          }
     }

     if (project) {
          const breadcrumb = {
               "My Projects": "/view/projects",
               ["Editing Project: " + parseSerialized(capitalize(project.title))]: ""
          }

          return (
               <div>
                    <Head title={"Edit Project - " + parseSerialized(capitalize(project.title))}/> 

                    <Breadcrumb list={breadcrumb} />

                    <div className="col g-ml-45 g-ml-0--lg g-pb-65--md">
                         <div className="g-pa-20">
                              <div className="row">
                                   <div className="col-md-3 g-mb-30 g-mb-0--md">
                                        <div className="h-100 g-brd-around g-brd-gray-light-v7 g-rounded-4 g-pa-15 g-pa-20--md">
                                             <section className="text-center g-mb-30 g-mb-50--md">

                                                  <div className="row">
                                                       <div className="col-md-6 g-mb-25 g-mb-0--md">
                                                            <h5 className="g-font-size-default g-color-gray-dark-v6 g-mb-5">Created:</h5>
                                                            <p className="g-color-black mb-0">{formatTime(formData.created_at)}</p>
                                                       </div>

                                                       <div className="col-md-6">
                                                            <h5 className="g-font-size-default g-color-gray-dark-v6 g-mb-5">Last Updated:</h5>
                                                            <p className="g-color-black mb-0">{formatTime(formData.updated_at)}</p>
                                                       </div>
                                                  </div>

                                                  <hr className="d-flex g-brd-gray-light-v7 my-10" />

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
                                                  <h3 className="g-font-weight-300 g-font-size-20 g-color-black mb-10"><b>{capitalize(parseSerialized(formData.title))}</b></h3>
                                                  <p className="g-font-size-14 g-color-black">{parseSerialized(formData.description)}</p>
                                             </section>

                                             <section className="text-center g-mb-30" >
                                                  <h3 className="g-font-weight-500 g-font-size-20 g-color-black mb-0">Developed By</h3>
                                                  <p className={"g-font-size-16 " + ((props.user.fname + " " + props.user.lname == formData.authorName) ?  "g-color-primary" : "g-color-black" )}>{capitalize(formData.authorName)}</p>
                                             </section>
                                        </div>
                                   </div>

                                   <div className="col-md-9">
                                        <div className="g-brd-around g-brd-gray-light-v7 g-rounded-4 g-pa-15 g-pa-20--md">
                                             <form className="js-validate">
                                                  <div className="g-mb-60">
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
                                                                      <input onChange={handleChange} id="projectTitle" name="title" className="form-control h-100 form-control-md g-brd-gray-light-v7 g-brd-lightblue-v3--focus g-brd-primary--error g-rounded-4 g-px-20 g-py-12" type="text" placeholder={parseSerialized(capitalize(formData.title))} data-msg="This field is mandatory" data-error-class="u-has-error-v3" data-success-class="has-success" />
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
                                                                      <textarea onChange={handleChange} id="projectDescription" name="description" className="form-control u-textarea-expandable g-resize-none g-overflow-hidden h-100 form-control-md g-brd-gray-light-v7 g-brd-lightblue-v3--focus g-brd-primary--error g-rounded-4 g-px-20 g-py-12" rows="5" placeholder={formData.description} data-msg="This field is mandatory" data-error-class="u-has-error-v3" data-success-class="has-success" />
                                                                 </div>
                                                            </div>
                                                       </div>                         

                                                       <hr className="d-flex g-brd-gray-light-v7 g-my-15 g-my-30--md" />

                                                       <div>
                                                            <button onClick={handleSubmit} className="btn btn-md btn-xl--md u-btn-secondary g-width-160--md g-font-size-12 g-font-size-default--md g-mb-10" type="button">Save Changes</button>
                                                       </div>
                                                  </div>

                                                  <ProjectUsers users={formData.users} pid={pid} />
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

export default EditProject;