const parseSerialized = (text) => {
     return text.replace("&#39;", "'")
}

const formatTime = (time) => {
     let t = time.split(/[- : T Z]/);
     let d = new Date(t[0], t[1], t[2], t[3], t[4], t[5]);

     return (((d.getHours()%12 == 0) ? "12" : d.getHours()%12) + ":" + ((Math.floor(parseInt(d.getMinutes())/10) == 0) ? "0"+d.getMinutes() : d.getMinutes()) + " " + ((d.getHours()/12 > 1) ? "pm" : "am") + " on " + d.getMonth() + "-" + d.getDate() + "-" + d.getFullYear());
}

function Comment({info, side}) {
     //console.log(info)

     if (side == "left") {
          return (
               <>
                    <section className="g-mb-30">
                         <div className="media g-mb-12">
                              <div className="d-flex align-self-end g-mr-12">
                                   <img className="rounded-circle g-width-36 g-height-36" src={info.img_url} alt="Avatar Image" />
                              </div>
                              <div className="media-body">
                                   <div className="d-inline-block g-width-170 g-width-auto--sm g-bg-gray-light-v8 g-font-size-12 g-font-size-default--lg g-color-gray-dark-v6 g-rounded-10 g-pa-10-15">
                                        <p className="mb-0">{parseSerialized(info.comment)}</p>
                                   </div>
                              </div>
                         </div>
                         <em className="d-flex align-self-center align-items-center g-font-style-normal g-color-gray-light-v1 g-ml-50">
                              <i className="hs-admin-time icon-clock g-mr-5"></i>
                              <small>{formatTime(info.updated_at)}</small>
                         </em>
                    </section>
               </>
          )
     } else {
          return (
               <>
                    <section className="g-mb-30">
                         <div className="media g-mb-12">
                              <div className="media-body d-flex align-self-left align-items-center justify-content-end">
                                   <div className="d-inline-block g-width-170 g-width-auto--sm g-bg-lightblue-v6 g-font-size-12 g-font-size-default--lg g-color-gray-dark-v6 g-rounded-10 g-pa-10-15">
                                        <p className="mb-0">{parseSerialized(info.comment)}</p>
                                   </div>
                              </div>
                              <div className="d-flex align-self-end g-ml-12">
                                   <img className="rounded-circle g-width-36 g-height-36" src={info.img_url} alt="Avatar Image" />
                              </div>
                         </div>
                         <em className="d-flex align-self-center align-items-center justify-content-end g-font-style-normal g-color-gray-light-v1 g-mr-50">
                              <i className="hs-admin-time icon-clock g-mr-5"></i>
                              <small>{formatTime(info.updated_at)}</small>
                         </em>
                    </section>
               </>
          )
     }
}

export default Comment