module.exports = (on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions) => {
	// `on` is used to hook into various events Cypress emits
	// `config` is the resolved Cypress config
	on('task', {
		log(x) {
			// prints into the terminal's console
			console.log(x);

			return null;
		},
	});
};
