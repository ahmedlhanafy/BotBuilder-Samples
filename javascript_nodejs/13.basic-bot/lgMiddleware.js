const { LanguageGenerationResolver } = require('botbuilder-ai');

class LGMiddleware {
    /**
     * Creates a translation middleware.
     * @param {BotStatePropertyAccessor} entitiesStateAccessor Accessor for LG entities property in the user state.
     * @param {LanguageGenerationApplication} languageGenerationApplication Language Generation configuration object.
     */
    constructor(entitiesStateAccessor, languageGenerationApplication) {
        this.entitiesStateAccessor = entitiesStateAccessor;
        this.lgResolver = new LanguageGenerationResolver(languageGenerationApplication);
    }

    async onTurn(turnContext, next) {
        turnContext.onSendActivities(async (context, activities, next) => {
            const { entities } = await this.entitiesStateAccessor.get(context, new Map());
            await Promise.all(
                activities.map(activity => {
                    activity.locale = activity.locale || context.activity.locale;
                    return this.lgResolver.resolve(activity, entities || new Map());
                }),
            );
            await next();
        });
        await next();
    }
}

module.exports = LGMiddleware;
