const ID = {
  collection: 0,
  member: 1
}

export default class Scope {
  static onCollection (name) {
    return ID[name] === ID.collection
  }

  static onMember (name) {
    return ID[name] === ID.member
  }
}
