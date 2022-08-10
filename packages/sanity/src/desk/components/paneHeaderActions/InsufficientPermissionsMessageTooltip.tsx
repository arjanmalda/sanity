import {Tooltip} from '@sanity/ui'
import React from 'react'
import {InsufficientPermissionsMessage} from '../../../components/InsufficientPermissionsMessage'
import {useCurrentUser} from '../../../datastores'

interface InsufficientPermissionsMessageTooltipProps {
  reveal: boolean
  loading: boolean
  children: React.ReactNode
}

export function InsufficientPermissionsMessageTooltip({
  reveal,
  loading,
  children,
}: InsufficientPermissionsMessageTooltipProps) {
  const currentUser = useCurrentUser()

  if (!reveal) {
    return <>{children}</>
  }

  return (
    <Tooltip
      content={loading ? 'Loading…' : <InsufficientPermissionsMessage currentUser={currentUser} />}
      portal
    >
      {/* this wrapping div is to allow mouse events */}
      {/* while the child element is disabled */}
      <div>{children}</div>
    </Tooltip>
  )
}