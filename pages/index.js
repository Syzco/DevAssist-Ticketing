import Head from '@Components/head.js'
import Link from 'next/link'
import ProjectsPage from './view/projects.js'

function Index(props) {
     if (!props.user) {
          return (
               <div>
                    <Head title="Unauthorized" />

                    <h1>You do not appear to be logged in. Please <Link href="/login" passHREF><a>sign in</a></Link> or <Link href="/login" passHREF><a>create an account.</a></Link></h1>
               </div>
          )
     } else {
          window.location = "/view/projects"
          return (
               <>
                    <ProjectsPage user={props.user} />
               </>
          );
     }
}

export default Index;