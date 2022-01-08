declare namespace WeddiApp {
  namespace Post {
    type Data = UserInput & SystemInput

    interface UserInput {
      name: string;
      greetings: string;
      imgUrl: string;
      joinedGame: boolean;
    }

    interface SystemInput {
      userAgent: string;
      modifiedTime: string;
      id: string;
    }
  }
}
