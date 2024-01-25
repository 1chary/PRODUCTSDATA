// Write your code here
import {Component} from 'react'
import Cookies from 'js-cookie'
import {Loader, Link} from 'react-loader-spinner'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

import './index.css'

const apiConstants = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
}

class ProductItemDetails extends Component {
  state = {detailsList: [], apiStatus: '', count: 1, similarProducts: []}

  componentDidMount() {
    this.getProductsWithId()
  }

  getProductsWithId = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const responseData = await fetch(url, options)
    if (responseData.ok === true) {
      const data = await responseData.json()
      const updatedData = {
        id: data.id,
        availability: data.availability,
        description: data.description,
        imageUrl: data.image_url,
        price: data.price,
        rating: data.rating,
        title: data.title,
        style: data.style,
        brand: data.brand,
        totalReviews: data.total_reviews,
      }
      const similarProductsList = data.similar_products.map(eachItem => ({
        id: eachItem.id,
        imageUrl: eachItem.image_url,
        price: eachItem.price,
        rating: eachItem.rating,
        title: eachItem.title,
        brand: eachItem.brand,
      }))
      this.setState({
        apiStatus: apiConstants.success,
        detailsList: updatedData,
        similarProducts: similarProductsList,
      })
    } else if (responseData.status === 404) {
      this.renderFailureView()
    }
  }

  renderLoader = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderFailureView = () => (
    <div className="failureView">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
      />
      <h1>Product Not Found</h1>
      <Link to="/Products">
        <button type="button">Continue Shopping</button>
      </Link>
    </div>
  )

  decrease = () => {
    const {count} = this.state
    if (count > 1) {
      this.setState(prevState => ({count: prevState.count - 1}))
    }
  }

  increase = () => {
    this.setState(prevState => ({count: prevState.count + 1}))
  }

  renderDetailedProduct = () => {
    const {detailsList, count, similarProducts} = this.state
    const {
      rating,
      availability,
      description,
      imageUrl,
      price,
      title,
      brand,
      totalReviews,
    } = detailsList
    return (
      <>
        <Header />
        <div className="detailsContainer">
          <img src={imageUrl} alt="product" className="detailedPhoto" />
          <div className="arrangeInColumn">
            <h1>{title}</h1>
            <p className="amount">Rs {price}/- </p>
            <div className="buttonAndReviewContainer">
              <div className="buttonContainer">
                <p type="button" className="ratingButton">
                  {rating}
                </p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="smallStar"
                />
              </div>
              <p className="reviewText">{totalReviews} Reviews</p>
            </div>
            <p>{description}</p>
            <p>
              {' '}
              <span className="availableHeading"> Available</span>:{' '}
              {availability}
            </p>
            <p>
              {' '}
              <span className="availableHeading"> Brand</span>:{brand}
            </p>
            <hr className="line" />
            <div className="productIncrease">
              <button data-testid="minus">
                <BsDashSquare onClick={this.decrease} className="minusButton" />
              </button>
              <p className="count">{count}</p>
              <button data-testid="plus">
                <BsPlusSquare onClick={this.increase} className="minusButton" />
              </button>
            </div>
            <div className="addToCartContainer">
              <button type="button" className="cartButton">
                Add to cart
              </button>
            </div>
          </div>
        </div>
        <h1 className="similarHeading">Similar Products</h1>
        <ul className="unOrderedList">
          {similarProducts.map(eachItem => (
            <SimilarProductItem key={eachItem.id} eachItem={eachItem} />
          ))}
        </ul>
      </>
    )
  }

  renderAllViews = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiConstants.success:
        return this.renderDetailedProduct()
      case apiConstants.failure:
        return this.renderFailureView()
      case apiConstants.loading:
        return this.renderLoader()

      default:
        return null
    }
  }

  render() {
    return this.renderAllViews()
  }
}

export default ProductItemDetails
