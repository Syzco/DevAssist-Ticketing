import Spinner from '@Components/spinner.js'
import {useEffect} from 'react'
import $ from 'jquery'
import 'jquery-mousewheel'
import 'malihu-custom-scrollbar-plugin'

function TicketScroll(props) {

     if (props.loading || !props.tickets) {
          return (
               <div>
                    <div className="col-lg-5 w-100 g-brd-right--lg g-brd-gray-light-v7">
                         <div className="js-custom-scroll-horizontal js-custom-scroll g-height-59_5vh--lg">
                              <div className="d-flex d-lg-block g-brd-bottom g-brd-none--lg g-brd-gray-light-v4 g-overflow-x-auto">
                                   <Spinner />
                              </div>
                         </div>
                    </div>
               </div>
          )
     }

     const capitalize = (author) => {
          let temp = author.split(" ");
               temp.forEach((v, i) => {
                    temp[i] = v.replace(/^\w/, c => c.toUpperCase());
               })
          return temp.join(" ");
     }

     useEffect(() => {
          $('.js-custom-scroll').each(function(i, el){
               
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
     
          });

     }, [])

     const formatTime = (time) => {
          let t = time.split(/[- : T Z]/);
          let d = new Date(t[0], t[1], t[2], t[3], t[4], t[5]);

          return (((d.getHours()%12 == 0) ? "12" : d.getHours()%12) + ":" + ((Math.floor(parseInt(d.getMinutes())/10) == 0) ? "0"+d.getMinutes() : d.getMinutes()) + " " + ((d.getHours()/12 > 1) ? "pm" : "am") + " on " + d.getMonth() + "-" + d.getDay() + "-" + d.getFullYear());
     }

     const parseSerialized = (text) => {
          return text.replace("&#39;", "'")
     }

     const handleClick = (e) => {
          props.alterCurrent(e.target.dataset.key)
     }

     return (
          <>
               <div className="col-lg-5 w-100 g-brd-right--lg g-brd-gray-light-v7">
                    <div className="js-custom-scroll-horizontal js-custom-scroll g-height-59_5vh--lg">
                         <div className="d-flex d-lg-block g-brd-bottom g-brd-none--lg g-brd-gray-light-v4 g-overflow-x-auto">
                              {props.tickets.map((v, i) => {
                                   //console.log(v);
                                   return (
                                        <div key={i}>
                                             <section className={"media justify-content-center g-bg-gray-light-v8--active g-brd-bottom--lg g-brd-gray-light-v4 g-pa-15 g-pa-25--lg make-pointer g-color-secondary--hover" + ((props.current == v.tid) ? " active" : "")}>
                                                  <a onClick={handleClick} className="w-100 h-100 d-flex">
                                                       <div data-key={i} className="d-flex g-mr-20--lg">
                                                            <span data-key={i}className="d-inline-block g-pos-rel">
                                                                 <img data-key={i} className="rounded-circle g-width-45 g-width-55--lg g-height-45 g-height-55--lg" src={v.img_url} alt="User Avatar" />
                                                            </span>
                                                       </div>
                                                       <div data-key={i} className="media-body align-self-center g-hidden-md-down">
                                                            <div data-key={i} className="media g-mb-10">
                                                                 <h3 data-key={i} className="d-flex align-self-center g-font-size-16 g-font-weight-400 mb-0">{parseSerialized(capitalize(v.title))}</h3>
                                                                 <em data-key={i} className="d-flex align-self-center align-items-center g-font-style-normal g-color-gray-light-v1 ml-auto">
                                                                      <i data-key={i} className="hs-admin-time icon-clock g-mr-5"></i>
                                                                      <small data-key={i}>{formatTime(v.updated_at)}</small>
                                                                 </em>
                                                            </div>
                              
                                                            <div data-key={i} className="media">
                                                                 <p data-key={i} className="media-body mb-0">{capitalize(v.creatorName)}</p>
                                                            </div>
                                                       </div>
                                                  </a>
                                             </section>
                                        </div>
                                   )
                              })}
                         </div>
                    </div>
               </div>
          </>
     )
}

export default TicketScroll;