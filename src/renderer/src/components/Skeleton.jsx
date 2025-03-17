import React from 'react'
import '../styles/Skeleton.css'

const Skeleton = ({ style, className = '' }) => {
  return <div className={`skeleton ${className}`} style={style} />
}

export default Skeleton
