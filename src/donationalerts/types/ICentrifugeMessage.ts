export interface ICentrifugeMessage<T> {
  seq: number
  data: T
}
