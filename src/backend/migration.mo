module {
  type OldActor = {};
  type NewActor = { notificationCounter : Nat };

  public func run(old : OldActor) : NewActor {
    { notificationCounter = 0 };
  };
};
