import Head from '@Components/head.js'
import Breadcrumb from '@Components/breadcrumb.js'
import Spinner from '@Components/spinner'
import ProjectWidget from '@Components/project/widget.js'
import Link from 'next/link'
import useSWR from 'swr'
import axios from 'axios'

function Projects({user}) {

     const NewProject = ({projects}) => {
          if (user.usergroup == "user") {
               if (projects.length < 1) {
                    return (
                         <>
                              <div className="col-md-6 col-lg-4 g-mb-30">
                                   <div className="js-fancybox d-flex align-items-center justify-content-center u-link-v5 g-parent h-100 g-brd-around g-brd-style-dashed g-brd-gray-light-v7 rounded g-pa-30">
                                        <span className="text-center">
                                             <span className="d-block g-font-weight-300 g-font-size-16 g-color-gray-dark-v6 g-color-secondary--parent-hover">No Available Projects</span>
                                        </span>
                                   </div>
                              </div> 
                         </>
                    )
               }
               return null;
          } else {
               return (
                    <>
                         <div className="col-md-6 col-lg-4 g-mb-30">
                              <Link href="/new/project" passHREF>
                                   <a className="js-fancybox d-flex align-items-center justify-content-center u-link-v5 g-parent h-100 g-brd-around g-brd-style-dashed g-brd-gray-light-v7 rounded g-pa-30">
                                        <span className="text-center">
                                             <span className="d-inline-block g-pos-rel g-width-50 g-height-50 g-font-size-default g-color-secondary g-brd-around g-brd-secondary rounded-circle g-mb-5">
                                                  <i className="hs-admin-plus g-absolute-centered"></i>
                                             </span>
                                             <span className="d-block g-font-weight-300 g-font-size-16 g-color-gray-dark-v6 g-color-secondary--parent-hover">Start New Project</span>
                                        </span>
                                   </a>
                              </Link>
                         </div>
                    </>
               )
          }
     }
     
     const getAllProjects = () => {
          const fetcher = url => axios.get(url).then(res => res.data);
          const { data, error } = useSWR(`/api/projects`, fetcher, {
               revalidateOnMount: true,
               shouldRetryOnError: true,
               initialData: []
          });
     
          return {
               projects: data,
               isLoading: !error && !data,
               isError: error
          }
     }

     const breadcrumb = {
          "My Projects": ""
     }

     let {projects, isLoading, isError} = getAllProjects();

     if (isError || isLoading) {
          return (
               <div>
                    <Head title="Loading..." />

                    <Spinner />
               </div>
          )
     }

     const NewProjectButton = () => {
          if (user.usergroup != "user") {
               return (
                    <>
                         <div className="media-body align-self-center text-right">
                              <Link href="/new/project" passHREF><a className="js-fancybox btn btn-xl u-btn-secondary g-width-160--md g-font-size-default g-ml-10">New Project</a></Link>
                         </div>
                    </>
               )
          }
          return null;
     }

     if (projects) {
          return (
               <div>
                    <Head title="My Projects"/> 

                    <Breadcrumb list={breadcrumb} />

                    <div className="g-pa-20">
                         <div className="media">
                              <div className="d-flex align-self-center">
                                   <h1 className="g-font-weight-300 g-font-size-28 g-color-black mb-0">Projects - All</h1>
                              </div>
                              <NewProjectButton />
                         </div>

                         <hr className="d-flex g-brd-gray-light-v7 g-my-30" />

                         <div className="row">
                              {
                                   projects.map((v, i) => {
                                        return (
                                             <ProjectWidget info={v} key={i} user={user} />
                                        )
                                   })
                              }

                              <NewProject projects={projects} />
                         </div>
                    </div>
               </div>
          )
     }
} 

export default Projects;