import Head from '@Components/head.js'
import Link from 'next/link'
import Router from 'next/router'

function Index(props) {
     if (!props.user) {
          return (
               <div>
                    <Head title="Unauthorized" />

                    <h1>You do not appear to be logged in. Please <Link href="/login" passHREF><a>sign in</a></Link> or <Link href="/login" passHREF><a>create an account.</a></Link></h1>
               </div>
          )
     } 

     Router.push('/view/projects')
     return null
}

export default Index;