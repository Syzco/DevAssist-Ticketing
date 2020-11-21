import Comment from '@Components/project/ticket/comment.js'
import useSWR, {mutate} from 'swr'
import axios from 'axios'
import {useEffect} from 'react'
import $ from 'jquery'
import 'jquery-mousewheel'
import 'malihu-custom-scrollbar-plugin'

function ViewTicket(props) {

          (() => {$('.js-custom-scroll').each(function(i, el){
                         
               var $this = $(el),
                    scrollBar,
                    scrollBarThumb,
                    itemConfig = {
                         scrollInertia: 150,
                         theme: "dark-2",
                         scrollbarPosition: "inside"
                    };
          
          
               $this.mCustomScrollbar(itemConfig);
          
               scrollBar = $this.find('.mCSB_scrollTools');
               scrollBarThumb = $this.find('.mCSB_dragger_bar');
          
               if(scrollBar.length && $this.data('scroll-classes')) {
                    scrollBar.addClass($this.data('scroll-classes'));
               }
          
               if(scrollBarThumb.length && $this.data('scroll-thumb-classes')) {
                    scrollBarThumb.addClass($this.data('scroll-thumb-classes'));
               }
     
          })})();

     let message = "";

     if (props.selected == "" || !props.selected || !props.tickets) { 
          return (
               <>
                    <div className="col-lg-7 g-pos-rel g-min-height-500 g-min-height-200--lg g-pa-15">
                         <div className="g-absolute-centered text-center">
                              <div className="g-pos-rel g-width-80 g-width-130--lg g-height-80 g-height-130--lg g-bg-gray-light-v8 rounded-circle mx-auto g-mb-20">
                                   <i className="hs-admin-comments g-absolute-centered g-font-size-24 g-font-size-32--lg g-color-gray-light-v1"></i>
                              </div>

                              <h5 className="g-font-size-default g-font-size-16--md g-font-weight-300 g-color-black mb-0">Select Ticket to Start Viewing</h5>
                         </div>
                    </div>
               </>
          )
     }

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

          return (((d.getHours()%12 == 0) ? "12" : d.getHours()%12) + ":" + ((Math.floor(parseInt(d.getMinutes())/10) == 0) ? "0"+d.getMinutes() : d.getMinutes()) + " " + ((d.getHours()/12 > 1) ? "pm" : "am") + " on " + d.getMonth() + "-" + d.getDate() + "-" + d.getFullYear());
     }

     const parseSerialized = (text) => {
          return text.replace("&#39;", "'")
     }

     const getTicketComments = (tid) => {
          if (typeof tid == 'undefined') tid = "";
          const fetcher = url => axios.get(url).then(res => res.data);
          const { data, error } = useSWR(`/api/comments?tid=${tid}`, fetcher, {
               revalidateOnMount: true,
               shouldRetryOnError: true,
               initialData: [],
               onSuccess: () => {
                    $('.js-custom-scroll').mCustomScrollbar("update");
               }
          });
     
          return {
               comments: data,
               isLoading: !error && !data,
               isError: error
          }
     }

     let {comments, isLoading, isError} = getTicketComments(props.tickets[props.selected].tid)

     const handleChange = (e) => {
          message = e.target.value
     }

     const handleSubmit = (e) => {
          e.preventDefault();

          if (message != "") {
               axios.post(`/api/comments?tid=${props.tickets[props.selected].tid}`, {comment: message}).then((res) => {
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
                              "text": "<div class=\"g-mr-20\"><div class=\"noty_body__icon\"><i class=\"hs-admin-check\"></i></div></div><div>ERROR: UNKNOWN<br><b>"+res.data+"</b>. </div>",
                              "theme": "unify--v1"
                         }).show();
                    } else if (res.status == 200) {
                         $('.js-custom-scroll').mCustomScrollbar("update");
                         mutate(`/api/comments?tid=${props.tickets[props.selected].tid}`)
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
                    "text": "<div class=\"g-mr-20\"><div class=\"noty_body__icon\"><i class=\"hs-admin-check\"></i></div></div><div>ERROR: MESSAGE EMPTY<br>Your messsage must not be empty. </div>",
                    "theme": "unify--v1"
               }).show();
          }
     }

     if (props.selected && props.tickets) {
          let initialComment = {
               cid: 0,
               updated_at: props.tickets[props.selected].updated_at,
               created_at: props.tickets[props.selected].created_at,
               comment: props.tickets[props.selected].description,
               creator: props.tickets[props.selected].creator,
               creatorName: props.tickets[props.selected].creatorName,
               img_url: props.tickets[props.selected].img_url,
               ticket: props.tickets[props.selected].tid
          }

          return (
               <>
                    <div className="col-lg-7">
                         <header className="g-px-15 g-px-25--lg">
                              <div className="media g-height-50 g-height-80--lg">
                                   <div className="media-body d-flex align-self-center justify-content-between g-font-size-16--md g-color-black">
                                        <div className="d-flex flex-column text-left">
                                             <h3 className="g-font-size-16 g-color-black mb-0">Date Created:</h3>
                                             <p className="g-font-size-12 g-color-black mb-0">{formatTime(props.tickets[props.selected].created_at)}</p>
                                        </div>
                                        <div className="d-flex flex-column">
                                             <h3 className="g-font-size-16 g-color-black mb-0">{parseSerialized(capitalize(props.tickets[props.selected].title))}</h3>
                                             <p className="g-font-size-12 g-color-black mb-0">{"Submitted By: " + capitalize(props.tickets[props.selected].creatorName)}</p>
                                        </div>
                                        <div className="d-flex flex-column text-right">
                                             <h3 className="g-font-size-16 g-color-black mb-0">Last Updated:</h3>
                                             <p className="g-font-size-12 g-color-black mb-0">{formatTime(props.tickets[props.selected].updated_at)}</p>
                                        </div>
                                   </div>
                              </div>
                         </header>

                         <hr className="d-flex g-brd-gray-light-v7 g-mx-15 g-mx-25--lg my-0" />

                         <div className="js-custom-scroll g-height-50vh--lg g-pa-15 g-pa-25--lg">
                              <div>
                                   <Comment info={initialComment} key="0" side={((initialComment.creator == props.user.uid) ? 'right' : 'left')}/>
                                   {comments.map((v, i) => {
                                        return (
                                             <>
                                                  <Comment key={i+1} info={v} side={((v.creator == props.user.uid) ? 'right' : 'left')}/>
                                             </>
                                        )
                                   })}
                              </div>
                         </div>

                         <footer className="g-bg-gray-light-v8 g-px-15 g-px-30--lg g-py-10 g-py-25--lg">
                              <form action="#!">
                                   <div className="media align-items-top">
                                        <div className="media-body g-ml-25">
                                             <textarea onChange={handleChange} className="form-control u-textarea-expandable g-resize-none g-bg-transparent g-brd-none w-100 p-0 g-mt-minus-3" placeholder="Type Something"></textarea>
                                        </div>

                                        <div className="d-flex ml-auto">
                                             <button onClick={handleSubmit} className="btn btn-link d-flex align-self-top align-items-top u-link-v5 g-color-secondary g-color-secondary--hover p-0 g-ml-15">
                                                  <i className="hs-admin-arrow-top-right g-font-size-18 g-line-height-1_4"></i>
                                                  <span className="g-hidden-sm-down g-font-weight-300 g-font-size-12 g-font-size-default--md g-ml-4 g-ml-8--md">Send</span>
                                             </button>
                                        </div>
                                   </div>
                              </form>
                         </footer>
                    </div>
               </>
          )
     }
}

export default ViewTicket;