import React from 'react'
import { Switch,Route } from 'react-router-dom'
import { Spin } from 'antd'

import AllProducts from './AllProducts'
import NewProduct from '../NewProduct'
import SingleProduct from '../SingleProduct'
import './products.css'

const Products = (props) => {
  
  const {
    products,
    isLoading,
    addProduct,
    deleteProduct,
    categories,
    isExact,
    tabKey,
    handleNextTab,
    handlePrevTab,
    handleTabChange,
    formValues,
    formValid,
    progress,
    onSearch,
    isIdDuplicated,
    onSelectFilter
  } = props
  return (
    <div className="products-container">
      {
        !isExact?
        <div className="products-form">
          <Switch>
            <Route
              path='/products/new-product'
              render={() => 
                <NewProduct
                  categories={categories}
                  tabKey={tabKey}
                  handleNextTab={handleNextTab}
                  handlePrevTab={handlePrevTab}
                  addProduct={addProduct}
                  handleTabChange={handleTabChange}
                  formValues={formValues}
                  formValid={formValid}
                  progress={progress}
                  isIdDuplicated={isIdDuplicated}
                />
              } 
            />
            <Route path="/products/:id" component={SingleProduct} />
          </Switch>
        </div>:
        <div className="products-table">
          <Spin spinning={isLoading} tip="Loading...">
            <AllProducts
              categories={categories}
              products={products}
              deleteProduct={deleteProduct}
              onSearch={onSearch}
              onSelectFilter={onSelectFilter}
            />
          </Spin>
        </div>
      }
    </div>
  );
};

export default Products