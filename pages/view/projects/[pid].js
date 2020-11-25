import Head from '@Components/head.js'
import Breadcrumb from '@Components/breadcrumb.js'
import Spinner from '@Components/spinner.js'
import Ticket from '@Components/project/ticket.js'
import { useRouter } from 'next/router'
import Link from 'next/link'
import useSWR, {mutate} from 'swr'
import axios from 'axios'
import {useEffect} from 'react'
import {capitalize, parseSerialized} from '@Utils/misc.js'

function ViewProject(props) {
     const router = useRouter()
     const { pid } = router.query

     useEffect(() => {
          mutate(`/api/projects/${pid}`)
     }, [])

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
          //window.location = "/view/projects";
          return (
               <div>
                    <Head title="Loading..." />

                    <Spinner />
               </div>
          )
     }      

     if (project) {
          const breadcrumb = {
               "My Projects": "/view/projects",
               ["Viewing Tickets: " + parseSerialized(capitalize(project.title))]: ""
          }

          return (
               <div>
                    <Head title={"View Project - " + parseSerialized(capitalize(project.title))}/> 

                    <Breadcrumb list={breadcrumb} />

                    <div className="g-pa-20">
                         <div className="media">
                              <div className="d-flex align-self-center">
                                   <h1 className="g-font-weight-300 g-font-size-28 g-color-black mb-0 g-ml-20">{"Viewing Tickets for Project: " + parseSerialized(capitalize(project.title))}</h1>
                              </div>

                              <div className="media-body align-self-center text-right">
                                   <div className="d-inline-flex g-mr-20">
                                        <h5 className="g-font-size-20 g-color-gray-dark-v6 g-mb-5 g-mt-10">Developed By:</h5>
                                        <p className={((props.user.uid != project.author) ? "g-color-black" : "g-color-primary") + " g-font-size-18 mb-0 g-mt-10 g-ml-10 g-mr-50"}>{capitalize(project.authorName)}</p>
                                        <Link href={"/new/ticket?pid=" + pid} passHREF><a className="js-fancybox btn btn-xl u-btn-secondary g-width-160--md g-font-size-default g-ml-50">New Ticket</a></Link>
                                   </div>
                              </div>
                         </div>

                         <hr className="d-flex g-brd-gray-light-v7 g-my-30" />
                         
                         <div className="row">
                              <div className="col-md-12">
                                   <Ticket pid={pid} user={props.user}/>
                              </div>
                         </div>
                    </div>
               </div>
          )
     }
}

export default ViewProject;