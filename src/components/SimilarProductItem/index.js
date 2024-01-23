// Write your code here
import './index.css'

const SimilarProductItem = props => {
  const {eachItem} = props
  const {imageUrl, price, rating, title, brand} = eachItem
  return (
    <li className="individualCardContainer">
      <img
        src={imageUrl}
        className="similarProductsImage"
        alt={`similar product ${title}`}
      />
      <h1 className="titleHeading">{title}</h1>
      <p className="styleHeading">{brand}</p>
      <div className="priceAndRating">
        <p>Rs {price} /-</p>
        <div className="backgroundBlue">
          <p className="colorChange">{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="smallStar"
          />
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
