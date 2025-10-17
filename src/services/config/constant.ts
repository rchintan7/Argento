export default {

  // Base URL

  BASE_URL: 'http://18.168.140.30:8080/api/v1/',

  // Get Social URL

  getProfile: 'users/me',
  getSocial: 'users/exists',

  // Auth URL

  signIn: 'users',

  // Questions URL

  getQuestions: 'check-ins/questions',
  postQuestions: 'check-ins/answer',

  // Activities URL

  getActivities: 'activities',
  postCreateActivities: 'activities',
  postActivities: 'check-ins/activities',

  // Journal URL

  getJournal: 'journals',
  postJournal: 'journals',

  // Journal URL

  getHistory: 'check-ins/history?',

  // Selfie URL

  postSelfie: 'selfies',

  // Insights 
  getInsights: 'insights',

  // Insights activities
  getInsightActivities: 'insights/activities',

  // Insights checkins
  getInsightCheckins: 'insights/checkins?',

  // Insights journals
  getInsightJournals: 'insights/journal',
};
