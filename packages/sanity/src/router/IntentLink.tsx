import React, {ForwardedRef, forwardRef} from 'react'
import {IntentParameters} from './types'
import {useIntentLink} from './useIntentLink'

/**
 * The props for the `IntentLink` component that creates a link to an intent.
 *
 * @public
 */
export interface IntentLinkProps {
  /**
   * The name of the intent to link to.
   */
  intent: string

  /**
   * The parameters to include in the intent.
   */
  params?: IntentParameters

  /**
   * Whether to replace the current URL in the browser history instead of adding a new entry.
   */
  replace?: boolean
}

/**
 * A component that creates a link to an intent.
 *
 * @public
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *  return <IntentLink intent="edit" params={{id: 'abc123'}}>Edit</IntentLink>
 * }
 * ```
 */
export const IntentLink = forwardRef(function IntentLink(
  props: IntentLinkProps & React.HTMLProps<HTMLAnchorElement>,
  ref: ForwardedRef<HTMLAnchorElement>
) {
  const {intent, params, target, ...restProps} = props
  const {onClick, href} = useIntentLink({
    intent,
    params,
    target,
    onClick: props.onClick,
  })

  return <a {...restProps} href={href} onClick={onClick} ref={ref} target={target} />
})
