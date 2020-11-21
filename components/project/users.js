import {useState} from 'react'
import axios from 'axios'
import {mutate} from 'swr'

function ProjectUsers({pid, users}) {
     const [formData, updateFormData] = useState({
          email: ""
     })
     const [status, updateStatus] = useState({
          success: false,
          submitted: false,
          error: ""
     })

     const capitalize = (author) => {
          let temp = author.split(" ");
               temp.forEach((v, i) => {
                    temp[i] = v.replace(/^\w/, c => c.toUpperCase());
               })
          return temp.join(" ");
     }

     const handleChange = (e) => {
          const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value.trim();
          
          updateFormData({
               ...formData,

               [e.target.name]: value
          });
     }

     const handleSubmit = (e) => {
          e.preventDefault();

          axios.put(`/api/projects/${pid}`, {...formData, type: "user"}).then((res) => {
               if (res.status == 202) {
                    updateStatus({
                         submitted: true,
                         success: false,
                         error: res.data
                    });
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
                         "text": "<div class=\"g-mr-20\"><div class=\"noty_body__icon\"><i class=\"hs-admin-check\"></i></div></div><div>"+res.data.title+"<br><b>"+res.data.message+"</b>. </div>",
                         "theme": "unify--v1"
                    }).show();
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
                         "text": "<div class=\"g-mr-20\"><div class=\"noty_body__icon\"><i class=\"hs-admin-check\"></i></div></div><div>Updated Project Information<br>You have successfully added the user to the project.</div>",
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
                    "text": "<div class=\"g-mr-20\"><div class=\"noty_body__icon\"><i class=\"hs-admin-check\"></i></div></div><div>ERROR<br><b>"+err+"</b>. </div>",
                    "theme": "unify--v1"
               }).show();
          });
     }

     const UserGroup = ({usergroup}) => {
          switch(usergroup) {
               case 'admin':
                    return (
                         <>
                              <span className="u-tags-v1 text-center g-width-150--md g-brd-around g-brd-lightred-v3 g-bg-lightred-v3 g-font-size-12 g-font-size-default--md g-color-white g-rounded-50 g-py-4 g-px-15">Admin</span>
                         </>
                    )
                    break;
               case 'dev':
                    return (
                         <>
                              <span className="u-tags-v1 text-center g-width-150--md g-brd-around g-brd-lightblue-v3 g-bg-lightblue-v3 g-font-size-12 g-font-size-default--md g-color-white g-rounded-50 g-py-4 g-px-15">Developer</span>
                         </>
                    )
                    break;
               default:
                    return (
                         <>
                              <span className="u-tags-v1 text-center g-width-150--md g-brd-around g-brd-lightyellow g-bg-lightyellow g-font-size-12 g-font-size-default--md g-color-white g-rounded-50 g-py-4 g-px-15">User</span>
                         </>
                    )
                    break;
          }
     }

     const handleDelete = (e) => {
          e.preventDefault();

          axios.delete(`/api/projects/${pid}?uid=${e.target.name}`, ).then((res) => {
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
                         "text": "<div class=\"g-mr-20\"><div class=\"noty_body__icon\"><i class=\"hs-admin-check\"></i></div></div><div>Updated Project Information<br>You have successfully removed the user from the project.</div>",
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
                    "text": "<div class=\"g-mr-20\"><div class=\"noty_body__icon\"><i class=\"hs-admin-check\"></i></div></div><div>ERROR<br><b>"+err+"</b>. </div>",
                    "theme": "unify--v1"
               }).show();
          });
     }

     return (
          <>
               <header>
                    <h2 className="text-uppercase g-font-size-12 g-font-size-default--md g-color-black mb-0">Project Users</h2>
               </header>

               <hr className="d-flex g-brd-gray-light-v7 g-my-15 g-mt-25--md g-mb-30--md"></hr>
               {
                    users.map((v) => {
                         return (
                              <div className="media-md align-items-center g-mb-30" key={v.uid}>
                                   <div className="d-flex">
                                        <div className="media">
                                             <div className="d-flex align-self-center g-mr-10 g-mr-15--md">
                                                  <img className="g-width-40 g-width-50--md g-height-40 g-height-50--md rounded-circle" src={v.img_url} alt="Uaser Avatar" />
                                             </div>

                                             <div className="media-body align-self-center g-width-100 g-width-auto--md">
                                                  <h3 className="g-font-weight-300 g-font-size-16 g-color-black g-mb-5">{capitalize(v.uname)}</h3>
                                                  <em className="d-inline-block d-md-block w-100 g-width-auto--md g-text-overflow-ellipsis g-font-style-normal g-font-weight-300 g-color-gray-dark-v6">{v.email}</em>
                                             </div>
                                        </div>
                                   </div>

                                   <div className="media-body d-flex justify-content-end g-mt-10">
                                        <div className="g-pos-rel g-z-index-2">
                                             <UserGroup usergroup={v.usergroup} />
                                             <button data-toggle="modal" data-target="#deleteUser" type="button" className="btn btn-md btn-xl--md g-line-height-0 g-font-size-24 g-color-gray-light-v6 g-color-primary--hover">
                                                  <i className="hs-admin-trash g-ml-100 g-top-5"></i>
                                             </button>
                                        </div>
                                   </div>

                                   <div className="modal fade" id="deleteUser" tabIndex="-1" role="dialog" aria-labelledby="deleteUserLabel" aria-hidden="true">
                                        <div className="modal-dialog" role="document">
                                             <div className="modal-content">
                                                  <div className="modal-header">
                                                       <h5 className="modal-title" id="deleteUserLabel">Delete User</h5>
                                                       <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                            <span aria-hidden="true">&times;</span>
                                                       </button>
                                                  </div>
                                                  <div className="modal-body">
                                                       <h3 className="g-font-size-14">Are you sure you would like to delete: {capitalize(v.uname)}</h3>
                                                  </div>
                                                  <div className="modal-footer">
                                                       <button type="button" className="btn btn-secondary" data-dismiss="modal">No</button>
                                                       <button onClick={handleDelete} name={v.uid} data-dismiss="modal" type="button" className="btn btn-primary">Yes</button>
                                                  </div>
                                             </div>
                                        </div>
                                   </div>
                              </div>
                         )
                    })
               }
               <div className="g-my-30">
                    <label className="g-font-weight-300 g-mb-10">Add Users to the Project</label>
                    <input type="text" onChange={handleChange} name="email" className="form-control form-control-md g-brd-gray-light-v7 g-brd-gray-light-v3--focus g-rounded-4 g-px-14 g-py-10" placeholder="Enter a user's email..." />
               </div>

               <button onClick={handleSubmit} className="btn btn-md btn-xl--md u-btn-secondary g-width-145 g-font-size-default--md g-py-12" type="submit">Add User</button>
          </>
     )
}

export default ProjectUsers