import React, { useEffect } from 'react'
import Banner from './Banner'
import Slider from './Slider'
import {getProducts} from "../redux/actions/action";
import { useDispatch,useSelector } from 'react-redux';
import ServiesBanner from './ServiesBanner';
import MarcueeWraper from './MarcueeWraper';
import CategoryElectronics from './CategoryElectronics';
import CategoryBeauty from './CategoryBeauty';
import CategoryClothing from './CategoryClothing';

const Home = () => {

  const {products} = useSelector(state => state.getproductsdata);
  console.log(products);

  const dispatch = useDispatch();

  useEffect(()=>{
    dispatch(getProducts());
  },[dispatch]);

  return (
    <div className="home_section">
      <div className="banner_part">
        <Banner />
      </div>
      <div className="slide_part">
        <div className="left_slide">
          <Slider title="Deal Of The Day" products={products} />
        </div>
        <div className="right_slide">
          <h4>fastive lateste Lonch</h4>
          <img src="https://images-eu.ssl-images-amazon.com/images/G/31/img21/Wireless/Jupiter/Launches/T3/DesktopGateway_CategoryCard2x_758X608_T3._SY608_CB639883570_.jpg" alt="rightimg" />
          <a href="#">see more</a>
        </div>
      </div>
      <MarcueeWraper />
      <CategoryBeauty />
      <Slider title="Today's Deal" products={products} />
      <CategoryClothing />
      <Slider title="Best Seller" products={products} />
      <CategoryElectronics />
      <Slider title="Upto 80% off" products={products} />
      <br/>
      <ServiesBanner />
    </div>
  )
}

export default Home