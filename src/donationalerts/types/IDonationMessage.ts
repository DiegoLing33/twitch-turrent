/*
{
    "id": 169718369,
    "name": "Donations",
    "username": "Test 8",
    "message": "",
    "message_type": "text",
    "payin_system": null,
    "amount": 270,
    "currency": "RUB",
    "is_shown": 1,
    "amount_in_user_currency": 270,
    "recipient_name": "notafoks",
    "recipient": {
      "user_id": 14068224,
      "code": "notafoks",
      "name": "notafoks",
      "avatar": "https://static-cdn.jtvnw.net/jtv_user_pictures/9520601c-ab57-45ca-bfcf-a941548368fd-profile_image-300x300.png"
    },
    "created_at": "2025-07-22 17:16:41",
    "shown_at": null,
    "reason": "default"
  }
    */
export interface IDonationMessage {
  id: number;
  name: string;
  username: string;
  message: string;
  message_type: string;
  payin_system: string | null;
  amount: number;
  currency: string;
  is_shown: number;
  amount_in_user_currency: number;
  recipient_name: string;
  recipient: {
    user_id: number;
    code: string;
    name: string;
    avatar: string;
  };
  created_at: string;
  shown_at: string | null;
  reason: string;
}
