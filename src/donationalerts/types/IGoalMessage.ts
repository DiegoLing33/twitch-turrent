/*
{
    "id": 8929429,
    "is_active": 1,
    "is_default": 1,
    "title": "Test",
    "currency": "RUB",
    "start_amount": 0,
    "raised_amount": 12,
    "goal_amount": 10,
    "started_at": "2025-07-22 16:15:59",
    "expires_at": null,
    "reason": "default"
  }
    */
export interface IGoalMessage{
  id: number;
  is_active: number;
  is_default: number;
  title: string;
  currency: string;
  start_amount: number;
  raised_amount: number;
  goal_amount: number;
  started_at: string;
  expires_at: string | null;
  reason: string;
}