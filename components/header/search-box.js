function SearchBox() {
     return (
          <div>
               <form id="searchMenu" className="u-header--search col-sm g-py-12 g-ml-15--sm g-ml-20--md g-mr-10--sm" aria-labelledby="searchInvoker" action="#!">
                    <div className="input-group g-max-width-450--sm">
                         <input className="form-control h-100 form-control-md g-rounded-4 g-pr-40" type="text" placeholder="Enter search keywords" />
                         <button type="submit" className="btn u-btn-outline-primary g-brd-none g-bg-transparent--hover g-pos-abs g-top-0 g-right-0 d-flex g-width-40 h-100 align-items-center justify-content-center g-font-size-18 g-z-index-2"><i className="hs-admin-search"></i></button>
                    </div>
               </form>
          </div>
     );
}

export default SearchBox;