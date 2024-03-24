// Write your code here
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {BsPlusSquare} from 'react-icons/bs'

import Cookies from 'js-cookie'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'
import './index.css'

const isStatus = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  progress: 'PROGRESS',
}

class ProductItemDetails extends Component {
  state = {productsDetails: {}, error: '', count: 1, status: isStatus.progress}

  componentDidMount() {
    this.getData()
  }

  getData = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    console.log(response)
    if (response.ok) {
      const fetchedData = await response.json()

      const updatedProductDetails = {
        availability: fetchedData.availability,
        brand: fetchedData.brand,
        description: fetchedData.description,
        id: fetchedData.id,
        imageUrl: fetchedData.image_url,
        style: fetchedData.style,
        similarProducts: fetchedData.similar_products,
        title: fetchedData.title,
        totalReviews: fetchedData.total_reviews,
        price: fetchedData.price,
        rating: fetchedData.rating,
      }

      this.setState({
        productsDetails: updatedProductDetails,
        status: isStatus.success,
      })
    } else {
      this.setState({status: isStatus.failure, error: response.error_msg})
    }
  }

  decreaseCount = () => {
    const {count} = this.state
    if (count > 1) {
      this.setState(old => ({count: old.count - 1}))
    }
  }

  increaseCount = () => {
    const {count} = this.state
    if (count >= 0) {
      this.setState(old => ({count: old.count + 1}))
    }
  }

  continueShopping = () => {
    const {history} = this.props
    history.replace('/products')
  }

  onFailure = () => {
    const {error} = this.state
    return (
      <div>
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
          alt="failure view"
        />
        <h1>Product Not Found</h1>
        <button onClick={this.continueShopping} type="button">
          Continue Shopping
        </button>
      </div>
    )
  }

  onSuccess = () => {
    const {productsDetails, count} = this.state
    const {
      price,
      totalReviews,
      title,
      similarProducts,
      imageUrl,
      description,
      brand,
      availability,
      rating,
    } = productsDetails

    return (
      <div>
        <Header />
        <div className="details-cont">
          <img src={imageUrl} alt="product" className="product-img" />
          <div className="data-cont">
            <h1>{title}</h1>
            <p>Rs {price}/-</p>

            <div className="reviews">
              <button type="button" className="rating">
                <p>{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star"
                />
              </button>
              <p>{totalReviews} Reviews</p>
            </div>
            <p>{description}</p>
            <p>Availability: {availability}</p>
            <p>Brand: {brand}</p>
            <hr />
            <div className="count">
              <button
                data-testid="minus"
                type="button"
                onClick={this.decreaseCount}
              >
                -
              </button>
              <p>{count}</p>
              <button
                data-testid="plus"
                type="button"
                onClick={this.increaseCount}
              >
                <BsPlusSquare />
              </button>
            </div>
            <button type="button" className="add-btn">
              ADD TO CART
            </button>
          </div>
        </div>
        <h1>Similar Products</h1>
        <div>
          <ul>render</ul>
        </div>
      </div>
    )
  }

  onLoading = () => (
    <div data-testis="loader" className="primedeals-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  render() {
    const {status} = this.state
    switch (status) {
      case isStatus.success:
        return this.onSuccess()
      case isStatus.failure:
        return this.onFailure()
      case isStatus.progress:
        return this.onLoading()
      default:
        return null
    }
  }
}

export default ProductItemDetails
