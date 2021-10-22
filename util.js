const { colors } = require('./styles')

const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'svg', 'gif']
const VIDEO_EXTENSIONS = ['mp4', 'mov', 'wmv', 'avi', 'avchd', 'flv', 'f4v', 'swf', 'webm', 'mpeg-2', 'mpg', 'mpeg', 'mpv', 'mpe']
const URL_MAX_LENGTH = 100
const MAX_CONTENT_LENGTH = 47

const getFirstName = name => name.split(/\s+/)[0]

const getInitialsByName = name => name ? name.split(/\s+/).map(word => word[0]).join('').toUpperCase() : null

const getShortText = (content, cut) => {
  const dotIndex = content.substr(0, cut).lastIndexOf('.')
  if (dotIndex > 3) { // just in case of dots in begining
    return content.substr(0, dotIndex)
  } else {
    return content.substr(0, cut)
  }
}

const getBriefText = (original, cut = MAX_CONTENT_LENGTH, more = '...') => {
  const image = /(!\[.*\]\(.*\))/
  const file = /(\[.*\]\(.*\))/
  let content = (original || '').replace(image, '[IMAGE]')
  content = content.replace(file, '[FILE]')
  if (!content || content.length <= cut) return content
  if (content && content.length > cut) {
    return getShortText(content, cut) + more
  } else {
    return content
  }
}

const getRestText = (content, more = '...') => {
  const shortText = getShortText(content)
  if (content.length <= MAX_CONTENT_LENGTH) return ''
  if (shortText.length < MAX_CONTENT_LENGTH) {
    return content.substr(shortText.length, content.length)
  } else {
    return more + content.substr(MAX_CONTENT_LENGTH, content.length)
  }
}

const titleCase = (str) => str.replace(/\b\S/g, function (t) { return t.toUpperCase() })

const getCoverUrl = obj =>
  obj.thumbnailUrl
    ? { uri: obj.thumbnailUrl }
    : { uri: obj.coverUrl }

const getDeckCover = (deck, placeholderImage) => {
  const deckHasCardsWithCovers =
    deck.cards && deck.cards.length &&
    deck.cards.filter(card => !!card.coverUrl)[0]
  return deck.coverUrl
    ? getCoverUrl(deck)
    : (deckHasCardsWithCovers
      ? getCoverUrl(deckHasCardsWithCovers)
      : placeholderImage
    )
}
const getCoverByObjectType = (type, card, placeholderImage) =>
  type === 'Deck'
    ? getDeckCover(card)
    : (card.coverUrl
      ? getCoverUrl(card)
      : placeholderImage
    )

const getCardColor = card => {
  let color
  switch (card.type) {
    case 'guide':
      color = colors.red.deep
      break
    case 'info':
      color = colors.bronze.deep
      break
    case 'collection':
      color = colors.green.deep
      break
    case 'pedagogical':
      color = colors.blue.deep
      break
    case 'training':
      color = colors.grey.deep
      break
    default:
      color = colors.grey.deep
  }
  return color
}

const getLevelColor = card => {
  let color
  switch (card.level) {
    case 'everyone':
      color = colors.level.everyone
      break
    case 'beginner':
      color = colors.level.beginner
      break
    case 'advanced':
      color = colors.level.advanced
      break
    case 'skilled':
      color = colors.level.skilled
      break
    default:
      color = colors.level.everyone
  }
  return color
}

const formatDate = (date = '') => {
  const d = date instanceof Date 
    ? date
    : new Date(date)
  return d.toJSON().substr(0, 16).replace('T', ' ')
}

module.exports = {
  IMAGE_EXTENSIONS,
  VIDEO_EXTENSIONS,
  URL_MAX_LENGTH,
  MAX_CONTENT_LENGTH,
  getFirstName,
  getInitialsByName,
  getRestText,
  getBriefText,
  titleCase,
  getDeckCover,
  getCoverByObjectType,
  getCardColor,
  getLevelColor,
  formatDate
}
