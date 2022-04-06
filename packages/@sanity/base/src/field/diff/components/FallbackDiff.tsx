import React from 'react'
import {Box} from '@sanity/ui'
import {SanityPreview} from '../../../preview'
import {PreviewComponent} from '../../preview/types'
import {Diff, DiffComponent} from '../../types'
import {DiffFromTo} from './DiffFromTo'

const FallbackPreview: PreviewComponent<React.ReactNode> = ({value, schemaType}) => {
  return (
    <Box padding={2}>
      <SanityPreview type={schemaType} value={value as any} layout="default" />
    </Box>
  )
}

export const FallbackDiff: DiffComponent<Diff<unknown, Record<string, unknown>>> = (props) => {
  const {diff, schemaType} = props

  return (
    <DiffFromTo
      diff={diff}
      schemaType={schemaType}
      previewComponent={FallbackPreview}
      layout="grid"
    />
  )
}