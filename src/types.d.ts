declare namespace WeddiApp {
  namespace Post {
    type Status = 'pending' | 'approved';
    type Data = UserInput & SystemInput

    interface UserInput {
      name: string;
      greetings: string;
      imgUrl: string;
      joinedGame: boolean;
    }

    interface SystemInput {
      status?: Status;
      userAgent: string;
      modifiedTime: string;
      id: string;
    }
  }
}
