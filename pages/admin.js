import Head from '@Components/head.js'
import Breadcrumb from '@Components/breadcrumb'
import Spinner from '@Components/spinner'
import Link from 'next/link'
import useSWR from 'swr'
import axios from 'axios'

function Admin() {

     const UserGroup = ({usergroup}) => {
          switch(usergroup) {
               case 'admin':
                    return (
                         <>
                              <td className="g-valign-middle g-brd-top-none g-brd-bottom g-brd-gray-light-v7 g-py-15 g-py-30--md text-align-center">
                                   <span className="u-tags-v1 text-center g-width-150--md g-brd-around g-brd-lightred-v3 g-bg-lightred-v3 g-font-size-12 g-font-size-default--md g-color-white g-rounded-50 g-py-4 g-px-15">Admin</span>
                              </td>
                         </>
                    )
                    break;
               case 'dev':
                    return (
                         <>
                              <td className="g-valign-middle g-brd-top-none g-brd-bottom g-brd-gray-light-v7 g-py-15 g-py-30--md text-align-center">
                                   <span className="u-tags-v1 text-center g-width-150--md g-brd-around g-brd-lightblue-v3 g-bg-lightblue-v3 g-font-size-12 g-font-size-default--md g-color-white g-rounded-50 g-py-4 g-px-15">Developer</span>
                              </td>
                         </>
                    )
                    break;
               default:
                    return (
                         <>
                              <td className="g-valign-middle g-brd-top-none g-brd-bottom g-brd-gray-light-v7 g-py-15 g-py-30--md text-align-center">
                                   <span className="u-tags-v1 text-center g-width-150--md g-brd-around g-brd-lightyellow g-bg-lightyellow g-font-size-12 g-font-size-default--md g-color-white g-rounded-50 g-py-4 g-px-15">User</span>
                              </td>
                         </>
                    )
                    break;
          }
     }

     const UserRow = ({info}) => {
          return (
               <>
                    <tr id={"userRow-" + info.uid} role="tab" className="" key={info.uid}>
                         <td className="g-hidden-sm-down g-valign-middle g-brd-top-none g-brd-bottom g-brd-gray-light-v7 g-py-15 g-py-30--md g-pl-25--sm">{info.uid}</td>
                         <td className="g-valign-middle g-brd-top-none g-brd-bottom g-brd-gray-light-v7 g-py-15 g-py-30--md g-px-5 g-px-10--sm text-align-left">
                              <Link href={"/admin/edit/"+info.uid} passHREF>
                                   <a className="d-flex align-items-center u-link-v5 g-color-black g-color-secondary--hover g-color-secondary--opened">
                                        <img className="g-width-40 g-width-50--md g-height-40 g-height-50--md g-brd-around g-brd-2 g-brd-transparent g-brd-lightblue-v3--parent-opened rounded-circle g-mr-20--sm" src={info.img_url} alt="User Avatar" />
                                        <span className="g-hidden-sm-down">{info.fname.replace(/^\w/, c => c.toUpperCase()) + " " + info.lname.replace(/^\w/, c => c.toUpperCase())}</span>
                                   </a>
                              </Link>
                         </td>
                         <td className="g-hidden-sm-down g-valign-middle g-brd-top-none g-brd-bottom g-brd-gray-light-v7 g-py-15 g-py-30--md g-px-5 g-px-10--sm">
                              <a className="u-link-v5 g-text-break-word g-color-black g-color-secondary--hover" href={"mailto:" + info.email}>
                                   <span className="g-hidden-sm-down">{info.email}</span>
                              </a>
                         </td>
                         
                         <UserGroup usergroup={info.usergroup} />
                         
                         <td className="g-valign-middle g-brd-top-none g-brd-bottom g-brd-gray-light-v7 g-py-15 g-py-30--md g-px-5 g-px-10--sm g-pr-25">
                              <div className="d-flex align-items-center g-line-height-1">
                                   <Link href={"/admin/edit/"+info.uid} passHREF>
                                        <a className="u-link-v5 g-color-gray-light-v6 g-color-secondary--hover g-mr-15">
                                             <i className="hs-admin-pencil g-font-size-18"></i>
                                        </a>
                                   </Link>
                              </div>
                         </td>
                    </tr>
               </>
          )
     }

     const getAllUsers = () => {
          const fetcher = url => axios.get(url).then(res => res.data);
          const { data, error } = useSWR(`/api/users`, fetcher, {
               revalidateOnMount: true,
               shouldRetryOnError: false,
               initialData: []
          });
     
          return {
               users: data,
               isLoading: !error && !data,
               isError: error
          }
     }

     const breadcrumb = {
          "Admin": ""
     }

     let {users, isLoading, isError} = getAllUsers();

     if (isError || isLoading) {
          if (isError) {
               window.location = "/";
          }
          return (
               <div>
                    <Head title="Loading..." />

                    <Spinner />
               </div>
          )
     }
     if (users) {
          
          return (
               <>
                    <Head title="Admin" />

                    <Breadcrumb list={breadcrumb} />

                    <div className="g-pa-20">
                         <div className="media">
                              <div className="d-flex align-self-center">
                                   <h1 className="g-font-weight-300 g-font-size-28 g-color-black mb-0">Administration</h1>
                              </div>
                         </div>

                         <hr className="d-flex g-brd-gray-light-v7 g-my-30" />

                         <table className="table w-100 g-mb-25">
                              <thead className="g-hidden-sm-down g-color-gray-dark-v6">
                                   <tr>
                                        <th className="g-bg-gray-light-v8 g-font-weight-400 g-valign-middle g-brd-bottom-none g-py-15 g-py-30--md g-pl-25--sm">
                                            User ID
                                        </th>
                                        <th className="g-bg-gray-light-v8 g-font-weight-400 g-valign-middle g-brd-bottom-none g-py-15 g-py-30--md text-align-left">
                                             Name
                                        </th>
                                        <th className="g-bg-gray-light-v8 g-font-weight-400 g-valign-middle g-brd-bottom-none g-py-15 g-py-30--md g-px-5 g-px-10--sm">
                                             Email
                                        </th>
                                        <th className="g-bg-gray-light-v8 g-font-weight-400 g-valign-middle g-brd-bottom-none g-py-15 g-py-30--md text-align-center">
                                             Usergroup
                                        </th>
                                        <th className="g-bg-gray-light-v8 g-font-weight-400 g-valign-middle g-brd-bottom-none g-py-15 g-pr-25"></th>
                                   </tr>
                              </thead>

                              <tbody className="g-font-size-default g-color-black" id="accordion-09" role="tablist" aria-multiselectable="true">
                                   {users.map((v, index) => {
                                        return (
                                             <UserRow info={v} key={v.uid}/>
                                        )
                                   })}
                              </tbody>
                         </table>
                    </div>
               </>
          )
     }
}

export default Admin