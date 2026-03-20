export const removeWallets = tab => tab !== 'wallets'

export const removeMostPopular = tab => tab !== 'most_popular'

export const removeQuickAccess = tab => tab !== 'quick_access'

export const isNotButtonOnly = ({ params }) =>
  params?.method_position !== 'button_only'
