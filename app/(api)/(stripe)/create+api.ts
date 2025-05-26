import { Stripe } from "stripe";

const stripe = new Stripe(process.env.EXPO_PUBLIC_STRIPE_SECRET_KEY || "");
export async function POST(req: Request) {
  const body = await req.json();
  const { name, email, amount } = body;

  if (!name || !email || !amount) {
    Response.json(
      {
        message: "Please enter a valid email adress.",
      },
      { status: 400 }
    );
  }

  let customer;
  const existingCustomer = await stripe.customers.list({ email });
  if (existingCustomer.data.length > 0) {
    customer = existingCustomer.data[0];
  } else {
    customer = await stripe.customers.create({
      name,
      email,
    });
  }
  const ephemeralKey = await stripe.ephemeralKeys.create(
    { customer: customer.id },
    { apiVersion: "2025-04-30.basil" }
  );

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Number.parseInt(amount) * 100,
    currency: "usd",
    customer: customer.id,
    automatic_payment_methods: {
      enabled: true,
      allow_redirects: "never",
    },
  });

  return new Response(
    JSON.stringify({
      paymentIntent: paymentIntent,
      ephemeralKey: ephemeralKey,
      customer: customer.id,
    }),
    { status: 200 }
  );
}
