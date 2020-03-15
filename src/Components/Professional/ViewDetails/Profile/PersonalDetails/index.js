import React from 'react'
import { List, Tag, Icon, Avatar } from 'antd'
import moment from 'moment'
import { isEmptyOrNull } from '../../../../../utils/helpers'
import { SERVER_URL as url, DATE_FORMAT as dateFormat } from '../../../../../constants'

const PersonalDetails = ({ professional, phoneVerified }) => {
  const {
    profilePicture,
    fullName,
    email,
    isVerified,
    dateOfBirth,
    createdAt,
    phone
  } = professional
  
  return (
    <List className="profile-list">
      <List.Item>
        {
          isEmptyOrNull(profilePicture) ? 
          <Avatar size={160} icon="user" /> :
          <Avatar size={160} src={`${url}${profilePicture}`} />
        }
      </List.Item>
      <List.Item>
        <label>
          <Icon type="user" />
          Full Name
        </label>
        <span className="label-value">{fullName}</span>
      </List.Item>
      <List.Item>
        <label>
          <Icon type="api" />
          Status
        </label>
        <span className="label-value">{professional.status}</span>
      </List.Item>
      <List.Item>
        <label>
          <Icon type="mail" />
            Email <Tag color={isVerified ? `green` : `red`}>
            {isVerified ? `Verified` : `Not Verified`}
          </Tag>
        </label>
        <span className="label-value">{email}</span>
      </List.Item>
      <List.Item>
        <label>
          <Icon type="phone" />
          Phone <Tag color={phoneVerified ? `green` : `red`}>
            {phoneVerified ? `Verified` : `Not Verified`}
          </Tag>
        </label>
        <span className="label-value">{phone}</span>
      </List.Item>
      <List.Item>
        <label>
          <Icon type="shop" />
          Date of Birth
        </label>
        <span className="label-value">
          {dateOfBirth ? moment(dateOfBirth).format(dateFormat) : ''}
        </span>
      </List.Item>
      <List.Item>
        <label>
          <Icon type="calendar" />
          Joined At
        </label>
        <span className="label-value">{moment(createdAt).format(dateFormat)}</span>
      </List.Item>
    </List>
  )
}
export default PersonalDetails
