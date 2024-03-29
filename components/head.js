import Head from 'next/head'

function head({ title }) {

     return (
          <div>
               <Head>
                    <meta charSet="utf-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
                    <link rel="stylesheet" href="//fonts.googleapis.com/css?family=Open+Sans%3A400%2C300%2C500%2C600%2C700%7CPlayfair+Display%7CRoboto%7CRaleway%7CSpectral%7CRubik" />

                    <title>{ title }</title>
               </Head>
          </div>
     )
}

export default head;