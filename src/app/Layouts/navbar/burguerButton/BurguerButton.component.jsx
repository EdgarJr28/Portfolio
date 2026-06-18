import React from 'react'

const BurguerButton = (props) => {
  return (
    <nav>
      <div
        onClick={props.handleClick}
        className={`dark:text-white icon nav-icon-1 burguer transition-all duration-300 ${props.active ? 'open' : ''}`}>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </nav>
  )
}

export default BurguerButton
