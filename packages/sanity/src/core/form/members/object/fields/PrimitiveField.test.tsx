// eslint-disable-next-line import/no-unassigned-import
import '@testing-library/jest-dom/extend-expect'
import {render} from '@testing-library/react'
import React, {PropsWithChildren} from 'react'
import {ThemeProvider, studioTheme, LayerProvider} from '@sanity/ui'
import userEvent from '@testing-library/user-event'
import {FieldMember} from '../../../store'
import {
  defaultRenderField,
  defaultRenderInput,
  FormCallbacksProvider,
  FormCallbacksValue,
} from '../../../studio'
import {PatchEvent, set} from '../../../patch'
import {FIXME} from '../../../../FIXME'
import {PrimitiveField} from './PrimitiveField'

describe('PrimitiveField', () => {
  describe('number', () => {
    it('renders empty input when given no value', () => {
      // Given
      const {member, formCallbacks} = setupTest('number', undefined)

      // When
      const {getByTestId} = render(
        <ThemeProvider theme={studioTheme}>
          <LayerProvider>
            <FormCallbacksProvider {...formCallbacks}>
              <PrimitiveField
                member={member}
                renderInput={defaultRenderInput}
                renderField={defaultRenderField}
              />
            </FormCallbacksProvider>
          </LayerProvider>
        </ThemeProvider>
      )

      // Then
      const input = getByTestId('number-input') as HTMLInputElement
      expect(input).toBeInstanceOf(HTMLInputElement)
      expect(input.value).toEqual('')
    })

    it('renders non-zero number when mounted', () => {
      // Given
      const {member, TestWrapper} = setupTest('number', 42)

      // When
      const {getByTestId} = render(
        <PrimitiveField
          member={member}
          renderInput={defaultRenderInput}
          renderField={defaultRenderField}
        />,
        {wrapper: TestWrapper}
      )

      // Then
      const input = getByTestId('number-input') as HTMLInputElement
      expect(input).toBeInstanceOf(HTMLInputElement)
      expect(input.value).toEqual('42')
    })

    it('renders 0 number when mounted', () => {
      // Given
      const {member, TestWrapper} = setupTest('number', 0)

      // When
      const {getByTestId} = render(
        <PrimitiveField
          member={member}
          renderInput={defaultRenderInput}
          renderField={defaultRenderField}
        />,
        {wrapper: TestWrapper}
      )

      // Then
      const input = getByTestId('number-input') as HTMLInputElement
      expect(input).toBeInstanceOf(HTMLInputElement)
      expect(input.value).toEqual('0')
    })

    it('calls `onChange` callback when the input changes', () => {
      // Given
      const {member, formCallbacks, TestWrapper} = setupTest('number', undefined)

      const {getByTestId} = render(
        <PrimitiveField
          member={member}
          renderInput={defaultRenderInput}
          renderField={defaultRenderField}
        />,
        {wrapper: TestWrapper}
      )

      // When
      userEvent.type(getByTestId('number-input'), '1.01')

      // Then
      expect(formCallbacks.onChange).toHaveBeenNthCalledWith(
        1,
        PatchEvent.from(set(1)).prefixAll(member.name)
      )
      expect(formCallbacks.onChange).toHaveBeenNthCalledWith(
        2,
        PatchEvent.from(set(1)).prefixAll(member.name)
      )
      expect(formCallbacks.onChange).toHaveBeenNthCalledWith(
        3,
        PatchEvent.from(set(1.01)).prefixAll(member.name)
      )
    })

    it('updates input value when field is updated with a new value', () => {
      // Given
      const {member, TestWrapper} = setupTest('number', 1)

      const {getByTestId, rerender} = render(
        <PrimitiveField
          member={member}
          renderInput={defaultRenderInput}
          renderField={defaultRenderField}
        />,
        {wrapper: TestWrapper}
      )

      // When
      member.field.value = 42

      rerender(
        <PrimitiveField
          member={member}
          renderInput={defaultRenderInput}
          renderField={defaultRenderField}
        />
      )

      // Then
      const input = getByTestId('number-input') as HTMLInputElement
      expect(input).toBeInstanceOf(HTMLInputElement)
      expect(input.value).toEqual('42')
    })

    it('keeps input value when field value is updated with a "simplified" version of the current input', () => {
      // Given
      const {member, TestWrapper} = setupTest('number', 1)

      const {getByTestId, rerender} = render(
        <PrimitiveField
          member={member}
          renderInput={defaultRenderInput}
          renderField={defaultRenderField}
        />,
        {wrapper: TestWrapper}
      )

      // When
      userEvent.type(getByTestId('number-input'), '.00')
      member.field.value = 1

      rerender(
        <PrimitiveField
          member={member}
          renderInput={defaultRenderInput}
          renderField={defaultRenderField}
        />
      )

      // Then
      const input = getByTestId('number-input') as HTMLInputElement
      expect(input).toBeInstanceOf(HTMLInputElement)
      expect(input.value).toEqual('1.00')
    })
  })
})

function setupTest(type: string, value: string | number | boolean | undefined) {
  const member: FieldMember = {
    kind: 'field',
    key: 'key',
    name: 'name',
    index: 0,
    collapsed: false,
    collapsible: false,
    open: true,
    field: {
      id: 'id',
      schemaType: {
        name: type,
        jsonType: type as FIXME,
      },
      level: 1,
      path: ['id'],
      presence: [],
      validation: [],
      value,
      readOnly: false,
      focused: false,
      changed: false,
    },
  }

  const formCallbacks: FormCallbacksValue = {
    onChange: jest.fn(),
    onPathFocus: jest.fn(),
    onPathBlur: jest.fn(),
    onPathOpen: jest.fn(),
    onSetPathCollapsed: jest.fn(),
    onSetFieldSetCollapsed: jest.fn(),
    onFieldGroupSelect: jest.fn(),
  }

  function TestWrapper({children}: PropsWithChildren) {
    return (
      <ThemeProvider theme={studioTheme}>
        <LayerProvider>
          <FormCallbacksProvider {...formCallbacks}>{children}</FormCallbacksProvider>
        </LayerProvider>
      </ThemeProvider>
    )
  }

  return {member, formCallbacks, TestWrapper}
}