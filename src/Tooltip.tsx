import CyTooltip from '@cypress/react-tooltip'
import React from 'react'

interface TooltipProps {
  children: React.ReactElement
  noWrapper?: boolean
  title: string
  updateCue?: any
  visible?: boolean
}

export function Tooltip (props: TooltipProps) {
  const content = props.noWrapper ? props.children : <span>{props.children}</span>

  return (
    <CyTooltip updateCue={props.title} {...props} className='dog-tooltip' wrapperClassName='dog-tooltip-wrapper'>
      {content}
    </CyTooltip>
  )
}
