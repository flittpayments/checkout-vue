let mapping = {
  trustly: 'banks',
}

export const mappingMethod = item => mapping[item] || item
