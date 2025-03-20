import React from "react"

type Props = {
  label?: string
}

const Loader = (props: Props) => {
  const { label } = props

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="lds-circle">
        <div></div>
      </div>
      {label && <span className="text-primary">{label}</span>}
    </div>
  )
}

export default Loader
