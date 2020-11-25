import Head from '@Components/head.js'
import Breadcrumb from '@Components/breadcrumb.js'
import Spinner from '@Components/spinner.js'
import { useRouter } from 'next/router'
import { useState } from 'react'
import useSWR, {mutate} from 'swr'
import axios from 'axios'
import {capitalize, parseSerialized, formatTime} from '@Utils/misc.js'

function NewTicket(props) {
     const router = useRouter()
     const { pid } = router.query

     const [formData, updateFormData] = useState({
          title: "New Ticket",
          description: ""
     })

     const getCurrentProject = (pid) => { 
          if (typeof pid == 'undefined') pid = "";
          const fetcher = url => axios.get(url).then(res => res.data);
          const { data, error } = useSWR(`/api/projects/${pid}`, fetcher, {
               revalidateOnMount: true,
               shouldRetryOnError: false,
               initialData: {
                    title: "",
                    description: "",
                    img_url: "",
                    author: "",
                    created_at: "",
                    updated_at: "",
                    authorName: "",
                    users: []
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
          console.log(isError);
          return (
               <div>
                    <Head title="Loading..." />

                    <Spinner />
               </div>
          )
     }   

     const checkUserExists = (arr, uid) => {
          for (let i = 0; i < arr.length; i++) {
               if (arr[i].uid == uid) {
                    return true
               }
          }
          return false
     }

     if (props.user.usergroup == "user") {
          if (project.author != "") {
               if (project.users.length < 1) {
                    window.location = "/view/projects"
                    return (
                         <div>
                              <Head title="Loading..." />
          
                              <Spinner />
                         </div>
                    )
               } else if (!checkUserExists(project.users, props.user.uid)) {
                    window.location = "/view/projects"
                    return (
                         <div>
                              <Head title="Loading..." />
          
                              <Spinner />
                         </div>
                    )
               }
          }
     }

     if (props.user.usergroup == "dev") {
          if (project.author != "") {
               if (project.author != props.user.uid && !checkUserExists(project.users, props.user.uid)) {
                    window.location = "/view/projects"
                    return (
                         <div>
                              <Head title="Loading..." />
          
                              <Spinner />
                         </div>
                    )
               }
          }
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
               title: formData.title,
               description: formData.description
          }
     }

     const handleSubmit = (e) => {
          e.preventDefault();
          let validation = validateFormData();
          if (validation == true) {
               axios.post(`/api/tickets?pid=${pid}`, formData).then((res) => {
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
                         window.location = `/view/projects/${pid}`;
                         updateStatus({
                              ...status,

                              submitted: true,
                              success: true
                         });
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

     if (project) {
          const breadcrumb = {
               "My Projects": "/view/projects",
               [parseSerialized(capitalize(project.title))]: ("/view/projects/"+pid),
               ["Create New Ticket: " + parseSerialized(capitalize(formData.title))]: ""
          }

          return (
               <div>
                    <Head title={"Create New Ticket - " + parseSerialized(capitalize(formData.title))}/> 

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
                                                            <p className="g-color-black mb-0">{formatTime(project.created_at)}</p>
                                                       </div>

                                                       <div className="col-md-6">
                                                            <h5 className="g-font-size-default g-color-gray-dark-v6 g-mb-5">Last Updated:</h5>
                                                            <p className="g-color-black mb-0">{formatTime(project.updated_at)}</p>
                                                       </div>
                                                  </div>

                                                  <hr className="d-flex g-brd-gray-light-v7 my-10" />

                                                  <div className="d-inline-block g-pos-rel g-mb-20">
                                                       <img className="img-fluid rounded-circle" src={project.img_url} alt="Project Image" />
                                                  </div>

                                                  <h3 className="g-font-weight-300 g-font-size-20 g-color-black mb-10"><b>{capitalize(parseSerialized(project.title))}</b></h3>
                                                  <p className="g-font-size-14 g-color-black">{parseSerialized(project.description)}</p>
                                             </section>

                                             <section className="text-center g-mb-30" >
                                                  <h3 className="g-font-weight-500 g-font-size-20 g-color-black mb-0">Developed By</h3>
                                                  <p className={"g-font-size-16 " + ((props.user.fname + " " + props.user.lname == project.authorName) ?  "g-color-primary" : "g-color-black" )}>{capitalize(project.authorName)}</p>
                                             </section>
                                        </div>
                                   </div>

                                   <div className="col-md-9">
                                        <div className="g-brd-around g-brd-gray-light-v7 g-rounded-4 g-pa-15 g-pa-20--md">
                                             <form className="js-validate">
                                                  <div className="mb-0">
                                                       <header>
                                                            <h2 className="text-uppercase g-font-size-12 g-font-size-default--md g-color-black mb-0">Ticket Information</h2>
                                                       </header>

                                                       <hr className="d-flex g-brd-gray-light-v7 g-my-15 g-my-30--md" />

                                                       <div className="row g-mb-20">
                                                            <div className="col-md-3 align-self-center g-mb-5 g-mb-0--md">
                                                                 <label className="mb-0" htmlFor="#projectTitle">Ticket Title</label>
                                                            </div>

                                                            <div className="col-md-9 align-self-center">
                                                                 <div className="form-group g-pos-rel mb-0">
                                                                      <span className="g-pos-abs g-top-0 g-right-0 d-block g-width-40 h-100 opacity-0 g-opacity-1--success">
                                                                           <i className="hs-admin-check g-absolute-centered g-font-size-default g-color-secondary"></i>
                                                                      </span>
                                                                      <input onChange={handleChange} id="projectTitle" name="title" placeholder={formData.title} className="form-control h-100 form-control-md g-brd-gray-light-v7 g-brd-lightblue-v3--focus g-brd-primary--error g-rounded-4 g-px-20 g-py-12" type="text" data-msg="This field is mandatory" data-error-class="u-has-error-v3" data-success-class="has-success" />
                                                                 </div>
                                                            </div>
                                                       </div>

                                                       <div className="row g-mb-20">
                                                            <div className="col-md-3 align-self-center g-mb-5 g-mb-0--md">
                                                                 <label className="mb-0" htmlFor="#projectDescription">Ticket Description</label>
                                                            </div>

                                                            <div className="col-md-9 align-self-center">
                                                                 <div className="form-group g-pos-rel mb-0">
                                                                      <span className="g-pos-abs g-top-0 g-right-0 d-block g-width-40 h-100 opacity-0 g-opacity-1--success">
                                                                           <i className="hs-admin-check g-absolute-centered g-font-size-default g-color-secondary"></i>
                                                                      </span>
                                                                      <textarea onChange={handleChange} id="projectDescription" name="description" className="form-control u-textarea-expandable g-resize-none g-overflow-hidden h-100 form-control-md g-brd-gray-light-v7 g-brd-lightblue-v3--focus g-brd-primary--error g-rounded-4 g-px-20 g-py-12" rows="5" data-msg="This field is mandatory" data-error-class="u-has-error-v3" data-success-class="has-success" />
                                                                 </div>
                                                            </div>
                                                       </div>                         

                                                       <hr className="d-flex g-brd-gray-light-v7 g-my-15 g-my-30--md" />

                                                       <div>
                                                            <button onClick={handleSubmit} className="btn btn-md btn-xl--md u-btn-secondary g-width-160--md g-font-size-12 g-font-size-default--md g-mb-10" type="button">Save Changes</button>
                                                       </div>
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

export default NewTicket;