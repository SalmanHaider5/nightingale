import React from 'react'
import { isNil } from 'ramda'
import { Upload, Icon, Form, Button } from 'antd'

const FormItem = Form.Item

export const FileInput = ({
  input: { name, value, onChange, onBlur },
  meta: { touched, error, warning },
  label,
  isRequired,
  fileAdded,
  specialText,
  type,
  onRemove,
  downloadIcon = false,
  previewIcon = false,
  removeIcon = false
}) => {
  
  return (
    <div className="file-input">
      <FormItem
        validateStatus={touched && error ? 'error' : ''}
        label={label}
        labelCol={isNil(label) ? undefined : { span: 5, offset: 3 } }
        wrapperCol={isNil(label) ? undefined :{ span: 12, offset: 1 }}
        labelAlign='left'
        colon={false}
        required={isRequired}
        extra={specialText}
      >
        <Upload
          name="file"
          action={'https://www.mocky.io/v2/5cc8019d300000980a055e76'}
          listType={type}
          accept=".doc,.docx,.pdf"
          data={file => onChange(file)}
          onRemove={onRemove}
          showUploadList={
            {
              showDownloadIcon: downloadIcon,
              showPreviewIcon: previewIcon,
              showRemoveIcon: removeIcon
            }
          }
        >
          <Button>
            <Icon type="upload" /> Upload Document
          </Button>
        </Upload>
      </FormItem>
    </div>
  )
}