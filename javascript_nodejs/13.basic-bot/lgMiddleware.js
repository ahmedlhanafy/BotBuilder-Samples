class LGMiddleware {
  constructor(lgResolver) {
    this.lgResolver = lgResolver;
  }

  onTurn(turnContext) {
    turnContext.onSendActivities(async (context, activities, next) => {
      await Promise.all(activities.map(activity => this.lgResolver.resolve(activity)));
      await next();
    });
  }
}

module.exports = LGMiddleware;
