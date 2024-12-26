import { Elements, PaymentElement } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useLocation } from "react-router-dom";

const stripePromise = loadStripe("pk_test_51QYNIjP25mjMs8ock3E6Kpw8CnsBd7YX7yyjj2g89U6Fg9UO7bdLQ9cCn3LufcBGAOyOOaRWHvrgoLxb8SUwXuzT00JEhyLe86");

const CheckoutForm = () => {
    return (
        <form>
            <PaymentElement/>
        </form>
    )
}

const Checkout = () => {
 const location = useLocation();
 const options = {
    clientSecret: location.state.clientSecret,
 };

  return (
   <div>checkout
    <Elements stripe = {stripePromise} options={options}>
        <CheckoutForm />
        </Elements>
   </div>
  );
};

export default Checkout;
