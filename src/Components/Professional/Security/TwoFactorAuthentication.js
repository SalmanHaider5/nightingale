import React from 'react'
import { Field } from 'redux-form'
import { defaultTo, prop } from 'ramda'
import { SwitchField } from '../../../utils/custom-components'

const TwoFactorAuthentication = ({ formValues }) => {
  const twoFactorAuthentication = prop('twoFactorAuthentication', prop('changePassword', formValues))
  return (
    <div>
      <Field
        name="twoFactorAuthentication"
        component={SwitchField}
        size="large"
        label="Two Factor Authentication"
        defaultStatus={false}
        checked={twoFactorAuthentication}
        // specialText={twoFactorAuthentication ? `Enabled` : `Disabled`}
        text={twoFactorAuthentication ? `Enabled` : `Disabled`}
      />
    </div>
  )
}
export default TwoFactorAuthentication
