import React, { Component } from 'react'
import { connect } from 'react-redux'
import { reduxForm, getFormValues, reset } from 'redux-form'
import { filter, length, contains, toLower } from 'ramda'
import { notification } from 'antd'
import { postCategory, getCategories, deleteCategory } from '../../actions'
import Categories from './Categories'

class CategoriesContainer extends Component {
  constructor(props){
    super(props)
    this.state = {
      categoryModal: false
    }
  }

  componentDidMount(){
    const { dispatch } = this.props
    dispatch(getCategories())
  }

  componentWillReceiveProps(nextProps){
    if(this.props.categories.addRequest !== nextProps.categories.addRequest){
      if(!nextProps.categories.addRequest){
        notification.success({
          message: 'Add Success',
          description: 'Category is successfully added.',
          placement: 'bottomLeft',
          style: {
            backgroundColor: 'rgb(77, 141, 45)',
            color: '#fff'
          }
        })
      }
    }
    if(this.props.categories.deleteRequest !== nextProps.categories.deleteRequest){
      if(!nextProps.categories.deleteRequest){
        notification.success({
          message: 'Delete Success',
          description: 'Category is successfully deleted.',
          placement: 'bottomLeft',
          style: {
            backgroundColor: 'rgb(77, 141, 45)',
            color: '#fff'
          }
        })
      }
    }
  }

  showCategoryModal = () => {
    this.setState({categoryModal: true})
  }

  hideCategoryModal = () => {
    const { dispatch } = this.props
    dispatch(reset('category'))
    this.setState({categoryModal: false})
  }

  addCategory = e => {
    e.preventDefault();
    const { formValues, dispatch } = this.props
    dispatch(postCategory(formValues))
    dispatch(reset('category'))
    this.setState({categoryModal: false})
  }

  deleteCategory = id => {
    const { dispatch } = this.props
    dispatch(deleteCategory(id))
  }
  
  isTitleDuplicated = value => {
    const { categories: { categories } } = this.props
    const duplicates = length(filter(category => category.name === value, categories))
    return duplicates > 0 ? 'Name is already used' : '' 
  }

  onSearch = e => {
    const { categories: { categories }, dispatch } = this.props
    const value = e.target.value 
    if(value.length === 0) { dispatch(getCategories()) }
    const filteredCategories = filter(category => contains(toLower(value), toLower(category.name)), categories)
    dispatch({
      type: 'FETCH_CATEGORIES_SUCCESS',
      payload: filteredCategories
    })
  }
  
  render() {
    const { categoryModal } = this.state
    const { categories: { isLoading, categories, isError, error }, match: { isExact } } = this.props
    return (
      <div>
        {
          isExact ?
          <Categories
            categoryModal={categoryModal}
            showCategoryModal={this.showCategoryModal}
            hideCategoryModal={this.hideCategoryModal}
            addCategory={this.addCategory}
            deleteCategory={this.deleteCategory}
            isLoading={isLoading}
            isError={isError}
            isTitleDuplicated={this.isTitleDuplicated}
            error={error}
            categories={categories}
            onSearch={this.onSearch}
          />:
          null
        }
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    formValues: getFormValues('category')(state),
    categories: state.categories
  }
}
export default connect(mapStateToProps)(
  reduxForm({
    form: 'category'
  })(CategoriesContainer)
)