import { Stripe } from "stripe";

const stripe = new Stripe(process.env.EXPO_PUBLIC_STRIPE_SECRET_KEY || "");
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { payment_method_id, payment_intent_id, customer_id } = body;

    if (!payment_intent_id || !payment_method_id || !customer_id) {
      Response.json(
        {
          message: "Missing required payment infomation.",
        },
        { status: 400 }
      );
    }

    const paymentMethod = await stripe.paymentMethods.attach(
      payment_method_id,
      {
        customer: customer_id,
      }
    );

    const result = await stripe.paymentIntents.confirm(payment_intent_id, {
      payment_method: paymentMethod.id,
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Payment confirm successfully!",
        result,
      })
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      {
        error,
        status: 500,
      },
      { status: 500 }
    );
  }
}
