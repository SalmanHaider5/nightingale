import { change, initialize } from 'redux-form'
import Cookies from 'js-cookie'
import { pathOr, join, defaultTo, forEach, length, head } from 'ramda'
import moment from 'moment'
import { SERVER_URL as url, GET_ADDRESS_URL as apiUrl, GET_ADDRESS_API_KEY as apiKey } from '../constants'
import { showToast, isEmptyOrNull } from '../utils/helpers'
import { getAdresses } from './addresses'
import * as types from './'
import { getCompanyData } from '../utils/parsers'

export const getClientPaymentToken = () => dispatch => {
    dispatch({type: types.CLIENT_TOKEN_REQUEST})
    const token = pathOr('', ['authToken'], Cookies.getJSON('authToken'))
    const endpoint = `${url}company/clientSecret`
    fetch(endpoint, {
        headers: {
            authorization: token
        }
    })
    .then(res => res.json())
    .then(data => {
        const { code, secret } = data
        if(code === 'success'){
            dispatch({
                type: types.CLIENT_TOKEN_SUCCESS,
                payload: secret
            })
        }
    })
    .catch(error => {
        dispatch({
            type: types.CLINET_TOKEN_FAILURE,
            error
        })
    })
}

export const getClientPaypalToken = userId => dispatch => {
    dispatch({type: types.FETCH_PAYPAL_TOKEN_REQUEST})
    const token = pathOr('', ['authToken'], Cookies.getJSON('authToken'))
    const endpoint = `${url}company/paypalToken/${userId}`
    fetch(endpoint, {
        headers: {
            authorization: token
        }
    })
    .then(res => res.json())
    .then(data => {
        const { code, token } = data
        if(code === 'success'){
            dispatch({
                type: types.FETCH_PAYPAL_TOKEN_SUCCESS,
                payload: token
            })
        }
    })
    .catch(error => {
        dispatch({
            type: types.FETCH_PAYPAL_TOKEN_FAILURE,
            error
        })
    })
}

export const addDetails = (userId, formValues) => dispatch => {
    dispatch({ type: types.ADD_COMPANY_DETAILS_REQUEST })
    const endpoint = `${url}${userId}/company`
    fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(formValues),
        headers: {
            'Content-Type':'application/json'
        }
    })
    .then(res => res.json())
    .then(response => {
        const { code, response: { title, message } } = response
        showToast(title, message, code)
        formValues.createdAt = moment()
        const company = getCompanyData(formValues)
        dispatch(initialize('company', company))
        dispatch({
            type: types.ADD_COMPANY_DETAILS_SUCCESS,
            payload: company
        })
    })
    .catch(error => {
        dispatch({
            type: types.ADD_COMPANY_DETAILS_FAILURE,
            error
        })
    })
}

export const getCompanyDetails = userId => dispatch => {
    dispatch({ type: types.FETCH_COMPANY_DETAILS_REQUEST })
    const token = pathOr('', ['authToken'], Cookies.getJSON('authToken'))
    const endpoint = `${url}${userId}/company`
    fetch(endpoint, {
        headers: {
            authorization: token
        }
    })
    .then(res => res.json())
    .then(data => {
        if(data.code === 'success'){
            const { company } = data
            const { firstName, lastName, email, phone, address, city, postalCode } = company
            if(!isEmptyOrNull(postalCode)){
                dispatch(getAdresses(postalCode))
            }
            const contact = {
                name: join(' ', [firstName, lastName]),
                email,
                phone: phone,
                subject: '',
                message: ''
            }
            const shiftsForm = {
                shift1: false,
                shift2: false,
                shift3: false,
                shift4: false,
                shift5: false
            }
            
            const searchForm = {
                skill: '',
                day0: shiftsForm,
                day1: shiftsForm,
                day2: shiftsForm,
                day3: shiftsForm,
                day4: shiftsForm,
                day5: shiftsForm,
                day6: shiftsForm
            } 
            const changePassword = {
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            }
            const offerForm = {
                shiftRate: '',
                shifts: [],
                address: `${address}, ${city}, Postal Code ${postalCode}`,
                message: ''
            }
            company.contactForm = contact
            company.changePassword = changePassword
            company.searchForm = searchForm
            company.offerForm = offerForm
            dispatch(initialize('company', company))
        }
        if(data.code !== 'error'){
            dispatch({
                type: types.FETCH_COMPANY_DETAILS_SUCCESS,
                payload: data
            })
        }else{
            const { code, response: { title, message } } = data
            showToast(title, message, code)
            if(title === 'Authorization Failed'){
                dispatch({ type: types.ACCOUNT_LOGOUT_REQUEST })
            }
        }
    })
    .catch(err => {
        console.log('Error', err)
    })
}

export const updatePassword = (userId, values) => dispatch => {
    dispatch({ type: types.COMPANY_PASSWORD_CHANGE_REQUEST })
    const endpoint = `${url}${userId}/company/changePassword`
    const token = defaultTo('', Cookies.getJSON('authToken').authToken)
    const changePassword = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    }
    fetch(endpoint, {
        method: 'PUT',
        body: JSON.stringify(values),
        headers: {
            authorization: token,
            'Content-Type':'application/json'
        }
    })
    .then(res=> res.json())
    .then(response => {
        const { code, response: { title, message }, error = '' } = response
        showToast(title, message, code)
        if(code === 'success'){
            dispatch(change('company', 'changePassword', changePassword))
            dispatch({
                type: types.COMPANY_PASSWORD_CHANGE_SUCCESS
            })
        }else{
            dispatch({
                type: types.COMPANY_PASSWORD_CHANGE_FAILURE,
                error
            })
        }
    })
    .catch(err => {
        dispatch({
            type: types.COMPANY_PASSWORD_CHANGE_FAILURE,
            error: err
        })
    })
} 

export const contactUs = values => dispatch => {
    const endpoint = `${url}user/sendMessage`
    const token = defaultTo('', Cookies.getJSON('authToken').authToken)
    fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(values),
        headers: {
            authorization: token,
            'Content-Type':'application/json'
        }
    })
    .then(res=> res.json())
    .then(response => {
        const { code, response: { title, message } } = response
        values.message = ''
        values.subject = ''
        dispatch(change('company', 'contactForm', values))
        dispatch(change('professional', 'contactForm', values))
        showToast(title, message, code)
    })
}

export const updateProfile = (userId, values) => dispatch => {
    dispatch({ type: types.UPDATE_COMPANY_REQUEST })
    const endpoint = `${url}${userId}/company`
    const token = defaultTo('', Cookies.getJSON('authToken').authToken)
    fetch(endpoint, {
        method: 'PUT',
        body: JSON.stringify(values),
        headers: {
            authorization: token,
            'Content-Type':'application/json'
        }
    })
    .then(res=> res.json())
    .then(response=> {
        const { code, response: { title, message } } = response
        showToast(title, message, code)
        if(code === 'success'){
            dispatch({
                type: types.UPDATE_COMPANY_SUCCESS,
                payload: values
            })
        }
    })
    .catch(err => {
        dispatch({
            type: types.UPDATE_SHIFT_FAILURE,
            error: err
        })
    })
}

const filterProfessionalsByShift = (professional, timesheet, values) => dispatch => {
    if(isEmptyOrNull(timesheet)){
        // const { date } = values
        for(let i = 0; i < length(values); i++){
            dispatch({
                type: types.ENLIST_PROFESSIONAL,
                payload: { index: i, professional: {} }
            })
            if(i === length(values) - 1){
                dispatch({
                    type: types.FIND_PROFESSIONALS_SUCCESS
                })
            }
        }
    }else{
        const { id } = timesheet
        const token = pathOr('', ['authToken'], Cookies.getJSON('authToken'))
        const endpoint = new URL(`${url}timesheet/${id}/search`)
        
        for(let i = 0; i < length(values); i++){
            const pro = []
            pro[i] = professional
            const { date, shifts } = values[i]
            endpoint.search = new URLSearchParams({
                shifts: shifts.toString(),
                date: moment(date).format('YYYY-MM-DD')
            })
            fetch(endpoint,
                {
                headers: {  
                    authorization: token
                }
            })
            .then(res => res.json())
            .then(response => {
                const { code } = response
                if(code === 'success'){
                    const { timesheet } = response
                    if(!isEmptyOrNull(timesheet)){
                        pro[i].shift = timesheet.shift
                        pro[i].time = timesheet.time
                        dispatch({
                            type: types.ENLIST_PROFESSIONAL,
                            payload: { index: i, professional: isEmptyOrNull(professional) ? {} : pro[i] }
                        })
                    }else{
                        dispatch({
                            type: types.ENLIST_PROFESSIONAL,
                            payload: { index: i, professional: {} }
                        })
                    }
                }
            })
            .then(() => {
                dispatch({
                    type: types.FIND_PROFESSIONALS_SUCCESS
                })
            })
            .catch(err => {
                console.log('Error', err)
            })
        }
    }
}

const filterProfessionalsByTimesheets = (values, professional) => dispatch => {
    if(isEmptyOrNull(professional)){
        dispatch(filterProfessionalsByShift({}, {}, values))
    }else{
        const { userId } = professional
        const endpoint = `${url}timesheets/${userId}`
        const token = pathOr('', ['authToken'], Cookies.getJSON('authToken'))
        fetch(endpoint, {
            headers: {
                authorization: token
            }
        })
        .then(res => res.json())
        .then(response => {
            const { model: { timesheets, phone, email } } = response
            professional.phone = phone
            professional.email = email
            if(!isEmptyOrNull(timesheets)){
                forEach(timesheet => {
                    dispatch(filterProfessionalsByShift(professional, timesheet, values))
                }, timesheets)
            }else{
                dispatch(filterProfessionalsByShift({}, {}, values))
            }
        })
        .catch(err => {
            console.log('Error', err)
        })
    }
}

const filterProfessionalsByPostalCode = (values, professional) => dispatch => {
    const professionalCode = pathOr('', ['postCode'], professional)
    const { postalCode } = head(values)
    if(!isEmptyOrNull(professionalCode)){
        const endpoint = `${apiUrl}distance/${postalCode}/${professionalCode}?api-key=${apiKey}`
        fetch(endpoint)
        .then(res => res.json())
        .then(response => {
            const { metres } = response
            const miles = parseFloat(metres) / 1609
            if(parseInt(miles) < 26){
                dispatch(filterProfessionalsByTimesheets(values, professional))
            }else{
                dispatch(filterProfessionalsByTimesheets(values, {}))
            }
        })
    }
}

export const searchProfessionals = (userId, values) => dispatch => {
    const { skill } = head(values)
    dispatch({ type: types.FIND_PROFESSIONALS_REQUEST })
    const token = pathOr('', ['authToken'], Cookies.getJSON('authToken'))
    const endpoint = `${url}${userId}/search/${skill}`
    fetch(endpoint, {
        headers: {
            authorization: token
        }
    })
    .then(res => res.json())
    .then(response => {
        if(response.code === 'success'){
            const { professionals } = response
            if(length(professionals) > 0){
                forEach(professional => {
                    dispatch(filterProfessionalsByPostalCode(values, professional))
                }, professionals)
            }else{
                dispatch({ type: types.NO_PROFESSIONALS_FOUND })
            }
        }else{
            const { code, response: { title, message } } = response
            showToast(title, message, code)
            dispatch({ type: types.NO_PROFESSIONALS_FOUND })
        }
    })
}

export const makePayment = (userId, response) => dispatch => {

    if(isEmptyOrNull(response)){
        dispatch({ type: types.MAKE_PAYMENT_REQUEST })
    }else{
        if(response.error){
            const { message } = response.error
            showToast('Card Declined', message, 'error')
            dispatch({ type: types.MAKE_PAYMENT_FAILURE })
        }else{
            const { paymentIntent } = response
            const { status, amount } = paymentIntent
            if(status === 'succeeded'){
                const endpoint = `${url}company/${userId}/payment`
                const token = pathOr('', ['authToken'], Cookies.getJSON('authToken'))
                const values = {}
                values.balance = amount
                values.payDate = moment().format('YYYY-MM-DD')
                values.status = true
                fetch(endpoint, {
                    method: 'POST',
                    body: JSON.stringify(values),
                    headers: {
                        authorization: token,
                        'Content-Type':'application/json'
                    }
                })
                .then(res=> res.json())
                .then(response => {
                    const { code } = response
                    if(code === 'success'){
                        const { response: { title, message } } = response
                        showToast(title, message, code)
                        dispatch({
                            type: types.MAKE_PAYMENT_SUCCESS,
                            payload: values
                        })
                    }
                })
                .catch(err => {

                })
            }
        }
    }
}

export const makePaypalPayment = (userId, data) => dispatch => {
    dispatch({ type: types.MAKE_PAYMENT_REQUEST })
    const token = pathOr('', ['authToken'], Cookies.getJSON('authToken'))
    const endpoint = `${url}company/${userId}/payment`
    const values = {}
    const { amount } = data
    values.balance = amount
    values.payDate = moment().format('YYYY-MM-DD')
    values.status = true
    fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(values),
        headers: {
            authorization: token,
            'Content-Type':'application/json'
        }
    })
    .then(res=> res.json())
    .then(response => {
        const { code } = response
        if(code === 'success'){
            const { response: { title, message } } = response
            showToast(title, message, code)
            dispatch({
                type: types.MAKE_PAYMENT_SUCCESS,
                payload: values
            })
        }
    })
    .catch(err => {

    })
}

export const sendOfferRequest = values => dispatch => {
    dispatch({ type: types.OFFER_REQUEST_INIT })
    const token = pathOr('', ['authToken'], Cookies.getJSON('authToken'))
    const endpoint = `${url}createOffer`
    fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(values),
        headers: {
            authorization: token,
            'Content-Type':'application/json'
        }
    })
    .then(res => res.json())
    .then(response => {
        const { code, response: { title, message, offer } } = response
        showToast(title, message, code)
        console.log('Offer', response)
        if(code === 'success'){
            dispatch({
                type: types.OFFER_REQUEST_SUCCESS,
                payload: offer
            })
        }else{
            dispatch({
                type: types.OFFER_REQUEST_FAILURE
            })
        }
    })
    .catch(err => {
        dispatch({
            type: types.OFFER_REQUEST_FAILURE,
            error: err
        })
    })
}

export const updateOffer = (values, offerId) => dispatch => {
    dispatch({ type: types.COMPANY_OFFER_UPDATE_REQUEST })
    const token = defaultTo('', Cookies.getJSON('authToken').authToken)
    const endpoint = `${url}offer/${offerId}`
    fetch(endpoint, {
        method: 'PUT',
        body: JSON.stringify(values),
        headers: {
            authorization: token,
            'Content-Type':'application/json'
        }
    })
    .then(res => res.json())
    .then(response => {
        const { code, response: { title, message } } = response
        showToast(title, message, code)
        if(code === 'success'){
            dispatch({
                type: types.COMPANY_OFFER_UPDATE_SUCCESS,
                payload: values
            })
        }else{
            dispatch({
                type: types.COMPANY_OFFER_UPDATE_FAILURE
            })
        }
    })
    .catch(err => {
        dispatch({
            type: types.OFFER_UPDATE_FAILURE,
            error: err
        })
    })   
}
