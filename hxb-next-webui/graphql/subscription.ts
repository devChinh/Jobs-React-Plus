import { gql } from "@apollo/client";

export const ADD_SUBSCRIPTION = gql`
  mutation CreateSubscription($payment: SubscriptionInput!) {
    createSubscription(payment: $payment) {
      ID
      subscription_id
      u_id
      ws_id
      org_id
      product_id
      price_id
      price_data
      status
    }
  }
`;
