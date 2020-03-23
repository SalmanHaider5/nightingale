import React from 'react'
import { Field } from 'redux-form'
import { TextField, SelectField, MultilineTextField, FileInput } from '../../../utils/custom-components'
import { isRequired, QUALIFICATION_OPTIONS as qualifications, max35Hours, max200Words, isValidNMC } from '../../../constants'

const ProfessionalDetailsForm = ({ fileRemoveHandler, formValues, crbRemoveHandler }) => {
  const { document, crbDocument } = formValues
  return (
    <div>
      <Field
        name="nmcPin"
        component={TextField}
        label={'NMC Pin'}
        size={'large'}
        type="text"
        validate={[isRequired, isValidNMC]}
        tooltipPlacement={'topRight'}
      />
      <Field
        name="qualification"
        component={SelectField}
        label={'Qualification'}
        size={'large'}
        options={qualifications}
        hintText={'Choose your Qualification'}
        validate={[isRequired]}
      />
      <Field
        name="crbDocument"
        component={FileInput}
        label="DBS"
        hintText={'Upload DBS Document'}
        acceptedFileTypes=".doc,.docx,.pdf,.jpg,.jpeg,.png"
        type={'card'}
        fileAdded={crbDocument}
        onRemove={crbRemoveHandler}
        removeIcon={true}
      />
      <Field
        name="cpdHours"
        component={TextField}
        label={'CPD Hours'}
        size={'large'}
        type="text"
        specialText={'Max 35 Hours'}
        validate={[max35Hours]}
        tooltipPlacement={'topRight'}
      />
      <Field
        name="document"
        component={FileInput}
        label="Resume/CV"
        hintText={'Upload Document'}
        acceptedFileTypes=".doc,.docx,.pdf"
        type={'card'}
        fileAdded={document}
        onRemove={fileRemoveHandler}
        removeIcon={true}
      />
      <Field
        name="profilePicture"
        component={FileInput}
        label="Profile ID"
        hintText={'Upload Image'}
        acceptedFileTypes=".jpg,.jpeg,.png"
        type={'picture'}
        fileAdded={crbDocument}
        onRemove={crbRemoveHandler}
        removeIcon={true}
      />
      <Field
        name="experience"
        component={MultilineTextField}
        label={'Work Experience'}
        type="text"
        options={qualifications}
        rows={5}
        validate={[max200Words]}
        specialText={'Max 200 words'}
        tooltipPlacement={'topRight'}
      />
    </div>
  )
}

export default ProfessionalDetailsForm
