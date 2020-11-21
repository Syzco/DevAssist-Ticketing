import TicketScroll from '@Components/project/ticket/ticket-scroll.js'
import ViewTicket from '@Components/project/ticket/view-ticket.js'
import useSWR from 'swr'
import {useState} from 'react'
import axios from 'axios'

function TicketWidget({pid, user}) {

     const [currentTicket, alterCurrentTicket] = useState("")
     
     const getProjectTicketInfo = (pid) => {
          if (typeof pid == 'undefined') pid = "";
          const fetcher = url => axios.get(url).then(res => res.data);
          const { data, error } = useSWR(`/api/tickets?pid=${pid}`, fetcher, {
               revalidateOnMount: true,
               shouldRetryOnError: true,
               initialData: []
          });
     
          return {
               tickets: data,
               isLoading: !error && !data,
               isError: error
          }
     }

     let {tickets, isLoading, isError} = getProjectTicketInfo(pid)

     if (tickets.length < 1) {
          return (
               <>
                    <div className="card">
                         <div className="row no-gutters">
                              <div className="col-lg-12 h-100 g-pos-rel g-min-height-500 g-min-height-200--lg g-pa-15">
                                   <div className="g-absolute-centered text-center">
                                        <div className="g-pos-rel g-width-80 g-width-130--lg g-height-80 g-height-130--lg g-bg-gray-light-v8 rounded-circle mx-auto g-mb-20">
                                             <i className="hs-admin-face-smile g-absolute-centered g-font-size-24 g-font-size-32--lg g-color-gray-light-v1"></i>
                                        </div>

                                        <h5 className="g-font-size-default g-font-size-16--md g-font-weight-300 g-color-black mb-0">This project has no tickets, currently.</h5>
                                   </div>
                              </div>
                         </div>
                    </div>
               </>
          )
     }
     
     return (
          <>
               <div className="card">
                    <div className="row no-gutters">
                         <TicketScroll tickets={tickets} loading={isLoading} alterCurrent={alterCurrentTicket} current={currentTicket} />
                         <ViewTicket tickets={tickets} selected={currentTicket} user={user}/>
                    </div>
               </div>
          </>
     )
}

export default TicketWidget;