import React from 'react'
import { Field } from 'redux-form'
import { Form, Button, Icon, Row, Col } from 'antd'
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js'

const StripeCardPayment = ({ secret, formValues, makePaymentRequest, skipPaymentOption }) => {
  const { firstName, lastName } = formValues
  const options = {
    hidePostalCode: true,
  }
  const stripe = useStripe()
  const elements = useElements()

  const makePayment = async (e) => {
    e.preventDefault();

    makePaymentRequest({})

    if(!stripe || !elements){
      return;
    }

    const response = await stripe.confirmCardPayment(secret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: `${firstName} ${lastName}`
        }
      }
    })
    makePaymentRequest(response)
  }
  return (
    <span>
      <Form.Item
        label="Card Details"
        labelCol={{ span: 5, offset: 3 }}
        wrapperCol={{ span: 12, offset: 1 }}
        colon={false}
      >
        <Field
          name="cardDetails"
          component={CardElement}
          options={options}
        />
      </Form.Item>
      <Row>
        <Col span={10} offset={14}>
          <Button type="danger" onClick={skipPaymentOption}>
            Skip <Icon type="right" />
          </Button>
          <Button className="success-btn" style={{ marginLeft: '22px' }}  onClick={makePayment}>
            <Icon type="pound" /> Make Payment
          </Button>
        </Col>
      </Row>
    </span>
  )
}
export default StripeCardPayment
