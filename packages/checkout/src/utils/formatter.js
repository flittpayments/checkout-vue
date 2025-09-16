export const formatterAmount = value => {
  const [integer, decimal] = value.split('.')
  return decimal ? `${integer}.${decimal.slice(0, 2)}` : integer
}
