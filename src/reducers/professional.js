import * as actions from '../actions'
import { equals, pathOr, type as dataType, defaultTo } from 'ramda'

const initState = {
    isLoading: false,
    code: '',
    phoneVerified: false,
    professionalDetails: {
        professional: {
            phone: {}
        }
    }
}

const professional = (state=initState, action) => {
    const { type, payload } = action
    switch(type){
        case actions.ADD_PROFESSIONAL_DETAILS_REQUEST:
        case actions.ADD_PROFESSIONAL_PHONE_REQUEST:
        case actions.VERIFY_PROFESSIONAL_PHONE_REQUEST:
            return{
                ...state,
                isLoading: true
            }
        case actions.ADD_PROFESSIONAL_DETAILS_SUCCESS:
            const picture = pathOr('', ['payload', 'professional', 'profilePicture', 'name'], payload)
            payload.professional.phone = state.professionalDetails.professional.phone
            payload.professional.email = state.professionalDetails.professional.email
            payload.professional.profilePicture = picture
            return{
                ...state,
                isLoading: false,
                professionalDetails: payload
            }
        case actions.ADD_PROFESSIONAL_PHONE_SUCCESS:
            return{
                ...state,
                isLoading: false,
                code: payload
            }
        case actions.VERIFY_PROFESSIONAL_PHONE_SUCCESS:
            return{
                ...state,
                isLoading: false,
                code: payload,
                phoneVerified: equals(payload, 'success') ? true : false
            }
        case actions.FETCH_PROFESSIONAL_DETAILS_REQUEST:
            return{
                ...state,
                isLoading: true
            }
        case actions.FETCH_PROFESSIONAL_DETAILS_SUCCESS:
            return{
                ...state,
                professionalDetails: payload,
                isLoading: false
            }
        case actions.PROFESSIONAL_PROFILE_UPDATE_REQUEST:
            return{
                ...state,
                isLoading: true
            }
        case actions.PROFESSIONAL_PROFILE_UPDATE_SUCCESS:
            const profilePicture = defaultTo('', payload.professional.profilePicture)
            console.log('Picture', profilePicture.name,  dataType(profilePicture), equals(dataType(profilePicture), 'File'))
            const updatedPicture = equals(dataType(profilePicture), 'File') ? profilePicture.name : state.professionalDetails.professional.profilePicture
            payload.professional.profilePicture = updatedPicture
            
            console.log(payload)
            return{
                ...state,
                isLoading: false,
                professionalDetails: payload
            }
        case actions.PROFESSIONAL_PROFILE_UPDATE_FAILURE:
        case actions.ADD_PROFESSIONAL_PHONE_FAILURE:
        case actions.ADD_PROFESSIONAL_DETAILS_FAILURE:
        case actions.VERIFY_PROFESSIONAL_PHONE_FAILURE:
        case actions.FETCH_PROFESSIONAL_DETAILS_FAILURE:
            return{
                ...state,
                isLoading: false
            }
        
        default:
            return{
                ...state
            }
    }
}

export default professional