import React from 'react'
import { Card, Icon, Button, Row, Col, Spin } from 'antd'
import { ModalBox } from '../../../../utils/custom-components'
import PersonalDetails from './PersonalDetails/'
import ProfessionalDetails from './ProfessionalDetails'
import PersonalDetailsForm from '../../Forms/PersonalDetailsForm'
import ProfessionalDetailsForm from '../../Forms/ProfessionalDetailsForm'
import './profile.css'

const Profile = ({
  isLoading,
  company,
  editFormModal,
  formName,
  showEditFormModal,
  hideEditFormModal,
  findAddresses,
  addressSelectHandler,
  addresses,
  charityStatus,
  subsidiary,
  charityStatusChange,
  changePostalCode,
  subsidiaryStatusChange,
  invalid,
  formValues,
  updateCompany
}) => {
  return (
    <Spin spinning={isLoading} tip="Loading...">
      <div className="inner-wrapper">
        <div className="steps-content">
          <div className="steps-header">
            <h3>Profile</h3>
          </div>
          <div className="profile-view">
            <Row>
              <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                <Card
                  title={
                    <span>
                      <Icon type="user" />
                        Personal Details
                    </span>
                  }
                  extra={
                    <Button
                      type={"link"}
                      className={""}
                      onClick={() => showEditFormModal("Personal")}>
                      <Icon
                        type={"edit"}
                      />
                    </Button>
                  }
                >
                  {
                    <PersonalDetails
                      company={company}
                    />
                  }
                </Card>
              </Col>
              <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                <Card
                  title={
                    <span>
                      <Icon type="highlight" />
                      Company Details
                    </span>
                  }
                  extra={
                    <Button type="link" onClick={() => showEditFormModal("Professional")}>
                      <Icon type="edit" />
                    </Button>
                  }
                >
                  {
                    <ProfessionalDetails
                      company={company}
                    />
                  }
                </Card>
              </Col>
            </Row>
            <ModalBox
              title={`Edit ${formName} Details`}
              visible={editFormModal}
              size={800}
              content={
                formName === 'Personal' ?
                <PersonalDetailsForm
                  formValues={formValues}
                /> :
                formName === 'Professional' ?
                <ProfessionalDetailsForm
                  formValues={formValues}
                  addresses={addresses}
                  findAddresses={findAddresses}
                  addressSelectHandler={addressSelectHandler}
                  changePostalCode={changePostalCode}
                  charityStatus={charityStatus}
                  subsidiary={subsidiary}
                  charityStatusChange={charityStatusChange}
                  subsidiaryStatusChange={subsidiaryStatusChange}
                /> :
                ''
              }
              submitText={<><Icon type="save" /> Save</>}
              cancelText={<><Icon type="close" /> Cancel </>}
              submitDisabled={invalid}
              submitHandler={updateCompany}
              cancelHandler={hideEditFormModal}
            />
          </div>  
        </div>
      </div>
    </Spin>
  )
}

export default Profile
