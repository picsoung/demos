import React from 'react'
import Filters from '../Filters/Filters'
import TenantToken from 'components/TenantToken/TenantToken'
import Result from './Result'
import Footer from './Footer'

function Content() {
  return (
    <>
      <div className="flex flex-col sm:flex-row px-5 m-4 space-x-12 space-y-5 sm:space-y-0">
        <div className="md:w-4/12 lg:w-3/12">
          <Filters />
          <TenantToken />
        </div>
        <div className="md:w-8/12 lg:w-9/12">
          <Result />
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Content
