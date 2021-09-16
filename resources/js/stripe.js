import axios from 'axios';
import Noty from 'noty';
import { loadStripe } from '@stripe/stripe-js'

export const initStripe = async () => {
    const stripe = await loadStripe('pk_test_51JYAh4SJtA72x2UkLjI4dU1m0mKhyOln1Nm9YAZOnqfUyQZHm5FWFS4OeFbWeaY5fqWjszfxDGS2U2U7tDgWFRdf00n7nu1apJ');

    let card = null;
    const mountStripe = () => {
        const elements = stripe.elements();

        var style = {
            base: {
                color: '#303238',
                fontSize: '16px',
                fontFamily: '"Open Sans", sans-serif',
                fontSmoothing: 'antialiased',
                '::placeholder': {
                    color: '#CFD7DF',
                },

            },
            invalid: {
                color: '#e5424d',
                ':focus': {
                    color: '#303238',
                },
            },
        };

        card = elements.create('card', { style, hidePostalCode: true })
        card.mount('#card-element');
    }



    const paymentType = document.querySelector('#paymentType');
    paymentType.addEventListener('change', (e) => {
        if (e.target.value === 'card') {
            //Display card detail form
            mountStripe();
        } else {
            card.destroy();
        }
    });


    const paymentForm = document.getElementById('payment');
    if (paymentForm) {
        paymentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(paymentForm);
            let formObject = {};
            for (let [key, value] of formData.entries()) {
                formObject[key] = value;
            }

            const placeOrder = (formObject) => {
                axios.post('/orders', formObject)
                    .then((res) => {
                        new Noty({
                            type: 'success',
                            timeout: 1000,
                            text: res.data.msg,
                            progressBar: false,
                            layout: 'bottomRight',

                        }).show();
                    })
                    .catch((err) => {

                        new Noty({
                            type: 'error',
                            timeout: 1000,
                            progressBar: false,
                            layout: 'bottomRight',
                            text: err.res.data.msg
                        }).show();
                    })
            }
            if (!card) {
                placeOrder(formObject);

                return;
            }
            //verify card
            stripe.createToken(card)
                .then((res) => {
                    //console.log("res", res);
                    formObject.stripeToken = res.token.id;
                    placeOrder(formObject)
                })
                .catch((res) => {
                    //console.log("res.error", res.error);
                })

        })
    }
}

