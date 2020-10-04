import axios from 'axios';
import { showAlert } from './alert';

export const bookTour = async tourId => {
    const stripe = Stripe(
        'pk_test_51H1DZFDvmHZhe2Gzd9YPQVQqpqOwCPktwUt0S2ZflvCqFKXPNwv1UtPSWHaMsTUhtxACNyg6RvbBW0ojc3j4lv0X00WaBrTi3P'
    );
    try {
        const session = await axios.get(
            `/api/v1/booking/checkout-session/${tourId}`
        );
        await stripe.redirectToCheckout({
            sessionId: session.data.session.id,
        });
    } catch (err) {
        showAlert('error', err.message);
    }

    console.log(session);
};
