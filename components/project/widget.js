import Link from 'next/link'

function ProjectWidget({user, info}) {

     const capitalize = (author) => {
          let temp = author.split(" ");
               temp.forEach((v, i) => {
                    temp[i] = v.replace(/^\w/, c => c.toUpperCase());
               })
          return temp.join(" ");
     }

     const formatTime = (time) => {
          let t = time.split(/[- : T Z]/);
          let d = new Date(t[0], t[1], t[2], t[3], t[4], t[5]);

          return (((d.getHours()%12 == 0) ? "12" : d.getHours()%12) + ":" + d.getMinutes() + " " + ((d.getHours()/12 > 1) ? "pm" : "am") + " on " + d.getMonth() + "-" + d.getDay() + "-" + d.getFullYear());
     }

     const EditButton = () => {
          if (info.author == (user.fname + " " + user.lname) || user.usergroup == "admin") {
               return (
                    <>
                         <div className="media-body d-flex justify-content-end g-mt-10">
                              <div className="g-pos-rel g-z-index-2">
                                   <Link href={"/edit/projects/" + info.pid} passHREF>
                                        <a id="dropDown1Invoker" className="u-link-v5 g-line-height-0 g-font-size-24 g-color-gray-light-v6 g-color-secondary--hover">
                                             <i className="hs-admin-pencil g-ml-20"></i>
                                        </a>
                                   </Link>
                              </div>
                         </div>
                    </>
               )
          }
          return null;
     }

     const parseSerialized = (text) => {
          return text.replace("&#39;", "'")
     }
     
     return (
          <>
               <div className="col-md-6 col-lg-4 g-mb-30">
                    <div className="card h-100 g-brd-gray-light-v7 rounded">
                         <header className="card-header g-bg-transparent g-brd-bottom-none g-pa-20 g-pa-30--sm g-pb-20--sm">
                              <div className="media g-mb-15">
                                   <Link href={"/view/projects/" + info.pid} passHREF>
                                        <a className="d-flex align-items-center u-link-v5 g-color-black g-color-secondary--hover g-color-secondary--opened">
                                             <img className="g-width-40 g-width-50--md g-height-40 g-height-50--md g-brd-around g-brd-2 g-brd-transparent g-brd-lightblue-v3--parent-opened rounded-circle g-mr-20--sm" src={info.img_url} alt="Project Image" />
                                             <h3 className="g-font-weight-300 g-font-size-20">{parseSerialized(capitalize(info.title))}</h3>
                                        </a>
                                   </Link>

                                   <EditButton />
                              </div>
                              
                              <div className="d-flex align-self-center"><b>Developed By:</b>&nbsp;<span className={(info.author == (user.fname + " " + user.lname) ? "g-color-primary" : "")}>{capitalize(info.author)}</span></div>
                         </header>

                         <hr className="d-flex g-brd-gray-light-v7 g-mx-20 g-mx-30--sm my-0" />

                         <div className="card-block g-px-20 g-px-30--sm g-py-15 g-py-20--sm">
                              <div className="row g-mb-25">
                                   <div className="col-md-6 g-mb-25 g-mb-0--md">
                                        <h5 className="g-font-size-default g-color-gray-dark-v6 g-mb-5">Created:</h5>
                                        <p className="g-color-black mb-0">{formatTime(info.created_at)}</p>
                                   </div>

                                   <div className="col-md-6">
                                        <h5 className="g-font-size-default g-color-gray-dark-v6 g-mb-5">Last Updated:</h5>
                                        <p className="g-color-black mb-0">{formatTime(info.updated_at)}</p>
                                   </div>
                              </div>
                         </div>
                    </div>
               </div>
          </>
     )
}

export default ProjectWidget