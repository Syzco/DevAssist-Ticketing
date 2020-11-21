import { useState } from 'react'
import axios from 'axios'

function EditAvatar(props) {
     const initialFormData = Object.freeze({
          img_url: ""
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

          axios.put(`/api/users/${props.user.uid}`, formData).then((res) => {
               if (res.status == 202) {
                    updateStatus({
                         submitted: true,
                         success: false,
                         error: res.data
                    });
                    $('#changeAvatar').modal('show')
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
     }

     return (
          <div>
               <div className="d-inline-block g-pos-rel g-mb-20">
                    <a className="make-pointer u-badge-v2--lg u-badge--bottom-right g-width-32 g-height-32 g-bg-secondary g-bg-primary--hover g-transition-0_3 g-mb-20 g-mr-20" data-toggle="modal" data-target="#changeAvatar">
                         <i className="hs-admin-pencil g-absolute-centered g-font-size-16 g-color-white"></i>
                    </a>
                    <img className="img-fluid rounded-circle" src={props.user.img_url} alt="Image Avatar" />
               </div>

               <div className="modal fade" id="changeAvatar" tabIndex="-1" role="dialog" aria-labelledby="changeAvatarLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                         <div className="modal-content">
                              <div className="modal-header">
                                   <h5 className="modal-title" id="changeAvatarLabel">Change Avatar</h5>
                                   <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                   </button>
                              </div>
                              <div className="modal-body">
                                   <h3 className="g-font-size-14">Enter the URL of the image you would like to use for your profile:</h3>
                                   <form>
                                        <input onChange={handleChange} name="img_url" className="form-control g-color-black g-bg-white g-bg-white--focus g-brd-gray-light-v4 g-brd-primary--hover rounded g-py-10 g-px-15 g-rounded-10" type="text" placeholder={props.user.img_url} />
                                   </form>
                              </div>
                              <div className="modal-footer">
                                   <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                   <button onClick={handleSubmit} data-dismiss="modal" type="button" className="btn btn-primary">Save Changes</button>
                              </div>
                         </div>
                    </div>
               </div>
          </div>
     )

}

export default EditAvatar