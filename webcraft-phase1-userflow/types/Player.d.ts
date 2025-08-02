
export type PlayerType = {
  profile: string,
  username: string,
  _id: string,
  created: string,
  email?: string, // only exposed to your own session, not to others
}

