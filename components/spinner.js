function Spinner() {
     return (
          <div>
               <div className="loader"></div> 
               <style jsx>{`
                    .loader {
                         border-top: 16px solid blue;
                         border-right: 16px solid green;
                         border-bottom: 16px solid red;
                         border-left: 16px solid pink;
                         border-radius: 50%;
                         width: 120px;
                         height: 120px;
                         display: block;
                         position: fixed;
                         z-index: 1031; 
                         top: calc( 50% - ( 120px / 2) );
                         right: calc( 50% - ( 120px / 2) );
                         animation: spin 2s linear infinite;
                    }
                    
                    @keyframes spin {
                         0% { transform: rotate(0deg); }
                         100% { transform: rotate(360deg); }
                    }
               `}</style>
          </div>
     )
}

export default Spinner;