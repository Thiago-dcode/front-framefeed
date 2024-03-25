import React from 'react'

export default function Btn({content, handleClick}) {
  return (
    <button className='' onClick={handleClick}>{content}</button>
  )
}
