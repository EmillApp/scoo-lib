/* global fetch, FormData, XMLHttpRequest */
const apiHost = process.env.API_HOST || 'https://dev.emill.fi'
const defaultParams = { headers: { 'Content-type': 'application/json' }, credentials: 'include' }

function fetchWithTimeout(url, params, timeout) {
  return new Promise((resolve, reject) => {
    // Set timeout timer
    const timer = setTimeout(
      () => reject(new Error('Request timed out')),
      timeout
    )

    fetch(url, params).then(
      response => resolve(response),
      err => reject(err)
    ).finally(() => clearTimeout(timer))
  })
}

const request = async (url, params = {}) => {
  const timeout = (params.timeout || 30) * 1000
  
  params = Object.assign(params, api.defaultParams || {})

  params.body = params.data ? JSON.stringify(params.data) : params.body
  delete params.data

  const { query } = params
  if (query) {
    const qs = Object.keys(query).map(key => `${key}=${query[key]}`).join('&')
    url = url + (qs.length ? `?${qs}` : '')
  }

  const host = api.defaultParams && 'host' in api.defaultParams ? api.defaultParams.host : apiHost
  try {
    const res = await fetchWithTimeout(host + '/api' + url, params, timeout)
    process.env.DEBUG && console.log(apiHost + '/api' + url, params)
    const data = await res.json()

    if (!res.ok) return { error: data }
    return { data }
  } catch (e) {
    return { error: e }
  }
}

const uploadFile = async function (file, progressCallback, done) {
  const formData = new FormData()
  formData.append('file', file, file.name)

  // both work but with XMLHttpRequest we can get upload progress
  if (XMLHttpRequest) {
    const xhr = new XMLHttpRequest()

    xhr.onload = () => {
      progressCallback(100)
    }

    xhr.upload.onprogress = e => {
      if (e.lengthComputable) {
        progressCallback(e.loaded / e.total * 100)
      }
    }

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          done(null, xhr.responseText)
        } else {
          done(xhr.responseText, null)
        }
      }
    }
    const host = api.defaultParams && 'host' in api.defaultParams ? api.defaultParams.host : apiHost

    xhr.open('POST', host + '/api/files/upload', true)
    xhr.send(formData)
  } else {
    const { data, error } = await request('/files/upload', { method: 'POST', body: formData })
    progressCallback(100)
    done(error, data)
  }
}

const register = function (data) { return this.request('/auth/register', { method: 'POST', data }) }
const login = function (data) { return this.request('/auth/login', { method: 'POST', data }) }
const magicLogin = function (data) { return this.request('/auth/magic', { method: 'POST', data }) }
const logout = function () { return this.request('/auth/logout', { method: 'POST' }) }
const forgotpassword = function (data) { return this.request('/auth/forgotpassword', { method: 'POST', data }) }

const searchUsers = function (query) { return this.request('/users', { query }) }
const me = function (id) { return this.request('/users/me') }
const getUser = function (id, query) { return this.request(`/users/${id}`, { query }) }
const updateUser = function (data) { return this.request('/users/me', { method: 'PATCH', data }) }

const updateAvatar = function (data, file) {
  const imageFormData = new FormData() // eslint-disable-line no-undef
  imageFormData.append('avatar', data.avatar, data.avatar.name)
  return this.request('/users/me/avatar', { method: 'POST', body: imageFormData })
}

const createAndInviteUser = function (data, query) { return this.request('/invite', { method: 'PUT', data, query }) }

const markAllRead = function () { return this.request('/users/me/markread', { method: 'POST' }) }
const getUserNotifications = function () { return this.request('/users/me/notifications') }
const getAllUserEvents = function (query) { return this.request('/users/me/events', { query }) }
const getUserQuestions = function (query) { return this.request('/users/me/questions', { query }) }

const createQuestion = function (data) { return this.request('/questions', { method: 'POST', data }) }
const getQuestion = function (id, query) { return this.request(`/questions/${id}`, { query }) }
const updateQuestion = function (id, data) { return this.request(`/questions/${id}`, { method: 'PATCH', data }) }
const archiveQuestion = function (id) { return this.request(`/questions/${id}`, { method: 'DELETE' }) }
const searchQuestions = function (query) { return this.request('/questions', { query }) }
const getPersonalQuestions = function (query) { return this.request('/questions/personal', { query }) }
const createAnswer = function (id, data) { return this.request(`/questions/${id}/answers`, { method: 'POST', data }) }
const updateAnswer = function (id, answerId, data) { return this.request(`/questions/${id}/answers/${answerId}`, { method: 'PATCH', data }) }
const deleteAnswer = function (id, answerId) { return this.request(`/questions/${id}/answers/${answerId}`, { method: 'DELETE' }) }
const acceptAnswer = function (id, answerId) { return this.request(`/questions/${id}/answers/${answerId}/accept`, { method: 'POST' }) }
const rejectAnswer = function (id, answerId) { return this.request(`/questions/${id}/answers/${answerId}/reject`, { method: 'POST' }) }
const markFavorite = function (id, answerId) { return this.request(`/questions/${id}/answers/${answerId}/favorite`, { method: 'POST' }) }
const unmarkFavorite = function (id, answerId) { return this.request(`/questions/${id}/answers/${answerId}/unfavorite`, { method: 'POST' }) }

const getQuestionMessages = function (id) { return this.request(`/questions/${id}/chat`) }
const getQuestionChatPresence = function (id) { return this.request(`/questions/${id}/chat/presence`) }
const newQuestionMessage = function (id, data) { return this.request(`/questions/${id}/chat`, { method: 'POST', data }) }
const questionChatSubscribe = function (id) { return this.request(`/questions/${id}/chat/subscribe`, { method: 'POST' }) }
const questionChatUnsubscribe = function (id) { return this.request(`/questions/${id}/chat/unsubscribe`, { method: 'POST' }) }

const getSkillsCloud = function () { return this.request('/users/skills') }
const getTagsCloud = function () { return this.request('/questions/tags') }
const getOrganization = function (org) { return this.request(`/organizations/${org}`) }
const searchOrganizations = function (query) { return this.request('/organizations', { query }) }

const getParam = function (id) { return this.request(`/params/${id}`) }
const searchParams = function (query) { return this.request('/params', { query }) }
const createParam = function (data) { return this.request('/params', { method: 'POST', data }) }
const deleteParam = function (id) { return this.request(`/params/${id}`, { method: 'DELETE' }) }

const createDeck = function (data) { return this.request('/decks', { method: 'POST', data }) }
const getDeck = function (id) { return this.request(`/decks/${id}`) }
const updateDeck = function (id, data) { return this.request(`/decks/${id}`, { method: 'PATCH', data }) }
const deleteDeck = function (id) { return this.request(`/decks/${id}`, { method: 'DELETE' }) }
const searchDecks = function (query) { return this.request('/decks', { query }) }
const addCardToParentsDeckByGroupId = function (channelId, cardId) { return this.request(`/decks/${channelId}/parents/${cardId}`, { method: 'POST' }) }
const shareDeckWithUsers = function (id, data) { return this.request(`/decks/${id}/share`, { method: 'POST', data }) }
const getMarketplaceDecks = function () { return this.request('/marketplace') }

const createCard = function (deckId, data, timeout) {
  return deckId
    ? this.request(`/decks/${deckId}/cards`, { method: 'POST', data, timeout })
    : this.request('/cards', { method: 'POST', data, timeout })
}
const getCard = function (id) { return this.request(`/cards/${id}`) }
const updateCard = function (id, data, timeout) { return this.request(`/cards/${id}`, { method: 'PATCH', data, timeout }) }
const deleteCard = function (id) { return this.request(`/cards/${id}`, { method: 'DELETE' }) }
const fillCard = function (data) { return this.request('/cards/fill', { method: 'POST', data }) }
const likeCard = function (id) { return this.request(`/cards/${id}/like`) }
const markCardStepDone = function (id, stepId) { return this.request(`/cards/${id}/steps/${stepId}`, { method: 'POST' }) }
const getCardStepsDoneEvents = function (id) { return this.request(`/cards/${id}/steps`) }
const addCardToDeck = function (deckId, cardId) { return this.request(`/decks/${deckId}/addcard/${cardId}`, { method: 'POST' }) }
const removeCardFromDeck = function (deckId, cardId) { return this.request(`/decks/${deckId}/removecard/${cardId}`, { method: 'DELETE' }) }
const approveToMarketplace = function (deckId = '', cardId) { return this.request(`/marketplace/${cardId}/approve/${deckId}`, { method: 'POST' }) }
const publishToMarketplace = function (deckId = '', data) { return this.request(`/marketplace/${deckId}`, { method: 'POST', data }) }
const getPublishedCardCategory = function (cardId) { return this.request(`/cards/${cardId}/marketplace-category`, { method: 'GET' }) }
const getPublishedCardByOriginalIds = function (ids) { return this.request('/cards/marketplace-status', { method: 'GET', query: { ids } }) }
const searchCards = function (query, params) { return this.request('/cards', { query, ...params }) }

const getDecksHome = function () { return this.request('/decks/home') }
const getMyDecks = function () { return this.request('/users/me/decks') }
const getMyRecommendedCards = function () { return this.request('/users/me/recommended-cards') }
const getUserDecks = function (id, query) { return this.request(`/users/${id}/decks`, { query }) }
const getUserCards = function (id, query) { return this.request(`/users/${id}/cards`, { query }) }
const getUserChildren = function (id, query) { return this.request(`/users/${id}/children`, { query }) }
const followUser = function (id) { return this.request(`/users/${id}/follow`, { method: 'GET' }) }
const unfollowUser = function (id) { return this.request(`/users/${id}/unfollow`, { method: 'GET' }) }

const followDeck = function (id) { return this.request(`/decks/${id}/follow`) }
const unfollowDeck = function (id) { return this.request(`/decks/${id}/unfollow`) }
const followTag = function (tag) { return this.request(`/tags/${tag}/follow`) }
const unfollowTag = function (tag) { return this.request(`/tags/${tag}/unfollow`) }

const getLogoFromUrl = function (query) { return this.request('/partnerLogo', { query }) }

const sendUserProfilePost = function (data) { return this.request('/userFeed', { method: 'POST', data }) }
const getUserProfilePosts = function (query) { return this.request('/userFeed', { query }) }
const getFeed = function (query) { return this.request('/feed', { query }) }
const postFeed = function (data) { return this.request('/feed', { method: 'POST', data }) }
const postFeedUpdate = function (id, data) { return this.request(`/feed/${id}`, { method: 'POST', data }) }
const deletePost = function (id, data) { return this.request(`/feed/delete/${id}`, { method: 'POST', data }) }
const getMyOrgsChannels = function (query) { return this.request('/orgchannels', { query }) }
const postTimelineComment = function (id, data) { return this.request(`/feed/${id}/comments`, { method: 'POST', data }) }
const deleteComment = function (id) { return this.request(`/comments/${id}`, { method: 'DELETE' }) }
const likeComment = function (id) { return this.request(`/comments/${id}/likes`, { method: 'POST' }) }
const unlikeComment = function (id) { return this.request(`/comments/${id}/likes`, { method: 'DELETE' }) }

const getAnnouncements = function () { return this.request('/users/me/announcements') }
const markNotificationRead = function (id) { return this.request(`/users/me/notification/${id}/read`) }
const createAnnouncement = function (data) { return this.request('/organization/announcement', { method: 'POST', data }) }
const getOnlineStatus = function (data) { return this.request('/users/online', { method: 'POST', data }) }

const addCardReview = function (id, data) { return this.request(`/cards/${id}/reviews`, { method: 'POST', data }) }
const editCardReview = function (id, reviewId, data) { return this.request(`/cards/${id}/reviews/${reviewId}`, { method: 'PATCH', data }) }

const getCardsQuiz = function (id) { return this.request(`/cards/${id}/quiz`) }
const getQuiz = function (id) { return this.request(`/quizzes/${id}`) }
const getQuizAnswers = function (id) { return this.request(`/quizzes/${id}/answers`) }
const linkQuizToCard = function (id, data) { return this.request(`/cards/${id}/quiz`, { method: 'POST', data }) }
const getUserQuizAnswers = function (id, query) { return this.request(`/users/${id}/quiz`, { query }) }
const postQuizAnswer = function (id, data) { return this.request(`/quiz/${id}/answer`, { method: 'POST', data }) }
const deleteQuiz = function (id) { return this.request(`/quiz/${id}`, { method: 'DELETE' }) }
const getCardStepsQuizCompletion = function (id) { return this.request(`/users/me/quiz/${id}/answers`) }

const getTask = function (id) { return this.request(`/tasks/${id}`, {}) }
const createTask = function (data) { return this.request('/tasks', { method: 'POST', data }) }
const updateTask = function (id, data) { return this.request(`/tasks/${id}`, { method: 'PATCH', data }) }
const deleteTask = function (id) { return this.request(`/tasks/${id}`, { method: 'DELETE' }) }
const getMyTasks = function () { return this.request('/users/me/tasks', {}) }
const getCreatedTasks = function () { return this.request('/users/me/tasks/created', {}) }
const getArchivedTasks = function () { return this.request('/users/me/tasks/archived', {}) }
const markTaskAsDone = function (id, data) { return this.request(`/tasks/${id}/done`, { method: 'POST', data }) }
const markTaskAsArchived = function (id) { return this.request(`/tasks/${id}/archive`, { method: 'POST' }) }
const getTaskComments = function (id) { return this.request(`/tasks/${id}/comments`) }
const commentTask = function (id, data) { return this.request(`/tasks/${id}/comments`, { method: 'POST', data }) }
const deleteTaskComment = function (id, commentId) { return this.request(`/tasks/${id}/comments/${commentId}`, { method: 'DELETE' }) }
const editTaskComment = function (id, commentId, data) { return this.request(`/tasks/${id}/comments/${commentId}`, { method: 'PATCH', data }) }

const createChannel = function (data) { return this.request('/chat', { method: 'POST', data }) }
const createPrivateChannel = function (id, data) { return this.request(`/chat/private/${id}`, { method: 'POST', data }) }
const updateChat = function (id, data) { return this.request(`/chat/${id}`, { method: 'PATCH', data }) }
const getMyChannels = function () { return this.request('/users/me/channels', { method: 'GET' }) }
const personIsTyping = function (id, data) { return this.request(`/chat/${id}/typing`, { method: 'POST' }) }
const getMessages = function (id) { return this.request(`/chat/${id}/messages`, { method: 'GET' }) }
const deleteAllMessages = function (id) { return this.request(`/chat/${id}/messages`, { method: 'DELETE' }) }
const getPresence = function (id) { return this.request(`/chat/${id}/presence`, { method: 'GET' }) }
const chatSubscribe = function (id, data) { return this.request(`/chat/${id}/subscribe`, { method: 'POST', data }) }
const chatUnsubscribe = function (id, data) { return this.request(`/chat/${id}/unsubscribe`, { method: 'POST', data }) }
const newMessage = function (id, data) { return this.request(`/chat/${id}/messages`, { method: 'POST', data }) }
const chatSubscribeMany = function (id, data) { return this.request(`/chat/${id}/subscribeMany`, { method: 'POST', data }) }
const chatUnsubscribeMany = function (id, data) { return this.request(`/chat/${id}/unsubscribeMany`, { method: 'PATCH', data }) }

const registerPushToken = function (data) { return this.request('/users/me/push-token', { method: 'POST', data }) }
const revokePushToken = function (data) { return this.request('/users/me/push-token', { method: 'DELETE', data }) }

const searchGroups = function (query) { return this.request('/groups/search', { query }) }
const getMyGroups = function (id) { return this.request('/users/me/groups', { method: 'GET' }) }
const getUserGroups = function (id) { return this.request(`/users/${id}/groups`, { method: 'GET' }) }
const getGroup = function (id) { return this.request(`/groups/${id}`, { method: 'GET' }) }

const getGroupWithoutAuth = function (id) { return this.request(`/groups/public/${id}`, { method: 'GET' }) }

const createGroup = function (data) { return this.request('/groups', { method: 'POST', data }) }
const updateGroup = function (id, data) { return this.request(`/groups/${id}`, { method: 'PATCH', data }) }
const deleteGroup = function (id) { return this.request(`/groups/${id}`, { method: 'DELETE' }) }
const joinGroup = function (id) { return this.request(`/groups/${id}/join`, { method: 'POST' }) }
const leaveGroup = function (id) { return this.request(`/groups/${id}/leave`, { method: 'POST' }) }
const inviteUserToGroup = function (id, userId) { return this.request(`/groups/${id}/invite/${userId}`, { method: 'POST' }) }
const acceptGroupInvite = function (id) { return this.request(`/groups/${id}/accept`, { method: 'POST' }) }

const createGroupInvite = function (id) { return this.request(`/groups/${id}/invite`, { method: 'POST' }) }
const deleteGroupInvite = function (id) { return this.request(`/groups/${id}/invite`, { method: 'DELETE' }) }
const joinGroupWithInvite = function (code) { return this.request(`/groups/invite/accept/${code}`, { method: 'POST' }) }
const getGroupInviteData = function (code) { return this.request(`/groups/invite/${code}`, { method: 'GET' }) }
const getGroupInviteDataById = function (id) { return this.request(`/groups/${id}/invite`, { method: 'GET' }) }

const removeChatFromGroup = function (id, channelId) { return this.request(`/groups/${id}/chats/${channelId}/remove`, { method: 'POST' }) }
const removeQuestionFromGroup = function (id, questionId) { return this.request(`/groups/${id}/questions/${questionId}/remove`, { method: 'POST' }) }
const postToGroupTimeline = function (id, data) { return this.request(`/groups/${id}/timeline`, { method: 'POST', data }) }
const createChatInGroup = function (groupId, data) { return this.request(`/chat`, { method: 'POST', data: { ...data, group: groupId } }) }
const createQuestionInGroup = function (groupId, data) { return this.request(`/questions`, { method: 'POST', data: { ...data, group: groupId } }) }

const getGroupUsers = function (id, query) { return this.request(`/groups/${id}/users`, { method: 'GET', query }) }
const getGroupChats = function (id) { return this.request(`/groups/${id}/chats`, { method: 'GET' }) }
const getGroupTimeline = function (id, query) { return this.request(`/groups/${id}/timeline`, { query }) }
const getGroupQuestions = function (id) { return this.request(`/groups/${id}/questions`, { method: 'GET' }) }
const pinTimelinePost = function (id, postId) { return this.request(`/groups/${id}/pin/${postId}`, { method: 'POST' }) }
const getPinnedPostByGroupId = function (id) { return this.request(`/groups/${id}/pin`, { method: 'GET' }) }
const unpinTimelinePost = function (id) { return this.request(`/groups/${id}/pin`, { method: 'DELETE' }) }


const getCollection = function (id) { return this.request(`/colls/${id}`, { method: 'GET' }) }
const createCollection = function (data) { return this.request(`/colls`, { method: 'POST', data }) }
const updateCollection = function (id, data) { return this.request(`/colls/${id}`, { method: 'PATCH', data }) }
const deleteCollection = function (id) { return this.request(`/colls/${id}`, { method: 'DELETE' }) }
const addCollectionToGroup = function (groupId, collId) { return this.request(`/groups/${groupId}/colls/${collId}`, { method: 'POST', data }) }
const removeCollectionFromGroup = function (groupId, collId) { return this.request(`/groups/${groupId}/colls/${collId}`, { method: 'DELETE' }) }
const addDeckToCollection = function (collId, deckId) { return this.request(`/colls/${collId}/decks/${deckId}`, { method: 'POST', data }) }
const removeDeckFromCollection = function (collId, deckId) { return this.request(`/colls/${collId}/decks/${deckId}`, { method: 'DELETE' }) }

const getMyCollections = function () { return this.request('/users/me/colls') }
const subscribeToCollection = function (id) { return this.request(`/colls/${id}/subscribe`, { method: 'POST' }) }
const unsubscribeFromCollection = function (id) { return this.request(`/colls/${id}/subscribe`, { method: 'DELETE' }) }
const getAllMyGroupsTimeline = function (query) { return this.request('/users/me/groups/fulltimeline', { query }) }

const sendDebug = function (message) {
  const data = {}
  if (message instanceof Error) {
    data.error = message
    data.stack = message.stack
    data.info = message.info
  } else if (typeof message === 'object' && 'context' in message) {
    data.error = message.props
    data.stack = message.context
    data.info = message.info
  } else {
    data.message = message
  }
  return request('/debug', { method: 'POST', data })
}

const api = {
  apiHost,
  defaultParams,
  request,
  register,
  login,
  magicLogin,
  logout,
  forgotpassword,
  searchUsers,
  me,
  getUser,
  updateUser,
  updateAvatar,
  uploadFile,
  markAllRead,
  getUserNotifications,
  getAllUserEvents,
  getUserQuestions,
  createQuestion,
  getGroupWithoutAuth,
  getQuestion,
  updateQuestion,
  archiveQuestion,
  searchQuestions,
  createAnswer,
  updateAnswer,
  deleteAnswer,
  acceptAnswer,
  rejectAnswer,
  markFavorite,
  unmarkFavorite,
  getQuestionMessages,
  getQuestionChatPresence,
  newQuestionMessage,
  questionChatSubscribe,
  questionChatUnsubscribe,
  getSkillsCloud,
  getTagsCloud,
  getOrganization,
  searchOrganizations,
  createDeck,
  getDeck,
  updateDeck,
  deleteDeck,
  searchDecks,
  addCardToParentsDeckByGroupId,
  shareDeckWithUsers,
  getMarketplaceDecks,
  createCard,
  getCard,
  updateCard,
  deleteCard,
  likeCard,
  addCardToDeck,
  removeCardFromDeck,
  approveToMarketplace,
  publishToMarketplace,
  searchCards,
  getDecksHome,
  getMyDecks,
  getMyRecommendedCards,
  getUserDecks,
  getUserCards,
  getUserChildren,
  addCardReview,
  editCardReview,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getMyTasks,
  getCreatedTasks,
  getArchivedTasks,
  markTaskAsDone,
  markTaskAsArchived,
  sendDebug,
  createChannel,
  createPrivateChannel,
  updateChat,
  getMyChannels,
  getMessages,
  deleteAllMessages,
  personIsTyping,
  getPresence,
  chatSubscribe,
  chatUnsubscribe,
  chatSubscribeMany,
  chatUnsubscribeMany,
  newMessage,
  followUser,
  unfollowUser,
  followDeck,
  unfollowDeck,
  followTag,
  unfollowTag,
  getLogoFromUrl,
  getFeed,
  postFeed,
  searchGroups,
  getMyOrgsChannels,
  postFeedUpdate,
  deletePost,
  postTimelineComment,
  deleteComment,
  likeComment,
  unlikeComment,
  getAnnouncements,
  createAnnouncement,
  getTaskComments,
  commentTask,
  deleteTaskComment,
  editTaskComment,
  markNotificationRead,
  getPersonalQuestions,
  getOnlineStatus,
  getParam,
  searchParams,
  createParam,
  deleteParam,
  registerPushToken,
  revokePushToken,
  getPublishedCardCategory,
  getPublishedCardByOriginalIds,
  createAndInviteUser,
  postQuizAnswer,
  getUserQuizAnswers,
  getCardStepsQuizCompletion,
  deleteQuiz,
  linkQuizToCard,
  getCardsQuiz,
  getQuiz,
  getQuizAnswers,
  markCardStepDone,
  getCardStepsDoneEvents,

  getMyGroups,
  getUserGroups,
  getGroup,
  createGroup,
  updateGroup,
  deleteGroup,
  joinGroup,
  leaveGroup,
  inviteUserToGroup,
  acceptGroupInvite,
  removeChatFromGroup,
  removeQuestionFromGroup,
  getGroupUsers,
  getGroupChats,
  postToGroupTimeline,
  getGroupTimeline,
  getGroupQuestions,
  pinTimelinePost,
  getPinnedPostByGroupId,
  unpinTimelinePost,
  getCollection,
  createCollection,
  updateCollection,
  deleteCollection,
  addCollectionToGroup,
  removeCollectionFromGroup,
  addDeckToCollection,
  removeDeckFromCollection,
  getMyCollections,
  subscribeToCollection,
  unsubscribeFromCollection,
  createChatInGroup,
  createQuestionInGroup,
  sendUserProfilePost,
  getUserProfilePosts,
  getAllMyGroupsTimeline,
  createGroupInvite,
  joinGroupWithInvite,
  getGroupInviteData,
  deleteGroupInvite,
  getGroupInviteDataById,
  fillCard
}

// export default api
module.exports = api
