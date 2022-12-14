import { component$, useClientEffect$, useOnDocument, useStore } from '@builder.io/qwik';
import {constants} from '~/components/var/global'
import SimpleMaskMoney from 'simple-mask-money'
//export const cartProducts = [];
//export var cartCount;

export const cartQty = [1];

interface productsCollectin {
  data: Array;
  value: Number;
}

export default component$(() => {

  // Default configuration
  SimpleMaskMoney.args = {
    allowNegative: false,
    negativeSignAfter: false,
    prefix: constants.currency,
    suffix: '',
    fixed: true,
    fractionDigits: 2,
    decimalSeparator: '.',
    thousandsSeparator: ','
  };
  
  const store = useStore({
    data: null,
    value: 1
  });

  useClientEffect$(( {track} ) => {
    // track(() => store.data);
    track(() => store.data);

    store.data = productCollection(constants.cartProducts);
    //const tmrId = setInterval(() => store.data = productCollection(constants.cartProducts), 1000);
    //return () => clearInterval(tmrId);

  });
    
  return (
    <div class="offcanvas offcanvas-start" data-bs-scroll="true" tabindex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
        <div class="offcanvas-header">
          <h5 class="offcanvas-title" id="offcanvasExampleLabel">Shopping Cart</h5>
          <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        
        <div class="offcanvas-body">

              <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                <button type="button" onClick$={()=> {constants.cartProducts.length = 0; cartQty.length = 0}} class="btn btn-primary btn-sm"><i class="bi bi-cart-fill"></i> Clear Cart</button>
              </div>

              <Display cartItems={store} />
              
              <div class="cart-footer text-right">
                  <a href="page-checkout.html" class="btn btn-success my-1">Proceed to Checkout<i class="ri-arrow-right-line ml-2"></i></a>
              </div>
            
          
        </div>
      </div>
  );
});
  
export const Display = component$((props: {cartItems: any}) => {
  
  console.log(props.cartItems.data?.length);

  return (
    <>
    <div class="table-responsive">

      <table class="table table-borderless">
        <thead>
            <tr>
                <th scope="col">#</th>
                <th scope="col">Order Details</th>
                <th scope="col" class="text-right">Total</th>
                <th scope="col">Act.</th>
            </tr>
        </thead>
        <tbody>
        {props.cartItems.data?.map((a)=>(
        <tr>
          <th scope="row">{props.cartItems.data.indexOf(a)+1}</th>
          <td>
              <div class="row">
                {/*
                <div class="col-sm-4">
                <img src={a.thumbnail} class="img-fluid" width="120" alt={a.description} />
                </div>
                */}
                <div class="col-sm-12">
                  <div class="form-group mb-0">
                    <a href={`/pages/products/sku/${a.id}`} tabindex="-1" class="">
                    <strong>{a.title}</strong>
                    </a>
                    <br/>
                    <strong>{SimpleMaskMoney.formatToCurrency(a.price)} * </strong>
                    <input 
                      type="number" 
                      class="form-control form-control-sm" 
                      name={`cartQty-${a.id}`}
                      id={`cartQty-${a.id}`}
                      min="1" 
                      value={cartQty[props.cartItems.data.indexOf(a)] == null | undefined ? 1 : cartQty[props.cartItems.data.indexOf(a)]}
                      onInput$={(ev) => 
                        {
                          props.cartItems.value = (ev.target as HTMLInputElement).value;
                          cartQty[props.cartItems.data.indexOf(a)] = props.cartItems.value;
                        }
                      } />
                  </div>
                </div>
              </div>
            </td>
          <td class="text-right">
            {SimpleMaskMoney.formatToCurrency(a.price * (cartQty[props.cartItems.data.indexOf(a)] == null | undefined ? 1 : cartQty[props.cartItems.data.indexOf(a)]))}
          </td>
          <td>
            
            <a 
              href="#" 
              class="text-danger" 
              onClick$={ ()=> {
                constants.cartProducts.splice(props.cartItems.data.indexOf(a), 1); 
                  cartQty.splice(props.cartItems.data.indexOf(a) == null | undefined ? 1 : props.cartItems.data.indexOf(a), 1);
                }
                }>
                <i class="bi bi-x-circle-fill"></i>
            </a>
          </td>
        </tr>
        ))}
    </tbody>
    </table>
          </div>

         
          <div class="order-total table-responsive ">
            <table class="table table-borderless text-right">
                <tbody>
                    <tr>
                        <td>Sub Total :</td>
                        <td>{getTotal(props.cartItems.data, cartQty)}</td>
                    </tr>
                    {
                    /*
                    <tr>
                        <td>Shipping :</td>
                        <td>$0.00</td>
                    </tr>
                    <tr>
                        <td>Tax(1%) :</td>
                        <td>$1.00</td>
                    </tr>
                    */}
                    <tr>
                        <td class="f-w-7 font-18"><h4>Amount :</h4></td>
                        <td class="f-w-7 font-18"><h4>{getTotal(props.cartItems.data, cartQty)}</h4></td>
                    </tr>
                </tbody>
            </table>
        </div> 

    </>
  )
});


export function productCollection(store: productsCollectin) {
  store.data = constants.cartProducts;
  return store.data.map((a)=> (a));
}

export function getTotal(item, qty){
  let array=[];
  array.push(item?.map((a)=>(a.price)*(qty[item.indexOf(a)] == null | undefined ? 1 : qty[item.indexOf(a)])))
  let ab = array[0]?.reduce(myFunc, 0 );
  //console.log(ab);
  var gtotal = SimpleMaskMoney.formatToCurrency(ab == undefined | null ? "0" : ab);
  return gtotal;
}

function myFunc(total, num) {
  return total + num;
} 



export function getCart(item){
  cartItems(item.product);
}

export function cartItems(items){
  
  //console.log(constants.cartProducts.map((a)=> (a)))
  
  if( !constants.cartProducts.find(c => checkCartItem(c) == checkCartItem(items) ) ){
    constants.cartProducts.push(items);
      //console.log(constants.cartProducts);
      constants.cartCount === undefined | null ? constants.cartCount = 0 : constants.cartCount = getCartItems(constants.cartProducts);
    console.log(constants.cartCount);

  } else {
    alert("Please update the quantity. Product already added.");
  }
  

  
  return Array.isArray(constants.cartProducts) ? constants.cartProducts.map((repo) => repo) : null;

}

export function checkCartItem(item){
  return item.title;
}

export function getCartItems(productLine){
  return productLine.length;
}

